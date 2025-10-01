import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// 创建必要的目录
const TEMP_DIR = path.join(__dirname, 'temp');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

async function ensureDirectories() {
  try {
    await fs.access(TEMP_DIR);
  } catch {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  }

  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

await ensureDirectories();

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 配置 multer 用于处理文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileHash = req.body.fileHash;
    const chunkDir = path.join(TEMP_DIR, fileHash);

    // 确保分片目录存在
    fs.mkdir(chunkDir, { recursive: true })
      .then(() => cb(null, chunkDir))
      .catch(err => cb(err));
  },
  filename: (req, file, cb) => {
    const chunkIndex = req.body.chunkIndex;
    cb(null, `chunk-${chunkIndex}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per chunk (larger than our 2MB chunks)
    files: 1 // Only one file per request
  }
});

// 存储已上传文件的信息
const uploadedFiles = new Map();

// 检查文件是否已存在（秒传检测）
app.post('/api/check-file', async (req, res) => {
  try {
    const { hash, name, size } = req.body;

    if (!hash || !name || !size) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }

    const filePath = path.join(UPLOAD_DIR, `${hash}_${name}`);

    try {
      const stats = await fs.stat(filePath);
      if (stats.size === size) {
        // 文件已存在且大小匹配，可以秒传
        uploadedFiles.set(hash, {
          name,
          size,
          path: filePath,
          uploadTime: new Date()
        });

        return res.json({
          hash,
          name,
          size,
          exists: true,
          uploadedChunks: []
        });
      }
    } catch (error) {
      // 文件不存在，检查是否有部分分片
      const chunkDir = path.join(TEMP_DIR, hash);
      const uploadedChunks = [];

      try {
        const files = await fs.readdir(chunkDir);
        for (const file of files) {
          if (file.startsWith('chunk-')) {
            const chunkIndex = parseInt(file.split('-')[1]);
            uploadedChunks.push(chunkIndex);
          }
        }
      } catch {
        // 目录不存在，没有上传过分片
      }

      return res.json({
        hash,
        name,
        size,
        exists: false,
        uploadedChunks: uploadedChunks.sort((a, b) => a - b)
      });
    }
  } catch (error) {
    console.error('检查文件失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

// Multer 错误处理中间件
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    console.error('Multer 错误:', error);

    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: '分片文件过大，超过 5MB 限制'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: '文件数量超出限制'
        });
      default:
        return res.status(400).json({
          success: false,
          message: '文件上传错误: ' + error.message
        });
    }
  }
  next(error);
};

// 上传分片
app.post('/api/upload-chunk', upload.single('chunk'), handleMulterError, async (req, res) => {
  const startTime = Date.now();
  try {
    const { chunkIndex, chunkHash, fileHash, fileName, totalChunks } = req.body;

    console.log(`开始处理分片: ${fileName} - chunk ${chunkIndex}/${totalChunks}`);

    if (!req.file) {
      console.error('未接收到文件分片');
      return res.status(400).json({
        success: false,
        message: '未接收到文件分片'
      });
    }

    console.log(`分片文件大小: ${req.file.size} bytes, 路径: ${req.file.path}`);

    // 验证分片哈希
    const chunkBuffer = await fs.readFile(req.file.path);
    const calculatedHash = crypto.createHash('sha256').update(chunkBuffer).digest('hex');

    if (calculatedHash !== chunkHash) {
      // 哈希不匹配，删除文件并返回错误
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        message: '分片哈希验证失败'
      });
    }

    const processingTime = Date.now() - startTime;
    console.log(`分片上传成功: ${fileName} - chunk ${parseInt(chunkIndex) + 1}/${totalChunks} (${processingTime}ms)`);

    res.json({
      success: true,
      message: '分片上传成功',
      data: {
        chunkIndex: parseInt(chunkIndex),
        fileHash,
        fileName,
        processingTime
      }
    });
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`上传分片失败 (${processingTime}ms):`, error);

    // 如果是 multer 错误，提供更详细的信息
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '分片文件过大'
      });
    }

    res.status(500).json({
      success: false,
      message: '服务器错误: ' + error.message
    });
  }
});

// 合并文件
app.post('/api/merge-file', async (req, res) => {
  try {
    const { fileHash, fileName, totalChunks } = req.body;

    if (!fileHash || !fileName || !totalChunks) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }

    const chunkDir = path.join(TEMP_DIR, fileHash);
    const outputPath = path.join(UPLOAD_DIR, `${fileHash}_${fileName}`);

    // 检查所有分片是否存在
    const chunkPaths = [];
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(chunkDir, `chunk-${i}`);
      try {
        await fs.access(chunkPath);
        chunkPaths.push(chunkPath);
      } catch {
        return res.status(400).json({
          success: false,
          message: `分片 ${i} 不存在`
        });
      }
    }

    // 合并文件
    const writeStream = await fs.open(outputPath, 'w');

    try {
      for (let i = 0; i < chunkPaths.length; i++) {
        const chunkData = await fs.readFile(chunkPaths[i]);
        await writeStream.write(chunkData, 0, chunkData.length, null);
      }
    } finally {
      await writeStream.close();
    }

    // 清理临时分片文件
    try {
      for (const chunkPath of chunkPaths) {
        await fs.unlink(chunkPath);
      }
      await fs.rmdir(chunkDir);
    } catch (error) {
      console.warn('清理临时文件失败:', error);
    }

    // 验证合并后的文件
    const stats = await fs.stat(outputPath);

    // 存储文件信息
    uploadedFiles.set(fileHash, {
      name: fileName,
      size: stats.size,
      path: outputPath,
      uploadTime: new Date()
    });

    console.log(`文件合并完成: ${fileName} (${stats.size} bytes)`);

    res.json({
      success: true,
      message: '文件合并成功',
      data: {
        fileHash,
        fileName,
        fileSize: stats.size,
        uploadTime: new Date()
      }
    });
  } catch (error) {
    console.error('合并文件失败:', error);
    res.status(500).json({
      success: false,
      message: '文件合并失败'
    });
  }
});

// 获取已上传文件列表
app.get('/api/files', (req, res) => {
  const files = Array.from(uploadedFiles.entries()).map(([hash, info]) => ({
    hash,
    ...info
  }));

  res.json({
    success: true,
    data: files
  });
});

// 下载文件
app.get('/api/download/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const fileInfo = uploadedFiles.get(hash);

    if (!fileInfo) {
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      });
    }

    const filePath = fileInfo.path;

    try {
      await fs.access(filePath);
      res.download(filePath, fileInfo.name);
    } catch {
      return res.status(404).json({
        success: false,
        message: '文件已被删除'
      });
    }
  } catch (error) {
    console.error('下载文件失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

// 删除文件
app.delete('/api/files/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const fileInfo = uploadedFiles.get(hash);

    if (!fileInfo) {
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      });
    }

    // 删除文件
    try {
      await fs.unlink(fileInfo.path);
    } catch (error) {
      console.warn('删除文件失败:', error);
    }

    // 从内存中移除记录
    uploadedFiles.delete(hash);

    res.json({
      success: true,
      message: '文件删除成功'
    });
  } catch (error) {
    console.error('删除文件失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '服务正常',
    timestamp: new Date(),
    uploadedFiles: uploadedFiles.size
  });
});

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 服务器启动成功！`);
  console.log(`📡 API 地址: http://localhost:${PORT}/api`);
  console.log(`📁 上传目录: ${UPLOAD_DIR}`);
  console.log(`📁 临时目录: ${TEMP_DIR}`);
});
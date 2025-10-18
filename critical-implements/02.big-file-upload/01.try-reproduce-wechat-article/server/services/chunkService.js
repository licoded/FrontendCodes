import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { CONFIG } from '../config/constants.js';
import { fileDB } from '../config/database.js';

export class ChunkService {
  // 处理单个分片上传
  static async processChunk(file, chunkIndex, chunkHash, fileHash, fileName, totalChunks) {
    const startTime = Date.now();

    console.log(`开始处理分片: ${fileName} - chunk ${chunkIndex}/${totalChunks}`);
    console.log(`分片文件大小: ${file.size} bytes, 路径: ${file.path}`);

    // 验证分片哈希
    const chunkBuffer = await fs.readFile(file.path);
    const calculatedHash = crypto.createHash('sha256').update(chunkBuffer).digest('hex');

    if (calculatedHash !== chunkHash) {
      // 哈希不匹配，删除文件并返回错误
      await fs.unlink(file.path);
      throw new Error('分片哈希验证失败');
    }

    // 创建目标分片目录
    const chunkDir = path.join(CONFIG.TEMP_DIR, fileHash);
    await fs.mkdir(chunkDir, { recursive: true });

    // 移动临时文件到正确位置
    const finalPath = path.join(chunkDir, `chunk-${chunkIndex}`);
    await fs.rename(file.path, finalPath);

    const processingTime = Date.now() - startTime;
    console.log(`分片上传成功: ${fileName} - chunk ${parseInt(chunkIndex) + 1}/${totalChunks} (${processingTime}ms)`);

    return {
      success: true,
      message: '分片上传成功',
      data: {
        chunkIndex: parseInt(chunkIndex),
        fileHash,
        fileName,
        processingTime
      }
    };
  }

  // 合并文件分片
  static async mergeChunks(fileHash, fileName, totalChunks) {
    const chunkDir = path.join(CONFIG.TEMP_DIR, fileHash);
    const outputPath = path.join(CONFIG.UPLOAD_DIR, fileHash);

    // 检查所有分片是否存在
    const chunkPaths = [];
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(chunkDir, `chunk-${i}`);
      try {
        await fs.access(chunkPath);
        chunkPaths.push(chunkPath);
      } catch {
        throw new Error(`分片 ${i} 不存在`);
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
    fileDB.set(fileHash, {
      name: fileName,
      size: stats.size,
      path: outputPath,
      hash: fileHash,
      uploadTime: new Date(),
      isReference: false
    });

    // 存储文件名映射
    fileDB.set(`${fileHash}_${fileName}`, {
      name: fileName,
      size: stats.size,
      path: outputPath,
      hash: fileHash,
      uploadTime: new Date(),
      isReference: true
    });

    console.log(`文件合并完成: ${fileName} (${stats.size} bytes)`);

    return {
      success: true,
      message: '文件合并成功',
      data: {
        fileHash,
        fileName,
        fileSize: stats.size,
        uploadTime: new Date()
      }
    };
  }
}
import { FileService } from '../services/fileService.js';
import { ChunkService } from '../services/chunkService.js';

export class UploadController {
  // 检查文件是否已存在（秒传检测）
  static async checkFile(req, res) {
    try {
      const { hash, name, size } = req.body;

      if (!hash || !name || !size) {
        return res.status(400).json({
          success: false,
          message: '缺少必要参数'
        });
      }

      const fileCheck = await FileService.checkFileExists(hash, name, size);

      if (fileCheck.exists) {
        return res.json({
          hash,
          name,
          size,
          exists: true,
          uploadedChunks: []
        });
      }

      // 获取已上传的分片
      const uploadedChunks = await FileService.getUploadedChunks(hash);

      return res.json({
        hash,
        name,
        size,
        exists: false,
        uploadedChunks
      });
    } catch (error) {
      console.error('检查文件失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }

  // 上传分片
  static async uploadChunk(req, res) {
    try {
      const { chunkIndex, chunkHash, fileHash, fileName, totalChunks } = req.body;

      if (!req.file) {
        console.error('未接收到文件分片');
        return res.status(400).json({
          success: false,
          message: '未接收到文件分片'
        });
      }

      const result = await ChunkService.processChunk(
        req.file,
        chunkIndex,
        chunkHash,
        fileHash,
        fileName,
        totalChunks
      );

      res.json(result);
    } catch (error) {
      console.error('上传分片失败:', error);

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
  }

  // 合并文件
  static async mergeFile(req, res) {
    try {
      const { fileHash, fileName, totalChunks } = req.body;

      if (!fileHash || !fileName || !totalChunks) {
        return res.status(400).json({
          success: false,
          message: '缺少必要参数'
        });
      }

      const result = await ChunkService.mergeChunks(fileHash, fileName, totalChunks);
      res.json(result);
    } catch (error) {
      console.error('合并文件失败:', error);
      res.status(500).json({
        success: false,
        message: '文件合并失败'
      });
    }
  }
}
import { FileService } from '../services/fileService.js';
import { fileDB } from '../config/database.js';

export class FileController {
  // 获取已上传文件列表
  static async getFiles(req, res) {
    try {
      const files = FileService.getFileList();
      res.json({
        success: true,
        data: files
      });
    } catch (error) {
      console.error('获取文件列表失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }

  // 下载文件
  static async downloadFile(req, res) {
    try {
      const { hash } = req.params;
      const fileInfo = fileDB.get(hash);

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
  }

  // 删除文件
  static async deleteFile(req, res) {
    try {
      const { hash } = req.params;
      const result = await FileService.deleteFile(hash);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('删除文件失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }

  // 健康检查
  static healthCheck(req, res) {
    res.json({
      success: true,
      message: '服务正常',
      timestamp: new Date(),
      uploadedFiles: fileDB.size()
    });
  }
}
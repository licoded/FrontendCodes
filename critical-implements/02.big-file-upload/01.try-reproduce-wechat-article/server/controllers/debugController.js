import { FileService } from '../services/fileService.js';

export class DebugController {
  // 调试接口：查看所有文件映射关系
  static getDebugFiles(req, res) {
    try {
      const debugInfo = FileService.getDebugInfo();
      res.json({
        success: true,
        ...debugInfo
      });
    } catch (error) {
      console.error('获取调试信息失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }
}
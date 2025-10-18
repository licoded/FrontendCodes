import multer from 'multer';
import { CONFIG } from './constants.js';

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 使用临时目录，之后在处理逻辑中移动到正确位置
    cb(null, CONFIG.TEMP_DIR);
  },
  filename: (req, file, cb) => {
    // 使用时间戳和随机数生成临时文件名
    const tempName = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    cb(null, tempName);
  }
});

// 创建 multer 实例
export const upload = multer({
  storage,
  limits: {
    fileSize: CONFIG.MAX_FILE_SIZE,
    files: 1 // Only one file per request
  }
});
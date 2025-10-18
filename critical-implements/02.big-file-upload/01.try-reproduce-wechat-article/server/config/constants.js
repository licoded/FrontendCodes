import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  PORT: 3001,
  TEMP_DIR: path.join(__dirname, '..', 'temp'),
  UPLOAD_DIR: path.join(__dirname, '..', 'uploads'),

  // 文件限制
  MAX_FILE_SIZE: 30 * 1024 * 1024, // 30MB per chunk
  MAX_REQUEST_SIZE: '50mb',

  // 并发配置
  DEFAULT_CONCURRENCY: 3,

  // API 路径
  API_PREFIX: '/api'
};
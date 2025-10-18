import express from 'express';
import { UploadController } from '../controllers/uploadController.js';
import { upload } from '../config/multer.js';

const router = express.Router();

// 检查文件是否已存在（秒传检测）
router.post('/check-file', UploadController.checkFile);

// 上传分片
router.post('/upload-chunk', upload.single('chunk'), UploadController.uploadChunk);

// 合并文件
router.post('/merge-file', UploadController.mergeFile);

export { router as uploadRoutes };
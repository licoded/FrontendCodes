import multer from 'multer';

// Multer 错误处理中间件
export const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    console.error('Multer 错误:', error);

    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: '分片文件过大，超过 30MB 限制'
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

// 全局错误处理中间件
export const globalErrorHandler = (error, req, res, next) => {
  console.error('服务器错误:', error);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
};

// 404 处理中间件
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
};
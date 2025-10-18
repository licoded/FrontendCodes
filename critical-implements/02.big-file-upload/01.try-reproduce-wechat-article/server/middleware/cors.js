import cors from 'cors';
import express from 'express';
import { CONFIG } from '../config/constants.js';

export const setupMiddleware = (app) => {
  // CORS 配置
  app.use(cors());

  // 请求体解析配置
  app.use(express.json({ limit: CONFIG.MAX_REQUEST_SIZE }));
  app.use(express.urlencoded({ extended: true, limit: CONFIG.MAX_REQUEST_SIZE }));
};
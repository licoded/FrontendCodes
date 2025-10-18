import fs from 'fs/promises';
import path from 'path';
import { CONFIG } from '../config/constants.js';
import { fileDB } from '../config/database.js';

export class FileService {
  // 确保目录存在
  static async ensureDirectories() {
    try {
      await fs.access(CONFIG.TEMP_DIR);
    } catch {
      await fs.mkdir(CONFIG.TEMP_DIR, { recursive: true });
    }

    try {
      await fs.access(CONFIG.UPLOAD_DIR);
    } catch {
      await fs.mkdir(CONFIG.UPLOAD_DIR, { recursive: true });
    }
  }

  // 检查文件是否存在
  static async checkFileExists(hash, name, size) {
    const filePath = path.join(CONFIG.UPLOAD_DIR, hash);

    try {
      const stats = await fs.stat(filePath);
      if (stats.size === size) {
        // 文件已存在且大小匹配，记录引用
        fileDB.set(`${hash}_${name}`, {
          name,
          size,
          path: filePath,
          hash,
          uploadTime: new Date(),
          isReference: true
        });

        console.log(`秒传成功: ${name} -> ${hash} (${size} bytes)`);
        return { exists: true };
      }
    } catch {
      // 文件不存在，继续检查分片
    }

    return { exists: false };
  }

  // 获取已上传的分片列表
  static async getUploadedChunks(hash) {
    const chunkDir = path.join(CONFIG.TEMP_DIR, hash);
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

    return uploadedChunks.sort((a, b) => a - b);
  }

  // 删除文件
  static async deleteFile(hash) {
    const fileInfo = fileDB.get(hash);
    if (!fileInfo) {
      return { success: false, message: '文件不存在' };
    }

    try {
      await fs.unlink(fileInfo.path);
    } catch (error) {
      console.warn('删除文件失败:', error);
    }

    fileDB.delete(hash);
    return { success: true, message: '文件删除成功' };
  }

  // 获取文件列表
  static getFileList() {
    return Array.from(fileDB.entries())
      .filter(([key, info]) => !info.isReference)
      .map(([hash, info]) => ({
        hash,
        ...info
      }));
  }

  // 获取调试信息
  static getDebugInfo() {
    const allEntries = Array.from(fileDB.entries()).map(([key, info]) => ({
      key,
      ...info,
      keyType: key.includes('_') ? 'reference' : 'original'
    }));

    return {
      totalEntries: allEntries.length,
      data: allEntries,
      summary: {
        originalFiles: allEntries.filter(entry => !entry.isReference).length,
        references: allEntries.filter(entry => entry.isReference).length,
        totalStorage: allEntries.reduce((sum, entry) => {
          return sum + (entry.isReference ? 0 : entry.size);
        }, 0)
      }
    };
  }
}
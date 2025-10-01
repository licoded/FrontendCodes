import type { FileChunk, FileInfo, UploadResponse } from '../types/upload';
import { calculateChunkHash, calculateFileHashIncremental } from './hash';

const CHUNK_SIZE = 25 * 1024 * 1024; // 25MB per chunk
const API_BASE = 'http://localhost:3001/api';

export class FileUploader {
  private file: File;
  private chunks: FileChunk[] = [];
  private fileHash: string = '';

  constructor(file: File) {
    this.file = file;
  }

  // 创建文件分片
  async createChunks(): Promise<FileChunk[]> {
    this.chunks = [];
    const chunkCount = Math.ceil(this.file.size / CHUNK_SIZE);

    // 计算文件哈希
    this.fileHash = await calculateFileHashIncremental(this.file, CHUNK_SIZE);

    for (let i = 0; i < chunkCount; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, this.file.size);
      const chunk = this.file.slice(start, end);
      const chunkHash = await calculateChunkHash(chunk);

      this.chunks.push({
        chunk,
        index: i,
        hash: chunkHash,
        size: chunk.size
      });
    }

    return this.chunks;
  }

  // 检查文件是否已存在（秒传检测）
  async checkFileExists(): Promise<FileInfo> {
    if (!this.fileHash) {
      this.fileHash = await calculateFileHashIncremental(this.file, CHUNK_SIZE);
    }

    try {
      const response = await fetch(`${API_BASE}/check-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hash: this.fileHash,
          name: this.file.name,
          size: this.file.size
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('检查文件失败:', error);
      return {
        hash: this.fileHash,
        name: this.file.name,
        size: this.file.size,
        exists: false,
        uploadedChunks: []
      };
    }
  }

  // 上传单个分片
  async uploadChunk(chunk: FileChunk, onProgress?: (progress: number) => void): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('chunk', chunk.chunk);
    formData.append('chunkIndex', chunk.index.toString());
    formData.append('chunkHash', chunk.hash);
    formData.append('fileHash', this.fileHash);
    formData.append('fileName', this.file.name);
    formData.append('totalChunks', this.chunks.length.toString());

    try {
      const xhr = new XMLHttpRequest();

      return new Promise<UploadResponse>((resolve, reject) => {
        // 设置超时时间 (30秒)
        xhr.timeout = 30000;

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          console.log(`分片上传响应: status=${xhr.status}, response=${xhr.responseText}`);

          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (parseError) {
              console.error('解析响应失败:', parseError, 'responseText:', xhr.responseText);
              reject(new Error('解析响应失败'));
            }
          } else {
            console.error(`上传失败: ${xhr.status} ${xhr.statusText}`, xhr.responseText);
            reject(new Error(`上传失败: ${xhr.status} ${xhr.statusText}`));
          }
        });

        xhr.addEventListener('error', (event) => {
          console.error('网络错误:', event);
          reject(new Error('网络错误'));
        });

        xhr.addEventListener('timeout', () => {
          console.error('请求超时');
          reject(new Error('请求超时'));
        });

        xhr.addEventListener('abort', () => {
          console.error('请求被中止');
          reject(new Error('请求被中止'));
        });

        console.log(`开始上传分片 ${chunk.index}: ${chunk.size} bytes`);
        xhr.open('POST', `${API_BASE}/upload-chunk`);
        xhr.send(formData);
      });
    } catch (error) {
      console.error('上传分片失败:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 合并文件
  async mergeFile(): Promise<UploadResponse> {
    try {
      const response = await fetch(`${API_BASE}/merge-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileHash: this.fileHash,
          fileName: this.file.name,
          totalChunks: this.chunks.length
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('合并文件失败:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '合并文件失败'
      };
    }
  }

  getFileHash(): string {
    return this.fileHash;
  }

  getChunks(): FileChunk[] {
    return this.chunks;
  }
}
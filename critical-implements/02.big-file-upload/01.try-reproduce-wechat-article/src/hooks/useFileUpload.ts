import { useState, useCallback } from 'react';
import type { UploadProgress, FileInfo } from '../types/upload';
import { FileUploader } from '../utils/upload';

export const useFileUpload = () => {
  const [uploads, setUploads] = useState<Map<string, UploadProgress>>(new Map());

  // 开始上传文件
  const startUpload = useCallback(async (file: File) => {
    const uploader = new FileUploader(file);

    // 创建分片
    const chunks = await uploader.createChunks();
    const fileHash = uploader.getFileHash();

    // 检查文件是否已存在
    const fileInfo: FileInfo = await uploader.checkFileExists();

    if (fileInfo.exists) {
      // 文件已存在，秒传成功
      setUploads(prev => new Map(prev.set(fileHash, {
        fileHash,
        fileName: file.name,
        fileSize: file.size,
        uploadedSize: file.size,
        percentage: 100,
        status: 'success',
        chunks: chunks.map((_, index) => ({
          index,
          hash: chunks[index].hash,
          status: 'success' as const,
          percentage: 100
        }))
      })));
      return { success: true, message: '文件秒传成功' };
    }

    // 初始化上传进度
    const initialProgress: UploadProgress = {
      fileHash,
      fileName: file.name,
      fileSize: file.size,
      uploadedSize: 0,
      percentage: 0,
      status: 'uploading',
      chunks: chunks.map((chunk, index) => ({
        index,
        hash: chunk.hash,
        status: fileInfo.uploadedChunks?.includes(index) ? 'success' : 'waiting',
        percentage: fileInfo.uploadedChunks?.includes(index) ? 100 : 0
      }))
    };

    setUploads(prev => new Map(prev.set(fileHash, initialProgress)));

    // 并发上传分片
    const concurrency = 3; // 并发数
    const uploadQueue = chunks.filter((_, index) =>
      !fileInfo.uploadedChunks?.includes(index)
    );

    try {
      await Promise.all(
        Array.from({ length: Math.min(concurrency, uploadQueue.length) }, async (_, i) => {
          for (let j = i; j < uploadQueue.length; j += concurrency) {
            const chunk = uploadQueue[j];

            // 更新分片状态为上传中
            setUploads(prev => {
              const current = prev.get(fileHash);
              if (!current) return prev;

              const newChunks = [...current.chunks];
              newChunks[chunk.index] = {
                ...newChunks[chunk.index],
                status: 'uploading'
              };

              return new Map(prev.set(fileHash, {
                ...current,
                chunks: newChunks
              }));
            });

            // 上传分片
            const result = await uploader.uploadChunk(chunk, (progress) => {
              setUploads(prev => {
                const current = prev.get(fileHash);
                if (!current) return prev;

                const newChunks = [...current.chunks];
                newChunks[chunk.index] = {
                  ...newChunks[chunk.index],
                  percentage: progress
                };

                // 计算总进度
                const totalProgress = newChunks.reduce((sum, c) => sum + c.percentage, 0) / newChunks.length;
                const uploadedSize = Math.floor((totalProgress / 100) * file.size);

                return new Map(prev.set(fileHash, {
                  ...current,
                  chunks: newChunks,
                  percentage: totalProgress,
                  uploadedSize
                }));
              });
            });

            if (result.success) {
              // 分片上传成功
              setUploads(prev => {
                const current = prev.get(fileHash);
                if (!current) return prev;

                const newChunks = [...current.chunks];
                newChunks[chunk.index] = {
                  ...newChunks[chunk.index],
                  status: 'success',
                  percentage: 100
                };

                // 计算总进度
                const totalProgress = newChunks.reduce((sum, c) => sum + c.percentage, 0) / newChunks.length;
                const uploadedSize = Math.floor((totalProgress / 100) * file.size);

                return new Map(prev.set(fileHash, {
                  ...current,
                  chunks: newChunks,
                  percentage: totalProgress,
                  uploadedSize
                }));
              });
            } else {
              // 分片上传失败
              setUploads(prev => {
                const current = prev.get(fileHash);
                if (!current) return prev;

                const newChunks = [...current.chunks];
                newChunks[chunk.index] = {
                  ...newChunks[chunk.index],
                  status: 'error'
                };

                return new Map(prev.set(fileHash, {
                  ...current,
                  chunks: newChunks,
                  status: 'error'
                }));
              });
              throw new Error(`分片 ${chunk.index} 上传失败: ${result.message}`);
            }
          }
        })
      );

      // 所有分片上传完成，合并文件
      const mergeResult = await uploader.mergeFile();

      if (mergeResult.success) {
        setUploads(prev => {
          const current = prev.get(fileHash);
          if (!current) return prev;

          return new Map(prev.set(fileHash, {
            ...current,
            status: 'success',
            percentage: 100,
            uploadedSize: file.size
          }));
        });
        return { success: true, message: '文件上传成功' };
      } else {
        setUploads(prev => {
          const current = prev.get(fileHash);
          if (!current) return prev;

          return new Map(prev.set(fileHash, {
            ...current,
            status: 'error'
          }));
        });
        return { success: false, message: mergeResult.message };
      }
    } catch (error) {
      setUploads(prev => {
        const current = prev.get(fileHash);
        if (!current) return prev;

        return new Map(prev.set(fileHash, {
          ...current,
          status: 'error'
        }));
      });
      return {
        success: false,
        message: error instanceof Error ? error.message : '上传失败'
      };
    }
  }, []);

  // 暂停上传
  const pauseUpload = useCallback((fileHash: string) => {
    setUploads(prev => {
      const current = prev.get(fileHash);
      if (!current) return prev;

      return new Map(prev.set(fileHash, {
        ...current,
        status: 'paused'
      }));
    });
  }, []);

  // 删除上传记录
  const removeUpload = useCallback((fileHash: string) => {
    setUploads(prev => {
      const newMap = new Map(prev);
      newMap.delete(fileHash);
      return newMap;
    });
  }, []);

  return {
    uploads: Array.from(uploads.values()),
    startUpload,
    pauseUpload,
    removeUpload
  };
};
export interface FileChunk {
  chunk: Blob;
  index: number;
  hash: string;
  size: number;
}

export interface UploadProgress {
  fileHash: string;
  fileName: string;
  fileSize: number;
  uploadedSize: number;
  percentage: number;
  status: 'waiting' | 'uploading' | 'success' | 'error' | 'paused';
  chunks: ChunkProgress[];
}

export interface ChunkProgress {
  index: number;
  hash: string;
  status: 'waiting' | 'uploading' | 'success' | 'error';
  percentage: number;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface FileInfo {
  hash: string;
  name: string;
  size: number;
  exists?: boolean;
  uploadedChunks?: number[];
}
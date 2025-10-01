import { useRef, useState } from 'react';
import { useFileUpload } from '../hooks/useFileUpload';
import type { UploadProgress } from '../types/upload';

const FileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const { uploads, startUpload, pauseUpload, removeUpload } = useFileUpload();

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // 限制文件大小（例如：1GB）
    const maxSize = 1 * 1024 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({ type: 'error', text: '文件大小不能超过 1GB' });
      return;
    }

    setMessage({ type: 'info', text: '开始上传文件...' });

    try {
      const result = await startUpload(file);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch {
      setMessage({ type: 'error', text: '上传失败' });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'waiting': return '等待中';
      case 'uploading': return '上传中';
      case 'success': return '完成';
      case 'error': return '失败';
      case 'paused': return '已暂停';
      default: return '未知';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'waiting': return '#f59e0b';
      case 'uploading': return '#3b82f6';
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'paused': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>大文件分片上传</h1>

      {/* 拖拽上传区域 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? '#3b82f6' : '#d1d5db'}`,
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: dragOver ? '#f0f9ff' : '#f9fafb',
          transition: 'all 0.3s ease',
          marginBottom: '20px'
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
        <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500' }}>
          拖拽文件到此处或点击选择文件
        </p>
        <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
          支持最大 1GB 的文件上传
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* 消息提示 */}
      {message && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            backgroundColor: message.type === 'success' ? '#f0fdf4' :
                           message.type === 'error' ? '#fef2f2' : '#f0f9ff',
            border: `1px solid ${message.type === 'success' ? '#bbf7d0' :
                                message.type === 'error' ? '#fecaca' : '#bfdbfe'}`,
            color: message.type === 'success' ? '#166534' :
                   message.type === 'error' ? '#dc2626' : '#1d4ed8'
          }}
        >
          {message.text}
        </div>
      )}

      {/* 上传列表 */}
      {uploads.length > 0 && (
        <div>
          <h3>上传列表</h3>
          {uploads.map((upload) => (
            <UploadItem
              key={upload.fileHash}
              upload={upload}
              onPause={() => pauseUpload(upload.fileHash)}
              onRemove={() => removeUpload(upload.fileHash)}
              formatFileSize={formatFileSize}
              getStatusText={getStatusText}
              getStatusColor={getStatusColor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface UploadItemProps {
  upload: UploadProgress;
  onPause: () => void;
  onRemove: () => void;
  formatFileSize: (bytes: number) => string;
  getStatusText: (status: string) => string;
  getStatusColor: (status: string) => string;
}

const UploadItem = ({ upload, onPause, onRemove, formatFileSize, getStatusText, getStatusColor }: UploadItemProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        backgroundColor: 'white'
      }}
    >
      {/* 文件信息 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{upload.fileName}</h4>
          <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
            {formatFileSize(upload.uploadedSize)} / {formatFileSize(upload.fileSize)}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
              color: getStatusColor(upload.status),
              backgroundColor: `${getStatusColor(upload.status)}20`
            }}
          >
            {getStatusText(upload.status)}
          </span>
          {upload.status === 'uploading' && (
            <button
              onClick={onPause}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              暂停
            </button>
          )}
          <button
            onClick={onRemove}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              border: '1px solid #fca5a5',
              borderRadius: '4px',
              backgroundColor: 'white',
              color: '#dc2626',
              cursor: 'pointer'
            }}
          >
            删除
          </button>
        </div>
      </div>

      {/* 进度条 */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '14px' }}>总进度</span>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>{upload.percentage.toFixed(1)}%</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#f3f4f6',
            borderRadius: '4px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${upload.percentage}%`,
              height: '100%',
              backgroundColor: getStatusColor(upload.status),
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* 详情切换 */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        style={{
          padding: '4px 0',
          fontSize: '12px',
          border: 'none',
          backgroundColor: 'transparent',
          color: '#3b82f6',
          cursor: 'pointer',
          textDecoration: 'underline'
        }}
      >
        {showDetails ? '隐藏详情' : '显示详情'}
      </button>

      {/* 分片详情 */}
      {showDetails && (
        <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
          <h5 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>分片详情 ({upload.chunks.length} 个分片)</h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '4px' }}>
            {upload.chunks.map((chunk) => (
              <div
                key={chunk.index}
                title={`分片 ${chunk.index + 1}: ${getStatusText(chunk.status)} (${chunk.percentage.toFixed(1)}%)`}
                style={{
                  width: '60px',
                  height: '20px',
                  backgroundColor: `${getStatusColor(chunk.status)}40`,
                  border: `1px solid ${getStatusColor(chunk.status)}`,
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: getStatusColor(chunk.status)
                }}
              >
                {chunk.index + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
// 简单的内存数据库，用于存储文件映射
// 在生产环境中应该替换为真实数据库 (Redis/MongoDB等)

export class FileDatabase {
  constructor() {
    this.uploadedFiles = new Map();
  }

  // 获取文件信息
  get(key) {
    return this.uploadedFiles.get(key);
  }

  // 设置文件信息
  set(key, value) {
    this.uploadedFiles.set(key, value);
  }

  // 获取所有条目
  entries() {
    return this.uploadedFiles.entries();
  }

  // 删除文件记录
  delete(key) {
    return this.uploadedFiles.delete(key);
  }

  // 检查文件是否存在
  has(key) {
    return this.uploadedFiles.has(key);
  }

  // 获取文件数量
  size() {
    return this.uploadedFiles.size;
  }

  // 清空所有数据
  clear() {
    this.uploadedFiles.clear();
  }
}

// 单例实例
export const fileDB = new FileDatabase();
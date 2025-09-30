// 使用 Web Crypto API 计算文件 MD5
export async function calculateFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// 使用增量哈希计算大文件（分块计算）
export async function calculateFileHashIncremental(file: File, chunkSize: number = 2 * 1024 * 1024): Promise<string> {
  const chunks: string[] = [];

  for (let start = 0; start < file.size; start += chunkSize) {
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    const buffer = await chunk.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    chunks.push(hashHex);
  }

  // 将所有块的哈希再次哈希得到最终哈希
  const combinedHash = chunks.join('');
  const buffer = new TextEncoder().encode(combinedHash);
  const finalHashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const finalHashArray = Array.from(new Uint8Array(finalHashBuffer));
  return finalHashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 计算块的哈希
export async function calculateChunkHash(chunk: Blob): Promise<string> {
  const buffer = await chunk.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
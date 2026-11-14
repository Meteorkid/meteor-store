/** 构建进程显式缩小连接预算；普通运行未设置时沿用10连接。 */
export function getDatabasePoolSize(buildPoolSize: string | undefined): number {
  if (buildPoolSize === undefined) return 10;
  if (!/^(?:[1-9]|10)$/.test(buildPoolSize)) {
    throw new Error('METEOR_BUILD_DB_POOL_SIZE must be an integer from 1 to 10');
  }
  return Number(buildPoolSize);
}

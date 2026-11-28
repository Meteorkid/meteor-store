/** 构建进程显式缩小连接预算；普通运行未设置时沿用10连接。 */
export function getDatabasePoolSize(buildPoolSize: string | undefined): number {
  if (buildPoolSize === undefined) return 10;
  if (!/^(?:[1-9]|10)$/.test(buildPoolSize)) {
    throw new Error('METEOR_BUILD_DB_POOL_SIZE must be an integer from 1 to 10');
  }
  return Number(buildPoolSize);
}

/** 构建期隧道排队可能超过默认 10 秒；仅构建环境可放宽，普通运行维持 10 秒。 */
export function getDatabaseConnectionTimeoutMs(buildTimeoutMs: string | undefined): number {
  if (buildTimeoutMs === undefined) return 10_000;
  if (!/^\d+$/.test(buildTimeoutMs)) {
    throw new Error('METEOR_BUILD_DB_CONNECT_TIMEOUT_MS must be an integer from 5000 to 60000');
  }
  const value = Number(buildTimeoutMs);
  if (value < 5_000 || value > 60_000) {
    throw new Error('METEOR_BUILD_DB_CONNECT_TIMEOUT_MS must be an integer from 5000 to 60000');
  }
  return value;
}

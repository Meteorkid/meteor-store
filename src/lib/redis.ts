import { Redis } from 'ioredis';

/**
 * 全站共享的本机 Redis 客户端。
 *
 * 限流、CAPTCHA 防重放和 Pathfinder 静态下架记录都从这里取连接。
 * 生产环境连接服务器上只监听回环地址的 redis-server，不再依赖 Upstash 的
 * HTTP REST 接口，因此没有每月命令额度，也不会把访问凭证暴露给公网。
 *
 * 配置只认 `REDIS_URL`，例如：
 *   redis://:password@127.0.0.1:6379/0
 *
 * 未配置时返回 null，调用方各自降级（限流走内存、CAPTCHA 走进程内 Map）。
 */

let redis: Redis | null = null;
let lastErrorLogAt = 0;

function readUrl(): string | null {
  const url = process.env.REDIS_URL?.trim();
  return url || null;
}

/** 返回共享 Redis 客户端；未配置时返回 null。 */
export function getRedis(): Redis | null {
  const url = readUrl();
  if (!url) return null;
  if (redis) return redis;

  redis = new Redis(url, {
    connectionName: 'meteor-store',
    // 首次命令可能早于连接就绪，保留离线队列；Redis 真故障时由
    // maxRetriesPerRequest + commandTimeout 快速失败，让调用方走降级。
    enableOfflineQueue: true,
    maxRetriesPerRequest: 1,
    connectTimeout: 3_000,
    commandTimeout: 3_000,
    keepAlive: 30_000,
    retryStrategy(times) {
      return Math.min(times * 200, 2_000);
    },
  });

  // ioredis 的 error 事件没有监听器时会被 Node 当成未捕获异常。
  // 连接抖动只保留每分钟一条日志，避免 Redis 重启时刷爆应用日志。
  redis.on('error', (error: Error) => {
    const now = Date.now();
    if (now - lastErrorLogAt < 60_000) return;
    lastErrorLogAt = now;
    console.error('[redis] connection error:', error.message);
  });

  return redis;
}

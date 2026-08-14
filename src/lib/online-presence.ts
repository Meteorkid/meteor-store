import { getRedis } from './redis';

/**
 * 在线人数低于该阈值时前端不展示数字，避免「在线 1 人」这类冷启动噪音。
 */
export const ONLINE_VISIBLE_THRESHOLD = 50;

/**
 * 5 分钟一个 HLL 桶：10 分钟窗口只需合并当前桶与上一个桶。
 */
export function onlineBucketKey(now: number): string {
  return `online:hll:${Math.floor(now / 300_000)}`;
}

/**
 * 记录一次访客心跳：PFADD 进当前桶并刷新 TTL（15 分钟 > 10 分钟窗口，过期自动清理）。
 * Redis 未配置或请求失败时静默降级，不打扰用户。
 */
export async function heartbeat(visitorId: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    const key = onlineBucketKey(Date.now());
    await redis.pfadd(key, visitorId);
    await redis.expire(key, 900);
  } catch (error) {
    console.error('online presence heartbeat failed:', error);
  }
}

/**
 * 返回 10 分钟窗口内的去重在线人数。
 * 先读 60 秒缓存；未命中时 PFCOUNT 当前桶 + 上一个桶，HLL 合并天然去重。
 * Redis 未配置或请求失败时返回 0。
 */
export async function getOnlineCount(): Promise<number> {
  const redis = getRedis();
  if (!redis) return 0;

  try {
    const cached = await redis.get<number>('online:count');
    if (cached !== null) return cached;

    const now = Date.now();
    const count = await redis.pfcount(onlineBucketKey(now), onlineBucketKey(now - 300_000));
    await redis.set('online:count', count, { ex: 60 });
    return count;
  } catch (error) {
    console.error('online presence count failed:', error);
    return 0;
  }
}

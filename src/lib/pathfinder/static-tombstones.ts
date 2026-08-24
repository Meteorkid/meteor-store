import { getRedis } from '@/lib/redis';

const STATIC_TOMBSTONE_KEY = 'pathfinder:static-tombstones:v1';
const localTombstones = new Set<string>();

export interface StaticTombstoneSnapshot {
  ids: string[];
  /** true 表示本次读取来自可依赖的存储；生产环境未配置 Redis 也视为不可用。 */
  available: boolean;
}

/** 静态种子的紧急下架记录独立于 Postgres 保存，数据库故障时仍能阻止内容复活。 */
export async function readStaticPathfinderTombstones(): Promise<StaticTombstoneSnapshot> {
  const redis = getRedis();
  if (!redis) {
    return { ids: [...localTombstones], available: process.env.NODE_ENV !== 'production' };
  }

  try {
    const ids = await redis.smembers<string[]>(STATIC_TOMBSTONE_KEY);
    for (const id of ids) localTombstones.add(id);
    return { ids: [...new Set([...localTombstones, ...ids])], available: true };
  } catch (error) {
    console.error('[pathfinder] 读取静态下架保护记录失败', error);
    return { ids: [...localTombstones], available: false };
  }
}

/** 写入先于数据库覆盖记录；生产环境无法持久化时拒绝宣告下架成功。 */
export async function addStaticPathfinderTombstone(id: string, urlHash?: string): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Pathfinder static tombstone store is not configured');
    }
    localTombstones.add(id);
    if (urlHash) localTombstones.add(`url:${urlHash}`);
    return;
  }

  if (urlHash) {
    await redis.sadd(STATIC_TOMBSTONE_KEY, id, `url:${urlHash}`);
  } else {
    await redis.sadd(STATIC_TOMBSTONE_KEY, id);
  }
  localTombstones.add(id);
  if (urlHash) localTombstones.add(`url:${urlHash}`);
}

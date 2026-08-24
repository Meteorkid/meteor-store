import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  redis: null as null | { smembers: ReturnType<typeof vi.fn>; sadd: ReturnType<typeof vi.fn> },
}));

vi.mock('@/lib/redis', () => ({ getRedis: () => state.redis }));

import {
  addStaticPathfinderTombstone,
  readStaticPathfinderTombstones,
} from '../static-tombstones';

describe('Pathfinder 静态下架保护存储', () => {
  beforeEach(() => {
    state.redis = null;
  });

  it('开发和测试环境未配置 Redis 时使用进程内保护', async () => {
    await addStaticPathfinderTombstone('static-local-test');
    await expect(readStaticPathfinderTombstones()).resolves.toMatchObject({
      ids: expect.arrayContaining(['static-local-test']),
      available: true,
    });
  });

  it('Redis 持久化静态下架记录并在读取时合并', async () => {
    const smembers = vi.fn().mockResolvedValue(['static-remote-test']);
    const sadd = vi.fn().mockResolvedValue(1);
    state.redis = { smembers, sadd };

    await addStaticPathfinderTombstone('static-written-test');
    const snapshot = await readStaticPathfinderTombstones();

    expect(sadd).toHaveBeenCalledWith('pathfinder:static-tombstones:v1', 'static-written-test');
    expect(snapshot.available).toBe(true);
    expect(snapshot.ids).toEqual(expect.arrayContaining(['static-written-test', 'static-remote-test']));
  });
});

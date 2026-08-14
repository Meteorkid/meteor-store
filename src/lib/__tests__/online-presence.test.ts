import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type MockRedis = {
  get: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  pfadd: ReturnType<typeof vi.fn>;
  pfcount: ReturnType<typeof vi.fn>;
  expire: ReturnType<typeof vi.fn>;
};

const state = vi.hoisted(() => ({
  redis: null as MockRedis | null,
}));

vi.mock('@/lib/redis', () => ({
  getRedis: () => state.redis,
}));

import {
  getOnlineCount,
  heartbeat,
  onlineBucketKey,
  ONLINE_VISIBLE_THRESHOLD,
} from '../online-presence';

function createRedisMock(): MockRedis {
  return {
    get: vi.fn(),
    set: vi.fn(),
    pfadd: vi.fn(),
    pfcount: vi.fn(),
    expire: vi.fn(),
  };
}

describe('同时在线人数', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.redis = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('heartbeat 把访客 UUID 写进当前 5 分钟桶并设置 900 秒 TTL', async () => {
    const redis = createRedisMock();
    redis.pfadd.mockResolvedValue(1);
    redis.expire.mockResolvedValue(1);
    state.redis = redis;

    const now = 1_800_000_000_000;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    const visitorId = '11111111-1111-4111-8111-111111111111';

    await heartbeat(visitorId);

    expect(redis.pfadd).toHaveBeenCalledTimes(1);
    expect(redis.pfadd).toHaveBeenCalledWith(onlineBucketKey(now), visitorId);
    expect(redis.expire).toHaveBeenCalledTimes(1);
    expect(redis.expire).toHaveBeenCalledWith(onlineBucketKey(now), 900);
  });

  it('Redis 未配置时 heartbeat 与 getOnlineCount 静默降级', async () => {
    await expect(
      heartbeat('11111111-1111-4111-8111-111111111111'),
    ).resolves.toBeUndefined();
    await expect(getOnlineCount()).resolves.toBe(0);
  });

  it('Redis 请求失败时 heartbeat 与 getOnlineCount 不抛错', async () => {
    const redis = createRedisMock();
    redis.pfadd.mockRejectedValue(new Error('redis down'));
    redis.get.mockRejectedValue(new Error('redis down'));
    state.redis = redis;

    await expect(
      heartbeat('11111111-1111-4111-8111-111111111111'),
    ).resolves.toBeUndefined();
    await expect(getOnlineCount()).resolves.toBe(0);
  });

  it('getOnlineCount 缓存命中时直接返回，不再查 HLL', async () => {
    const redis = createRedisMock();
    redis.get.mockResolvedValue(123);
    state.redis = redis;

    await expect(getOnlineCount()).resolves.toBe(123);

    expect(redis.get).toHaveBeenCalledWith('online:count');
    expect(redis.pfcount).not.toHaveBeenCalled();
    expect(redis.set).not.toHaveBeenCalled();
  });

  it('getOnlineCount 缓存未命中时合并当前与上一个桶并写入 60 秒缓存', async () => {
    const redis = createRedisMock();
    redis.get.mockResolvedValue(null);
    redis.pfcount.mockResolvedValue(42);
    redis.set.mockResolvedValue('OK');
    state.redis = redis;

    const now = 1_800_000_000_000;
    vi.spyOn(Date, 'now').mockReturnValue(now);

    await expect(getOnlineCount()).resolves.toBe(42);

    expect(redis.pfcount).toHaveBeenCalledWith(
      onlineBucketKey(now),
      onlineBucketKey(now - 300_000),
    );
    expect(redis.set).toHaveBeenCalledWith('online:count', 42, { ex: 60 });
  });

  it('onlineBucketKey 跨 5 分钟边界变化，同一桶内相同', () => {
    const bucketStart = 1_800_000_000_000;

    expect(onlineBucketKey(bucketStart)).toBe(onlineBucketKey(bucketStart + 299_999));
    expect(onlineBucketKey(bucketStart)).not.toBe(onlineBucketKey(bucketStart + 300_000));
  });

  it('ONLINE_VISIBLE_THRESHOLD 固定为 50', () => {
    expect(ONLINE_VISIBLE_THRESHOLD).toBe(50);
  });
});

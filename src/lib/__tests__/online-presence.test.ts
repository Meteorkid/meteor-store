import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const BASE_TIME = 1_800_000_000_000;

describe('同时在线人数', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.setSystemTime(BASE_TIME);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('同一访客重复心跳只算一次，不同访客分别计数', async () => {
    const { heartbeat, getOnlineCount } = await import('../online-presence');

    await heartbeat('11111111-1111-4111-8111-111111111111');
    await heartbeat('11111111-1111-4111-8111-111111111111');
    await expect(getOnlineCount()).resolves.toBe(1);

    await heartbeat('22222222-2222-4222-8222-222222222222');
    await expect(getOnlineCount()).resolves.toBe(2);
  });

  it('只统计最近 10 分钟内有心跳的访客', async () => {
    const { heartbeat, getOnlineCount } = await import('../online-presence');

    await heartbeat('11111111-1111-4111-8111-111111111111');
    vi.setSystemTime(BASE_TIME + 10 * 60_000);
    await expect(getOnlineCount()).resolves.toBe(1);

    vi.setSystemTime(BASE_TIME + 10 * 60_000 + 1);
    await expect(getOnlineCount()).resolves.toBe(0);
  });

  it('visitorId 重复出现不会无限撑大计数', async () => {
    const { heartbeat, getOnlineCount } = await import('../online-presence');

    for (let i = 0; i < 100; i += 1) {
      await heartbeat('11111111-1111-4111-8111-111111111111');
    }

    await expect(getOnlineCount()).resolves.toBe(1);
  });

  it('ONLINE_VISIBLE_THRESHOLD 固定为 50', async () => {
    const { ONLINE_VISIBLE_THRESHOLD } = await import('../online-presence');
    expect(ONLINE_VISIBLE_THRESHOLD).toBe(50);
  });
});

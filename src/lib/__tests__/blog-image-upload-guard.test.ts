import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  calls: [] as unknown[][],
  results: [] as Array<{ limited: boolean; remaining: number; resetAt: number }>,
}));

vi.mock('../rate-limit', () => ({
  rateLimit: async (...args: unknown[]) => {
    state.calls.push(args);
    return state.results.shift() ?? {
      limited: false,
      remaining: 1,
      resetAt: 60_000,
    };
  },
}));

import {
  acquireBlogImageUploadSlot,
  checkBlogImageUploadRateLimit,
} from '../blog-image-upload-guard';

describe('博客图片上传门控', () => {
  beforeEach(() => {
    state.calls.length = 0;
    state.results.length = 0;
  });

  it('Cookie 与 PAT 入口可共用用户键和全站键，且限流后端异常时关闭失败', async () => {
    const result = await checkBlogImageUploadRateLimit('U1');

    expect(result).toEqual({ limited: false, scope: null, resetAt: 60_000 });
    expect(state.calls).toEqual([
      [
        'blog-image-upload:user:U1',
        10,
        60_000,
        { failClosed: true, fallback: 'memory' },
      ],
      [
        'blog-image-upload:global',
        30,
        60_000,
        { failClosed: true, fallback: 'memory' },
      ],
    ]);
  });

  it('用户已限流时不再消耗全站额度', async () => {
    state.results.push({ limited: true, remaining: 0, resetAt: 12_345 });

    await expect(checkBlogImageUploadRateLimit('U1')).resolves.toEqual({
      limited: true,
      scope: 'user',
      resetAt: 12_345,
    });
    expect(state.calls).toHaveLength(1);
  });

  it('返回全站限流的范围与重试时间', async () => {
    state.results.push(
      { limited: false, remaining: 9, resetAt: 10_000 },
      { limited: true, remaining: 0, resetAt: 20_000 },
    );

    await expect(checkBlogImageUploadRateLimit('U1')).resolves.toEqual({
      limited: true,
      scope: 'global',
      resetAt: 20_000,
    });
  });

  it('最多允许四个并发槽位，释放函数幂等', () => {
    const releases = Array.from({ length: 4 }, () => acquireBlogImageUploadSlot());
    expect(releases.every(Boolean)).toBe(true);
    expect(acquireBlogImageUploadSlot()).toBeNull();

    releases[0]?.();
    releases[0]?.();
    const replacement = acquireBlogImageUploadSlot();
    expect(replacement).not.toBeNull();
    expect(acquireBlogImageUploadSlot()).toBeNull();

    replacement?.();
    for (const release of releases.slice(1)) release?.();
  });
});

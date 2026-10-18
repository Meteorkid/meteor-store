import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({ feed: vi.fn(), limit: vi.fn() }));
vi.mock('@/data/blog-feed', () => ({ getFeedPosts: mocks.feed }));
vi.mock('@/lib/rate-limit', () => ({ getClientIp: () => '203.0.113.8', rateLimit: mocks.limit }));
import { GET as search } from '../search/route';
import { GET as legacySearch } from '../sb3/search/route';

beforeEach(() => {
  vi.clearAllMocks();
  mocks.feed.mockResolvedValue([]);
  mocks.limit.mockResolvedValue({ limited: false });
});

describe.each([['search', search], ['sb3/search', legacySearch]] as const)('%s 查询预算', (_, handler) => {
  const request = (query: string) => new NextRequest(`https://example.test/api/spotlight/search?q=${encodeURIComponent(query)}&locale=en`);

  it('超长输入在读取博客或执行搜索前明确拒绝', async () => {
    const response = await handler(request('a'.repeat(161)));
    expect(response.status).toBe(400);
    expect(mocks.feed).not.toHaveBeenCalled();
  });

  it('两个入口共享IP预算，超额不读取博客', async () => {
    mocks.limit.mockResolvedValue({ limited: true });
    const response = await handler(request('xisland'));
    expect(response.status).toBe(429);
    expect(mocks.feed).not.toHaveBeenCalled();
    expect(mocks.limit).toHaveBeenCalledWith('spotlight:ip:203.0.113.8', 60, 60_000, { fallback: 'memory' });
  });

  it('普通查询仍保留英文结果结构', async () => {
    const response = await handler(request('xisland'));
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.results.some((item: { href: string }) => item.href.includes('/products/xisland'))).toBe(true);
    expect(mocks.feed).toHaveBeenCalledWith('en');
  });
});

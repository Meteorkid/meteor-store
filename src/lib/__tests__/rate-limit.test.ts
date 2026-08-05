import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockLimit = vi.fn();
const slidingWindowMock = vi.fn((limit: number, window: string) => ({ limit, window }));

vi.mock('@upstash/redis', () => ({
  Redis: class MockRedis {},
}));

vi.mock('@upstash/ratelimit', () => {
  class MockRatelimit {
    static slidingWindow = slidingWindowMock;
    limit = mockLimit;
  }
  return { Ratelimit: MockRatelimit };
});

async function importRateLimit() {
  return await import('../rate-limit');
}

describe('rateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  it('fails open when Redis is not configured', async () => {
    const { rateLimit } = await importRateLimit();
    const result = await rateLimit('key', 10, 60_000);

    expect(result.limited).toBe(false);
    expect(mockLimit).not.toHaveBeenCalled();
  });

  it('uses a per-instance fallback limit when requested and Redis is not configured', async () => {
    const { rateLimit } = await importRateLimit();
    const key = `memory-${Date.now()}`;

    const first = await rateLimit(key, 2, 60_000, { fallback: 'memory' });
    const second = await rateLimit(key, 2, 60_000, { fallback: 'memory' });
    const third = await rateLimit(key, 2, 60_000, { fallback: 'memory' });

    expect(first.limited).toBe(false);
    expect(second.limited).toBe(false);
    expect(third.limited).toBe(true);
  });

  it('creates a distinct limiter per (limit, windowMs) combination instead of sharing one instance', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
    mockLimit.mockResolvedValue({ success: true, remaining: 4, reset: Date.now() });

    const { rateLimit } = await importRateLimit();
    await rateLimit('ip1', 10, 60_000);
    await rateLimit('ip2', 5, 60_000);

    // 若限流器被单例共享，slidingWindow 只会以第一次的参数被调用一次；
    // 修复后应分别以各自的 limit 值被调用
    const calledLimits = slidingWindowMock.mock.calls.map(([limit]) => limit);
    expect(calledLimits).toContain(10);
    expect(calledLimits).toContain(5);
  });

  it('reuses the cached limiter instance for the same (limit, windowMs) combination', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
    mockLimit.mockResolvedValue({ success: true, remaining: 9, reset: Date.now() });

    const { rateLimit } = await importRateLimit();
    await rateLimit('ip1', 10, 60_000);
    await rateLimit('ip2', 10, 60_000);

    const callsWithLimit10 = slidingWindowMock.mock.calls.filter(([limit]) => limit === 10);
    expect(callsWithLimit10).toHaveLength(1);
  });

  it('reports limited=true when the underlying limiter rejects the request', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
    mockLimit.mockResolvedValue({ success: false, remaining: 0, reset: Date.now() + 1000 });

    const { rateLimit } = await importRateLimit();
    const result = await rateLimit('ip', 5, 60_000);

    expect(result.limited).toBe(true);
  });

  it('fails open on Redis errors by default', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
    mockLimit.mockRejectedValue(new Error('network error'));

    const { rateLimit } = await importRateLimit();
    const result = await rateLimit('ip', 10, 60_000);

    expect(result.limited).toBe(false);
  });

  it('fails closed on Redis errors when failClosed is requested', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
    mockLimit.mockRejectedValue(new Error('network error'));

    const { rateLimit } = await importRateLimit();
    const result = await rateLimit('ip', 10, 60_000, { failClosed: true });

    expect(result.limited).toBe(true);
  });
});

describe('getClientIp', () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.VERCEL;
    delete process.env.TRUST_NGINX_PROXY;
  });

  it('returns "unknown" when not running on Vercel, even with forwarded headers', async () => {
    const { getClientIp } = await importRateLimit();
    const request = new Request('https://example.com', {
      headers: { 'x-forwarded-for': '203.0.113.1' },
    });

    expect(getClientIp(request)).toBe('unknown');
  });

  it('uses the real IP overwritten by the trusted Nginx proxy', async () => {
    process.env.TRUST_NGINX_PROXY = '1';
    const { getClientIp } = await importRateLimit();
    const request = new Request('https://example.com', {
      headers: {
        'x-real-ip': '203.0.113.2',
        'x-forwarded-for': '198.51.100.9, 203.0.113.2',
      },
    });

    expect(getClientIp(request)).toBe('203.0.113.2');
  });

  it('extracts the last non-private IP from x-forwarded-for on Vercel', async () => {
    process.env.VERCEL = '1';
    const { getClientIp } = await importRateLimit();
    const request = new Request('https://example.com', {
      headers: { 'x-forwarded-for': '203.0.113.1, 10.0.0.1' },
    });

    expect(getClientIp(request)).toBe('203.0.113.1');
  });
});

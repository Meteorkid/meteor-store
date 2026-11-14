import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mock = vi.hoisted(() => ({ lookup: vi.fn(), limit: vi.fn() }));
vi.mock('@/lib/rate-limit', () => ({ rateLimit: mock.limit, getClientIp: () => 'test-ip' }));
vi.mock('@/lib/ielts/word-lookup-service', async importOriginal => ({
  ...await importOriginal<typeof import('@/lib/ielts/word-lookup-service')>(), lookupIeltsWord: mock.lookup,
}));
vi.mock('@/lib/ielts/catalog', () => ({ getIeltsPair: vi.fn() }));
import { POST } from '../word-lookup/route';
import { WordLookupError } from '@/lib/ielts/word-lookup-service';

const input = { slug: 'pair-a', segmentIndex: 0, side: 'high', word: 'bank' };
const result = { source: 'ai', entry: { word: 'bank', lemma: 'bank', partOfSpeech: 'noun', meaningZh: '银行', usageZh: '' } };
function request(body: unknown = input, headers: Record<string, string> = {}) {
  return new NextRequest('http://127.0.0.1:3000/api/ielts/word-lookup', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://127.0.0.1:3000', ...headers },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  mock.limit.mockResolvedValue({ limited: false, resetAt: Date.now() + 60_000 });
  mock.lookup.mockResolvedValue(result);
});
afterEach(() => vi.useRealTimers());

describe('/api/ielts/word-lookup', () => {
  it('收藏凭据只给v2客户端，旧严格客户端仍收到原协议', async () => {
    const withReceipt = { ...result, saveToken: 'signed.receipt', sourceKey: 'a'.repeat(64) };
    mock.lookup.mockResolvedValue(withReceipt);
    expect(await (await POST(request())).json()).toEqual(result);
    expect(await (await POST(request(input, { 'X-Ielts-Lookup-Version': '2' }))).json()).toEqual(withReceipt);
  });

  it('公开读取不要求登录，返回共享协议且所有响应no-store', async () => {
    const response = await POST(request({ ...input, word: 'Bank' }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(result);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(mock.lookup).toHaveBeenCalledWith(input);
    expect(mock.limit).toHaveBeenCalledWith('ielts-word:test-ip', 30, 60_000, { fallback: 'memory', failClosed: true });
  });

  it('跨站403且不调用服务或预算', async () => {
    const response = await POST(request(input, { Origin: 'https://evil.example.com' }));
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: 'invalid' });
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(mock.lookup).not.toHaveBeenCalled();
    expect(mock.limit).not.toHaveBeenCalled();
  });

  it('IP限流返回Retry-After且不调用服务', async () => {
    vi.useFakeTimers();
    mock.limit.mockResolvedValue({ limited: true, resetAt: Date.now() + 30_000 });
    const response = await POST(request());
    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('30');
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(mock.lookup).not.toHaveBeenCalled();
  });

  it.each([
    { ...input, context: 'client supplied sentence' }, { ...input, side: 'draft' },
    { ...input, segmentIndex: 30 }, { ...input, word: 'bank and loans' },
    { ...input, word: '2020' }, { ...input, slug: '../private' },
  ])('strict协议拒绝非法请求 %j', async body => {
    const response = await POST(request(body));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalid' });
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(mock.lookup).not.toHaveBeenCalled();
  });

  it('声明长度超过2KB时不读取请求体', async () => {
    const response = await POST(request(input, { 'content-length': '2049' }));
    expect(response.status).toBe(400);
    expect(mock.lookup).not.toHaveBeenCalled();
  });

  it('无Content-Length的分块请求也受2KB限制并取消读取', async () => {
    const cancel = vi.fn();
    const body = new ReadableStream<Uint8Array>({
      start(controller) { controller.enqueue(new TextEncoder().encode('中'.repeat(700))); }, cancel,
    });
    const req = new Request('http://127.0.0.1:3000/api/ielts/word-lookup', {
      method: 'POST', headers: { Origin: 'http://127.0.0.1:3000' }, body, duplex: 'half',
    } as RequestInit) as NextRequest;
    expect((await POST(req)).status).toBe(400);
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(mock.lookup).not.toHaveBeenCalled();
  });

  it('坏JSON或空body返回400', async () => {
    for (const body of ['{', undefined]) {
      const req = new NextRequest('http://127.0.0.1:3000/api/ielts/word-lookup', { method: 'POST', body });
      expect((await POST(req)).status).toBe(400);
    }
    expect(mock.lookup).not.toHaveBeenCalled();
  });

  it.each([
    ['invalid', 400], ['not_found', 404], ['rate_limited', 429], ['unavailable', 503], ['timeout', 504],
  ] as const)('服务错误%s映射为%s', async (code, status) => {
    mock.lookup.mockRejectedValueOnce(new WordLookupError(code, code === 'rate_limited' ? 2 : undefined));
    const response = await POST(request());
    expect(response.status).toBe(status);
    expect(await response.json()).toEqual({ error: code });
    expect(response.headers.get('cache-control')).toBe('no-store');
    if (code === 'rate_limited') expect(response.headers.get('retry-after')).toBe('2');
  });

  it('未预期异常不透出内容', async () => {
    mock.lookup.mockRejectedValueOnce(new Error('private diagnostic'));
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'unavailable' });
  });
});

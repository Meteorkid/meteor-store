import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

/**
 * 听力点词查词接口是公开的：不要求登录，按 IP 限流且未配置 Redis 也限流；
 * 请求体严格、有界，服务错误按协议映射状态码。
 */

const mock = vi.hoisted(() => ({ lookup: vi.fn(), limit: vi.fn() }));
vi.mock('@/lib/rate-limit', () => ({ rateLimit: mock.limit, getClientIp: () => 'test-ip' }));
vi.mock('@/lib/ielts-listening/word-lookup-service', async importOriginal => ({
  ...await importOriginal<typeof import('@/lib/ielts-listening/word-lookup-service')>(),
  lookupListeningWord: mock.lookup,
}));
vi.mock('@/lib/ielts/catalog', () => ({ getIeltsPair: vi.fn() }));

import { POST } from '../word-lookup/route';
import { WordLookupError } from '@/lib/ielts/word-lookup-service';

const input = { slug: 'test-01-part-1', sentenceIndex: 10, word: 'clay' };
const result = {
  source: 'lesson',
  entry: { word: 'clay', lemma: 'clay', partOfSpeech: 'n.', meaningZh: '陶土', usageZh: '' },
  saveToken: 'signed.receipt', sourceKey: 'a'.repeat(64),
};

function request(payload: unknown = input, headers: Record<string, string> = {}) {
  return new NextRequest('http://127.0.0.1:3000/api/ielts/listening/word-lookup', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://127.0.0.1:3000', ...headers },
    body: JSON.stringify(payload),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  mock.limit.mockResolvedValue({ limited: false, resetAt: Date.now() + 60_000 });
  mock.lookup.mockResolvedValue(result);
});

describe('/api/ielts/listening/word-lookup', () => {
  it('公开读取不要求登录，完整返回可收藏的凭据，所有响应 no-store', async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(result);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(mock.lookup).toHaveBeenCalledWith(input);
    expect(mock.limit).toHaveBeenCalledWith('ielts-listening-word:test-ip', 30, 60_000, { fallback: 'memory', failClosed: true });
  });

  it('跨站 403 且不调用服务或预算', async () => {
    const response = await POST(request(input, { Origin: 'https://evil.example.com' }));
    expect(response.status).toBe(403);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(mock.lookup).not.toHaveBeenCalled();
    expect(mock.limit).not.toHaveBeenCalled();
  });

  it('IP 限流返回 Retry-After 且不调用服务', async () => {
    vi.useFakeTimers();
    mock.limit.mockResolvedValue({ limited: true, resetAt: Date.now() + 30_000 });
    const response = await POST(request());
    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('30');
    expect(mock.lookup).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it.each([
    { ...input, sentence: 'client supplied' },
    { ...input, sentenceIndex: 500 },
    { ...input, sentenceIndex: -1 },
    { ...input, word: 'clay pot' },
    { ...input, word: '2020' },
    { ...input, slug: '../private' },
  ])('strict 协议拒绝非法请求 %j', async payload => {
    const response = await POST(request(payload));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalid' });
    expect(mock.lookup).not.toHaveBeenCalled();
  });

  it('声明长度超过 2KB 时不读取请求体；无 Content-Length 的分块请求同样被截断', async () => {
    const declared = await POST(request(input, { 'content-length': String(2 * 1024 + 1) }));
    expect(declared.status).toBe(400);
    const cancel = vi.fn();
    const body = new ReadableStream<Uint8Array>({
      start(controller) { controller.enqueue(new TextEncoder().encode('中'.repeat(700))); }, cancel,
    });
    const chunked = new Request('http://127.0.0.1:3000/api/ielts/listening/word-lookup', {
      method: 'POST', headers: { Origin: 'http://127.0.0.1:3000' }, body, duplex: 'half',
    } as RequestInit) as NextRequest;
    expect((await POST(chunked)).status).toBe(400);
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(mock.lookup).not.toHaveBeenCalled();
  });

  it('坏 JSON 或空 body 返回 400', async () => {
    for (const body of ['{', undefined]) {
      const req = new NextRequest('http://127.0.0.1:3000/api/ielts/listening/word-lookup', { method: 'POST', body });
      expect((await POST(req)).status).toBe(400);
    }
    expect(mock.lookup).not.toHaveBeenCalled();
  });

  it.each([
    ['invalid', 400], ['not_found', 404], ['rate_limited', 429], ['unavailable', 503], ['timeout', 504],
  ] as const)('服务错误 %s 映射为 %s', async (code, status) => {
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

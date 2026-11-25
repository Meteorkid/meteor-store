import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

/**
 * 听力练习记录接口的边界：未登录、跨站、账号对不上、限流、请求体不合法，
 * 以及正常返回的是服务端判分后的记录。记录页是私有的，所有响应都 no-store。
 */

const mock = vi.hoisted(() => ({ session: vi.fn(), limit: vi.fn(), save: vi.fn(), overview: vi.fn() }));
vi.mock('@/lib/auth', () => ({ getSession: mock.session }));
vi.mock('@/lib/rate-limit', () => ({ rateLimit: mock.limit, getClientIp: () => 'test-ip' }));
vi.mock('@/lib/ielts-listening/attempts', async importOriginal => ({
  ...await importOriginal<typeof import('@/lib/ielts-listening/attempts')>(),
  saveListeningAttempt: mock.save,
  getListeningPracticeOverview: mock.overview,
}));

import { GET, POST } from '../attempts/route';
import { ListeningAttemptError } from '@/lib/ielts-listening/attempts';

const body = { slug: 'test-01-part-1', answers: { 1: 'Krause' }, scope: [1], durationSec: 60 };
const attempt = {
  id: 'a1', lessonSlug: 'test-01-part-1', mode: 'custom', questionNumbers: [1], wrongNumbers: [], score: 1, total: 1,
  durationSec: 60, createdAt: '2026-11-24T10:00:00.000Z',
};

function req(method = 'POST', payload: unknown = body, headers: Record<string, string> = {}) {
  return new NextRequest('http://127.0.0.1:3000/api/ielts/listening/attempts', {
    method,
    headers: { 'Content-Type': 'application/json', Origin: 'http://127.0.0.1:3000', 'x-study-user': 'user-a', ...headers },
    ...(method === 'POST' ? { body: JSON.stringify(payload) } : {}),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  mock.session.mockResolvedValue({ userId: 'user-a', emailVerified: true });
  mock.limit.mockResolvedValue({ limited: false });
  mock.save.mockResolvedValue(attempt);
  mock.overview.mockResolvedValue({ attempts: [attempt], wrongBook: [] });
});

describe('/api/ielts/listening/attempts', () => {
  it('未登录所有入口 401 且 no-store', async () => {
    mock.session.mockResolvedValue(null);
    for (const response of [await GET(req('GET')), await POST(req())]) {
      expect(response.status).toBe(401);
      expect(response.headers.get('cache-control')).toBe('no-store');
    }
    expect(mock.save).not.toHaveBeenCalled();
    expect(mock.overview).not.toHaveBeenCalled();
  });

  it('跨站 403、账号对不上 409，都不写库', async () => {
    expect((await POST(req('POST', body, { Origin: 'https://evil.example.com' }))).status).toBe(403);
    expect((await POST(req('POST', body, { 'x-study-user': 'user-b' }))).status).toBe(409);
    expect(mock.save).not.toHaveBeenCalled();
  });

  it('写与读分别限流，返回 429', async () => {
    mock.limit.mockResolvedValue({ limited: true });
    expect((await POST(req())).status).toBe(429);
    expect((await GET(req('GET'))).status).toBe(429);
    expect(mock.limit).toHaveBeenCalledWith('ielts-listening-attempts:user-a:test-ip', 20, 60_000, { fallback: 'memory' });
    expect(mock.limit).toHaveBeenCalledWith('ielts-listening-attempts-read:user-a:test-ip', 60, 60_000, { fallback: 'memory' });
    expect(mock.save).not.toHaveBeenCalled();
  });

  it('正常记录返回服务端判分结果，客户端传的分数不被采纳', async () => {
    const response = await POST(req('POST', { ...body, score: 1, wrongNumbers: [] }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ userId: 'user-a', attempt });
    expect(response.headers.get('cache-control')).toBe('no-store');
    // 分数等字段由服务层校验拒绝，接口不把它们透传给写库逻辑
    expect(mock.save).toHaveBeenCalledWith('user-a', { ...body, score: 1, wrongNumbers: [] });
  });

  it('空体、坏 JSON、超长体都是 400，且由服务层协议拒绝', async () => {
    const bad = [
      req('POST', {}),
      new NextRequest('http://127.0.0.1:3000/api/ielts/listening/attempts', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://127.0.0.1:3000', 'x-study-user': 'user-a' }, body: '{',
      }),
    ];
    mock.save.mockRejectedValue(new ListeningAttemptError('invalid'));
    for (const request of bad) expect((await POST(request)).status).toBe(400);
    const tooLong = req('POST', body, { 'content-length': String(8 * 1024 + 1) });
    expect((await POST(tooLong)).status).toBe(400);
  });

  it('服务错误映射 400/404/503，未预期异常不透出内容', async () => {
    for (const [code, status] of [['invalid', 400], ['not_found', 404], ['unavailable', 503]] as const) {
      mock.save.mockRejectedValueOnce(new ListeningAttemptError(code));
      const response = await POST(req());
      expect(response.status).toBe(status);
      expect(await response.json()).toEqual({ error: code });
    }
    mock.save.mockRejectedValueOnce(new Error('private diagnostic'));
    expect(await (await POST(req())).json()).toEqual({ error: 'Could not save attempt' });
    mock.overview.mockRejectedValueOnce(new Error('db down'));
    expect((await GET(req('GET'))).status).toBe(503);
  });

  it('记录页一次性取回最近记录与错题本', async () => {
    const response = await GET(req('GET'));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ userId: 'user-a', attempts: [attempt], wrongBook: [] });
    expect(mock.overview).toHaveBeenCalledWith('user-a');
  });
});

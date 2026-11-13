import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

/**
 * 学习状态接口的边界：未登录、跨站、账号对不上、限流、请求体不合法，
 * 以及正常切换时返回的是回读后的真实状态。
 */

const mock = vi.hoisted(() => ({
  session: vi.fn(), limit: vi.fn(), list: vi.fn(), toggle: vi.fn(),
}));
vi.mock('@/lib/auth', () => ({ getSession: mock.session }));
vi.mock('@/lib/rate-limit', () => ({ getClientIp: () => 'test', rateLimit: mock.limit }));
vi.mock('@/lib/ielts/service', () => ({ listIeltsProgress: mock.list, toggleIeltsProgress: mock.toggle }));

import { GET, POST } from '../progress/route';

function req(method = 'POST', body?: unknown, headers: Record<string, string> = {}) {
  return new NextRequest('http://127.0.0.1:3000/api/ielts/progress', {
    method,
    headers: { 'Content-Type': 'application/json', Origin: 'http://127.0.0.1:3000', 'x-ielts-user': 'user-a', ...headers },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  mock.session.mockResolvedValue({ userId: 'user-a', emailVerified: true });
  mock.limit.mockResolvedValue({ limited: false });
  mock.list.mockResolvedValue([]);
  mock.toggle.mockResolvedValue({ slug: 'pair-a', studiedAt: '2026-11-14T00:00:00.000Z', bookmarkedAt: null });
});

describe('/api/ielts/progress', () => {
  it('未登录返回 401', async () => {
    mock.session.mockResolvedValue(null);
    expect((await GET()).status).toBe(401);
    expect((await POST(req('POST', { slug: 'pair-a', kind: 'studied' }))).status).toBe(401);
  });

  it('跨站请求返回 403', async () => {
    const response = await POST(req('POST', { slug: 'pair-a', kind: 'studied' }, { Origin: 'https://evil.example.com' }));
    expect(response.status).toBe(403);
  });

  it('账号对不上返回 409', async () => {
    const response = await POST(req('POST', { slug: 'pair-a', kind: 'studied' }, { 'x-ielts-user': 'user-b' }));
    expect(response.status).toBe(409);
  });

  it('限流返回 429', async () => {
    mock.limit.mockResolvedValue({ limited: true });
    expect((await POST(req('POST', { slug: 'pair-a', kind: 'studied' }))).status).toBe(429);
  });

  it('请求体不合法返回 400，且不写库', async () => {
    expect((await POST(req('POST', { slug: 'pair-a', kind: 'wat' }))).status).toBe(400);
    expect((await POST(req('POST', { slug: 'bad slug!', kind: 'studied' }))).status).toBe(400);
    expect(mock.toggle).not.toHaveBeenCalled();
  });

  it('正常切换返回回读后的状态', async () => {
    const response = await POST(req('POST', { slug: 'pair-a', kind: 'studied' }));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ userId: 'user-a', progress: { slug: 'pair-a', studiedAt: '2026-11-14T00:00:00.000Z' } });
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(mock.toggle).toHaveBeenCalledWith('user-a', 'pair-a', 'studied');
  });

  it('写库失败返回 503，不抛给框架', async () => {
    mock.toggle.mockRejectedValue(new Error('db down'));
    expect((await POST(req('POST', { slug: 'pair-a', kind: 'bookmarked' }))).status).toBe(503);
  });
});

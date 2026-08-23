import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  session: null as null | { userId: string },
  createCalls: [] as Array<{ userId: string; input: Record<string, unknown> }>,
  listCalls: [] as Array<{ userId: string; query: Record<string, unknown> }>,
}));

vi.mock('@/lib/auth', () => ({ getSession: async () => state.session }));
vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '203.0.113.8',
  rateLimit: async () => ({ limited: false }),
}));
vi.mock('@/lib/tollow', () => ({
  createTollowPracticeSession: async (userId: string, input: Record<string, unknown>) => {
    state.createCalls.push({ userId, input });
    return { session: { id: 'S1', ...input }, created: true };
  },
  listTollowPracticeSessions: async (userId: string, query: Record<string, unknown>) => {
    state.listCalls.push({ userId, query });
    return { items: [], total: 0, ...query };
  },
}));

import { GET, POST } from '../sessions/route';

const validSession = {
  clientRecordId: 'session-1',
  bookId: 'the-little-prince',
  bookTitle: '小王子',
  startedAt: '2026-08-23T00:00:00.000Z',
  endedAt: '2026-08-23T00:01:00.000Z',
  durationMs: 60_000,
  wordsTyped: 100,
  wpm: 100,
  accuracy: 98,
  errorCount: 2,
};

describe('/api/tollow/sessions', () => {
  beforeEach(() => {
    state.session = { userId: 'U1' };
    state.createCalls.length = 0;
    state.listCalls.length = 0;
  });

  it('分页参数经过白名单校验', async () => {
    const response = await GET(new NextRequest('http://localhost/api/tollow/sessions?page=2&limit=10'));
    expect(response.status).toBe(200);
    expect(state.listCalls).toEqual([{ userId: 'U1', query: { page: 2, limit: 10 } }]);

    expect((await GET(new NextRequest('http://localhost/api/tollow/sessions?limit=101'))).status).toBe(400);
  });

  it('写入会话只使用当前用户并返回幂等状态', async () => {
    const response = await POST(new NextRequest('http://localhost/api/tollow/sessions', {
      method: 'POST',
      body: JSON.stringify(validSession),
    }));

    expect(response.status).toBe(201);
    expect(state.createCalls).toEqual([{ userId: 'U1', input: validSession }]);
  });

  it('非法时间和未登录请求不会写入', async () => {
    const invalid = { ...validSession, endedAt: '2026-08-22T00:00:00.000Z' };
    expect((await POST(new NextRequest('http://localhost/api/tollow/sessions', {
      method: 'POST', body: JSON.stringify(invalid),
    }))).status).toBe(400);

    state.session = null;
    expect((await POST(new NextRequest('http://localhost/api/tollow/sessions', {
      method: 'POST', body: JSON.stringify(validSession),
    }))).status).toBe(401);
    expect(state.createCalls).toHaveLength(0);
  });
});

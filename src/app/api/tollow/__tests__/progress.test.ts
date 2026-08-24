import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  session: null as null | { userId: string },
  limited: false,
  listCalls: [] as string[],
  upsertCalls: [] as Array<{ userId: string; input: Record<string, unknown> }>,
}));

vi.mock('@/lib/tollow-access', () => ({
  requireTollowPro: async () => state.session
    ? { ok: true, session: state.session, access: { level: 'pro', source: 'order' } }
    : { ok: false, response: new Response(null, { status: 401 }) },
}));
vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '203.0.113.8',
  rateLimit: async () => ({ limited: state.limited }),
}));
vi.mock('@/lib/tollow', () => ({
  listTollowBookProgress: async (userId: string) => {
    state.listCalls.push(userId);
    return [];
  },
  upsertTollowBookProgress: async (userId: string, input: Record<string, unknown>) => {
    state.upsertCalls.push({ userId, input });
    return input;
  },
}));

import { GET, PUT } from '../progress/route';

function request(body: unknown): NextRequest {
  return new Request('http://localhost/api/tollow/progress', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as NextRequest;
}

const validProgress = {
  bookId: 'the-little-prince',
  sectionId: 'chapter-one',
  segmentIndex: 1,
  offset: 4,
  updatedAt: '2026-08-23T00:00:00.000Z',
};

describe('/api/tollow/progress', () => {
  beforeEach(() => {
    state.session = { userId: 'U1' };
    state.limited = false;
    state.listCalls.length = 0;
    state.upsertCalls.length = 0;
  });

  it('未登录时读写都返回 401', async () => {
    state.session = null;
    expect((await GET()).status).toBe(401);
    expect((await PUT(request(validProgress))).status).toBe(401);
    expect(state.upsertCalls).toHaveLength(0);
  });

  it('读取只使用当前会话用户', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(state.listCalls).toEqual(['U1']);
  });

  it('拒绝客户端 userId 并用当前会话写入合法进度', async () => {
    expect((await PUT(request({ ...validProgress, userId: 'U2' }))).status).toBe(400);

    const response = await PUT(request(validProgress));
    expect(response.status).toBe(200);
    expect(state.upsertCalls).toEqual([{ userId: 'U1', input: validProgress }]);
  });

  it('限流命中时不写入', async () => {
    state.limited = true;
    expect((await PUT(request(validProgress))).status).toBe(429);
    expect(state.upsertCalls).toHaveLength(0);
  });
});

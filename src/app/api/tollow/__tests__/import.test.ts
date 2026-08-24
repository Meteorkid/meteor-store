import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  session: null as null | { userId: string },
  limited: false,
  calls: [] as Array<Record<string, unknown>>,
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
  importTollowData: async (userId: string, batch: Record<string, unknown>) => {
    state.calls.push({ userId, batch });
    return { accepted: 2, duplicate: 1, rejected: 1 };
  },
}));

import { POST } from '../import/route';

describe('POST /api/tollow/import', () => {
  beforeEach(() => {
    state.session = { userId: 'U1' };
    state.limited = false;
    state.calls.length = 0;
  });

  it('未登录与超大批次不进入导入服务', async () => {
    state.session = null;
    expect((await POST(new NextRequest('http://localhost/api/tollow/import', {
      method: 'POST', body: JSON.stringify({ progress: [], sessions: [] }),
    }))).status).toBe(401);

    state.session = { userId: 'U1' };
    expect((await POST(new NextRequest('http://localhost/api/tollow/import', {
      method: 'POST', body: JSON.stringify({ progress: Array(101).fill({}), sessions: [] }),
    }))).status).toBe(400);
    expect(state.calls).toHaveLength(0);
  });

  it('返回逐批接受、重复和拒绝计数', async () => {
    const batch = { progress: [{}], sessions: [{}] };
    const response = await POST(new NextRequest('http://localhost/api/tollow/import', {
      method: 'POST', body: JSON.stringify(batch),
    }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ accepted: 2, duplicate: 1, rejected: 1 });
    expect(state.calls).toEqual([{ userId: 'U1', batch }]);
  });

  it('导入端点使用更严格的限流', async () => {
    state.limited = true;
    expect((await POST(new NextRequest('http://localhost/api/tollow/import', {
      method: 'POST', body: JSON.stringify({ progress: [], sessions: [] }),
    }))).status).toBe(429);
  });
});

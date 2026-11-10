import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  session: null as null | { userId: string; email: string },
  storedTheme: null as string | null,
  limited: false,
  updates: [] as Array<Record<string, unknown>>,
}));

vi.mock('@/lib/auth', () => ({ getSession: async () => state.session }));
vi.mock('@/lib/csrf', () => ({ assertMatchingOrigin: () => null }));
vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '127.0.0.1',
  rateLimit: async () => ({ limited: state.limited }),
}));
vi.mock('@/lib/db', () => ({
  db: {
    select: () => ({
      from: () => ({ where: () => ({ limit: async () => [{ themePreference: state.storedTheme }] }) }),
    }),
    update: () => ({
      set: (values: Record<string, unknown>) => ({
        where: async () => { state.updates.push(values); },
      }),
    }),
  },
}));

import { GET, PATCH } from '../appearance/route';

function request(body: unknown, user = 'u1'): NextRequest {
  return new Request('http://localhost/api/account/appearance', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-appearance-user': user },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

describe('/api/account/appearance', () => {
  beforeEach(() => {
    state.session = { userId: 'u1', email: 'u@example.com' };
    state.storedTheme = null;
    state.limited = false;
    state.updates.length = 0;
  });

  it('未登录不能读取或写入账号主题', async () => {
    state.session = null;
    expect((await GET()).status).toBe(401);
    expect((await PATCH(request({ theme: 'classic' }))).status).toBe(401);
    expect(state.updates).toHaveLength(0);
  });

  it('只读取白名单主题，非法历史值按未选择处理', async () => {
    state.storedTheme = 'classic';
    expect(await (await GET()).json()).toEqual({ theme: 'classic' });
    state.storedTheme = 'light';
    expect(await (await GET()).json()).toEqual({ theme: null });
  });

  it('拒绝跨标签页的旧账号写入', async () => {
    const response = await PATCH(request({ theme: 'nebula' }, 'u2'));
    expect(response.status).toBe(409);
    expect(state.updates).toHaveLength(0);
  });

  it('拒绝夹带字段和未知主题', async () => {
    expect((await PATCH(request({ theme: 'classic', userId: 'victim' }))).status).toBe(400);
    expect((await PATCH(request({ theme: 'light' }))).status).toBe(400);
    expect(state.updates).toHaveLength(0);
  });

  it('只更新当前账号的主题字段', async () => {
    const response = await PATCH(request({ theme: 'nebula' }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ theme: 'nebula' });
    expect(state.updates).toEqual([{ themePreference: 'nebula' }]);
  });
});

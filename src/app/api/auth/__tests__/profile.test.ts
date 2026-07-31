import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

let currentSession: { userId: string; email: string; name?: string } | null = null;
const createdSessions: unknown[] = [];

vi.mock('@/lib/auth', () => ({
  getSession: async () => currentSession,
  createSession: async (payload: unknown) => {
    createdSessions.push(payload);
    return 'token';
  },
}));

let limited = false;
vi.mock('@/lib/rate-limit', () => ({
  rateLimit: async () => ({ limited, remaining: 0, resetAt: 0 }),
  getClientIp: () => '1.2.3.4',
}));

const updates: Record<string, unknown>[] = [];
vi.mock('@/lib/db', () => ({
  db: {
    update: () => ({
      set: (values: Record<string, unknown>) => ({
        where: async () => {
          updates.push(values);
        },
      }),
    }),
  },
}));

import { PATCH } from '../profile/route';

function request(body: unknown): NextRequest {
  return new Request('http://localhost/api/auth/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

describe('PATCH /api/auth/profile', () => {
  beforeEach(() => {
    currentSession = { userId: 'U1', email: 'a@b.com', name: '旧名字' };
    updates.length = 0;
    createdSessions.length = 0;
    limited = false;
  });

  it('未登录时 401，且不写库', async () => {
    currentSession = null;
    const res = await PATCH(request({ name: '新名字' }));

    expect(res.status).toBe(401);
    expect(updates).toHaveLength(0);
  });

  it('限流命中时 429，且不写库', async () => {
    limited = true;
    const res = await PATCH(request({ name: '新名字' }));

    expect(res.status).toBe(429);
    expect(updates).toHaveLength(0);
  });

  it('正常改名：写库 + 重新签发会话（否则导航栏要等下次登录才更新）', async () => {
    const res = await PATCH(request({ name: '新名字' }));

    expect(res.status).toBe(200);
    expect(updates[0]).toEqual({ name: '新名字' });
    expect(createdSessions[0]).toMatchObject({ userId: 'U1', email: 'a@b.com', name: '新名字' });
  });

  it('昵称首尾空格被 trim', async () => {
    await PATCH(request({ name: '  带空格  ' }));
    expect(updates[0]).toEqual({ name: '带空格' });
  });

  it('允许清空昵称，存 null 而不是空字符串', async () => {
    const res = await PATCH(request({ name: '' }));

    expect(res.status).toBe(200);
    expect(updates[0]).toEqual({ name: null });
    expect(createdSessions[0]).toMatchObject({ name: undefined });
  });

  it('超过 30 字拒绝', async () => {
    const res = await PATCH(request({ name: '字'.repeat(31) }));

    expect(res.status).toBe(400);
    expect(updates).toHaveLength(0);
  });

  it('body 不是合法 JSON 时返回 400 而不是崩溃', async () => {
    const bad = new Request('http://localhost/api/auth/profile', {
      method: 'PATCH',
      body: 'not json',
    }) as unknown as NextRequest;

    const res = await PATCH(bad);
    expect(res.status).toBe(400);
  });

  it('不能借这个接口改邮箱或用户 id', async () => {
    await PATCH(request({ name: '新名字', email: 'attacker@evil.com', userId: 'U999' }));

    expect(updates[0]).toEqual({ name: '新名字' });
    expect(createdSessions[0]).toMatchObject({ userId: 'U1', email: 'a@b.com' });
  });

  it('正常改 bio', async () => {
    const res = await PATCH(request({ bio: '一句话介绍' }));
    expect(res.status).toBe(200);
    expect(updates[0]).toEqual({ bio: '一句话介绍' });
  });

  it('bio 超过 200 字拒绝', async () => {
    const res = await PATCH(request({ bio: '字'.repeat(201) }));
    expect(res.status).toBe(400);
    expect(updates).toHaveLength(0);
  });

  it('正常上传头像（base64）', async () => {
    const avatar = 'data:image/jpeg;base64,/9j/short';
    const res = await PATCH(request({ avatar }));
    expect(res.status).toBe(200);
    expect(updates[0]).toEqual({ avatarUrl: avatar });
  });

  it('清空头像时写 null', async () => {
    const res = await PATCH(request({ avatar: '' }));
    expect(res.status).toBe(200);
    expect(updates[0]).toEqual({ avatarUrl: null });
  });

  it('头像格式不正确时 400', async () => {
    const res = await PATCH(request({ avatar: 'not-a-data-url' }));
    expect(res.status).toBe(400);
    expect(updates).toHaveLength(0);
  });
});

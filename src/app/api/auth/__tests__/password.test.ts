import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';
import { hash } from 'bcryptjs';

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
const rateLimitCalls: unknown[][] = [];
vi.mock('@/lib/rate-limit', () => ({
  rateLimit: async (...args: unknown[]) => {
    rateLimitCalls.push(args);
    return { limited, remaining: 0, resetAt: 0 };
  },
}));

let userRow: Record<string, unknown> | null = null;
const updates: Record<string, unknown>[] = [];
vi.mock('@/lib/db', () => ({
  db: {
    select: () => ({
      from: () => ({ where: () => ({ limit: async () => (userRow ? [userRow] : []) }) }),
    }),
    update: () => ({
      set: (values: Record<string, unknown>) => ({
        where: async () => {
          updates.push(values);
        },
      }),
    }),
  },
}));

import { POST } from '../password/route';

const CURRENT = 'current-password-123';
let currentHash = '';

function request(body: unknown): NextRequest {
  return new Request('http://localhost/api/auth/password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

describe('POST /api/auth/password', () => {
  beforeEach(async () => {
    currentHash ||= await hash(CURRENT, 4); // 测试里用低 cost，跑得快
    currentSession = { userId: 'U1', email: 'a@b.com' };
    userRow = { id: 'U1', email: 'a@b.com', name: '小明', passwordHash: currentHash };
    updates.length = 0;
    createdSessions.length = 0;
    rateLimitCalls.length = 0;
    limited = false;
  });

  it('未登录时 401', async () => {
    currentSession = null;
    const res = await POST(request({ currentPassword: CURRENT, newPassword: 'brand-new-pass' }));

    expect(res.status).toBe(401);
    expect(updates).toHaveLength(0);
  });

  it('限流用 failClosed —— Redis 异常时宁可拒绝改密', async () => {
    await POST(request({ currentPassword: CURRENT, newPassword: 'brand-new-pass' }));
    expect(rateLimitCalls[0][3]).toMatchObject({ failClosed: true });
  });

  it('限流命中时 429，且不改密码', async () => {
    limited = true;
    const res = await POST(request({ currentPassword: CURRENT, newPassword: 'brand-new-pass' }));

    expect(res.status).toBe(429);
    expect(updates).toHaveLength(0);
  });

  it('当前密码不对时 401，且不改密码', async () => {
    const res = await POST(request({ currentPassword: 'wrong', newPassword: 'brand-new-pass' }));

    expect(res.status).toBe(401);
    expect(updates).toHaveLength(0);
  });

  it('新密码少于 8 位拒绝', async () => {
    const res = await POST(request({ currentPassword: CURRENT, newPassword: 'short' }));

    expect(res.status).toBe(400);
    expect(updates).toHaveLength(0);
  });

  it('新密码不能和当前密码相同', async () => {
    const res = await POST(request({ currentPassword: CURRENT, newPassword: CURRENT }));

    expect(res.status).toBe(400);
    expect(updates).toHaveLength(0);
  });

  it('正常改密：存的是新哈希，不是明文', async () => {
    const res = await POST(request({ currentPassword: CURRENT, newPassword: 'brand-new-pass' }));

    expect(res.status).toBe(200);
    expect(updates).toHaveLength(1);

    const stored = updates[0].passwordHash as string;
    expect(stored).not.toBe('brand-new-pass');
    expect(stored).toMatch(/^\$2[aby]\$12\$/); // bcrypt cost 12
    expect(stored).toHaveLength(60);
  });

  it('改密后重新签发会话，当前设备不会被踢下线', async () => {
    await POST(request({ currentPassword: CURRENT, newPassword: 'brand-new-pass' }));
    expect(createdSessions[0]).toMatchObject({
      userId: 'U1',
      email: 'a@b.com',
      name: '小明',
      emailVerified: true,
    });
  });

  it('会话有效但账户已被删除时 401', async () => {
    userRow = null;
    const res = await POST(request({ currentPassword: CURRENT, newPassword: 'brand-new-pass' }));

    expect(res.status).toBe(401);
    expect(updates).toHaveLength(0);
  });
});

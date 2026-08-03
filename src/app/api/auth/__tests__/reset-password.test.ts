import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  user: {
    id: 'U1',
    email: 'user@example.com',
    emailVerified: true,
    tokenVersion: 2,
  },
  updates: [] as Array<Record<string, unknown>>,
}));

vi.mock('bcryptjs', () => ({
  hash: async () => 'new-password-hash',
}));

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '203.0.113.1',
  rateLimit: async () => ({ limited: false }),
}));

const readToken = vi.fn();
vi.mock('@/lib/password-reset', () => ({
  readPasswordResetToken: (...args: unknown[]) => readToken(...args),
}));

vi.mock('@/lib/db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => [{ ...state.user }],
        }),
      }),
    }),
    update: () => ({
      set: (values: Record<string, unknown>) => ({
        where: async () => {
          state.updates.push(values);
          state.user.tokenVersion = values.tokenVersion as number;
          return { rowCount: 1 };
        },
      }),
    }),
  },
}));

function request(token = 'reset-token', newPassword = 'new-strong-password'): NextRequest {
  return new Request('https://www.imagentx.top/api/auth/reset-password', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  }) as unknown as NextRequest;
}

describe('提交密码重置', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.user = {
      id: 'U1',
      email: 'user@example.com',
      emailVerified: true,
      tokenVersion: 2,
    };
    state.updates.length = 0;
    readToken.mockResolvedValue({
      userId: 'U1',
      email: 'user@example.com',
      tokenVersion: 2,
    });
  });

  it('有效令牌更新密码并递增 tokenVersion，但不签发会话', async () => {
    const { POST } = await import('../reset-password/route');

    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(state.updates).toEqual([{
      passwordHash: 'new-password-hash',
      tokenVersion: 3,
    }]);
    await expect(response.json()).resolves.toEqual({ success: true });
  });

  it('同一令牌成功使用后不能再次重置', async () => {
    const { POST } = await import('../reset-password/route');

    expect((await POST(request())).status).toBe(200);
    const second = await POST(request());

    expect(second.status).toBe(400);
    expect(state.updates).toHaveLength(1);
  });

  it('无效令牌和弱密码都不会写数据库', async () => {
    const { POST } = await import('../reset-password/route');
    readToken.mockResolvedValueOnce(null);

    expect((await POST(request('bad-token'))).status).toBe(400);
    expect((await POST(request('reset-token', 'short'))).status).toBe(400);
    expect(state.updates).toHaveLength(0);
  });
});

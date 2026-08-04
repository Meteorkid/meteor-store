import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  session: {
    userId: 'U1',
    email: 'user@example.com',
    emailVerified: true,
  },
  admin: false,
}));

const destroySession = vi.fn();
vi.mock('@/lib/auth', () => ({
  getSession: async () => state.session,
  destroySession: () => destroySession(),
}));

vi.mock('@/lib/admin', () => ({
  isAdminSession: () => state.admin,
}));

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '203.0.113.1',
  rateLimit: async () => ({ limited: false }),
}));

vi.mock('@/lib/db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => [{
            id: 'U1',
            email: 'user@example.com',
            passwordHash: 'stored-hash',
            avatarUrl: 'https://cdn.example.com/avatars/U1/avatar.webp',
          }],
        }),
      }),
    }),
  },
}));

const comparePassword = vi.fn();
vi.mock('bcryptjs', () => ({
  compare: (...args: unknown[]) => comparePassword(...args),
}));

const deleteAccount = vi.fn();
vi.mock('@/lib/account-deletion', () => ({
  deleteUserAccount: (...args: unknown[]) => deleteAccount(...args),
}));

function request(password = 'current-password', confirmation = 'DELETE'): NextRequest {
  return new Request('https://www.imagentx.top/api/auth/account', {
    method: 'DELETE',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password, confirmation }),
  }) as unknown as NextRequest;
}

describe('自助注销账户', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.admin = false;
    comparePassword.mockResolvedValue(true);
    deleteAccount.mockResolvedValue(undefined);
  });

  it('验证密码和确认短语后删除数据并销毁会话', async () => {
    const { DELETE } = await import('../account/route');

    const response = await DELETE(request());

    expect(response.status).toBe(200);
    expect(deleteAccount).toHaveBeenCalledWith({
      userId: 'U1',
      email: 'user@example.com',
      avatarUrl: 'https://cdn.example.com/avatars/U1/avatar.webp',
    });
    expect(destroySession).toHaveBeenCalledOnce();
  });

  it('密码错误或确认短语错误时不删除', async () => {
    const { DELETE } = await import('../account/route');
    comparePassword.mockResolvedValueOnce(false);

    expect((await DELETE(request('wrong'))).status).toBe(401);
    expect((await DELETE(request('current-password', 'wrong'))).status).toBe(400);
    expect(deleteAccount).not.toHaveBeenCalled();
  });

  it('管理员账户禁止自助注销以避免后台锁死', async () => {
    state.admin = true;
    const { DELETE } = await import('../account/route');

    const response = await DELETE(request());

    expect(response.status).toBe(403);
    expect(deleteAccount).not.toHaveBeenCalled();
  });
});

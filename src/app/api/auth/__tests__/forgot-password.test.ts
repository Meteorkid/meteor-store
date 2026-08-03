import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  user: null as null | {
    id: string;
    email: string;
    emailVerified: boolean;
    tokenVersion: number;
  },
}));

vi.mock('@/lib/db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => (state.user ? [state.user] : []),
        }),
      }),
    }),
  },
}));

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '203.0.113.1',
  rateLimit: async () => ({ limited: false }),
}));

const createToken = vi.fn();
vi.mock('@/lib/password-reset', () => ({
  createPasswordResetToken: (...args: unknown[]) => createToken(...args),
}));

const sendReset = vi.fn();
vi.mock('@/lib/email', () => ({
  isEmailDeliveryConfigured: () => true,
  sendPasswordReset: (...args: unknown[]) => sendReset(...args),
}));

function request(email: string): NextRequest {
  return new Request('https://www.imagentx.top/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, locale: 'zh' }),
  }) as unknown as NextRequest;
}

describe('请求密码重置', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.user = null;
    createToken.mockResolvedValue('reset-token');
    sendReset.mockResolvedValue(undefined);
  });

  it('不存在的邮箱返回与已存在账户相同的成功响应且不发信', async () => {
    const { POST } = await import('../forgot-password/route');

    const response = await POST(request('missing@example.com'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(createToken).not.toHaveBeenCalled();
    expect(sendReset).not.toHaveBeenCalled();
  });

  it('只向已验证账户发送包含 tokenVersion 的重置邮件', async () => {
    state.user = {
      id: 'U1',
      email: 'user@example.com',
      emailVerified: true,
      tokenVersion: 4,
    };
    const { POST } = await import('../forgot-password/route');

    const response = await POST(request(' USER@EXAMPLE.COM '));

    expect(response.status).toBe(200);
    expect(createToken).toHaveBeenCalledWith({
      userId: 'U1',
      email: 'user@example.com',
      tokenVersion: 4,
    });
    expect(sendReset).toHaveBeenCalledWith({
      email: 'user@example.com',
      token: 'reset-token',
      locale: 'zh',
    });
  });

  it('未验证账户仍返回统一成功响应但不发重置邮件', async () => {
    state.user = {
      id: 'U1',
      email: 'user@example.com',
      emailVerified: false,
      tokenVersion: 0,
    };
    const { POST } = await import('../forgot-password/route');

    const response = await POST(request('user@example.com'));

    expect(response.status).toBe(200);
    expect(sendReset).not.toHaveBeenCalled();
  });
});

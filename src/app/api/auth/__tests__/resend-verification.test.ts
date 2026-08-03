import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  identity: {
    userId: 'U1',
    email: 'user@example.com',
    locale: 'en' as const,
  } as null | { userId: string; email: string; locale: 'zh' | 'en' },
  user: {
    id: 'U1',
    email: 'user@example.com',
    emailVerified: false,
  } as null | { id: string; email: string; emailVerified: boolean },
  limited: false,
  rateLimitCalls: [] as Array<unknown[]>,
  sentEmails: [] as Array<Record<string, unknown>>,
  emailFails: false,
}));

vi.mock('@/lib/email-verification', () => ({
  readEmailVerificationResendTicket: async () => state.identity,
  createEmailVerificationToken: async () => 'new-verification-token',
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

vi.mock('@/lib/email', () => ({
  sendEmailVerification: async (data: Record<string, unknown>) => {
    if (state.emailFails) throw new Error('provider unavailable');
    state.sentEmails.push(data);
  },
}));

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: async (...args: unknown[]) => {
    state.rateLimitCalls.push(args);
    return { limited: state.limited };
  },
  getClientIp: () => '203.0.113.1',
}));

import { POST } from '../resend-verification/route';

function request(): NextRequest {
  return new Request('http://localhost/api/auth/resend-verification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resendTicket: 'resend-ticket' }),
  }) as unknown as NextRequest;
}

describe('POST /api/auth/resend-verification', () => {
  beforeEach(() => {
    state.identity = { userId: 'U1', email: 'user@example.com', locale: 'en' };
    state.user = { id: 'U1', email: 'user@example.com', emailVerified: false };
    state.limited = false;
    state.rateLimitCalls.length = 0;
    state.sentEmails.length = 0;
    state.emailFails = false;
  });

  it('有效重发凭证触发新的验证邮件并执行双维度限流', async () => {
    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(state.sentEmails[0]).toEqual({
      email: 'user@example.com',
      token: 'new-verification-token',
      locale: 'en',
    });
    expect(state.rateLimitCalls).toHaveLength(2);
    expect(
      state.rateLimitCalls.every(
        (call) => (call[3] as { failClosed?: boolean } | undefined)?.failClosed === true,
      ),
    ).toBe(true);
  });

  it('无效重发凭证被拒绝且不会发送邮件', async () => {
    state.identity = null;

    const response = await POST(request());

    expect(response.status).toBe(400);
    expect(state.sentEmails).toHaveLength(0);
  });

  it('账户已经验证时幂等成功但不再发邮件', async () => {
    state.user = { id: 'U1', email: 'user@example.com', emailVerified: true };

    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(state.sentEmails).toHaveLength(0);
  });

  it('邮件服务失败时允许凭证持有者稍后重试', async () => {
    state.emailFails = true;
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await POST(request());

    expect(response.status).toBe(503);
    consoleError.mockRestore();
  });

  it('IP 限流命中时在读取用户前拒绝', async () => {
    state.limited = true;

    const response = await POST(request());

    expect(response.status).toBe(429);
    expect(state.sentEmails).toHaveLength(0);
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  passwordMatches: true,
  user: null as null | Record<string, unknown>,
  createdSessions: [] as Array<Record<string, unknown>>,
}));

vi.mock('bcryptjs', () => ({
  compare: async () => state.passwordMatches,
  hash: async () => 'dummy-hash',
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

vi.mock('@/lib/auth', () => ({
  createSession: async (payload: Record<string, unknown>) => {
    state.createdSessions.push(payload);
  },
}));

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: async () => ({ limited: false }),
  getClientIp: () => '203.0.113.1',
}));

vi.mock('@/lib/email-verification', () => ({
  createEmailVerificationResendTicket: async () => 'resend-ticket',
}));

import { POST } from '../login/route';

function request(): NextRequest {
  return new Request('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'strong-password',
    }),
  }) as unknown as NextRequest;
}

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    state.passwordMatches = true;
    state.user = {
      id: 'U1',
      email: 'user@example.com',
      name: 'Meteor',
      passwordHash: 'stored-hash',
      tokenVersion: 0,
      emailVerified: false,
    };
    state.createdSessions.length = 0;
  });

  it('密码正确但邮箱未验证时拒绝登录并返回重发凭证', async () => {
    const response = await POST(request());
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body).toMatchObject({
      code: 'EMAIL_UNVERIFIED',
      resendTicket: 'resend-ticket',
    });
    expect(state.createdSessions).toHaveLength(0);
  });

  it('邮箱已验证且密码正确时签发正式会话', async () => {
    state.user = { ...state.user, emailVerified: true };

    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(state.createdSessions[0]).toMatchObject({
      userId: 'U1',
      email: 'user@example.com',
      emailVerified: true,
    });
  });

  it('密码错误时不泄露账户是否尚未验证', async () => {
    state.passwordMatches = false;

    const response = await POST(request());
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ error: '邮箱或密码错误' });
    expect(body).not.toHaveProperty('resendTicket');
  });
});

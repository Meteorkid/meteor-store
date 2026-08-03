import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  existingUser: false,
  insertedUsers: [] as Array<Record<string, unknown>>,
  createdSessions: [] as Array<Record<string, unknown>>,
  sentEmails: [] as Array<Record<string, unknown>>,
  emailConfigured: true,
  emailFails: false,
}));

vi.mock('bcryptjs', () => ({
  hash: vi.fn(async () => 'hashed-password'),
}));

vi.mock('@/lib/db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => (state.existingUser ? [{ id: 'existing' }] : []),
        }),
      }),
    }),
    insert: () => ({
      values: async (values: Record<string, unknown>) => {
        state.insertedUsers.push(values);
      },
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

vi.mock('@/lib/captcha', () => ({
  verifyCaptcha: async () => true,
}));

vi.mock('@/lib/admin', () => ({
  isAdminEmail: (email: string) => email === 'admin@example.com',
}));

vi.mock('@/lib/email-verification', () => ({
  createEmailVerificationToken: async () => 'verification-token',
  createEmailVerificationResendTicket: async () => 'resend-ticket',
}));

vi.mock('@/lib/email', () => ({
  isEmailDeliveryConfigured: () => state.emailConfigured,
  sendEmailVerification: async (data: Record<string, unknown>) => {
    if (state.emailFails) throw new Error('provider unavailable');
    state.sentEmails.push(data);
  },
}));

import { POST } from '../register/route';

function request(email: string): NextRequest {
  return new Request('http://localhost/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password: 'strong-password',
      name: 'Meteor',
      captchaToken: 'captcha-token',
      captchaX: 120,
      locale: 'zh',
    }),
  }) as unknown as NextRequest;
}

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    state.existingUser = false;
    state.insertedUsers.length = 0;
    state.createdSessions.length = 0;
    state.sentEmails.length = 0;
    state.emailConfigured = true;
    state.emailFails = false;
  });

  it('禁止通过公开注册入口创建管理员邮箱账户', async () => {
    const response = await POST(request('admin@example.com'));

    expect(response.status).toBe(403);
    expect(state.insertedUsers).toHaveLength(0);
    expect(state.createdSessions).toHaveLength(0);
  });

  it('注册只创建未验证账户并发送验证邮件，不签发会话', async () => {
    const response = await POST(request('user@example.com'));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(state.insertedUsers[0]).toMatchObject({
      email: 'user@example.com',
      emailVerified: false,
    });
    expect(state.createdSessions).toHaveLength(0);
    expect(state.sentEmails[0]).toMatchObject({
      email: 'user@example.com',
      token: 'verification-token',
      locale: 'zh',
    });
    expect(body).toMatchObject({
      success: true,
      verificationRequired: true,
      emailSent: true,
      resendTicket: 'resend-ticket',
    });
  });

  it('邮件服务未配置时不创建无法验证的账户', async () => {
    state.emailConfigured = false;

    const response = await POST(request('user@example.com'));

    expect(response.status).toBe(503);
    expect(state.insertedUsers).toHaveLength(0);
  });

  it('账户创建后邮件临时失败时返回可重发状态', async () => {
    state.emailFails = true;
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await POST(request('user@example.com'));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(state.insertedUsers).toHaveLength(1);
    expect(body).toMatchObject({
      verificationRequired: true,
      emailSent: false,
      resendTicket: 'resend-ticket',
    });
    consoleError.mockRestore();
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  session: null as null | { userId: string; email: string },
  user: null as null | {
    id: string;
    email: string;
    emailVerified: boolean;
    isStudent: boolean;
    tokenVersion: number;
  },
  owner: null as null | { id: string },
  selectCount: 0,
}));

vi.mock('@/lib/auth', () => ({
  getSession: async () => state.session,
}));

vi.mock('@/lib/db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => {
            state.selectCount += 1;
            return state.selectCount === 1
              ? (state.user ? [state.user] : [])
              : (state.owner ? [state.owner] : []);
          },
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
vi.mock('@/lib/student-verification', () => ({
  createStudentVerificationToken: (...args: unknown[]) => createToken(...args),
}));

const sendVerification = vi.fn();
vi.mock('@/lib/email', () => ({
  isEmailDeliveryConfigured: () => true,
  sendStudentVerification: (...args: unknown[]) => sendVerification(...args),
}));

function request(studentEmail: string): NextRequest {
  return new Request('https://www.imagentx.top/api/student', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ studentEmail, locale: 'zh' }),
  }) as unknown as NextRequest;
}

describe('请求学生身份验证', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.session = { userId: 'U1', email: 'user@example.com' };
    state.user = {
      id: 'U1',
      email: 'user@example.com',
      emailVerified: true,
      isStudent: false,
      tokenVersion: 2,
    };
    state.owner = null;
    state.selectCount = 0;
    createToken.mockResolvedValue('student-token');
    sendVerification.mockResolvedValue(undefined);
  });

  it('未登录不能请求验证邮件', async () => {
    state.session = null;
    const { POST } = await import('../route');

    const response = await POST(request('student@mit.edu'));

    expect(response.status).toBe(401);
    expect(sendVerification).not.toHaveBeenCalled();
  });

  it('向教育邮箱发送绑定当前账户的验证链接', async () => {
    const { POST } = await import('../route');

    const response = await POST(request(' Student@MIT.EDU '));

    expect(response.status).toBe(200);
    expect(createToken).toHaveBeenCalledWith({
      userId: 'U1',
      email: 'user@example.com',
      studentEmail: 'student@mit.edu',
      tokenVersion: 2,
    });
    expect(sendVerification).toHaveBeenCalledWith({
      email: 'student@mit.edu',
      token: 'student-token',
      locale: 'zh',
    });
  });

  it('教育邮箱已绑定其他账户时拒绝重复认证', async () => {
    state.owner = { id: 'U2' };
    const { POST } = await import('../route');

    const response = await POST(request('student@mit.edu'));

    expect(response.status).toBe(409);
    expect(sendVerification).not.toHaveBeenCalled();
  });
});

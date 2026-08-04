import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  user: {
    id: 'U1',
    email: 'user@example.com',
    emailVerified: true,
    isStudent: false,
    studentEmail: null as string | null,
    tokenVersion: 2,
  },
  updates: [] as Array<Record<string, unknown>>,
}));

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '203.0.113.1',
  rateLimit: async () => ({ limited: false }),
}));

const readToken = vi.fn();
vi.mock('@/lib/student-verification', () => ({
  readStudentVerificationToken: (...args: unknown[]) => readToken(...args),
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
          state.user.isStudent = true;
          state.user.studentEmail = values.studentEmail as string;
          return { rowCount: 1 };
        },
      }),
    }),
  },
}));

function request(token: string): NextRequest {
  return new Request('https://www.imagentx.top/api/student/verify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token }),
  }) as unknown as NextRequest;
}

describe('确认学生身份验证', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.user = {
      id: 'U1',
      email: 'user@example.com',
      emailVerified: true,
      isStudent: false,
      studentEmail: null,
      tokenVersion: 2,
    };
    state.updates.length = 0;
    readToken.mockResolvedValue({
      userId: 'U1',
      email: 'user@example.com',
      studentEmail: 'student@mit.edu',
      tokenVersion: 2,
    });
  });

  it('有效令牌写入学生身份和验证留痕', async () => {
    const { POST } = await import('../route');

    const response = await POST(request('student-token'));

    expect(response.status).toBe(200);
    expect(state.updates[0]).toMatchObject({
      isStudent: true,
      studentEmail: 'student@mit.edu',
    });
    expect(state.updates[0].studentVerifiedAt).toEqual(expect.any(String));
  });

  it('改密后的旧令牌不能认证', async () => {
    state.user.tokenVersion = 3;
    const { POST } = await import('../route');

    const response = await POST(request('student-token'));

    expect(response.status).toBe(400);
    expect(state.updates).toHaveLength(0);
  });
});

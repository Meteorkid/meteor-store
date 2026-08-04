import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createEmailVerificationToken } from '../email-verification';
import {
  createStudentVerificationToken,
  readStudentVerificationToken,
} from '../student-verification';

describe('学生身份验证令牌', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-with-enough-entropy';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('绑定账户、教育邮箱和 tokenVersion', async () => {
    const token = await createStudentVerificationToken({
      userId: 'U1',
      email: ' User@Example.COM ',
      studentEmail: ' Student@MIT.EDU ',
      tokenVersion: 2,
    });

    await expect(readStudentVerificationToken(token)).resolves.toEqual({
      userId: 'U1',
      email: 'user@example.com',
      studentEmail: 'student@mit.edu',
      tokenVersion: 2,
    });
  });

  it('邮箱验证令牌不能冒充学生验证令牌', async () => {
    const token = await createEmailVerificationToken({
      userId: 'U1',
      email: 'user@example.com',
    });

    await expect(readStudentVerificationToken(token)).resolves.toBeNull();
  });

  it('令牌超过 24 小时后失效', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-04T00:00:00Z'));
    const token = await createStudentVerificationToken({
      userId: 'U1',
      email: 'user@example.com',
      studentEmail: 'student@mit.edu',
      tokenVersion: 0,
    });

    vi.advanceTimersByTime(24 * 60 * 60_000 + 1_000);

    await expect(readStudentVerificationToken(token)).resolves.toBeNull();
  });
});

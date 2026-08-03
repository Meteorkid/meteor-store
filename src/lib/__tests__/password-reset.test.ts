import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createEmailVerificationToken } from '../email-verification';
import {
  createPasswordResetToken,
  readPasswordResetToken,
} from '../password-reset';

describe('密码重置令牌', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-with-enough-entropy';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('还原规范化身份和签发时的 tokenVersion', async () => {
    const token = await createPasswordResetToken({
      userId: 'U1',
      email: ' User@Example.COM ',
      tokenVersion: 3,
    });

    await expect(readPasswordResetToken(token)).resolves.toEqual({
      userId: 'U1',
      email: 'user@example.com',
      tokenVersion: 3,
    });
  });

  it('邮箱验证令牌不能冒充密码重置令牌', async () => {
    const token = await createEmailVerificationToken({
      userId: 'U1',
      email: 'user@example.com',
    });

    await expect(readPasswordResetToken(token)).resolves.toBeNull();
  });

  it('令牌超过 1 小时后失效', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-04T00:00:00Z'));
    const token = await createPasswordResetToken({
      userId: 'U1',
      email: 'user@example.com',
      tokenVersion: 0,
    });

    vi.advanceTimersByTime(60 * 60_000 + 1_000);

    await expect(readPasswordResetToken(token)).resolves.toBeNull();
  });
});

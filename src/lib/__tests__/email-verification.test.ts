import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createEmailVerificationResendTicket,
  createEmailVerificationToken,
  readEmailVerificationResendTicket,
  readEmailVerificationToken,
  verifyEmailAddress,
} from '../email-verification';

const dbState = vi.hoisted(() => ({
  user: null as null | { email: string; emailVerified: boolean },
  updates: [] as Array<Record<string, unknown>>,
}));

vi.mock('../db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => (dbState.user ? [dbState.user] : []),
        }),
      }),
    }),
    update: () => ({
      set: (values: Record<string, unknown>) => ({
        where: async () => {
          dbState.updates.push(values);
        },
      }),
    }),
  },
}));

describe('email verification tokens', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-with-enough-entropy';
    dbState.user = null;
    dbState.updates.length = 0;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('签发的验证令牌可以还原规范化后的用户身份', async () => {
    const token = await createEmailVerificationToken({
      userId: 'U1',
      email: ' User@Example.COM ',
    });

    await expect(readEmailVerificationToken(token)).resolves.toEqual({
      userId: 'U1',
      email: 'user@example.com',
    });
  });

  it('重发凭证只能用于重发，不能冒充验证令牌', async () => {
    const ticket = await createEmailVerificationResendTicket({
      userId: 'U1',
      email: 'user@example.com',
      locale: 'en',
    });

    await expect(readEmailVerificationResendTicket(ticket)).resolves.toEqual({
      userId: 'U1',
      email: 'user@example.com',
      locale: 'en',
    });
    await expect(readEmailVerificationToken(ticket)).resolves.toBeNull();
  });

  it('有效验证令牌会把匹配账户标记为已验证', async () => {
    dbState.user = { email: 'user@example.com', emailVerified: false };
    const token = await createEmailVerificationToken({
      userId: 'U1',
      email: 'user@example.com',
    });

    await expect(verifyEmailAddress(token)).resolves.toBe(true);
    expect(dbState.updates).toEqual([{ emailVerified: true }]);
  });

  it('验证令牌超过 24 小时后失效', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-03T00:00:00Z'));
    const token = await createEmailVerificationToken({
      userId: 'U1',
      email: 'user@example.com',
    });

    vi.advanceTimersByTime(24 * 60 * 60_000 + 1_000);

    await expect(readEmailVerificationToken(token)).resolves.toBeNull();
  });

  it('账户已经验证时保持幂等且不重复写库', async () => {
    dbState.user = { email: 'user@example.com', emailVerified: true };
    const token = await createEmailVerificationToken({
      userId: 'U1',
      email: 'user@example.com',
    });

    await expect(verifyEmailAddress(token)).resolves.toBe(true);
    expect(dbState.updates).toHaveLength(0);
  });
});

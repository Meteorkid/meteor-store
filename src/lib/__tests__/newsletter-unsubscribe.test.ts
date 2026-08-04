import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createEmailVerificationToken } from '../email-verification';
import {
  createNewsletterUnsubscribeToken,
  readNewsletterUnsubscribeToken,
} from '../newsletter-unsubscribe';

describe('Newsletter 退订令牌', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-with-enough-entropy';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('还原规范化后的邮箱', async () => {
    const token = await createNewsletterUnsubscribeToken(' User@Example.COM ');

    await expect(readNewsletterUnsubscribeToken(token)).resolves.toEqual({
      email: 'user@example.com',
    });
  });

  it('邮箱验证令牌不能冒充退订令牌', async () => {
    const token = await createEmailVerificationToken({
      userId: 'U1',
      email: 'user@example.com',
    });

    await expect(readNewsletterUnsubscribeToken(token)).resolves.toBeNull();
  });

  it('令牌超过 1 小时后失效', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-04T00:00:00Z'));
    const token = await createNewsletterUnsubscribeToken('user@example.com');

    vi.advanceTimersByTime(60 * 60_000 + 1_000);

    await expect(readNewsletterUnsubscribeToken(token)).resolves.toBeNull();
  });
});

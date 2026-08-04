import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const hasContact = vi.fn();
const createToken = vi.fn();
const sendConfirmation = vi.fn();

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '203.0.113.1',
  rateLimit: async () => ({ limited: false }),
}));

vi.mock('@/lib/newsletter', () => ({
  isNewsletterConfigured: () => true,
  hasNewsletterContact: (...args: unknown[]) => hasContact(...args),
}));

vi.mock('@/lib/newsletter-unsubscribe', () => ({
  createNewsletterUnsubscribeToken: (...args: unknown[]) => createToken(...args),
}));

vi.mock('@/lib/email', () => ({
  sendNewsletterUnsubscribeConfirmation: (...args: unknown[]) => sendConfirmation(...args),
}));

function request(email: string): NextRequest {
  return new Request('https://www.imagentx.top/api/newsletter/unsubscribe/request', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, locale: 'zh' }),
  }) as unknown as NextRequest;
}

describe('请求 Newsletter 退订', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hasContact.mockResolvedValue(false);
    createToken.mockResolvedValue('unsubscribe-token');
    sendConfirmation.mockResolvedValue(undefined);
  });

  it('未知邮箱返回统一成功响应且不发信', async () => {
    const { POST } = await import('../route');

    const response = await POST(request('missing@example.com'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(createToken).not.toHaveBeenCalled();
    expect(sendConfirmation).not.toHaveBeenCalled();
  });

  it('向已订阅邮箱发送 fragment 退订链接', async () => {
    hasContact.mockResolvedValue(true);
    const { POST } = await import('../route');

    const response = await POST(request(' USER@EXAMPLE.COM '));

    expect(response.status).toBe(200);
    expect(createToken).toHaveBeenCalledWith('user@example.com');
    expect(sendConfirmation).toHaveBeenCalledWith({
      email: 'user@example.com',
      token: 'unsubscribe-token',
      locale: 'zh',
    });
  });
});

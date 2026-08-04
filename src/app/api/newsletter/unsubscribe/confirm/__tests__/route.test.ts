import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const readToken = vi.fn();
const unsubscribe = vi.fn();

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '203.0.113.1',
  rateLimit: async () => ({ limited: false }),
}));

vi.mock('@/lib/newsletter-unsubscribe', () => ({
  readNewsletterUnsubscribeToken: (...args: unknown[]) => readToken(...args),
}));

vi.mock('@/lib/newsletter', () => ({
  unsubscribeNewsletterContact: (...args: unknown[]) => unsubscribe(...args),
}));

function request(token: string): NextRequest {
  return new Request('https://www.imagentx.top/api/newsletter/unsubscribe/confirm', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token }),
  }) as unknown as NextRequest;
}

describe('确认 Newsletter 退订', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    readToken.mockResolvedValue({ email: 'user@example.com' });
    unsubscribe.mockResolvedValue(undefined);
  });

  it('有效令牌将联系人标记为退订', async () => {
    const { POST } = await import('../route');

    const response = await POST(request('unsubscribe-token'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(unsubscribe).toHaveBeenCalledWith('user@example.com');
  });

  it('无效令牌不会修改联系人', async () => {
    readToken.mockResolvedValue(null);
    const { POST } = await import('../route');

    const response = await POST(request('invalid-token'));

    expect(response.status).toBe(400);
    expect(unsubscribe).not.toHaveBeenCalled();
  });
});

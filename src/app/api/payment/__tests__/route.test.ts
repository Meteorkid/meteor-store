import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

vi.mock('@/lib/constants', () => ({
  SHOW_PRICING: true,
  ANNUAL_DISCOUNT: 0.8,
}));

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '127.0.0.1',
  rateLimit: async () => ({ limited: false }),
}));

const inserted: Record<string, unknown>[] = [];
vi.mock('@/lib/db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({ limit: async () => [] }),
      }),
    }),
    insert: () => ({
      values: async (value: Record<string, unknown>) => {
        inserted.push(value);
      },
    }),
    update: () => ({ set: () => ({ where: async () => ({ rowCount: 1 }) }) }),
  },
}));

const createDesktopOrder = vi.fn();
const alipayConfigured = vi.fn();
vi.mock('@/lib/alipay', () => ({
  createAlipayOrder: (...args: unknown[]) => createDesktopOrder(...args),
  createAlipayMobileOrder: vi.fn(),
  isAlipayConfigured: () => alipayConfigured(),
}));

vi.mock('@/lib/license', () => ({ createLicenseKey: vi.fn() }));
vi.mock('@/lib/email', () => ({ sendOrderConfirmation: vi.fn() }));

describe('创建支付订单', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    inserted.length = 0;
    alipayConfigured.mockReturnValue(true);
    createDesktopOrder.mockResolvedValue('https://openapi.alipay.com/pay');
  });

  it('公开零价方案直接下载，不创建订单或授权码', async () => {
    const { POST } = await import('../route');
    const request = new Request('https://www.imagentx.top/api/payment', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        productName: 'statux',
        planName: 'Free',
        paymentMethod: 'alipay',
        email: 'buyer@example.com',
      }),
    }) as unknown as NextRequest;

    const response = await POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: '免费方案无需创建订单' });
    expect(inserted).toHaveLength(0);
    expect(createDesktopOrder).not.toHaveBeenCalled();
  });

  it('支付宝回调配置不完整时不创建数据库订单', async () => {
    alipayConfigured.mockReturnValue(false);
    const { POST } = await import('../route');
    const request = new Request('https://www.imagentx.top/api/payment', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        productName: 'omnicrawl',
        planName: 'Starter',
        paymentMethod: 'alipay',
        email: 'buyer@example.com',
      }),
    }) as unknown as NextRequest;

    const response = await POST(request);

    expect(response.status).toBe(503);
    expect(inserted).toHaveLength(0);
    expect(createDesktopOrder).not.toHaveBeenCalled();
  });
});

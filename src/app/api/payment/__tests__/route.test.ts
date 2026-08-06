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

// 下单时会读会话回填 userId；测试按游客下单处理（真实 getSession 依赖请求上下文，测试里取不到）
vi.mock('@/lib/auth', () => ({ getSession: async () => null }));

vi.mock('@/lib/license', () => ({ createLicenseKey: vi.fn() }));
vi.mock('@/lib/email', () => ({ sendOrderConfirmation: vi.fn() }));

describe('创建支付订单', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    inserted.length = 0;
    alipayConfigured.mockReturnValue(true);
    createDesktopOrder.mockResolvedValue('https://openapi.alipay.com/pay');
  });

  it('零价方案不走支付，改由 /api/claim 免费入库', async () => {
    const { POST } = await import('../route');
    const request = new Request('https://www.imagentx.top/api/payment', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        productName: 'xisland',
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

  it('Meteor Pass 按档位定价，档位 id 写进 billing_period', async () => {
    const { POST } = await import('../route');
    const request = new Request('https://www.imagentx.top/api/payment', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        productName: 'meteor-pass',
        planName: '年付',
        paymentMethod: 'alipay',
        email: 'buyer@example.com',
      }),
    }) as unknown as NextRequest;

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(inserted).toHaveLength(1);
    expect(inserted[0]).toMatchObject({
      productId: 'meteor-pass',
      planName: '年付',
      amountCny: 299,
      billingPeriod: 'annual',
    });
  });

  it('Pass 的年付档不再套用月付年付折扣，价格就是标价', async () => {
    const { POST } = await import('../route');
    const request = new Request('https://www.imagentx.top/api/payment', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        productName: 'meteor-pass',
        planName: 'monthly',
        paymentMethod: 'alipay',
        email: 'buyer@example.com',
        // 客户端即使传了 isAnnual，Pass 分支也必须忽略它
        isAnnual: true,
      }),
    }) as unknown as NextRequest;

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(inserted[0]).toMatchObject({
      amountCny: 39,
      billingPeriod: 'monthly',
    });
  });

  it('Pass 的档位不存在时拒绝下单', async () => {
    const { POST } = await import('../route');
    const request = new Request('https://www.imagentx.top/api/payment', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        productName: 'meteor-pass',
        planName: 'enterprise',
        paymentMethod: 'alipay',
        email: 'buyer@example.com',
      }),
    }) as unknown as NextRequest;

    const response = await POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: '方案不存在' });
    expect(inserted).toHaveLength(0);
  });
});

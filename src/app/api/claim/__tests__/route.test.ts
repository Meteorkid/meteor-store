import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '127.0.0.1',
  rateLimit: async () => ({ limited: false }),
}));

const getSession = vi.fn();
vi.mock('@/lib/auth', () => ({ getSession: () => getSession() }));

/** 桌面软件要走履约发码；单测里替掉，避免真的去打数据库和发邮件 */
const fulfillOrder = vi.fn();
vi.mock('@/lib/order-fulfillment', () => ({ fulfillOrder: (...args: unknown[]) => fulfillOrder(...args) }));

/** select 返回的「已有订单」，空数组表示还没入库过 */
let existingOrders: Record<string, unknown>[] = [];
const inserted: Record<string, unknown>[] = [];

vi.mock('@/lib/db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({ limit: async () => existingOrders }),
      }),
    }),
    insert: () => ({
      values: async (value: Record<string, unknown>) => {
        inserted.push(value);
      },
    }),
  },
}));

function post(body: unknown): NextRequest {
  return new Request('https://www.imagentx.top/api/claim', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

describe('免费入库', () => {
  afterEach(() => vi.unstubAllEnvs());
  it('限时免费期间 XIsland 领取写入待履约订单，并照常发放永久激活码', async () => {
    vi.stubEnv('SOFTWARE_LICENSE_ENABLED', 'true');
    fulfillOrder.mockResolvedValue({ status: 'emailed' });
    const { POST } = await import('../route');
    const response = await POST(post({ productId: 'xisland' }));

    expect(response.status).toBe(200);
    expect(inserted).toHaveLength(1);
    expect(inserted[0]).toMatchObject({
      productId: 'xisland',
      planId: 'limited-free',
      amountCny: 0,
      status: 'paid',
      billingPeriod: 'lifetime',
      // 必须进交付队列，否则用户拿不到激活码也收不到邮件
      deliveryStatus: 'pending',
    });
    expect(inserted[0].paidAt).toBeTruthy();
    expect(fulfillOrder).toHaveBeenCalledWith(inserted[0].id);
    await expect(response.json()).resolves.toMatchObject({ success: true, delivered: true });
  });

  it('履约失败时订单留在 pending，等重试补发，不给用户 500', async () => {
    vi.stubEnv('SOFTWARE_LICENSE_ENABLED', 'true');
    fulfillOrder.mockResolvedValue({ status: 'failed' });
    const { POST } = await import('../route');
    const response = await POST(post({ productId: 'xnook' }));

    expect(response.status).toBe(200);
    expect(inserted[0]).toMatchObject({ deliveryStatus: 'pending' });
    await expect(response.json()).resolves.toMatchObject({ success: true, delivered: false });
  });
  beforeEach(() => {
    vi.clearAllMocks();
    inserted.length = 0;
    existingOrders = [];
    getSession.mockResolvedValue({ userId: 'u1', email: 'a@b.com' });
    fulfillOrder.mockResolvedValue({ status: 'skipped' });
  });

  it('未登录时拒绝：授权要绑定到账号', async () => {
    getSession.mockResolvedValue(null);
    const { POST } = await import('../route');

    const response = await POST(post({ productId: 'webgl-fluid-sim' }));

    expect(response.status).toBe(401);
    expect(inserted).toHaveLength(0);
  });

  it('产品不存在时拒绝', async () => {
    const { POST } = await import('../route');

    const response = await POST(post({ productId: 'not-a-product' }));

    expect(response.status).toBe(400);
    expect(inserted).toHaveLength(0);
  });

  it('没有免费档的产品不能白拿', async () => {
    // 现在的真实产品里每个都至少有一档 ¥0（限免 / 免费），
    // 所以把 findProduct 换成「只有付费档」的产品来守这条边界。
    vi.resetModules();
    vi.doMock('@/lib/products', () => ({
      findProduct: (id: string) => (id === 'paid-only'
        ? { id: 'paid-only', pricing: [{ id: 'pro', name: { zh: 'Pro', en: 'Pro' }, price: 99, features: [] }], downloads: [] }
        : null),
    }));
    try {
      const { POST } = await import('../route');
      const response = await POST(post({ productId: 'paid-only' }));
      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({ error: '该产品没有免费档，请购买后使用' });
      expect(inserted).toHaveLength(0);
    } finally {
      vi.doUnmock('@/lib/products');
      vi.resetModules();
    }
  });

  it('Meteor Pass 不能靠入库接口白拿（它不是 products 里的产品）', async () => {
    const { POST } = await import('../route');

    const response = await POST(post({ productId: 'meteor-pass' }));

    expect(response.status).toBe(400);
    expect(inserted).toHaveLength(0);
  });

  it('有免费档时写入一条 ¥0 已支付订单，且不进邮件交付队列', async () => {
    const { POST } = await import('../route');

    const response = await POST(post({ productId: 'webgl-fluid-sim' }));

    expect(response.status).toBe(200);
    expect(inserted).toHaveLength(1);
    expect(inserted[0]).toMatchObject({
      productId: 'webgl-fluid-sim',
      planId: 'free',
      userId: 'u1',
      amountCny: 0,
      status: 'paid',
      paymentMethod: 'free',
      // 'pending' 会被 /api/payment/delivery-retry 捞去发信；
      // 'emailed' 则会因为查不到授权码而在授权判定里被过滤掉
      deliveryStatus: 'not_required',
    });
    expect(inserted[0].paidAt).toBeTruthy();
  });

  it('即将上架的产品（暂不出售）不能靠入库接口领取', async () => {
    const { POST } = await import('../route');

    // ex-memory 已标 coming_soon：即使有 ¥0 档也不能白拿
    const response = await POST(post({ productId: 'ex-memory' }));

    expect(response.status).toBe(400);
    expect(inserted).toHaveLength(0);
  });

  it('已经拥有时幂等返回，不重复写订单', async () => {
    existingOrders = [{ id: 'existing-order' }];
    const { POST } = await import('../route');

    const response = await POST(post({ productId: 'webgl-fluid-sim' }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ alreadyOwned: true });
    expect(inserted).toHaveLength(0);
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '127.0.0.1',
  rateLimit: async () => ({ limited: false }),
}));

const getSession = vi.fn();
vi.mock('@/lib/auth', () => ({ getSession: () => getSession() }));

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
  beforeEach(() => {
    vi.clearAllMocks();
    inserted.length = 0;
    existingOrders = [];
    getSession.mockResolvedValue({ userId: 'u1', email: 'a@b.com' });
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
    const { POST } = await import('../route');

    // omnicrawl 三档全是付费，不该能通过入库接口绕过付款
    const response = await POST(post({ productId: 'omnicrawl' }));

    expect(response.status).toBe(400);
    expect(inserted).toHaveLength(0);
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

  it('限免产品（原价 ¥9，现价 ¥0）同样可以入库', async () => {
    const { POST } = await import('../route');

    const response = await POST(post({ productId: 'ex-memory' }));

    expect(response.status).toBe(200);
    expect(inserted[0]).toMatchObject({ productId: 'ex-memory', amountCny: 0 });
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

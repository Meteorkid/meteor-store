import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const ORDERS = [
  { id: 'b3f1c2d4-0000-4000-8000-000000000001' },
  { id: 'b3f1c2d4-0000-4000-8000-000000000002' },
];

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '127.0.0.1',
  rateLimit: async () => ({ limited: false }),
}));

vi.mock('@/lib/db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => ORDERS,
        }),
      }),
    }),
  },
}));

const fulfill = vi.fn();
vi.mock('@/lib/order-fulfillment', () => ({
  fulfillOrder: (...args: unknown[]) => fulfill(...args),
}));

describe('订单交付重试接口', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DELIVERY_RETRY_SECRET = 'delivery-secret';
    fulfill
      .mockResolvedValueOnce({ status: 'emailed' })
      .mockResolvedValueOnce({ status: 'skipped' });
  });

  it('批量重试统一走原子交付服务，并单独报告跳过数量', async () => {
    const { POST } = await import('../route');
    const request = new Request('https://www.imagentx.top/api/payment/delivery-retry', {
      method: 'POST',
      headers: { authorization: 'Bearer delivery-secret' },
      body: '{}',
    }) as unknown as NextRequest;

    const response = await POST(request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      retried: 2,
      succeeded: 1,
      failed: 0,
      skipped: 1,
    });
    expect(fulfill).toHaveBeenCalledTimes(2);
  });
});

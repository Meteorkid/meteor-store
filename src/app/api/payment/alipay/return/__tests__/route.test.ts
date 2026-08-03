import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
  verify: vi.fn(),
  createOrderAccess: vi.fn(),
  orderExists: true,
}));

vi.mock('@/lib/alipay', () => ({
  verifyAlipayNotify: (...args: unknown[]) => mocks.verify(...args),
}));

vi.mock('@/lib/order-access', () => ({
  createOrderAccess: (...args: unknown[]) => mocks.createOrderAccess(...args),
}));

vi.mock('@/lib/db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => (mocks.orderExists ? [{ id: ORDER_ID }] : []),
        }),
      }),
    }),
  },
}));

const ORDER_ID = 'b3f1c2d4-0000-4000-8000-000000000001';

describe('支付宝同步回跳', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verify.mockReturnValue(true);
    mocks.orderExists = true;
    process.env.ALIPAY_APP_ID = 'test-app-id';
  });

  it('验签且订单存在时签发短时访问凭证，再跳到干净的成功页', async () => {
    const { GET } = await import('../route');
    const request = new Request(
      `https://www.imagentx.top/api/payment/alipay/return?out_trade_no=${ORDER_ID}&app_id=test-app-id&sign=valid`,
    ) as unknown as NextRequest;

    const response = await GET(request);

    expect(mocks.createOrderAccess).toHaveBeenCalledWith(ORDER_ID);
    expect(response.headers.get('location')).toBe(
      `https://www.imagentx.top/success?orderId=${ORDER_ID}`,
    );
  });

  it('验签失败时不签发凭证，也不在跳转地址暴露订单号', async () => {
    mocks.verify.mockReturnValue(false);
    const { GET } = await import('../route');
    const request = new Request(
      `https://www.imagentx.top/api/payment/alipay/return?out_trade_no=${ORDER_ID}&app_id=test-app-id&sign=bad`,
    ) as unknown as NextRequest;

    const response = await GET(request);

    expect(mocks.createOrderAccess).not.toHaveBeenCalled();
    expect(response.headers.get('location')).toBe('https://www.imagentx.top/success');
  });
});

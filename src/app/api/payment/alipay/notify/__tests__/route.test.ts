import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

const mockVerify = vi.fn();
vi.mock('@/lib/alipay', () => ({
  verifyAlipayNotify: (...args: unknown[]) => mockVerify(...args),
}));

/** 当前订单行；null 表示订单不存在 */
let orderRow: Record<string, unknown> | null = null;
/** 每次 db.update().set() 的入参 */
const updates: Record<string, unknown>[] = [];
/** 条件更新影响的行数，用来模拟并发下「已被别的请求处理」 */
let updateRowCount = 1;

vi.mock('@/lib/db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => (orderRow ? [orderRow] : []),
        }),
      }),
    }),
    update: () => ({
      set: (values: Record<string, unknown>) => ({
        where: async () => {
          updates.push(values);
          return { rowCount: updateRowCount };
        },
      }),
    }),
  },
}));

const mockAlert = vi.fn();
vi.mock('@/lib/email', () => ({
  sendAdminAlert: (...args: unknown[]) => mockAlert(...args),
}));

const mockFulfill = vi.fn();
vi.mock('@/lib/order-fulfillment', () => ({
  fulfillOrder: (...args: unknown[]) => mockFulfill(...args),
}));

import { POST } from '../route';

const APP_ID = 'test-app-id';
const SELLER_ID = 'test-seller-id';

const PENDING_ORDER = {
  id: 'b3f1c2d4-0000-4000-8000-000000000001',
  productId: 'omnicrawl',
  planName: 'Starter',
  email: 'buyer@example.com',
  amountCny: 199,
  status: 'pending',
  deliveryStatus: 'pending',
  accessToken: 'tok',
};

function notify(overrides: Record<string, string> = {}): NextRequest {
  const params: Record<string, string> = {
    app_id: APP_ID,
    seller_id: SELLER_ID,
    out_trade_no: PENDING_ORDER.id,
    total_amount: '199.00',
    trade_status: 'TRADE_SUCCESS',
    trade_no: 'ALIPAY-TRADE-1',
    ...overrides,
  };
  const body = new FormData();
  Object.entries(params).forEach(([k, v]) => body.append(k, v));
  return new Request('http://localhost/api/payment/alipay/notify', {
    method: 'POST',
    body,
  }) as unknown as NextRequest;
}

describe('支付宝异步通知', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    process.env.ALIPAY_APP_ID = APP_ID;
    process.env.ALIPAY_SELLER_ID = SELLER_ID;
    orderRow = { ...PENDING_ORDER };
    updates.length = 0;
    updateRowCount = 1;
    mockVerify.mockReturnValue(true);
    mockFulfill.mockResolvedValue({ status: 'emailed' });
  });

  describe('拒绝伪造的通知', () => {
    it('验签失败 → fail，且不写库不发信', async () => {
      mockVerify.mockReturnValue(false);
      const res = await POST(notify());

      expect(res.status).toBe(400);
      expect(await res.text()).toBe('fail');
      expect(updates).toHaveLength(0);
      expect(mockFulfill).not.toHaveBeenCalled();
    });

    it('app_id 不是自己的 → fail', async () => {
      const res = await POST(notify({ app_id: 'someone-else' }));
      expect(res.status).toBe(400);
      expect(updates).toHaveLength(0);
    });

    it('seller_id 不是自己的 → fail', async () => {
      const res = await POST(notify({ seller_id: 'someone-else' }));
      expect(res.status).toBe(400);
      expect(updates).toHaveLength(0);
    });

    it('未配置 ALIPAY_SELLER_ID → 500，宁可报错也不放行', async () => {
      delete process.env.ALIPAY_SELLER_ID;
      const res = await POST(notify());
      expect(res.status).toBe(500);
      expect(updates).toHaveLength(0);
    });

    it('订单不存在 → fail', async () => {
      orderRow = null;
      const res = await POST(notify());
      expect(res.status).toBe(400);
      expect(updates).toHaveLength(0);
    });
  });

  describe('金额校验', () => {
    it('金额不符 → fail，不标记已支付，并告警管理员', async () => {
      const res = await POST(notify({ total_amount: '0.01' }));

      expect(res.status).toBe(400);
      expect(updates).toHaveLength(0);
      expect(mockFulfill).not.toHaveBeenCalled();
      expect(mockAlert).toHaveBeenCalledWith(
        '支付宝通知金额不一致',
        expect.objectContaining({ expected: '199.00', received: '0.01' }),
      );
    });

    it('已支付订单收到金额不符的通知 → 仍回 success 止住重试，但要告警', async () => {
      orderRow = { ...PENDING_ORDER, status: 'paid', deliveryStatus: 'emailed' };
      const res = await POST(notify({ total_amount: '0.01' }));

      expect(res.status).toBe(200);
      expect(mockAlert).toHaveBeenCalledWith(
        '支付宝通知金额不一致（已支付订单）',
        expect.objectContaining({ received: '0.01' }),
      );
    });
  });

  describe('支付成功', () => {
    it('标记已支付后交给统一交付服务处理', async () => {
      const res = await POST(notify());

      expect(res.status).toBe(200);
      expect(await res.text()).toBe('success');

      expect(updates[0]).toMatchObject({ status: 'paid', alipayTradeNo: 'ALIPAY-TRADE-1' });
      expect(mockFulfill).toHaveBeenCalledWith(PENDING_ORDER.id);
    });

    it('TRADE_FINISHED 同样按成功处理', async () => {
      await POST(notify({ trade_status: 'TRADE_FINISHED' }));
      expect(updates[0]).toMatchObject({ status: 'paid' });
    });

    it('非成功状态（如 WAIT_BUYER_PAY）不标记已支付', async () => {
      const res = await POST(notify({ trade_status: 'WAIT_BUYER_PAY' }));

      expect(res.status).toBe(200);
      expect(updates).toHaveLength(0);
      expect(mockFulfill).not.toHaveBeenCalled();
    });

    it('统一交付服务返回失败时仍回 success，避免支付宝无限重试', async () => {
      mockFulfill.mockResolvedValue({ status: 'failed' });
      const res = await POST(notify());

      expect(res.status).toBe(200);
      expect(mockFulfill).toHaveBeenCalledWith(PENDING_ORDER.id);
    });
  });

  describe('重复通知的幂等性', () => {
    it('条件更新未命中（并发下已被处理）→ 不重复发信', async () => {
      updateRowCount = 0;
      const res = await POST(notify());

      expect(res.status).toBe(200);
      expect(mockFulfill).not.toHaveBeenCalled();
    });

    it('订单已支付且已发货 → 直接 success，不重复发信', async () => {
      orderRow = { ...PENDING_ORDER, status: 'paid', deliveryStatus: 'emailed' };
      const res = await POST(notify());

      expect(res.status).toBe(200);
      expect(mockFulfill).not.toHaveBeenCalled();
      expect(updates).toHaveLength(0);
    });

    it('订单已支付但发货失败过 → 交给统一服务安全补发', async () => {
      orderRow = { ...PENDING_ORDER, status: 'paid', deliveryStatus: 'failed' };

      const res = await POST(notify());

      expect(res.status).toBe(200);
      expect(mockFulfill).toHaveBeenCalledWith(PENDING_ORDER.id);
    });

    it('订单处于处理中时仍调用统一服务，由服务判断是否超时接管', async () => {
      orderRow = { ...PENDING_ORDER, status: 'paid', deliveryStatus: 'processing' };

      await POST(notify());

      expect(mockFulfill).toHaveBeenCalledWith(PENDING_ORDER.id);
    });
  });
});

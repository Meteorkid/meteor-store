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

const mockSendOrder = vi.fn();
const mockAlert = vi.fn();
vi.mock('@/lib/email', () => ({
  sendOrderConfirmation: (...args: unknown[]) => mockSendOrder(...args),
  sendAdminAlert: (...args: unknown[]) => mockAlert(...args),
}));

const mockCreateKey = vi.fn();
const mockGetKey = vi.fn();
vi.mock('@/lib/license', () => ({
  createLicenseKey: (...args: unknown[]) => mockCreateKey(...args),
  getLicenseKeyByOrderId: (...args: unknown[]) => mockGetKey(...args),
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
    mockCreateKey.mockResolvedValue('MC-AAAA-BBBB-CCCC-DDDD');
    mockGetKey.mockResolvedValue(null);
    mockSendOrder.mockResolvedValue(undefined);
  });

  describe('拒绝伪造的通知', () => {
    it('验签失败 → fail，且不写库不发信', async () => {
      mockVerify.mockReturnValue(false);
      const res = await POST(notify());

      expect(res.status).toBe(400);
      expect(await res.text()).toBe('fail');
      expect(updates).toHaveLength(0);
      expect(mockSendOrder).not.toHaveBeenCalled();
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
      expect(mockSendOrder).not.toHaveBeenCalled();
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
    it('标记已支付、生成 key、发确认邮件、置为已发货', async () => {
      const res = await POST(notify());

      expect(res.status).toBe(200);
      expect(await res.text()).toBe('success');

      expect(updates[0]).toMatchObject({ status: 'paid', alipayTradeNo: 'ALIPAY-TRADE-1' });
      expect(mockCreateKey).toHaveBeenCalledWith(
        expect.objectContaining({ orderId: PENDING_ORDER.id, email: 'buyer@example.com' }),
      );
      expect(mockSendOrder).toHaveBeenCalledWith(
        expect.objectContaining({ licenseKey: 'MC-AAAA-BBBB-CCCC-DDDD', amount: 199 }),
      );
      expect(updates.at(-1)).toMatchObject({ deliveryStatus: 'emailed' });
    });

    it('TRADE_FINISHED 同样按成功处理', async () => {
      await POST(notify({ trade_status: 'TRADE_FINISHED' }));
      expect(updates[0]).toMatchObject({ status: 'paid' });
    });

    it('非成功状态（如 WAIT_BUYER_PAY）不标记已支付', async () => {
      const res = await POST(notify({ trade_status: 'WAIT_BUYER_PAY' }));

      expect(res.status).toBe(200);
      expect(updates).toHaveLength(0);
      expect(mockSendOrder).not.toHaveBeenCalled();
    });

    it('发信失败时置为 failed，但仍回 success 避免支付宝无限重试', async () => {
      mockSendOrder.mockRejectedValue(new Error('SMTP down'));
      const res = await POST(notify());

      expect(res.status).toBe(200);
      expect(updates.at(-1)).toMatchObject({ deliveryStatus: 'failed' });
    });
  });

  describe('重复通知的幂等性', () => {
    it('条件更新未命中（并发下已被处理）→ 不重复发信', async () => {
      updateRowCount = 0;
      const res = await POST(notify());

      expect(res.status).toBe(200);
      expect(mockCreateKey).not.toHaveBeenCalled();
      expect(mockSendOrder).not.toHaveBeenCalled();
    });

    it('订单已支付且已发货 → 直接 success，不重复发信', async () => {
      orderRow = { ...PENDING_ORDER, status: 'paid', deliveryStatus: 'emailed' };
      const res = await POST(notify());

      expect(res.status).toBe(200);
      expect(mockSendOrder).not.toHaveBeenCalled();
      expect(updates).toHaveLength(0);
    });

    it('订单已支付但发货失败过 → 补发，且复用已有的 key', async () => {
      orderRow = { ...PENDING_ORDER, status: 'paid', deliveryStatus: 'failed' };
      mockGetKey.mockResolvedValue({ key: 'MC-OLD1-OLD2-OLD3-OLD4' });

      const res = await POST(notify());

      expect(res.status).toBe(200);
      expect(mockCreateKey).not.toHaveBeenCalled();
      expect(mockSendOrder).toHaveBeenCalledWith(
        expect.objectContaining({ licenseKey: 'MC-OLD1-OLD2-OLD3-OLD4' }),
      );
      expect(updates.at(-1)).toMatchObject({ deliveryStatus: 'emailed' });
    });

    it('订单已支付、发货失败过、且还没有 key → 补生成再发', async () => {
      orderRow = { ...PENDING_ORDER, status: 'paid', deliveryStatus: 'failed' };
      mockGetKey.mockResolvedValue(null);

      await POST(notify());

      expect(mockCreateKey).toHaveBeenCalled();
      expect(mockSendOrder).toHaveBeenCalledWith(
        expect.objectContaining({ licenseKey: 'MC-AAAA-BBBB-CCCC-DDDD' }),
      );
    });
  });
});

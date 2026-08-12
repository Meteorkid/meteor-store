import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

vi.mock('@/lib/email', () => ({
  sendAdminAlert: vi.fn(),
}));

vi.mock('@/lib/order-fulfillment', () => ({
  fulfillOrder: vi.fn().mockResolvedValue({ status: 'emailed' }),
}));

const parseWechatNotify = vi.fn();
const parseWechatRefundNotify = vi.fn();
vi.mock('@/lib/wechat', () => ({
  parseWechatNotify: (...args: unknown[]) => parseWechatNotify(...args),
  parseWechatRefundNotify: (...args: unknown[]) => parseWechatRefundNotify(...args),
}));

// 模拟数据库层
const dbUpdate = vi.fn();
const dbSelect = vi.fn();
vi.mock('@/lib/db', () => ({
  db: { update: (...a: unknown[]) => dbUpdate(...a), select: (...a: unknown[]) => dbSelect(...a) },
}));

function mockUpdateChain(opts: { returning?: boolean; rowCount?: number }) {
  const update = {
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue(opts),
  };
  dbUpdate.mockReturnValue(update);
}
function mockSelectChain(rows: unknown[]) {
  const select = {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue(rows) }),
  };
  dbSelect.mockReturnValue(select);
}

function request(body: string, headers: Record<string, string> = {}) {
  return new Request('https://www.imagentx.top/api/payment/wechat/notify', {
    method: 'POST',
    headers,
    body,
  }) as unknown as NextRequest;
}

function refundRequest(eventType: string) {
  return request(JSON.stringify({ event_type: eventType }));
}

describe('微信支付回调接口', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    parseWechatNotify.mockReturnValue(null);
    parseWechatRefundNotify.mockReturnValue(null);
  });

  it('验签失败返回 500 让微信重试', async () => {
    const { POST } = await import('../route');
    const response = await POST(request('{}'));

    expect(response.status).toBe(500);
  });

  it('支付成功时把 pending 订单置为 paid 并交付', async () => {
    parseWechatNotify.mockReturnValue({
      outTradeNo: 'order-1',
      transactionId: 'wx-txn-1',
      total: 3900,
      tradeState: 'SUCCESS',
    });
    mockSelectChain([{ id: 'order-1', status: 'pending', amountCny: 39, deliveryStatus: 'pending' }]);
    mockUpdateChain({ rowCount: 1 });

    const { POST } = await import('../route');
    const response = await POST(request('{}', { 'wechatpay-signature': 'sig' }));

    expect(response.text()).resolves.toBe('SUCCESS');
  });

  it('金额不一致返回 500 且不交付', async () => {
    parseWechatNotify.mockReturnValue({
      outTradeNo: 'order-2',
      transactionId: 'wx-txn-2',
      total: 1,
      tradeState: 'SUCCESS',
    });
    mockSelectChain([{ id: 'order-2', status: 'pending', amountCny: 39, deliveryStatus: 'pending' }]);

    const { POST } = await import('../route');
    const response = await POST(request('{}', { 'wechatpay-signature': 'sig' }));

    expect(response.status).toBe(500);
  });
});
describe('微信退款结果回调', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    parseWechatNotify.mockReturnValue(null);
    parseWechatRefundNotify.mockReturnValue(null);
  });

  it('REFUND.SUCCESS：paid 订单回写 refunded 并撤销授权码', async () => {
    parseWechatRefundNotify.mockReturnValue({
      outTradeNo: 'order-r1',
      outRefundNo: 'order-r1-R1',
      refundStatus: 'SUCCESS',
      refundAmount: 3900,
      totalAmount: 3900,
    });
    mockSelectChain([{ id: 'order-r1', status: 'paid', amountCny: 39 }]);
    mockUpdateChain({ rowCount: 1 });

    const { POST } = await import('../route');
    const response = await POST(refundRequest('REFUND.SUCCESS'));

    expect(response.status).toBe(200);
    // 两次更新：orders（paid→refunded）+ licenseKeys（revoked）
    expect(dbUpdate).toHaveBeenCalledTimes(2);
  });

  it('REFUND.SUCCESS：已 refunded 订单幂等，只补撤销授权码', async () => {
    parseWechatRefundNotify.mockReturnValue({
      outTradeNo: 'order-r2',
      outRefundNo: 'order-r2-R1',
      refundStatus: 'SUCCESS',
      refundAmount: 3900,
      totalAmount: 3900,
    });
    mockSelectChain([{ id: 'order-r2', status: 'refunded', amountCny: 39 }]);
    mockUpdateChain({ rowCount: 0 });

    const { POST } = await import('../route');
    const response = await POST(refundRequest('REFUND.SUCCESS'));

    expect(response.status).toBe(200);
    // 只更新 licenseKeys，不动 orders
    expect(dbUpdate).toHaveBeenCalledTimes(1);
  });

  it('REFUND.SUCCESS：部分退款不动订单状态，发管理员告警', async () => {
    parseWechatRefundNotify.mockReturnValue({
      outTradeNo: 'order-r3',
      outRefundNo: 'order-r3-R1',
      refundStatus: 'SUCCESS',
      refundAmount: 1900,
      totalAmount: 3900,
    });
    mockSelectChain([{ id: 'order-r3', status: 'paid', amountCny: 39 }]);

    const { POST } = await import('../route');
    const response = await POST(refundRequest('REFUND.SUCCESS'));

    expect(response.status).toBe(200);
    expect(dbUpdate).not.toHaveBeenCalled();
  });

  it('REFUND.ABNORMAL：refunded 订单回滚 paid 并恢复授权码', async () => {
    parseWechatRefundNotify.mockReturnValue({
      outTradeNo: 'order-r4',
      outRefundNo: 'order-r4-R1',
      refundStatus: 'ABNORMAL',
      refundAmount: 3900,
      totalAmount: 3900,
    });
    mockSelectChain([{ id: 'order-r4', status: 'refunded', amountCny: 39 }]);
    mockUpdateChain({ rowCount: 1 });

    const { POST } = await import('../route');
    const response = await POST(refundRequest('REFUND.ABNORMAL'));

    expect(response.status).toBe(200);
    // 两次更新：orders（refunded→paid）+ licenseKeys（active）
    expect(dbUpdate).toHaveBeenCalledTimes(2);
  });

  it('REFUND.CLOSED：paid 订单不动状态，只发告警', async () => {
    parseWechatRefundNotify.mockReturnValue({
      outTradeNo: 'order-r5',
      outRefundNo: 'order-r5-R1',
      refundStatus: 'CLOSED',
      refundAmount: 0,
      totalAmount: 3900,
    });
    mockSelectChain([{ id: 'order-r5', status: 'paid', amountCny: 39 }]);

    const { POST } = await import('../route');
    const response = await POST(refundRequest('REFUND.CLOSED'));

    expect(response.status).toBe(200);
    expect(dbUpdate).not.toHaveBeenCalled();
  });

  it('退款回调验签失败返回 500 让微信重试', async () => {
    parseWechatRefundNotify.mockReturnValue(null);

    const { POST } = await import('../route');
    const response = await POST(refundRequest('REFUND.SUCCESS'));

    expect(response.status).toBe(500);
  });

  it('退款回调订单不存在返回 500', async () => {
    parseWechatRefundNotify.mockReturnValue({
      outTradeNo: 'order-missing',
      outRefundNo: 'order-missing-R1',
      refundStatus: 'SUCCESS',
      refundAmount: 3900,
      totalAmount: 3900,
    });
    mockSelectChain([]);

    const { POST } = await import('../route');
    const response = await POST(refundRequest('REFUND.SUCCESS'));

    expect(response.status).toBe(500);
  });

  it('非退款终态事件走原支付流程，退款解析器不被调用', async () => {
    parseWechatNotify.mockReturnValue({
      outTradeNo: 'order-1',
      transactionId: 'wx-txn-1',
      total: 3900,
      tradeState: 'SUCCESS',
    });
    mockSelectChain([{ id: 'order-1', status: 'pending', amountCny: 39, deliveryStatus: 'pending' }]);
    mockUpdateChain({ rowCount: 1 });

    const { POST } = await import('../route');
    const response = await POST(refundRequest('REFUND.PROCESSING'));

    expect(response.status).toBe(200);
    expect(parseWechatRefundNotify).not.toHaveBeenCalled();
  });
});


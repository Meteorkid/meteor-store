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
const applyRefund = vi.fn();
vi.mock('@/lib/payment-refunds', () => ({ applyWechatRefundSnapshot: (...args: unknown[]) => applyRefund(...args) }));
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
  const snapshot = { outTradeNo: 'order-r1', outRefundNo: 'order-r1-R1', transactionId: 'wx-r1', refundId: 'wx-refund-r1', refundStatus: 'SUCCESS', refundAmount: 3900, totalAmount: 3900 };
  beforeEach(() => {
    vi.clearAllMocks();
    parseWechatNotify.mockReturnValue(null);
    parseWechatRefundNotify.mockReturnValue(snapshot);
    applyRefund.mockImplementation(async refund => ({ attempt: { orderId: refund.outTradeNo, requestNo: refund.outRefundNo, status: refund.refundStatus,
      needsReview: refund.refundAmount !== refund.totalAmount || refund.refundStatus === 'ABNORMAL' }, changed: true }));
  });

  it('完整保留退款号与交易号，交给共享持久状态机处理', async () => {
    const { POST } = await import('../route');
    expect((await POST(refundRequest('REFUND.SUCCESS'))).status).toBe(200);
    expect(applyRefund).toHaveBeenCalledWith(snapshot);
    expect(dbUpdate).not.toHaveBeenCalled();
  });

  it('ABNORMAL保持独立退款状态，不走失败恢复订单的旧路径', async () => {
    parseWechatRefundNotify.mockReturnValue({ ...snapshot, refundStatus: 'ABNORMAL' });
    const { POST } = await import('../route');
    expect((await POST(refundRequest('REFUND.ABNORMAL'))).status).toBe(200);
    expect(applyRefund).toHaveBeenCalledWith(expect.objectContaining({ outRefundNo: snapshot.outRefundNo, refundStatus: 'ABNORMAL' }));
    expect(dbUpdate).not.toHaveBeenCalled();
  });

  it('部分退款也进入持久状态机，由其决定人工核验', async () => {
    parseWechatRefundNotify.mockReturnValue({ ...snapshot, refundAmount: 1900 });
    const { POST } = await import('../route');
    expect((await POST(refundRequest('REFUND.SUCCESS'))).status).toBe(200);
    expect(applyRefund).toHaveBeenCalledWith(expect.objectContaining({ refundAmount: 1900 }));
  });

  it('事件类型与已验签内容不一致时拒绝', async () => {
    const { POST } = await import('../route');
    expect((await POST(refundRequest('REFUND.CLOSED'))).status).toBe(500);
    expect(applyRefund).not.toHaveBeenCalled();
  });

  it('签名失败或持久处理失败均返回500让渠道重试', async () => {
    const { POST } = await import('../route');
    parseWechatRefundNotify.mockReturnValueOnce(null);
    expect((await POST(refundRequest('REFUND.SUCCESS'))).status).toBe(500);
    expect(applyRefund).not.toHaveBeenCalled();
    applyRefund.mockRejectedValueOnce(new Error('refund-order-not-found'));
    expect((await POST(refundRequest('REFUND.SUCCESS'))).status).toBe(500);
  });
});

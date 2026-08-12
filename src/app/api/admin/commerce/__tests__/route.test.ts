import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

vi.mock('@/lib/auth', () => ({
  getSession: async () => ({ email: 'admin@example.com', emailVerified: true }),
}));

vi.mock('@/lib/admin', () => ({
  isAdminSession: () => true,
}));

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '203.0.113.1',
  rateLimit: async () => ({ limited: false }),
}));

const listCommerce = vi.fn();
const setLicenseStatus = vi.fn();
const refund = vi.fn();
vi.mock('@/lib/admin-commerce', () => ({
  listCommerceOperations: (...args: unknown[]) => listCommerce(...args),
  setLicenseStatus: (...args: unknown[]) => setLicenseStatus(...args),
  refundOrder: (...args: unknown[]) => refund(...args),
}));

const fulfill = vi.fn();
vi.mock('@/lib/order-fulfillment', () => ({
  fulfillOrder: (...args: unknown[]) => fulfill(...args),
}));

function request(body: Record<string, unknown>): NextRequest {
  return new Request('https://www.imagentx.top/api/admin/commerce', {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

describe('商业运维接口', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listCommerce.mockResolvedValue({ orders: [], licenses: [] });
    fulfill.mockResolvedValue({ status: 'emailed' });
    setLicenseStatus.mockResolvedValue(true);
    refund.mockResolvedValue('refunded');
  });

  it('返回订单和授权运维列表', async () => {
    const { GET } = await import('../route');

    const response = await GET();

    expect(response.status).toBe(200);
    expect(listCommerce).toHaveBeenCalledOnce();
  });

  it('交付重试调用统一交付状态机', async () => {
    const { PATCH } = await import('../route');
    const orderId = 'b3f1c2d4-0000-4000-8000-000000000001';

    const response = await PATCH(request({ action: 'retry-delivery', orderId }));

    expect(response.status).toBe(200);
    expect(fulfill).toHaveBeenCalledWith(orderId);
  });

  it('授权状态只能切换为 active 或 revoked', async () => {
    const { PATCH } = await import('../route');

    const response = await PATCH(request({
      action: 'set-license-status',
      licenseId: 'license-id',
      status: 'revoked',
    }));

    expect(response.status).toBe(200);
    expect(setLicenseStatus).toHaveBeenCalledWith('license-id', 'revoked');
  });

  it('退款调用退款状态机', async () => {
    const { PATCH } = await import('../route');
    const orderId = 'b3f1c2d4-0000-4000-8000-000000000002';

    const response = await PATCH(request({ action: 'refund-order', orderId }));

    expect(response.status).toBe(200);
    expect(refund).toHaveBeenCalledWith(orderId);
  });

  it('订单已不是已支付状态时退款返回 409', async () => {
    const { PATCH } = await import('../route');
    refund.mockResolvedValueOnce('skipped');
    const orderId = 'b3f1c2d4-0000-4000-8000-000000000003';

    const response = await PATCH(request({ action: 'refund-order', orderId }));

    expect(response.status).toBe(409);
  });

  it('支付宝退款被拒时返回 502 并透出原因', async () => {
    const { PATCH } = await import('../route');
    refund.mockRejectedValueOnce(new Error('支付宝拒绝退款（40004）：交易不存在'));
    const orderId = 'b3f1c2d4-0000-4000-8000-000000000004';

    const response = await PATCH(request({ action: 'refund-order', orderId }));
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body.error).toContain('交易不存在');
  });
});

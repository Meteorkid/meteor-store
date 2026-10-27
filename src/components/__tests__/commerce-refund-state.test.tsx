import { isValidElement, type ReactElement, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const hooks = vi.hoisted(() => ({ values: [] as unknown[], index: 0 }));
vi.mock('react', async () => ({ ...(await vi.importActual<typeof import('react')>('react')), useState: (initial: unknown) => {
  const index = hooks.index++; if (!(index in hooks.values)) hooks.values[index] = initial;
  return [hooks.values[index], (next: unknown) => { hooks.values[index] = typeof next === 'function' ? next(hooks.values[index]) : next; }];
} }));
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
import CommerceManager from '../CommerceManager';
const order = { id: 'order', productId: 'xnook', planName: 'Pro', email: 'buyer@example.invalid', amountCny: 39, status: 'paid', deliveryStatus: 'emailed', alipayTradeNo: 'wx-order', paidAt: null, createdAt: '2026-01-01T00:00:00Z' };
const license = { id: 'license', orderId: 'order', productId: 'xnook', planName: 'Pro', email: 'buyer@example.invalid', key: 'MC-TEST', status: 'active', createdAt: order.createdAt };
function buttons(node: ReactNode): ReactElement<{ children?: ReactNode; onClick?: () => Promise<void> }>[] {
  if (Array.isArray(node)) return node.flatMap(buttons);
  if (!isValidElement<{ children?: ReactNode }>(node)) return [];
  return node.type === 'button' ? [node] : buttons(node.props.children);
}
beforeEach(() => { hooks.values = []; hooks.index = 0; vi.stubGlobal('window', { confirm: vi.fn().mockReturnValue(true) }); vi.stubGlobal('fetch', vi.fn()); });
afterEach(() => vi.unstubAllGlobals());
describe('退款未决界面', () => {
  it('PROCESSING响应不假称已退款、不撤销付费权益', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ success: true, status: 'processing' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ orders: [{ ...order, refundStatus: 'PROCESSING', outRefundNo: 'R1' }], licenses: [license] }), { status: 200 }));
    const tree = CommerceManager({ initialOrders: [order], initialLicenses: [license] });
    await buttons(tree).find(button => button.props.children === 'refundOrder')!.props.onClick!();
    expect(hooks.values[0]).toEqual([expect.objectContaining({ status: 'paid', refundStatus: 'PROCESSING' })]);
    expect(hooks.values[1]).toEqual([expect.objectContaining({ status: 'active' })]);
  });
  it('未决attempt只显示核对入口，不再次显示新退款按钮', () => {
    const tree = CommerceManager({ initialOrders: [{ ...order, refundStatus: 'UNKNOWN', outRefundNo: 'R1' }], initialLicenses: [license] });
    const labels = buttons(tree).map(button => button.props.children);
    expect(labels).toContain('checkRefund');
    expect(labels).not.toContain('refundOrder');
  });
});

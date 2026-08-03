import { beforeEach, describe, expect, it, vi } from 'vitest';

const ORDER = {
  id: 'b3f1c2d4-0000-4000-8000-000000000001',
  productId: 'omnicrawl',
  planName: 'Starter',
  email: 'buyer@example.com',
  amountCny: 29,
  status: 'paid',
  deliveryStatus: 'pending',
  deliveryClaimedAt: null as string | null,
  accessToken: 'token',
};

const state = vi.hoisted(() => ({
  order: {
    id: 'b3f1c2d4-0000-4000-8000-000000000001',
    productId: 'omnicrawl',
    planName: 'Starter',
    email: 'buyer@example.com',
    amountCny: 29,
    status: 'paid',
    deliveryStatus: 'pending',
    deliveryClaimedAt: null as string | null,
    accessToken: 'token',
  },
}));

vi.mock('../db', () => ({
  db: {
    update: () => ({
      set: (values: Record<string, unknown>) => ({
        where: () => ({
          returning: async () => {
            if (values.deliveryStatus !== 'processing') return [];
            if (
              state.order.status !== 'paid' ||
              !['pending', 'failed'].includes(state.order.deliveryStatus)
            ) {
              return [];
            }
            state.order = { ...state.order, ...values };
            return [{ ...state.order }];
          },
          then: (resolve: (value: { rowCount: number }) => unknown) => {
            state.order = { ...state.order, ...values };
            return Promise.resolve({ rowCount: 1 }).then(resolve);
          },
        }),
      }),
    }),
  },
}));

const sendOrder = vi.fn();
vi.mock('../email', () => ({
  sendOrderConfirmation: (...args: unknown[]) => sendOrder(...args),
}));

const createKey = vi.fn();
vi.mock('../license', () => ({
  createLicenseKey: (...args: unknown[]) => createKey(...args),
}));

describe('订单交付', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.order = { ...ORDER };
    createKey.mockResolvedValue('MC-AAAA-BBBB-CCCC-DDDD');
    sendOrder.mockResolvedValue(undefined);
  });

  it('两个并发交付只有一个能认领并发送邮件', async () => {
    const { fulfillOrder } = await import('../order-fulfillment');

    const results = await Promise.all([
      fulfillOrder(ORDER.id),
      fulfillOrder(ORDER.id),
    ]);

    expect(results.map((result) => result.status).sort()).toEqual(['emailed', 'skipped']);
    expect(sendOrder).toHaveBeenCalledTimes(1);
    expect(state.order.deliveryStatus).toBe('emailed');
  });

  it('邮件失败会释放认领并标记 failed，下一次可以重试成功', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    sendOrder.mockRejectedValueOnce(new Error('mail unavailable'));
    const { fulfillOrder } = await import('../order-fulfillment');

    await expect(fulfillOrder(ORDER.id)).resolves.toEqual({ status: 'failed' });
    expect(state.order.deliveryStatus).toBe('failed');

    sendOrder.mockResolvedValueOnce(undefined);
    await expect(fulfillOrder(ORDER.id)).resolves.toEqual({ status: 'emailed' });
    expect(state.order.deliveryStatus).toBe('emailed');
  });
});

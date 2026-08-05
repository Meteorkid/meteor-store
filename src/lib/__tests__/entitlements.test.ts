import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * mock db：getUserEntitlements 只走一次 select().from().where()。
 * 用队列返回查询结果，为空数组表示无订单。
 */
const selectQueue: Record<string, unknown>[][] = [];

vi.mock('../db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: async () => selectQueue.shift() ?? [],
      }),
    }),
  },
}));

import { getUserEntitlements } from '../entitlements';

describe('getUserEntitlements', () => {
  beforeEach(() => {
    selectQueue.length = 0;
  });

  const baseRow = {
    productId: 'ex-memory',
    planName: 'Premium',
    billingPeriod: 'monthly',
    paidAt: '2026-08-01T00:00:00.000Z',
  };

  it('返回已支付订单的产品，映射产品名', async () => {
    selectQueue.push([{ ...baseRow }]);

    const result = await getUserEntitlements('u1', 'a@b.com');

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      productId: 'ex-memory',
      productName: 'Ex-Memory',
      planName: 'Premium',
      billingPeriod: 'monthly',
    });
  });

  it('同一产品多订单只保留最新一次', async () => {
    selectQueue.push([
      { ...baseRow, paidAt: '2026-07-01T00:00:00.000Z' },
      { ...baseRow, paidAt: '2026-08-01T00:00:00.000Z' },
    ]);

    const result = await getUserEntitlements('u1', 'a@b.com');

    expect(result).toHaveLength(1);
    expect(result[0].paidAt).toBe('2026-08-01T00:00:00.000Z');
  });

  it('不同产品分别返回', async () => {
    selectQueue.push([
      { ...baseRow },
      { ...baseRow, productId: 'tollow', planName: 'Pro' },
    ]);

    const result = await getUserEntitlements('u1', 'a@b.com');

    expect(result.map((r) => r.productId).sort()).toEqual(['ex-memory', 'tollow']);
  });

  it('无订单时返回空数组', async () => {
    selectQueue.push([]);

    const result = await getUserEntitlements('u1', 'a@b.com');

    expect(result).toEqual([]);
  });
});
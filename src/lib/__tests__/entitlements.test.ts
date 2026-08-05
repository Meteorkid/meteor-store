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

  it('管理员返回全部产品（无需购买）', async () => {
    // 管理员邮箱来自 ADMIN_EMAILS 环境变量；这里临时设成传入的邮箱
    const prev = process.env.ADMIN_EMAILS;
    process.env.ADMIN_EMAILS = 'admin@test.com';
    try {
      const result = await getUserEntitlements('u1', 'admin@test.com');
      const productIds = result.map((r) => r.productId);
      expect(productIds).toContain('ex-memory');
      expect(productIds).toContain('tollow');
      expect(productIds).toContain('webgl-fluid-sim');
      // 覆盖全部产品（findProduct 的有效 id 数量）
      expect(result.length).toBeGreaterThan(1);
    } finally {
      if (prev === undefined) delete process.env.ADMIN_EMAILS;
      else process.env.ADMIN_EMAILS = prev;
    }
  });
});
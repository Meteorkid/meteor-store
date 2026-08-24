import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * mock db：getUserEntitlementSummary 会并行发两条查询——先订单，后邀请码兑换。
 * 用队列按这个顺序返回结果，缺项按空数组处理。
 */
const selectQueue: Record<string, unknown>[][] = [];

vi.mock('../db', () => {
  const chain = () => {
    const node = {
      from: () => node,
      leftJoin: () => node,
      innerJoin: () => node,
      where: async () => selectQueue.shift() ?? [],
    };
    return node;
  };
  return { db: { select: () => chain() } };
});

import { products } from '@/data/products';
import { getUserEntitlements, getUserEntitlementSummary } from '../entitlements';

describe('getUserEntitlements', () => {
  beforeEach(() => {
    selectQueue.length = 0;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const baseRow = {
    productId: 'ex-memory',
    planName: 'Premium',
    planId: null,
    billingPeriod: 'monthly',
    paidAt: '2026-08-01T00:00:00.000Z',
    deliveryStatus: 'emailed',
    licenseStatus: 'active',
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

  it('历史 Tollow Pro 没有 planId 时仍升级为永久 Pro', async () => {
    selectQueue.push([{ ...baseRow, productId: 'tollow', planName: 'Pro', planId: null }]);

    const result = await getUserEntitlements('u1', 'a@b.com');

    expect(result[0]).toMatchObject({ productId: 'tollow', planId: 'pro', expiresAt: null });
  });

  it('后来的 Free 授权不会把已有 Pro 降级', async () => {
    selectQueue.push([
      { ...baseRow, productId: 'tollow', planName: 'Pro', planId: 'pro', paidAt: '2026-07-01T00:00:00.000Z' },
      { ...baseRow, productId: 'tollow', planName: 'Free', planId: 'free', paidAt: '2026-08-01T00:00:00.000Z' },
    ]);

    const result = await getUserEntitlements('u1', 'a@b.com');

    expect(result[0]).toMatchObject({ productId: 'tollow', planId: 'pro', planName: 'Pro' });
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

  describe('撤销授权码', () => {
    it('已交付订单的授权码被撤销后收回访问权（退款场景）', async () => {
      selectQueue.push([{ ...baseRow, deliveryStatus: 'emailed', licenseStatus: 'revoked' }]);

      const result = await getUserEntitlements('u1', 'a@b.com');

      expect(result).toEqual([]);
    });

    it('尚未交付的订单处于发码窗口期，不能因为还没有授权码就挡住', async () => {
      selectQueue.push([{ ...baseRow, deliveryStatus: 'pending', licenseStatus: null }]);

      const result = await getUserEntitlements('u1', 'a@b.com');

      expect(result).toHaveLength(1);
      expect(result[0].productId).toBe('ex-memory');
    });
  });

  describe('Meteor Pass', () => {
    const passOrder = (billingPeriod: string, paidAt: string) => ({
      productId: 'meteor-pass',
      planName: billingPeriod,
      billingPeriod,
      paidAt,
      deliveryStatus: 'emailed',
      licenseStatus: 'active',
    });

    it('有效期内的 Pass 展开成全部产品的访问权', async () => {
      selectQueue.push([passOrder('annual', new Date().toISOString())]);

      const result = await getUserEntitlements('u1', 'a@b.com');

      expect(result).toHaveLength(products.length);
      expect(result[0].planName).toBe('Meteor Pass');
      expect(result[0].passPlanId).toBe('annual');
      expect(result[0].viaPass).toBe(true);
      expect(result[0].expiresAt).not.toBeNull();
    });

    it('过期的 Pass 不再放行任何产品', async () => {
      selectQueue.push([passOrder('monthly', '2020-01-01T00:00:00.000Z')]);

      const result = await getUserEntitlements('u1', 'a@b.com');

      expect(result).toEqual([]);
    });

    it('买断的 Pass 永不过期', async () => {
      selectQueue.push([passOrder('lifetime', '2020-01-01T00:00:00.000Z')]);

      const result = await getUserEntitlements('u1', 'a@b.com');

      expect(result).toHaveLength(products.length);
      expect(result[0].expiresAt).toBeNull();
      expect(result[0].passPlanId).toBe('lifetime');
    });

    it('单品授权优先于 Pass：自己买断的产品不显示成靠会员在用', async () => {
      selectQueue.push([
        { ...baseRow },
        passOrder('annual', new Date().toISOString()),
      ]);

      const result = await getUserEntitlements('u1', 'a@b.com');

      const exMemory = result.find((r) => r.productId === 'ex-memory');
      expect(exMemory?.planName).toBe('Premium');
      expect(exMemory?.expiresAt).toBeNull();
      expect(exMemory?.viaPass).toBe(false);
      // 其余产品仍由 Pass 覆盖
      expect(result).toHaveLength(products.length);
    });

    it('Tollow Free 不会遮住 Pass 提供的 Pro', async () => {
      selectQueue.push([
        { ...baseRow, productId: 'tollow', planName: 'Free', planId: 'free' },
        passOrder('annual', new Date().toISOString()),
      ]);

      const result = await getUserEntitlements('u1', 'a@b.com');
      const tollow = result.find((item) => item.productId === 'tollow');

      expect(tollow).toMatchObject({ planId: 'pro', viaPass: true, planName: 'Meteor Pass' });
    });

    it('未知档位不再兑换成永久会员，按最短档兜底', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      // 一条脏 billing_period（手工补单/导入脚本）曾经等于白送永久全站会员
      selectQueue.push([passOrder('enterprise', '2020-01-01T00:00:00.000Z')]);

      const result = await getUserEntitlements('u1', 'a@b.com');

      expect(result).toEqual([]);
    });

    describe('续费叠加', () => {
      it('提前续费从现有到期时间起算，不吞掉剩余天数', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-03-25T00:00:00.000Z'));
        selectQueue.push([
          passOrder('monthly', '2026-03-01T00:00:00.000Z'), // → 4/1 到期
          passOrder('monthly', '2026-03-20T00:00:00.000Z'), // 提前续 → 应从 4/1 起算
        ]);

        const result = await getUserEntitlements('u1', 'a@b.com');

        // 取「最新一条」的旧写法会算成 4/20，用户白丢 11 天
        expect(result[0].expiresAt).toBe('2026-05-01T00:00:00.000Z');
      });

      it('过期后再买的从当次付款起算，不会凭空补上空窗期', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-06-10T00:00:00.000Z'));
        selectQueue.push([
          passOrder('monthly', '2026-01-01T00:00:00.000Z'), // 2/1 就过期了
          passOrder('monthly', '2026-06-01T00:00:00.000Z'),
        ]);

        const result = await getUserEntitlements('u1', 'a@b.com');

        expect(result[0].expiresAt).toBe('2026-07-01T00:00:00.000Z');
      });

      it('年付用户再兑一张月付邀请码，到期时间只会顺延不会缩短', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-07-01T00:00:00.000Z'));
        selectQueue.push([passOrder('annual', '2026-01-01T00:00:00.000Z')]); // → 2027-01-01
        selectQueue.push([
          {
            productId: 'meteor-pass',
            planId: 'monthly',
            planName: 'Monthly',
            redeemedAt: '2026-06-01T00:00:00.000Z',
          },
        ]);

        const result = await getUserEntitlements('u1', 'a@b.com');

        // 旧写法按「最新一条」会显示 2026-07-01 到期，年付的钱看着就没了
        expect(result[0].expiresAt).toBe('2027-02-01T00:00:00.000Z');
      });
    });

    it('过期后 summary 给出 passExpiredAt，供空态区分「没买过」和「已过期」', async () => {
      selectQueue.push([passOrder('monthly', '2020-01-01T00:00:00.000Z')]);

      const summary = await getUserEntitlementSummary('u1', 'a@b.com');

      expect(summary.entitlements).toEqual([]);
      expect(summary.passExpiredAt).toBe('2020-02-01T00:00:00.000Z');
    });

    it('从没买过 Pass 时 passExpiredAt 为 null', async () => {
      selectQueue.push([{ ...baseRow }]);

      const summary = await getUserEntitlementSummary('u1', 'a@b.com');

      expect(summary.passExpiredAt).toBeNull();
    });
  });

  describe('邀请码兑换', () => {
    it('兑换单个产品的邀请码也算授权（不只是发一串授权码）', async () => {
      selectQueue.push([]); // 无订单
      selectQueue.push([
        {
          productId: 'tollow',
          planId: 'pro',
          planName: 'Pro',
          redeemedAt: '2026-08-01T00:00:00.000Z',
        },
      ]);

      const result = await getUserEntitlements('u1', 'a@b.com');

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        productId: 'tollow',
        planName: 'Pro',
        billingPeriod: 'invite',
      });
    });

    it('兑换 Pass 邀请码同样展开成全部产品，并按档位计算有效期', async () => {
      selectQueue.push([]);
      selectQueue.push([
        {
          productId: 'meteor-pass',
          planId: 'monthly',
          planName: 'Monthly',
          redeemedAt: new Date().toISOString(),
        },
      ]);

      const result = await getUserEntitlements('u1', 'a@b.com');

      expect(result).toHaveLength(products.length);
      expect(result[0].planName).toBe('Meteor Pass');
      expect(result[0].passPlanId).toBe('monthly');
      expect(result[0].billingPeriod).toBe('monthly');
      expect(result[0].expiresAt).not.toBeNull();
    });
  });
});

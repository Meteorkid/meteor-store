import { describe, it, expect, vi, afterEach } from 'vitest';
import { findPassPlan, getPassCoverage, isPassActive, passPlans } from '../pass';

describe('findPassPlan', () => {
  it('按 plan id 查得到', () => {
    expect(findPassPlan('annual')?.price).toBe(19);
  });

  it('按中文与英文方案名都查得到，且大小写不敏感', () => {
    expect(findPassPlan('年付')?.id).toBe('annual');
    expect(findPassPlan('LIFETIME')?.id).toBe('lifetime');
    expect(findPassPlan('Monthly')?.id).toBe('monthly');
  });

  it('查不到时返回 undefined，不抛错', () => {
    expect(findPassPlan('enterprise')).toBeUndefined();
    expect(findPassPlan('')).toBeUndefined();
    expect(findPassPlan(null)).toBeUndefined();
  });
});

describe('getPassCoverage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('月付顺延一个月', () => {
    expect(getPassCoverage('monthly', '2026-03-10T08:00:00.000Z'))
      .toEqual({ kind: 'until', expiresAt: '2026-04-10T08:00:00.000Z' });
  });

  it('年付顺延十二个月', () => {
    expect(getPassCoverage('annual', '2026-03-10T08:00:00.000Z'))
      .toEqual({ kind: 'until', expiresAt: '2027-03-10T08:00:00.000Z' });
  });

  it('月末下单要钳到目标月最后一天，不能溢出到下下个月', () => {
    // 1/31 直接 setMonth(+1) 会变成 3/3，等于白送两三天
    expect(getPassCoverage('monthly', '2026-01-31T00:00:00.000Z'))
      .toEqual({ kind: 'until', expiresAt: '2026-02-28T00:00:00.000Z' });
  });

  it('闰年的 2/29 也要钳对', () => {
    expect(getPassCoverage('annual', '2028-02-29T00:00:00.000Z'))
      .toEqual({ kind: 'until', expiresAt: '2029-02-28T00:00:00.000Z' });
  });

  it('跨年正确进位', () => {
    expect(getPassCoverage('monthly', '2026-12-15T00:00:00.000Z'))
      .toEqual({ kind: 'until', expiresAt: '2027-01-15T00:00:00.000Z' });
  });

  it('买断是永久', () => {
    expect(getPassCoverage('lifetime', '2026-03-10T08:00:00.000Z'))
      .toEqual({ kind: 'lifetime' });
  });

  it('未知档位按最短档兜底并告警，绝不当成永久', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // 只要这里退化成 { kind: 'lifetime' }，一条脏 billing_period
    // 就等于白送一个永久免费的全站会员
    expect(getPassCoverage('bogus-plan', '2026-03-10T08:00:00.000Z'))
      .toEqual({ kind: 'until', expiresAt: '2026-04-10T08:00:00.000Z' });
    expect(warn).toHaveBeenCalled();
  });

  it('起算时间缺失或非法时判为 unknown（不放行）', () => {
    expect(getPassCoverage('monthly', null)).toEqual({ kind: 'unknown' });
    expect(getPassCoverage('monthly', 'not-a-date')).toEqual({ kind: 'unknown' });
  });
});

describe('isPassActive', () => {
  const paidAt = '2026-03-10T08:00:00.000Z';

  it('有效期内为 true', () => {
    expect(isPassActive('monthly', paidAt, new Date('2026-04-09T08:00:00.000Z'))).toBe(true);
  });

  it('过期后为 false', () => {
    expect(isPassActive('monthly', paidAt, new Date('2026-04-11T08:00:00.000Z'))).toBe(false);
  });

  it('到期瞬间即失效', () => {
    expect(isPassActive('monthly', paidAt, new Date('2026-04-10T08:00:00.000Z'))).toBe(false);
  });

  it('买断在任何时间都有效', () => {
    expect(isPassActive('lifetime', paidAt, new Date('2099-01-01T00:00:00.000Z'))).toBe(true);
  });

  it('算不出覆盖范围时按无效处理', () => {
    expect(isPassActive('monthly', null)).toBe(false);
  });
});

describe('passPlans', () => {
  it('年付比按月付满一年便宜，否则年付档没有存在意义', () => {
    const monthly = passPlans.find((p) => p.id === 'monthly')!;
    const annual = passPlans.find((p) => p.id === 'annual')!;
    expect(annual.price).toBeLessThan(monthly.price * 12);
  });

  it('买断价高于年付价，避免出现「买断反而更便宜」的定价倒挂', () => {
    const annual = passPlans.find((p) => p.id === 'annual')!;
    const lifetime = passPlans.find((p) => p.id === 'lifetime')!;
    expect(lifetime.price).toBeGreaterThan(annual.price);
  });

  it('权益文案不得再承诺「全部应用都能在浏览器直接打开」', () => {
    // 12 款产品里只有 4 款真的能在浏览器打开，定价页是支付宝签约审核会逐页核对的地方
    const allFeatures = passPlans.flatMap((p) => p.features.map((f) => f.zh));
    expect(allFeatures.some((f) => f.includes('无需下载'))).toBe(false);
    expect(allFeatures.some((f) => f.includes('解锁全部站内应用'))).toBe(false);
  });
});

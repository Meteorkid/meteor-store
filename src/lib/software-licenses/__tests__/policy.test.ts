import { describe, expect, it } from 'vitest';
import { calculateSoftwareCoverage, requireActiveCoverage } from '../policy';

describe('桌面授权期限', () => {
  it('一份来源只累计一次，月末按日历月钳制', () => {
    const grant = { id: 'source', kind: 'monthly' as const, grantedAt: '2027-01-31T12:00:00.000Z' };
    expect(calculateSoftwareCoverage([grant, grant])).toEqual({ kind: 'monthly', expiresAt: '2027-02-28T12:00:00.000Z' });
  });
  it('提前续费保留余期，过期后重买从付款时起算', () => {
    expect(calculateSoftwareCoverage([
      { id: 'a', kind: 'monthly', grantedAt: '2027-01-01T00:00:00.000Z' },
      { id: 'b', kind: 'annual', grantedAt: '2027-01-15T00:00:00.000Z' },
    ])).toEqual({ kind: 'annual', expiresAt: '2028-02-01T00:00:00.000Z' });
    expect(calculateSoftwareCoverage([
      { id: 'a', kind: 'monthly', grantedAt: '2027-01-01T00:00:00.000Z' },
      { id: 'b', kind: 'monthly', grantedAt: '2027-03-15T00:00:00.000Z' },
    ])?.expiresAt).toBe('2027-04-15T00:00:00.000Z');
  });
  it('买断不会被后续月付降级', () => {
    expect(calculateSoftwareCoverage([
      { id: 'a', kind: 'lifetime', grantedAt: '2027-01-01T00:00:00.000Z' },
      { id: 'b', kind: 'monthly', grantedAt: '2027-02-01T00:00:00.000Z' },
    ])).toEqual({ kind: 'lifetime', expiresAt: null });
  });
  it('截止秒以前可用，恰好到期即拒绝，无来源不能变永久', () => {
    const coverage = { kind: 'monthly' as const, expiresAt: '2027-02-01T00:00:00.000Z' };
    expect(requireActiveCoverage(coverage, new Date('2027-01-31T23:59:59.999Z'))).toEqual(coverage);
    expect(() => requireActiveCoverage(coverage, new Date(coverage.expiresAt))).toThrow('授权已到期');
    expect(() => requireActiveCoverage(null, new Date())).toThrow('授权已撤销');
  });
});

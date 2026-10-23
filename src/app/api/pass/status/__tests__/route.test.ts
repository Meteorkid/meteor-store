import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  rows: [] as Record<string, unknown>[][],
  session: { userId: 'pass-owner', email: 'pass@example.test', emailVerified: true } as unknown,
  queryError: false,
  queries: 0,
}));
vi.mock('@/lib/db', () => ({ db: { select: () => {
  mocks.queries += 1;
  const query = {
    from: () => query, leftJoin: () => query, innerJoin: () => query,
    where: async () => {
      if (mocks.queryError) throw new Error('fixture database unavailable');
      return mocks.rows.shift() ?? [];
    },
  };
  return query;
} } }));
vi.mock('@/lib/auth', () => ({ getSession: async () => mocks.session }));

import { products } from '@/data/products';
import { getUserEntitlements, getUserEntitlementSummary } from '@/lib/entitlements';
import { GET } from '../route';

const order = (plan: string, paidAt = '2026-10-01T00:00:00.000Z') => ({
  productId: 'meteor-pass', planName: plan, planId: plan, billingPeriod: plan, paidAt,
  deliveryStatus: 'emailed', licenseStatus: 'active',
});
const queueOrders = (rows: Record<string, unknown>[]) => mocks.rows.push(rows, []);

beforeEach(() => {
  mocks.rows.length = 0;
  mocks.queryError = false;
  mocks.queries = 0;
  mocks.session = { userId: 'pass-owner', email: 'pass@example.test', emailVerified: true };
  vi.stubEnv('ADMIN_EMAILS', '');
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-23T00:00:00.000Z'));
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); });

describe('真实权益计算与 Pass 状态接口契约', () => {
  it.each([
    ['monthly', '2026-11-01T00:00:00.000Z'],
    ['annual', '2027-10-01T00:00:00.000Z'],
    ['lifetime', null],
  ])('%s 持有状态独立于展开后的产品授权', async (plan, expiresAt) => {
    queueOrders([order(plan!)]);
    const summary = await getUserEntitlementSummary('pass-owner', 'pass@example.test');
    expect(summary.entitlements).toHaveLength(products.length);
    expect(summary.entitlements.some(item => item.productId === 'meteor-pass')).toBe(false);
    expect(summary.activePass).toEqual({ planId: plan, expiresAt });
    queueOrders([order(plan!)]);
    const response = await GET();
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).toEqual({ userId: 'pass-owner', hasPass: true, currentPlan: plan, expiresAt });
  });

  it('全部产品已单独拥有时，真实 Pass 仍然可见', async () => {
    const owned = products.map(product => ({
      productId: product.id, planName: 'Pro', planId: product.id === 'tollow' ? 'pro' : null,
      billingPeriod: 'lifetime', paidAt: '2026-09-01T00:00:00.000Z', deliveryStatus: 'not_required', licenseStatus: null,
    }));
    queueOrders([...owned, order('annual')]);
    const summary = await getUserEntitlementSummary('pass-owner', 'pass@example.test');
    expect(summary.entitlements.every(item => !item.viaPass)).toBe(true);
    expect(summary.activePass?.planId).toBe('annual');
    queueOrders([...owned, order('annual')]);
    expect(await (await GET()).json()).toMatchObject({ hasPass: true, currentPlan: 'annual' });
  });

  it('邀请码与订单合并计算期限', async () => {
    mocks.rows.push([order('annual')], [{ productId: 'meteor-pass', planId: 'monthly', planName: '月付', redeemedAt: '2026-10-15T00:00:00.000Z' }]);
    expect(await (await GET()).json()).toMatchObject({ hasPass: true, expiresAt: '2027-11-01T00:00:00.000Z' });
  });

  it.each(['none', 'expired', 'revoked'])('%s 不产生虚构会员', async kind => {
    queueOrders(kind === 'none' ? [] : kind === 'expired'
      ? [order('monthly', '2020-01-01T00:00:00.000Z')]
      : [{ ...order('annual'), licenseStatus: 'revoked' }]);
    const response = await GET();
    expect(await response.json()).toEqual({ userId: 'pass-owner', hasPass: false, currentPlan: null, expiresAt: null });
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });

  it('游客响应不携带旧账号状态且禁止缓存', async () => {
    mocks.session = null;
    const response = await GET();
    expect(await response.json()).toEqual({ userId: null, hasPass: false, currentPlan: null, expiresAt: null });
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });

  it('读取失败返回503，不伪装成未持有会员', async () => {
    mocks.queryError = true;
    const response = await GET();
    expect(response.status).toBe(503);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).not.toHaveProperty('hasPass');
  });

  it.each([false, true])('管理员的全部产品权限与真实Pass（%s）分开', async hasPass => {
    vi.stubEnv('ADMIN_EMAILS', 'pass@example.test');
    queueOrders(hasPass ? [order('annual')] : []);
    const summary = await getUserEntitlementSummary('pass-owner', 'pass@example.test');
    expect(summary.entitlements).toHaveLength(products.length);
    expect(summary.entitlements.every(item => !item.viaPass && item.expiresAt === null)).toBe(true);
    expect(summary.activePass?.planId ?? null).toBe(hasPass ? 'annual' : null);
  });

  it('商业查询故障不影响管理员原有全部产品权限，普通用户仍拒绝放行', async () => {
    vi.stubEnv('ADMIN_EMAILS', 'pass@example.test');
    mocks.queryError = true;
    const entitlements = await getUserEntitlements('pass-owner', 'pass@example.test');
    expect(entitlements).toHaveLength(products.length);
    expect(entitlements.every(item => !item.viaPass && item.expiresAt === null)).toBe(true);
    expect(mocks.queries).toBe(0);
    await expect(getUserEntitlements('ordinary-owner', 'ordinary@example.test')).rejects.toThrow('fixture database unavailable');
    expect(mocks.queries).toBe(2);
  });
});

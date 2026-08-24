import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  session: null as null | { userId: string; email: string; emailVerified: true },
  entitlements: [] as Array<Record<string, unknown>>,
}));

vi.mock('../auth', () => ({ getSession: async () => state.session }));
vi.mock('../entitlements', () => ({
  getUserEntitlements: async () => state.entitlements,
}));

import { getTollowAccess, requireTollowPro } from '../tollow-access';

const entitlement = (overrides: Record<string, unknown> = {}) => ({
  productId: 'tollow',
  productName: 'Tollow',
  planId: 'pro',
  planName: 'Pro',
  billingPeriod: 'lifetime',
  paidAt: '2026-08-24T00:00:00.000Z',
  expiresAt: null,
  viaPass: false,
  passPlanId: null,
  ...overrides,
});

describe('Tollow 套餐权限', () => {
  beforeEach(() => {
    state.session = { userId: 'U1', email: 'user@example.com', emailVerified: true };
    state.entitlements = [];
  });

  it('识别 Free、历史 Pro、Pass 与管理员来源', async () => {
    state.entitlements = [entitlement({ planId: 'free', planName: 'Free' })];
    await expect(getTollowAccess('U1', 'user@example.com')).resolves.toEqual({ level: 'free', source: 'order' });

    state.entitlements = [entitlement({ planId: null, planName: 'Pro' })];
    await expect(getTollowAccess('U1', 'user@example.com')).resolves.toEqual({ level: 'pro', source: 'order' });

    state.entitlements = [entitlement({ planName: 'Meteor Pass', viaPass: true })];
    await expect(getTollowAccess('U1', 'user@example.com')).resolves.toEqual({ level: 'pro', source: 'pass' });

    state.entitlements = [entitlement({ planName: '管理员' })];
    await expect(getTollowAccess('U1', 'user@example.com')).resolves.toEqual({ level: 'pro', source: 'admin' });
  });

  it('未登录返回 401，Free 返回稳定 403 错误码', async () => {
    state.session = null;
    const unauthorized = await requireTollowPro();
    expect(unauthorized.ok).toBe(false);
    if (!unauthorized.ok) expect(unauthorized.response.status).toBe(401);

    state.session = { userId: 'U1', email: 'user@example.com', emailVerified: true };
    state.entitlements = [entitlement({ planId: 'free', planName: 'Free' })];
    const forbidden = await requireTollowPro();
    expect(forbidden.ok).toBe(false);
    if (!forbidden.ok) {
      expect(forbidden.response.status).toBe(403);
      await expect(forbidden.response.json()).resolves.toMatchObject({ code: 'TOLLOW_PRO_REQUIRED' });
    }
  });

  it('Pro 返回可信会话', async () => {
    state.entitlements = [entitlement()];
    const allowed = await requireTollowPro();
    expect(allowed.ok).toBe(true);
    if (allowed.ok) expect(allowed.session.userId).toBe('U1');
  });
});

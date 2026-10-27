import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AdminUserSummary } from '@/lib/admin-users';

const mocks = vi.hoisted(() => ({ locale: 'zh' }));
vi.mock('next-intl', () => ({ useLocale: () => mocks.locale, useTranslations: () => (key: string) => key }));
vi.mock('../AuthProvider', () => ({ useAuth: () => ({ user: { id: 'operator', emailVerified: true }, loading: false }) }));
import UserManager from '../UserManager';
import SoftwareLicensePanel from '../SoftwareLicensePanel';

const user: AdminUserSummary = {
  id: 'target', email: 'recipient@example.test', name: '收件用户', emailVerified: false,
  isStudent: false, totpEnabled: false, hasWechat: false, createdAt: '2026-10-26T12:00:00Z',
  isAdmin: false, pass: null, paidOrders: 0, totalSpentCny: 0, postCount: 0, commentCount: 0,
  redemptionCount: 0, activeTokens: 0,
};
const initial = { users: [user], total: 1, page: 1, pageSize: 25 };
beforeEach(() => { mocks.locale = 'zh'; });

describe('账号管理的定向赠码入口', () => {
  it('开关关闭不显示，启用后在账号操作区显示赠送入口', () => {
    const disabled = renderToStaticMarkup(<UserManager initial={initial} roster={[]} ownerId="operator" />);
    expect(disabled).not.toContain('赠送激活码');
    const enabled = renderToStaticMarkup(<UserManager initial={initial} roster={[]} ownerId="operator" softwareLicensingEnabled />);
    expect(enabled).toContain('赠送激活码');
    expect(enabled).toContain('recipient@example.test');
  });

  it('锁定选中账号邮箱，提示未验证但不提供隐式验证动作', () => {
    const html = renderToStaticMarkup(<SoftwareLicensePanel ownerId="operator" locale="zh" admin recipient={{ userId: user.id, email: user.email, emailVerified: false }} />);
    expect(html).toMatch(/<input[^>]*readOnly=""[^>]*value="recipient@example.test"/i);
    expect(html).toContain('此账号尚未验证邮箱');
    expect(html).toContain('software-licenses-target');
    expect(html).toContain('XNook + XIsland');
    expect(html).toContain('一个月');
    expect(html).toContain('一年');
    expect(html).toContain('永久');
  });

  it('英文账号列表有对应入口', () => {
    mocks.locale = 'en';
    const html = renderToStaticMarkup(<UserManager initial={initial} roster={[]} ownerId="operator" softwareLicensingEnabled />);
    expect(html).toContain('Gift activation codes');
  });
});

import { isValidElement, type ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
const state = vi.hoisted(() => ({
  user: null as null | { id: string; email: string; emailVerified?: true },
  push: vi.fn(), setters: [vi.fn(), vi.fn(), vi.fn()], index: 0,
}));
vi.mock('react', async original => ({ ...await original<typeof import('react')>(), useState: (initial: unknown) => [initial, state.setters[state.index++]] }));
vi.mock('next-intl', () => ({ useLocale: () => 'zh', useTranslations: () => (key: string) => key }));
vi.mock('@/i18n/navigation', () => ({ useRouter: () => ({ push: state.push }) }));
vi.mock('../AuthProvider', () => ({ useAuth: () => ({ user: state.user, loading: false }) }));
vi.mock('../PaymentModal', () => ({ default: () => null }));
import PricingCard from '../PricingCard';
function buy(node: unknown): ReactElement<{onClick: () => void; children?: unknown}> | undefined {
  if (Array.isArray(node)) return node.map(buy).find(Boolean);
  if (!isValidElement<{onClick: () => void; children?: unknown}>(node)) return;
  if (node.type === 'button' && node.props.children === 'buyNow') return node;
  return buy(node.props.children);
}
const purchase = (productId = 'meteor-pass') => buy(PricingCard({ name: '一个月', productId, productName: 'Meteor Pass', planId: 'monthly', price: 9, features: [] }))!.props.onClick();
beforeEach(() => { vi.clearAllMocks(); state.index = 0; state.user = null; });
describe('软件购买先确认账号身份', () => {
  it('游客先登录并回到真实Pass定价页，不打开注定被后端拒绝的付款表单', () => {
    purchase();
    expect(state.push).toHaveBeenCalledWith('/login?next=%2Fpricing');
    expect(state.setters[0]).not.toHaveBeenCalledWith(true);
  });
  it('单品游客登录后回到该产品定价区', () => {
    purchase('xnook');
    expect(state.push).toHaveBeenCalledWith('/login?next=%2Fproducts%2Fxnook%23pricing');
  });
  it('未验证账号先进入账户验证', () => {
    state.user = { id: 'buyer', email: 'buyer@example.test' }; purchase();
    expect(state.push).toHaveBeenCalledWith('/account');
    expect(state.setters[0]).not.toHaveBeenCalledWith(true);
  });
  it('已验证账号继续付款', () => {
    state.user = { id: 'buyer', email: 'buyer@example.test', emailVerified: true }; purchase();
    expect(state.setters[0]).toHaveBeenCalledWith(true); expect(state.push).not.toHaveBeenCalled();
  });
});

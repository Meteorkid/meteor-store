import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ pass: vi.fn(), paymentModal: vi.fn(), locale: 'zh' }));
vi.mock('../usePassStatus', () => ({ usePassStatus: mocks.pass }));
vi.mock('next-intl', () => ({ useLocale: () => mocks.locale, useTranslations: (namespace: string) => (key: string) => `${namespace}.${key}` }));
vi.mock('@/i18n/navigation', () => ({ Link: 'a', useRouter: () => ({ push: vi.fn() }) }));
vi.mock('../AuthProvider', () => ({ useAuth: () => ({ user: { id: 'owner-a' }, loading: false }) }));
vi.mock('../PaymentModal', () => ({ default: (props: unknown) => { mocks.paymentModal(props); return null; } }));
vi.mock('../RedeemDialog', () => ({ default: () => null }));

import PricingSection from '../PricingSection';
import ProductPricingCards from '../ProductPricingCards';
import PassOwnedBadge from '../PassOwnedBadge';

beforeEach(() => {
  mocks.locale = 'zh';
  mocks.paymentModal.mockClear();
  mocks.pass.mockReturnValue({ status: null, error: null, loading: false, retry: vi.fn() });
});
const renderPricing = () => renderToStaticMarkup(<PricingSection productCount={5} />);

describe('真实会员状态驱动购买引导', () => {
  it('期限展示改名仍通过稳定套餐ID下单，保留历史名称兼容', () => {
    renderPricing();
    expect(mocks.paymentModal.mock.calls.map(([props]) => ({ planId: props.planId, planName: props.planName }))).toEqual([
      { planId: 'monthly', planName: 'PricingSection.activation_monthly' },
      { planId: 'annual', planName: 'PricingSection.activation_annual' },
      { planId: 'lifetime', planName: 'PricingSection.activation_lifetime' },
    ]);
  });
  it('只展示三种激活期限，并把领取入口指向账户而非旧邀请码兑换', () => {
    const html = renderPricing();
    for (const kind of ['monthly', 'annual', 'lifetime']) expect(html).toContain(`PricingSection.activation_${kind}`);
    expect(html).toContain('href="/account#software-licenses"');
    expect(html).not.toContain('PricingSection.redeemCta');
    expect(html).not.toContain('href="/redeem"');
  });
  it.each(['zh', 'en'])('%s 年付用户可提前续月/年，买断仍可升级', locale => {
    mocks.locale = locale;
    mocks.pass.mockReturnValue({ status: { hasPass: true, currentPlan: 'annual', expiresAt: '2027-10-01T00:00:00.000Z' }, loading: false, error: null, retry: vi.fn() });
    const html = renderPricing();
    expect(html).toContain('PricingCard.renew');
    expect(html).toContain('PricingCard.upgrade');
    expect(html).not.toContain('PricingCard.buyNow');
    expect(html.match(/<button[^>]* disabled=""/g) ?? []).toHaveLength(0);
  });

  it('永久用户无需再购买月年授权', () => {
    mocks.pass.mockReturnValue({ status: { hasPass: true, currentPlan: 'lifetime', expiresAt: null }, loading: false, error: null, retry: vi.fn() });
    const html = renderPricing();
    expect(html.match(/<button[^>]* disabled=""/g)).toHaveLength(3);
    expect(html).not.toContain('PricingCard.renew');
  });

  it.each(['loading', 'failed'] as const)('%s 时不把未知会员状态渲染成可购买', phase => {
    mocks.pass.mockReturnValue({ status: null, loading: phase === 'loading', error: phase === 'failed' ? 'failed' : null, retry: vi.fn() });
    const html = renderPricing();
    expect(html.match(/<button[^>]* disabled=""/g)).toHaveLength(3);
    expect(html).not.toContain('PricingCard.buyNow');
    expect(html).toContain(`PassStatus.${phase === 'loading' ? 'checking' : 'unavailable'}`);
    if (phase === 'failed') { expect(html).toContain('PassStatus.failed'); expect(html).toContain('PassStatus.retry'); }
  });

  it('产品购买同样受查询失败保护，免费领取仍可用', () => {
    mocks.pass.mockReturnValue({ status: null, loading: false, error: 'failed', retry: vi.fn() });
    const html = renderToStaticMarkup(<ProductPricingCards productId="xisland" productName="XIsland" plans={[
      { id: 'free', name: '免费版', price: 0, features: [] },
      { id: 'pro', name: '买断', price: 12, features: [] },
    ]} />);
    expect(html.match(/<button[^>]* disabled=""/g)).toHaveLength(1);
    expect(html).toContain('PricingCard.claimFree');
    expect(html).toContain('PassStatus.unavailable');
  });

  it('徽标不保留已注销或失效的会员信息', () => {
    mocks.pass.mockReturnValue({ status: { hasPass: true, currentPlan: 'lifetime' }, loading: false, error: null, retry: vi.fn() });
    expect(renderToStaticMarkup(<PassOwnedBadge />)).toContain('PassOwnedBadge.badge');
    mocks.pass.mockReturnValue({ status: null, loading: false, error: null, retry: vi.fn() });
    expect(renderToStaticMarkup(<PassOwnedBadge />)).toBe('');
  });
});

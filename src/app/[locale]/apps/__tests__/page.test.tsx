import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import zh from '../../../../../messages/zh.json';
import en from '../../../../../messages/en.json';

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  getUserEntitlementSummary: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ getSession: mocks.getSession }));
vi.mock('@/lib/entitlements', () => ({ getUserEntitlementSummary: mocks.getUserEntitlementSummary }));
vi.mock('@/components/Header', () => ({ default: () => null }));
vi.mock('@/components/Footer', () => ({ default: () => null }));
vi.mock('@/i18n/navigation', () => ({ Link: 'a' }));
vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getTranslations: vi.fn(async ({ locale }: { locale: string }) => {
    const messages = locale === 'en' ? en.MyAppsPage : zh.MyAppsPage;
    return (key: keyof typeof messages) => messages[key];
  }),
}));

import MyAppsPage from '../page';

describe('我的产品按实际使用方式提供入口', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getSession.mockResolvedValue({ userId: 'user-1', email: 'user@example.com' });
    mocks.getUserEntitlementSummary.mockResolvedValue({ entitlements: [], passExpiredAt: null });
  });

  it.each([
    ['xisland', '/products/xisland#download', '下载', 'Download'],
    ['xnook', '/products/xnook#download', '下载', 'Download'],
    ['statux', '/products/statux#download', '下载', 'Download'],
    ['claude-phone-control', '/products/claude-phone-control', '查看产品', 'View product'],
    ['cursor-source-analyzer', '/products/cursor-source-analyzer', '查看产品', 'View product'],
    ['ex-memory', '/apps/ex-memory', '开始使用', 'Launch'],
    ['webgl-fluid-sim', '/apps/webgl-fluid-sim', '开始使用', 'Launch'],
    ['skeleton-anatomy', '/apps/skeleton-anatomy', '开始使用', 'Launch'],
    ['chakra-visualizer', '/apps/chakra-visualizer', '开始使用', 'Launch'],
    ['tollow', '/apps/tollow', '开始使用', 'Launch'],
  ])('%s 指向可用入口并显示对应操作', async (productId, href, zhLabel, enLabel) => {
    mocks.getUserEntitlementSummary.mockResolvedValue({
      entitlements: [{ productId, productName: productId, planName: 'Pro', viaPass: false }],
      passExpiredAt: null,
    });

    for (const [locale, label] of [['zh', zhLabel], ['en', enLabel]]) {
      const page = await MyAppsPage({ params: Promise.resolve({ locale }) });
      const html = renderToStaticMarkup(page);
      expect(html).toContain(`href="${href}"`);
      expect(html).toContain(`>${label}</a>`);
    }
  });

  it('未登录时保留我的产品返回地址', async () => {
    mocks.getSession.mockResolvedValue(null);
    const page = await MyAppsPage({ params: Promise.resolve({ locale: 'zh' }) });

    expect(renderToStaticMarkup(page)).toContain('href="/login?next=%2Fapps"');
    expect(mocks.getUserEntitlementSummary).not.toHaveBeenCalled();
  });
});

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import zh from '../../../messages/zh.json';
import en from '../../../messages/en.json';
import { localizeProduct, products } from '@/data/products';
import { getHelpArticle } from '@/data/help';

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getTranslations: async (options: string | { locale: string; namespace: string }) => {
    const locale = typeof options === 'string' ? 'zh' : options.locale;
    const namespace = typeof options === 'string' ? options : options.namespace;
    const messages = (locale === 'en' ? en : zh) as unknown as Record<string, Record<string, string>>;
    return (key: string, values: Record<string, string> = {}) => (
      messages[namespace][key].replace(/\{(\w+)\}/g, (_, name: string) => values[name] ?? name)
    );
  },
}));
vi.mock('@/i18n/navigation', () => ({ Link: 'a' }));
vi.mock('@/components/TransitionLink', () => ({ default: 'a' }));
vi.mock('@/components/Header', () => ({ default: () => null }));
vi.mock('@/components/Footer', () => ({ default: () => null }));
vi.mock('@/components/ProductVisual', () => ({ default: () => null }));
vi.mock('@/components/ProductGallery', () => ({ default: () => null }));
vi.mock('@/components/InstallCommand', () => ({ default: () => null }));
vi.mock('@/components/DownloadSection', () => ({ default: () => null }));
vi.mock('@/components/ProductDemoEmbed', () => ({ default: () => null }));
vi.mock('@/components/PassOwnedBadge', () => ({ default: () => null }));
vi.mock('@/components/ProductPricingCards', () => ({
  default: () => <div data-testid="purchase-plans" />,
}));
vi.mock('@/lib/product-updates/catalog', () => ({
  getProductWithCurrentDownloads: async (id: string) => products.find((product) => product.id === id),
}));
vi.mock('@/lib/constants', () => ({ SHOW_PRICING: true, ANNUAL_DISCOUNT: 0.8, OPERATOR: {} }));

import ProductCard from '../ProductCard';
import ProductPage from '@/app/[locale]/products/[id]/page';
import PrivacyPage from '@/app/[locale]/privacy/page';

describe('Ex-Memory 试用、商业状态与数据处理说明', () => {
  const product = products.find((item) => item.id === 'ex-memory')!;

  it('开放试用仍保留后端禁售状态，卡片不再说整款产品尚未上线', async () => {
    expect(product.status).toBe('coming_soon');
    expect(product.experienceUrl).toBe('/apps/ex-memory');
    const html = renderToStaticMarkup(await ProductCard({ product: localizeProduct(product, 'zh') }));
    expect(html).toContain(zh.ProductsPage.trialAvailable);
    expect(html).not.toContain(zh.ProductsPage.comingSoon);
  });

  it.each(['zh', 'en'] as const)('%s 详情提供试用和数据流说明，隐藏尚未交付的购买方案', async (locale) => {
    const messages = locale === 'zh' ? zh : en;
    const html = renderToStaticMarkup(await ProductPage({
      params: Promise.resolve({ locale, id: 'ex-memory' }),
      searchParams: Promise.resolve({}),
    }));
    expect(html).toContain('href="/apps/ex-memory"');
    expect(html).toContain('href="/docs/ex-memory-first-import"');
    expect(html).toContain('href="/privacy#ex-memory"');
    expect(html).toContain(messages.ProductDetailPage.exMemoryPrivacy);
    expect(html).toContain(messages.ProductDetailPage.trialAvailable);
    expect(html).not.toContain('data-testid="purchase-plans"');
    expect(html).not.toContain(messages.ProductDetailPage.comingSoon);
    expect(html).not.toContain(messages.ProductDetailPage.readyDesc.replace('{name}', 'Ex-Memory'));
  });

  it.each(['zh', 'en'] as const)('%s 首用帮助与隐私声明可在关闭销售时阅读', async (locale) => {
    const messages = locale === 'zh' ? zh : en;
    const guide = getHelpArticle(locale, 'ex-memory-first-import');
    expect(guide?.commercial).toBe(false);
    expect(guide?.content).toContain('/privacy#ex-memory');
    const html = renderToStaticMarkup(await PrivacyPage({ params: Promise.resolve({ locale }) }));
    expect(html).toContain('id="ex-memory"');
    expect(html).toContain(messages.PrivacyPage.exMemoryContent);
    expect(html).toContain(messages.PrivacyPage.exMemoryDelete);
  });
});

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
    expect(product.pricing.every((plan) => plan.price === 0)).toBe(true);
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
    expect(html).toContain(messages.ProductDetailPage.exMemorySetup);
    expect(html).toContain(messages.ProductDetailPage.exMemoryPrivacy);
    expect(html).toContain(messages.ProductDetailPage.trialAvailable);
    expect(html).toContain(messages.ProductDetailPage.exMemoryTrialAvailableDesc);
    expect(html).toContain(messages.ProductDetailPage.exMemoryStartDesc);
    expect(html).not.toContain(messages.ProductDetailPage.trialAvailableDesc.replace('{name}', 'Ex-Memory'));
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
    expect(html).toContain(messages.PrivacyPage.exMemoryKeys);
    expect(html).toContain(messages.PrivacyPage.exMemoryDelete);
  });

  it.each([
    {
      locale: 'zh' as const,
      sequence: '登录 → 账号模型设置 → 导入示例或资料 → 对话',
      accountBilling: '服务商按你的账户计费，本站不代供模型额度',
      keyStorage: 'API Key 在服务器上加密保存，设置页只显示末 4 位',
      embeddingProviders: '内置文本向量服务支持 SiliconFlow 和 OpenAI',
      customProvider: '自定义 OpenAI 兼容服务',
      customAddress: '公网 HTTPS API 地址',
      customKeyScope: 'API Key 只发送给对应地址',
      indexLock: '已有索引会锁定文本向量服务与模型',
      outdatedCredits: '试用可用额度以应用内显示为准',
    },
    {
      locale: 'en' as const,
      sequence: 'Sign in → Account model settings → Import an example or records → Chat',
      accountBilling: 'Your selected providers bill model usage to your accounts. This site does not supply model credits.',
      keyStorage: 'API keys are encrypted on the server, and settings show only the last four characters',
      embeddingProviders: 'built-in embedding providers include SiliconFlow and OpenAI',
      customProvider: 'custom OpenAI-compatible service',
      customAddress: 'public HTTPS API URL',
      customKeyScope: 'Each API key is sent only to its corresponding address',
      indexLock: 'Existing indexes lock the embedding provider and model',
      outdatedCredits: 'Available trial credits are shown in the app',
    },
  ])('$locale 首用帮助说明账号自有模型、费用、密钥保存与索引限制', ({ locale, sequence, accountBilling, keyStorage, embeddingProviders, customProvider, customAddress, customKeyScope, indexLock, outdatedCredits }) => {
    const content = getHelpArticle(locale, 'ex-memory-first-import')!.content;
    expect(content).toContain(sequence);
    expect(content).toContain(accountBilling);
    expect(content).toContain(keyStorage);
    expect(content).toContain(embeddingProviders);
    expect(content).toContain(customProvider);
    expect(content).toContain(customAddress);
    expect(content).toContain(customKeyScope);
    expect(content).toContain(indexLock);
    expect(content).not.toContain(outdatedCredits);
  });
});

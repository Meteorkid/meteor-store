import type { Locale } from '@/i18n/routing';

export type HelpCategory = 'getting-started' | 'account' | 'products' | 'community' | 'tools' | 'support';

export type HelpArticleKind = 'tutorial' | 'how-to' | 'troubleshooting' | 'policy';

interface LocalizedText {
  zh: string;
  en: string;
}

interface LocalizedKeywords {
  zh: string[];
  en: string[];
}

export interface HelpCategoryMeta {
  id: HelpCategory;
  order: number;
  label: LocalizedText;
}

export interface HelpArticleMeta {
  slug: string;
  category: HelpCategory;
  kind: HelpArticleKind;
  order: number;
  readingMinutes: number;
  updatedAt: string;
  featured?: boolean;
  commercial: boolean;
  relatedSlugs: string[];
  title: LocalizedText;
  excerpt: LocalizedText;
  keywords: LocalizedKeywords;
}

export interface LocalizedHelpArticle {
  slug: string;
  category: HelpCategory;
  kind: HelpArticleKind;
  order: number;
  readingMinutes: number;
  updatedAt: string;
  featured?: boolean;
  commercial: boolean;
  relatedSlugs: string[];
  title: string;
  excerpt: string;
  keywords: string[];
}

export const helpCategories: HelpCategoryMeta[] = [
  {
    id: 'getting-started',
    order: 1,
    label: { zh: '初识与导航', en: 'Getting Started' },
  },
  {
    id: 'account',
    order: 2,
    label: { zh: '账户与资格', en: 'Account & Eligibility' },
  },
  {
    id: 'products',
    order: 3,
    label: { zh: '产品获取与使用', en: 'Products & Access' },
  },
  {
    id: 'community',
    order: 4,
    label: { zh: '博客与社区', en: 'Blog & Community' },
  },
  {
    id: 'tools',
    order: 5,
    label: { zh: '在线工具', en: 'Online Tools' },
  },
  {
    id: 'support',
    order: 6,
    label: { zh: '售后与支持', en: 'Support & Policies' },
  },
];

export const helpArticles: HelpArticleMeta[] = [
  {
    slug: 'macos-cannot-open-app',
    category: 'products',
    kind: 'troubleshooting',
    order: 10,
    readingMinutes: 3,
    updatedAt: '2026-08-09',
    commercial: false,
    relatedSlugs: [],
    title: { zh: 'macOS 下载后无法打开应用怎么办？', en: 'What if a downloaded app will not open on macOS?' },
    excerpt: {
      zh: '了解 macOS 安全提示的原因，以及使用"仍要打开"的安全处理步骤。',
      en: 'Learn why macOS shows security warnings and how to use Open Anyway safely.',
    },
    keywords: {
      zh: ['macOS', '无法打开', '隐私与安全性', '仍要打开', 'Gatekeeper'],
      en: ['macOS', 'cannot open', 'Privacy & Security', 'Open Anyway', 'Gatekeeper'],
    },
  },
  {
    slug: 'get-product-after-purchase',
    category: 'products',
    kind: 'how-to',
    order: 20,
    readingMinutes: 3,
    updatedAt: '2026-08-09',
    commercial: false,
    relatedSlugs: [],
    title: { zh: '购买后如何获取产品？', en: 'How do I access a product after purchase?' },
    excerpt: {
      zh: '从支付成功页、邮件、订单记录和"我的产品"找到购买内容。',
      en: 'Find your purchase from the payment result, email, order history, or My Products.',
    },
    keywords: {
      zh: ['购买', '交付', '下载', '我的产品', '订单', '邮件'],
      en: ['purchase', 'delivery', 'download', 'My Products', 'order', 'email'],
    },
  },
  {
    slug: 'use-license-key',
    category: 'products',
    kind: 'how-to',
    order: 30,
    readingMinutes: 3,
    updatedAt: '2026-08-09',
    commercial: false,
    relatedSlugs: [],
    title: { zh: '如何使用授权码？', en: 'How do I use a license key?' },
    excerpt: {
      zh: '了解在哪里查看授权码，以及哪些产品需要手动输入授权码。',
      en: 'Learn where to find your license key and when a product asks you to enter it.',
    },
    keywords: {
      zh: ['授权码', '激活码', '账户', '授权', '兑换'],
      en: ['license key', 'activation', 'account', 'license', 'redeem'],
    },
  },
  {
    slug: 'product-updates',
    category: 'products',
    kind: 'how-to',
    order: 40,
    readingMinutes: 2,
    updatedAt: '2026-08-09',
    commercial: false,
    relatedSlugs: [],
    title: { zh: '如何获取产品更新？', en: 'How do I get product updates?' },
    excerpt: {
      zh: '从产品页确认当前版本，并了解小版本与大版本更新的区别。',
      en: 'Check the current version on the product page and understand update eligibility.',
    },
    keywords: {
      zh: ['产品更新', '版本', '下载', '小版本', '大版本'],
      en: ['product updates', 'version', 'download', 'minor update', 'major update'],
    },
  },
  {
    slug: 'refund-policy',
    category: 'support',
    kind: 'policy',
    order: 10,
    readingMinutes: 2,
    updatedAt: '2026-08-09',
    commercial: false,
    relatedSlugs: [],
    title: { zh: '如何申请退款？', en: 'How do I request a refund?' },
    excerpt: {
      zh: '查看退款申请入口、所需订单信息和完整退款政策。',
      en: 'Find the refund request process, required order details, and full policy.',
    },
    keywords: {
      zh: ['退款', '退款政策', '订单号', '误购', '重复扣款'],
      en: ['refund', 'refund policy', 'order number', 'mistaken purchase', 'duplicate charge'],
    },
  },
  {
    slug: 'technical-support',
    category: 'support',
    kind: 'how-to',
    order: 20,
    readingMinutes: 2,
    updatedAt: '2026-08-09',
    commercial: false,
    relatedSlugs: [],
    title: { zh: '如何联系技术支持？', en: 'How do I contact technical support?' },
    excerpt: {
      zh: '提交清晰的问题信息，帮助我们更快复现并定位故障。',
      en: 'Send the details we need to reproduce and diagnose your issue faster.',
    },
    keywords: {
      zh: ['技术支持', '反馈', '问题', '错误提示', '联系方式'],
      en: ['technical support', 'feedback', 'issue', 'error message', 'contact'],
    },
  },
];

const categoryOrder = new Map(helpCategories.map((category) => [category.id, category.order]));

export function isHelpArticleVisible(
  article: Pick<HelpArticleMeta, 'commercial'>,
  showPricing: boolean,
): boolean {
  return showPricing || article.commercial !== true;
}

export function localizeHelpArticles(locale: Locale, showPricing = true): LocalizedHelpArticle[] {
  return helpArticles
    .filter((article) => isHelpArticleVisible(article, showPricing))
    .map((article) => ({
      slug: article.slug,
      category: article.category,
      kind: article.kind,
      order: article.order,
      readingMinutes: article.readingMinutes,
      updatedAt: article.updatedAt,
      featured: article.featured,
      commercial: article.commercial,
      relatedSlugs: article.relatedSlugs,
      title: article.title[locale],
      excerpt: article.excerpt[locale],
      keywords: [...article.keywords[locale]],
    }))
    .sort((a, b) => (
      (categoryOrder.get(a.category) ?? 0) - (categoryOrder.get(b.category) ?? 0)
      || a.order - b.order
    ));
}

export function findLocalizedHelpArticle(
  slug: string,
  locale: Locale,
): LocalizedHelpArticle | undefined {
  return localizeHelpArticles(locale).find((article) => article.slug === slug);
}

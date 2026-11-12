import type { LocalizedProduct } from '@/data/products';
import type { Locale } from '@/i18n/routing';
import { SITE_URL } from './constants';

/**
 * 结构化数据（JSON-LD）构造器。
 *
 * 集中放在这里而不是散在各个页面里，有两个原因：
 * 1. **可单测**。schema 的字段拼错、价格类型写成数字、@id 引用对不上，
 *    在浏览器里看不出来，只有搜索引擎静默忽略。这里每个构造器都有对应测试。
 * 2. **口径统一**。产品页和列表页对同一款产品必须给出同一个 `@id`，
 *    否则会被当成两个实体，权重互相稀释。
 *
 * 所有输出都必须过 `safeJsonLd()` 再进 `dangerouslySetInnerHTML`。
 */

/** 站点级实体 id，与 `[locale]/layout.tsx` 里 Organization 的 `@id` 必须逐字一致。 */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** schema.org 认可的应用类别。取值来自 product.category。 */
const APPLICATION_CATEGORY: Record<LocalizedProduct['category'], string> = {
  ai: 'DeveloperApplication',
  developer: 'DeveloperApplication',
  design: 'DesignApplication',
  utility: 'UtilitiesApplication',
};

/**
 * 从 `platforms` 里挑出真正的操作系统名。
 *
 * `platforms` 是给人看的展示标签，混着运行时（Python、CLI）、形态（Menu Bar）
 * 和技术栈（Three.js）。直接塞进 `operatingSystem` 会声明成
 * "operatingSystem: CLI"，这是错的信息，比不写更糟——搜索引擎会据此
 * 把产品归到错误的操作系统下。所以只认白名单前缀，认不出就整体省略该字段。
 *
 * 用前缀匹配是因为真实取值带版本号（`macOS 14.2+`）。
 */
const OS_PREFIXES = ['macOS', 'Windows', 'Linux', 'iOS', 'Android'] as const;

function deriveOperatingSystems(platforms: string[]): string[] {
  const matched = new Set<string>();
  for (const platform of platforms) {
    for (const os of OS_PREFIXES) {
      if (platform.startsWith(os)) {
        matched.add(os);
        break;
      }
    }
  }
  return [...matched];
}

export type ProductSchemaInput = {
  product: LocalizedProduct;
  locale: Locale;
  /**
   * 定价区块是否对外可见。关闭时不下发 offer —— 声明一个页面上不存在的价格，
   * 是「结构化数据与可见内容不符」，属于搜索引擎明确会处罚的情形。
   */
  showPricing: boolean;
};

/**
 * 产品页的 `SoftwareApplication` 结构化数据。
 *
 * **刻意不包含 `aggregateRating` / `review`**：本站没有真实的评分数据，
 * 编造一个分数会构成垃圾结构化数据（spammy structured markup），
 * 一旦被识别，惩罚是整站富媒体结果资格被撤，代价远大于收益。
 * 等真有用户评价数据（且可在页面上看到）再加。
 */
export function buildProductSchema({ product, locale, showPricing }: ProductSchemaInput) {
  const url = `${SITE_URL}/${locale}/products/${product.id}`;
  const operatingSystems = deriveOperatingSystems(product.platforms);
  const version = product.downloads?.find((download) => download.version)?.version;

  // 取最低价作为代表价。当前全站限时免费（price: 0），所以这里实际得到的是
  // 「免费」声明 + isAccessibleForFree: true，这是事实，不是营销话术。
  const sellable = product.status !== 'coming_soon' && product.pricing.length > 0;
  const lowestPrice = sellable
    ? Math.min(...product.pricing.map((plan) => plan.price))
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${url}#software`,
    name: product.name,
    description: product.description,
    url,
    applicationCategory: APPLICATION_CATEGORY[product.category],
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en',
    publisher: { '@id': ORGANIZATION_ID },
    ...(operatingSystems.length > 0 ? { operatingSystem: operatingSystems.join(', ') } : {}),
    // 版本号取自下载目录（线上真源），不是源码兜底值，所以能反映用户实际拿到的包
    ...(version ? { softwareVersion: version } : {}),
    ...(product.github ? { codeRepository: product.github } : {}),
    ...(showPricing && lowestPrice !== undefined
      ? {
          isAccessibleForFree: lowestPrice === 0,
          offers: {
            '@type': 'Offer',
            price: String(lowestPrice),
            priceCurrency: 'CNY',
            availability: 'https://schema.org/InStock',
            url: `${url}#pricing`,
          },
        }
      : {}),
  };
}

export type BreadcrumbItem = { name: string; url: string };

/**
 * 面包屑结构化数据。
 *
 * 层级必须与页面上真实可见的导航层级一致，不要为了多塞几个关键词
 * 造出页面里不存在的中间层。
 *
 * `item` 省略最后一项是可接受的（Google 允许最后一项不带 URL），
 * 但这里统一带上，因为本站所有层级都有真实可访问地址。
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

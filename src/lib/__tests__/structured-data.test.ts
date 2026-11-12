import { describe, expect, it } from 'vitest';
import { products, localizeProduct, type LocalizedProduct } from '@/data/products';
import type { Locale } from '@/i18n/routing';
import { SITE_URL } from '../constants';
import {
  ORGANIZATION_ID,
  buildBreadcrumbSchema,
  buildProductSchema,
} from '../structured-data';

/** 取真实产品，避免测试里手搓一个与线上字段形状不符的假对象。 */
function realProduct(id: string, locale: Locale = 'zh'): LocalizedProduct {
  const found = products.find((item) => item.id === id);
  if (!found) throw new Error(`测试基准产品不存在: ${id}`);
  return localizeProduct(found, locale);
}

describe('buildProductSchema', () => {
  it('输出 SoftwareApplication 并用 @id 指回站点实体', () => {
    const schema = buildProductSchema({
      product: realProduct('xisland'),
      locale: 'zh',
      showPricing: true,
    });
    expect(schema['@type']).toBe('SoftwareApplication');
    expect(schema['@id']).toBe(`${SITE_URL}/zh/products/xisland#software`);
    expect(schema.url).toBe(`${SITE_URL}/zh/products/xisland`);
    // 指回 Organization 而不是重复声明一个发布者，实体图才连得上
    expect(schema.publisher).toEqual({ '@id': ORGANIZATION_ID });
  });

  it('绝不输出 aggregateRating / review —— 没有真实评分数据', () => {
    const schema = buildProductSchema({
      product: realProduct('xisland'),
      locale: 'zh',
      showPricing: true,
    });
    // 编造评分属垃圾结构化数据，会被撤销整站富媒体资格
    expect(schema).not.toHaveProperty('aggregateRating');
    expect(schema).not.toHaveProperty('review');
  });

  it('operatingSystem 只收真实操作系统，不把展示标签当系统名', () => {
    const xisland = buildProductSchema({
      product: realProduct('xisland'),
      locale: 'zh',
      showPricing: true,
    });
    // xisland 的 platforms 是 ['macOS','Menu Bar','AI Agent']，只有 macOS 是系统
    expect(xisland.operatingSystem).toBe('macOS');

    const omnicrawl = buildProductSchema({
      product: realProduct('omnicrawl'),
      locale: 'zh',
      showPricing: true,
    });
    // ['Python','CLI','API'] 里没有任何操作系统，整个字段省略而不是写 "CLI"
    expect(omnicrawl).not.toHaveProperty('operatingSystem');
  });

  it('带版本号的平台名归一为操作系统名', () => {
    // duocast 的 platforms 含 'macOS 14.2+'，前缀匹配后应为 'macOS'
    const duocast = buildProductSchema({
      product: realProduct('duocast'),
      locale: 'zh',
      showPricing: true,
    });
    expect(duocast.operatingSystem).toContain('macOS');
    expect(duocast.operatingSystem).not.toContain('14.2');
  });

  it('价格按字符串输出（schema.org 要求），当前限免即免费', () => {
    const schema = buildProductSchema({
      product: realProduct('xisland'),
      locale: 'zh',
      showPricing: true,
    });
    expect(schema.offers?.price).toBe('0');
    expect(typeof schema.offers?.price).toBe('string');
    expect(schema.offers?.priceCurrency).toBe('CNY');
    expect(schema.isAccessibleForFree).toBe(true);
  });

  it('定价关闭时不下发 offer —— 不能声明页面上不存在的价格', () => {
    const schema = buildProductSchema({
      product: realProduct('xisland'),
      locale: 'zh',
      showPricing: false,
    });
    expect(schema).not.toHaveProperty('offers');
    expect(schema).not.toHaveProperty('isAccessibleForFree');
    // 其余字段照常，不能因为关定价就整块丢掉
    expect(schema.name).toBe('XIsland');
  });

  it('coming_soon 产品即使开着定价也不声明在售', () => {
    const comingSoon = products.find((item) => item.status === 'coming_soon');
    if (!comingSoon) return; // 将来没有这类产品时本用例自动失效，不算失败
    const schema = buildProductSchema({
      product: localizeProduct(comingSoon, 'zh'),
      locale: 'zh',
      showPricing: true,
    });
    expect(schema).not.toHaveProperty('offers');
  });

  it('英文页用英文名与英文语言标记', () => {
    const schema = buildProductSchema({
      product: realProduct('xisland', 'en'),
      locale: 'en',
      showPricing: true,
    });
    expect(schema.inLanguage).toBe('en');
    expect(schema.url).toBe(`${SITE_URL}/en/products/xisland`);
    expect(schema.description).toBe(realProduct('xisland', 'en').description);
  });

  it('有 GitHub 仓库时输出 codeRepository，没有则不输出空字段', () => {
    expect(
      buildProductSchema({ product: realProduct('xisland'), locale: 'zh', showPricing: true })
        .codeRepository,
    ).toBe('https://github.com/Meteorkid/XIsland');

    // 从真实数据里挑一个没配仓库的产品，而不是写死 id —— 产品随时可能补上仓库地址
    const withoutRepo = products.find((item) => !item.github);
    if (!withoutRepo) return; // 全都配了仓库时本用例自动失效，不算失败
    const schema = buildProductSchema({
      product: localizeProduct(withoutRepo, 'zh'),
      locale: 'zh',
      showPricing: true,
    });
    expect(schema).not.toHaveProperty('codeRepository');
  });
});

describe('buildBreadcrumbSchema', () => {
  it('position 从 1 连续递增，且每项都带可访问 URL', () => {
    const schema = buildBreadcrumbSchema([
      { name: '首页', url: `${SITE_URL}/zh` },
      { name: '产品', url: `${SITE_URL}/zh/products` },
      { name: 'XIsland', url: `${SITE_URL}/zh/products/xisland` },
    ]);
    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement.map((item) => item.position)).toEqual([1, 2, 3]);
    expect(schema.itemListElement.every((item) => item.item.startsWith(SITE_URL))).toBe(true);
  });
});

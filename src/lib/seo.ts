import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import { SITE_URL } from './constants';

/**
 * 把 JS 对象序列化为可安全内嵌到 <script type="application/ld+json"> 的字符串。
 *
 * JSON.stringify 不转义 <、>、/,读者投稿标题若含 </script><script>...
 * 可在 HTML 解析器眼里闭合脚本块并注入恶意脚本。CSP nonce 是纵深防御,
 * 这里做代码级修复:把可能闭合标签的字符替换成 Unicode 转义。
 *
 * 仅用于 dangerouslySetInnerHTML 的 __html,不要用于普通文本渲染。
 */
export function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\//g, '\\u002f');
}

/**
 * canonical / hreflang 用的一组绝对地址。
 *
 * `xDefault` 指向默认语言（zh），供 `hreflang="x-default"` 使用——
 * 搜索引擎在读者语言不匹配任何 hreflang 时回退到它。
 */
export type AlternateUrls = {
  canonical: string;
  /** 内容路由必须由页面按真实文章/标签集合生成语言候选。 */
  languages: { zh: string; en: string; xDefault: string } | null;
};

/**
 * 由请求路径推导 canonical 与两种语言的对应地址。
 *
 * **站点同时以 www 与非 www 两个主机名可达**（nginx 已把非 www 301 到 www，
 * 但历史链接和爬虫缓存里两种都有），加上 /zh 与 /en 两套前缀，
 * 同一份内容最多有四个地址。canonical 一律钉在 `SITE_URL`（www）上，
 * 让搜索引擎知道该收哪个——缺了它，四份重复内容的处理方式通常是先都不收。
 *
 * 传入的 pathname 必须带 locale 前缀（`localePrefix: 'always'` 保证了这点）。
 * 认不出前缀时返回 null，**宁可不输出 canonical 也不要指错**：
 * 指错的 canonical 会让搜索引擎把这个页面并进别的页面，比没有更糟。
 */
export function buildAlternateUrls(pathname: string | null | undefined): AlternateUrls | null {
  if (!pathname || !pathname.startsWith('/')) return null;

  // 末尾斜杠归一：/zh/products/ 和 /zh/products 是同一个页面，
  // canonical 只能指一个，否则等于自己制造一份重复内容
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

  const [, first, ...rest] = clean.split('/');
  if (!routing.locales.includes(first as Locale)) return null;

  const suffix = rest.length > 0 ? `/${rest.join('/')}` : '';
  const forLocale = (locale: string) => `${SITE_URL}/${locale}${suffix}`;

  return {
    canonical: `${SITE_URL}${clean}`,
    languages: /^\/blog\/(?:p|tag)\/[^/]+$/.test(suffix) ? null : {
      zh: forLocale('zh'),
      en: forLocale('en'),
      xDefault: forLocale(routing.defaultLocale),
    },
  };
}

/**
 * 软 404 页面的标题。
 *
 * Next 的 catch-all 在本项目会让不存在的路径**返回 200**（已实测确认），
 * 只调 `notFound()` 而不给标题，页面会继承站点默认标题——看上去像首页。
 * 这种「标题是首页、内容是未找到」的页面一旦被索引，就是一条重复内容。
 *
 * 所以未找到分支必须同时做两件事：给一个明确的标题、下发 noindex。
 */
export function notFoundTitle(locale: string): string {
  return locale === 'en' ? 'Page not found' : '页面未找到';
}

/**
 * 页面级分享卡片。根布局的 openGraph/twitter 描述的是整站，Next 又按字段浅合并，
 * 页面不显式声明就会让每篇文章、每个产品都分享成同一个「Meteor Store」。
 * 这里统一带上页面自己的标题、摘要、canonical URL 与封面，避免社交抓取端只看到首页文案。
 */
export function buildOpenGraphMetadata(input: {
  title: string;
  description: string;
  /** 带 locale 的站内路径，例如 /zh/products/xisland */
  path: string;
  locale: string;
  type?: 'website' | 'article';
  /** 站内相对路径或绝对地址；缺省用站点统一分享图 */
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  /** 文章首次公开发布时间（ISO 字符串），仅 type=article 时输出 */
  publishedTime?: string;
  /** 文章最后更新时间（ISO 字符串），仅 type=article 时输出 */
  modifiedTime?: string;
  /** 文章作者展示名，仅 type=article 时输出 */
  authors?: string[];
}): Pick<Metadata, 'openGraph' | 'twitter'> {
  const imageUrl = input.image ? new URL(input.image, SITE_URL).toString() : `${SITE_URL}/og-image.png`;
  const locale = input.locale === 'en' ? 'en_US' : 'zh_CN';
  const common = {
    title: input.title,
    description: input.description,
    url: `${SITE_URL}${input.path}`,
    images: [{ url: imageUrl, width: input.imageWidth ?? 1200, height: input.imageHeight ?? 630, alt: input.imageAlt ?? input.title }],
  };
  const openGraph = input.type === 'article'
    ? {
      ...common,
      type: 'article' as const,
      locale,
      siteName: 'Meteor Store',
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
      ...(input.authors?.length ? { authors: input.authors } : {}),
    }
    : { ...common, type: 'website' as const, locale, siteName: 'Meteor Store' };
  return {
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      images: [imageUrl],
      site: '@Meteorkid',
    },
  };
}

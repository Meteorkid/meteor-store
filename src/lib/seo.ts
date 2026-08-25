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
  languages: { zh: string; en: string; xDefault: string };
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
    languages: {
      zh: forLocale('zh'),
      en: forLocale('en'),
      xDefault: forLocale(routing.defaultLocale),
    },
  };
}

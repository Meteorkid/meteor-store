import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['zh', 'en'] as const,
  defaultLocale: 'zh',
  localePrefix: 'always', // /zh 和 /en 都带前缀，对称清晰

  /**
   * 关掉 next-intl 默认下发的 hreflang `Link` 响应头。
   *
   * 它按**请求的 host** 生成地址：从非 www 进来就发一组非 www 的 hreflang——
   * 正是我们要消除的那份重复内容；它的 `x-default` 还指向不带语言前缀的路径
   * （如 `/products`），而那个地址必然 307 跳转，等于把 x-default 指在一次重定向上。
   *
   * canonical 与 hreflang 现在统一由 `[locale]/layout.tsx` 写进 HTML，一律钉在 www。
   * 两套同时存在会互相矛盾，搜索引擎遇到矛盾的 hreflang 通常两套都不采信。
   */
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];

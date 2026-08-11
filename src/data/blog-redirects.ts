/**
 * 文件文章迁移到数据库投稿后的旧 URL → 新 URL 映射。
 * key: 旧 slug（不含 locale 前缀），value: 新投稿 id。
 */

const zhRedirects: Record<string, string> = {
  'baxian-love-is-holding-up': 'rLP5ZNk6CUw',
  'ex-memory-technical-deep-dive': '8mgqUTBA_aE',
  'meteor-store-launch': '6BnBgpSxIYY',
  'meteor-store-literary-imagery-design-philosophy': '6Yqtk5rLvwo',
  'omnicrawl-why-another-crawler': 'jsGpMNYGJHE',
  'skeleton-anatomy-3d-web': '5NBMhcphSpo',
  'spouse-first-in-law': 'IWclJQYnHh8',
};

const enRedirects: Record<string, string> = {
  'baxian-love-is-holding-up': 'H2F_SGUPd6Y',
  'ex-memory-technical-deep-dive': 'cb3DqBWjt4c',
  'meteor-store-launch': 'x0lZUuE0mcQ',
  'meteor-store-literary-imagery-design-philosophy': 'MdtXYqdEJS0',
  'omnicrawl-why-another-crawler': 'urxZic77Ldw',
  'skeleton-anatomy-3d-web': '2LefwlrU0Cg',
  'spouse-first-in-law': 'fCkmSkUaQ0E',
};

const redirects: Record<string, Record<string, string>> = {
  zh: zhRedirects,
  en: enRedirects,
};

/** 查询旧 slug 是否已迁移，返回新投稿 id，未命中返回 null */
export function getRedirectId(locale: string, slug: string): string | null {
  return redirects[locale]?.[slug] ?? null;
}

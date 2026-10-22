import { describe, expect, it, vi } from 'vitest';
vi.mock('@/data/blog-feed', () => ({ getFeedPosts: async () => [], getFeedTags: async () => [] }));
vi.mock('@/lib/pathfinder/catalog', () => ({ listCatalogItems: async () => [] }));
import { helpArticles } from '@/data/help-articles';
import { SITE_URL } from '@/lib/constants';
import sitemap, { getHelpSitemapEntries } from '../sitemap';

describe('getHelpSitemapEntries', () => {
  it('为每篇帮助文章生成中英文地址', () => {
    const entries = getHelpSitemapEntries();

    expect(entries).toHaveLength(helpArticles.length * 2);
    expect(new Set(entries.map(entry => entry.url)).size).toBe(entries.length);

    for (const article of helpArticles) {
      const zh = entries.find(entry => entry.url.endsWith(`/zh/docs/${article.slug}`));
      const en = entries.find(entry => entry.url.endsWith(`/en/docs/${article.slug}`));

      expect(zh?.lastModified).toBe(article.updatedAt);
      expect(en?.lastModified).toBe(article.updatedAt);
      expect(zh?.alternates?.languages).toEqual({
        zh: `${SITE_URL}/zh/docs/${article.slug}`,
        en: `${SITE_URL}/en/docs/${article.slug}`,
      });
      expect(en?.alternates?.languages).toEqual(zh?.alternates?.languages);
    }
  });
});


it('公开发现入口双语进入sitemap，私有应用和账号不加入', async () => {
  const entries = await sitemap();
  for (const path of ['/playground', '/open-source', '/student', '/blog/api-guide']) {
    for (const locale of ['zh', 'en']) {
      const entry = entries.find(item => item.url === `${SITE_URL}/${locale}${path}`);
      expect(entry).toBeDefined();
      expect(entry?.alternates?.languages).toEqual({ zh: `${SITE_URL}/zh${path}`, en: `${SITE_URL}/en${path}` });
    }
  }
  expect(entries.some(item => /\/(?:apps|account|admin)(?:\/|$)/.test(new URL(item.url).pathname))).toBe(false);
});

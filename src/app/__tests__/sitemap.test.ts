import { beforeEach, describe, expect, it, vi } from 'vitest';
const blog = vi.hoisted(() => ({
  posts: { zh: [] as { href: string; date: string }[], en: [] as { href: string; date: string }[] },
  tags: { zh: [] as { key: string; href: string }[], en: [] as { key: string; href: string }[] },
}));
vi.mock('@/data/blog-feed', () => ({
  getFeedPosts: async (locale: 'zh' | 'en') => blog.posts[locale],
  getFeedTags: async (locale: 'zh' | 'en') => blog.tags[locale],
}));
vi.mock('@/lib/pathfinder/catalog', () => ({ listCatalogItems: async () => [] }));
import { helpArticles } from '@/data/help-articles';
import { SITE_URL } from '@/lib/constants';
import sitemap, { getHelpSitemapEntries } from '../sitemap';

beforeEach(() => {
  blog.posts = { zh: [], en: [] };
  blog.tags = { zh: [], en: [] };
});

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

it('文章和标签分别来自当前语言集合，缺少的语言版本不能复制出来', async () => {
  blog.posts.zh = [{ href: '/blog/p/chinese-post', date: '2026-10-22' }];
  blog.posts.en = Array.from({ length: 7 }, (_, index) => ({ href: `/blog/p/english-${index}`, date: '2026-10-23' }));
  blog.tags.zh = [{ key: '中文独有', href: '/blog/tag/中文独有' }, { key: 'shared', href: '/blog/tag/SHARED' }];
  blog.tags.en = [{ key: 'english-only', href: '/blog/tag/english-only' }, { key: 'shared', href: '/blog/tag/Shared' }];
  const entries = await sitemap();
  expect(entries.filter(entry => /\/en\/blog\/p\//.test(entry.url))).toHaveLength(7);
  expect(entries.some(entry => entry.url === `${SITE_URL}/en/blog/p/chinese-post`)).toBe(false);
  expect(entries.find(entry => entry.url === `${SITE_URL}/zh/blog/p/chinese-post`)?.alternates?.languages)
    .toEqual({ zh: `${SITE_URL}/zh/blog/p/chinese-post` });
  expect(entries.some(entry => entry.url === `${SITE_URL}/en/blog/tag/中文独有`)).toBe(false);
  expect(entries.find(entry => entry.url === `${SITE_URL}/en/blog/tag/english-only`)?.alternates?.languages)
    .toEqual({ en: `${SITE_URL}/en/blog/tag/english-only` });
  for (const locale of ['zh', 'en']) {
    const label = locale === 'zh' ? 'SHARED' : 'Shared';
    expect(entries.find(entry => entry.url === `${SITE_URL}/${locale}/blog/tag/${label}`)?.alternates?.languages)
      .toEqual({ zh: `${SITE_URL}/zh/blog/tag/SHARED`, en: `${SITE_URL}/en/blog/tag/Shared` });
  }
});

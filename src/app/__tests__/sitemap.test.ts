import { describe, expect, it } from 'vitest';
import { helpArticles } from '@/data/help-articles';
import { SITE_URL } from '@/lib/constants';
import { getHelpSitemapEntries } from '../sitemap';

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

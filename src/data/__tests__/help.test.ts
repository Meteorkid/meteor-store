import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';
import {
  findLocalizedHelpArticle,
  helpArticles,
  helpCategories,
  localizeHelpArticles,
} from '../help-articles';
import { getHelpArticle, getRelatedHelpArticles } from '../help';
import { markdownToHtml } from '@/lib/markdown';

const INITIAL_SLUGS = [
  'macos-cannot-open-app',
  'get-product-after-purchase',
  'use-license-key',
  'product-updates',
  'refund-policy',
  'technical-support',
];

describe('帮助文章元数据', () => {
  it('包含首版 6 篇帮助文章', () => {
    expect(helpArticles.map((article) => article.slug)).toEqual(INITIAL_SLUGS);
  });

  it('元数据满足发布约束', () => {
    const slugs = helpArticles.map((article) => article.slug);
    const categoryIds = new Set(helpCategories.map((category) => category.id));
    const categoryOrders = new Set<string>();

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(helpCategories.map((category) => category.id)).toEqual([
      'installation',
      'account',
      'purchase',
      'support',
    ]);
    expect(new Set(helpCategories.map((category) => category.order)).size).toBe(helpCategories.length);
    helpCategories.forEach((category) => {
      expect(category.order).toBeGreaterThan(0);
      expect(category.label.zh.trim()).not.toBe('');
      expect(category.label.en.trim()).not.toBe('');
    });

    for (const article of helpArticles) {
      expect(article.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(categoryIds.has(article.category)).toBe(true);
      expect(article.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(`${article.updatedAt}T00:00:00Z`).toISOString().slice(0, 10))
        .toBe(article.updatedAt);
      expect(article.order).toBeGreaterThan(0);
      expect(Number.isInteger(article.order)).toBe(true);

      const categoryOrder = `${article.category}:${article.order}`;
      expect(categoryOrders.has(categoryOrder)).toBe(false);
      categoryOrders.add(categoryOrder);

      for (const locale of ['zh', 'en'] as const) {
        expect(article.title[locale].trim()).not.toBe('');
        expect(article.excerpt[locale].trim()).not.toBe('');
        expect(article.keywords[locale].length).toBeGreaterThan(0);
        article.keywords[locale].forEach((keyword) => expect(keyword.trim()).not.toBe(''));
      }
    }
  });

  it('按语言展平字段，并按分类与文章顺序返回', () => {
    const zhArticles = localizeHelpArticles('zh');
    const enArticle = findLocalizedHelpArticle('use-license-key', 'en');

    expect(zhArticles.map((article) => article.slug)).toEqual([
      'macos-cannot-open-app',
      'product-updates',
      'use-license-key',
      'get-product-after-purchase',
      'refund-policy',
      'technical-support',
    ]);
    expect(zhArticles[0].title).toBe(helpArticles[0].title.zh);
    expect(enArticle?.title).toBe('How do I use a license key?');
    expect(findLocalizedHelpArticle('not-a-help-article', 'zh')).toBeUndefined();
  });
});

describe('帮助文章正文', () => {
  it('中英文目录只包含元数据声明的同名 Markdown', () => {
    const expectedFiles = INITIAL_SLUGS.map((slug) => `${slug}.md`).sort();

    for (const locale of ['zh', 'en'] as const) {
      const files = readdirSync(join(process.cwd(), 'content/help', locale))
        .filter((file) => file.endsWith('.md'))
        .sort();

      expect(files).toEqual(expectedFiles);
    }
  });

  it('每篇元数据都有非空的中英文 Markdown 正文', () => {
    for (const article of helpArticles) {
      for (const locale of ['zh', 'en'] as const) {
        const localized = getHelpArticle(locale, article.slug);

        expect(localized, `${locale}/${article.slug}.md 不存在`).toBeDefined();
        expect(localized?.content.trim(), `${locale}/${article.slug}.md 正文为空`).not.toBe('');
      }
    }
  });

  it('相关文章只返回同分类、排除当前文章且最多 3 篇', () => {
    for (const article of localizeHelpArticles('zh')) {
      const related = getRelatedHelpArticles('zh', article);

      expect(related.length).toBeLessThanOrEqual(3);
      expect(related.every((candidate) => candidate.category === article.category)).toBe(true);
      expect(related.some((candidate) => candidate.slug === article.slug)).toBe(false);
    }

    expect(
      getRelatedHelpArticles('en', findLocalizedHelpArticle('refund-policy', 'en')!)
        .map((article) => article.slug),
    ).toEqual(['technical-support']);
  });

  it('未知或路径穿越形式的 slug 不会读取文件', () => {
    expect(getHelpArticle('zh', 'not-a-help-article')).toBeUndefined();
    expect(getHelpArticle('zh', '../blog/secret')).toBeUndefined();
  });

  it('正文图片具有替代文本，且本地图片位于对应文章目录并真实存在', () => {
    const imagePattern = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;

    for (const article of helpArticles) {
      for (const locale of ['zh', 'en'] as const) {
        const content = getHelpArticle(locale, article.slug)!.content;

        for (const match of content.matchAll(imagePattern)) {
          const [, alt, src] = match;
          expect(alt.trim(), `${locale}/${article.slug}.md 图片缺少替代文本`).not.toBe('');

          if (src.startsWith('/')) {
            expect(src.startsWith(`/help/${article.slug}/`)).toBe(true);
            expect(
              existsSync(join(process.cwd(), 'public', src.slice(1))),
              `${locale}/${article.slug}.md 引用了不存在的图片 ${src}`,
            ).toBe(true);
          }
        }
      }
    }
  });

  it('Markdown 只保存正文，且正文标题从二级开始', () => {
    for (const article of helpArticles) {
      for (const locale of ['zh', 'en'] as const) {
        const content = getHelpArticle(locale, article.slug)!.content;

        expect(content).not.toMatch(/^---\s*$/m);
        expect(content).not.toMatch(/^#\s+/m);
        expect(content).toMatch(/^##\s+/m);
      }
    }
  });

  it('macOS 指引使用 Apple 官方安全流程，不包含危险绕过命令', () => {
    const zh = getHelpArticle('zh', 'macos-cannot-open-app')!.content;
    const en = getHelpArticle('en', 'macos-cannot-open-app')!.content;
    const combined = `${zh}\n${en}`;

    expect(zh).toContain('https://support.apple.com/zh-cn/102445');
    expect(en).toContain('https://support.apple.com/en-us/102445');
    expect(zh).toContain('仍要打开');
    expect(en).toContain('Open Anyway');
    expect(combined).not.toMatch(/\bxattr\b|spctl\s+--master-disable/i);
  });

  it('所有正文都能通过现有安全 Markdown 管线渲染', () => {
    for (const article of helpArticles) {
      for (const locale of ['zh', 'en'] as const) {
        const html = markdownToHtml(getHelpArticle(locale, article.slug)!.content);

        expect(html).toContain('<h2>');
        expect(html).not.toContain('<h1>');
      }
    }
  });
});

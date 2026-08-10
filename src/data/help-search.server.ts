import { pinyin } from 'pinyin-pro';
import type { Locale } from '@/i18n/routing';
import { helpCategories, localizeHelpArticles } from './help-articles';
import type { HelpSearchEntry } from './help-search';

function toPinyinInitials(str: string): string {
  return pinyin(str, { pattern: 'first', toneType: 'none', type: 'array' })
    .join('')
    .toLowerCase();
}

function toFullPinyin(str: string): string {
  return pinyin(str, { toneType: 'none', type: 'array' })
    .join('')
    .toLowerCase();
}

export function buildHelpSearchEntries(
  locale: Locale,
  showPricing: boolean,
): HelpSearchEntry[] {
  const visible = localizeHelpArticles(locale).filter(
    (article) => showPricing || !article.commercial,
  );
  return visible.map((article) => ({
    slug: article.slug,
    category: article.category,
    categoryOrder: helpCategories.find((c) => c.id === article.category)?.order ?? 0,
    order: article.order,
    commercial: article.commercial,
    title: article.title,
    excerpt: article.excerpt,
    keywords: article.keywords.join(' ').toLowerCase(),
    initials: toPinyinInitials(article.title),
    fullPinyin: toFullPinyin(article.title),
  }));
}

import type { HelpCategory } from './help-articles';

export interface HelpSearchEntry {
  slug: string;
  category: HelpCategory;
  categoryOrder: number;
  order: number;
  commercial: boolean;
  title: string;
  excerpt: string;
  keywords: string;
  initials: string;
  fullPinyin: string;
}

function scoreTerm(entry: HelpSearchEntry, term: string): number {
  const title = entry.title.toLowerCase();
  if (title.startsWith(term)) return 100;
  if (title.includes(term)) return 60;
  if (entry.initials.includes(term)) return 55;
  if (entry.fullPinyin.includes(term)) return 35;
  if (entry.excerpt.toLowerCase().includes(term)) return 30;
  if (entry.keywords.includes(term)) return 20;
  return 0;
}

export function searchHelpEntries(
  entries: HelpSearchEntry[],
  query: string,
): HelpSearchEntry[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  return entries
    .map((entry) => {
      let total = 0;
      for (const term of terms) {
        const score = scoreTerm(entry, term);
        if (score === 0) return null;
        total += score;
      }
      return { entry, total };
    })
    .filter((result): result is { entry: HelpSearchEntry; total: number } => result !== null)
    .sort((a, b) =>
      b.total - a.total
      || a.entry.categoryOrder - b.entry.categoryOrder
      || a.entry.order - b.entry.order
      || a.entry.slug.localeCompare(b.entry.slug),
    )
    .map(({ entry }) => entry);
}

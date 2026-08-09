import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import type { Locale } from '@/i18n/routing';
import {
  findLocalizedHelpArticle,
  localizeHelpArticles,
  type LocalizedHelpArticle,
} from './help-articles';

/**
 * 此模块读取本地文件，只能由服务端组件、路由处理器或测试导入。
 * 客户端搜索与列表应使用不依赖 Node.js 的 help-articles.ts。
 */
const CONTENT_DIR = join(process.cwd(), 'content/help');

export interface HelpArticle extends LocalizedHelpArticle {
  content: string;
}

export function getHelpArticle(locale: Locale, slug: string): HelpArticle | undefined {
  const article = findLocalizedHelpArticle(slug, locale);
  if (!article) return undefined;

  // 文件名只取自元数据白名单，外部 slug 不能参与路径拼接。
  const filePath = join(CONTENT_DIR, locale, `${article.slug}.md`);
  if (!existsSync(filePath)) return undefined;

  const content = readFileSync(filePath, 'utf8').trim();
  if (!content) {
    throw new Error(`content/help/${locale}/${article.slug}.md 正文为空`);
  }

  return { ...article, content };
}

export function getRelatedHelpArticles(
  locale: Locale,
  article: Pick<LocalizedHelpArticle, 'slug' | 'category'>,
): LocalizedHelpArticle[] {
  return localizeHelpArticles(locale)
    .filter((candidate) => (
      candidate.category === article.category && candidate.slug !== article.slug
    ))
    .slice(0, 3);
}

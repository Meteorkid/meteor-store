/**
 * 内容页专注模式的唯一路径口径。
 *
 * 学习区（/study、/pathfinder、/competitions、/masters、/phd）之外，长文阅读和
 * 投稿编辑也需要收起站点外壳。这里统一返回三种作用域：
 *
 * - learning：学习区，放大正文、保留学习页自己的内容导航；
 * - reading：博客正文、每日一新、帮助文章和 API 指南，放大正文字号；
 * - writing：投稿编辑器，只收站点外壳和氛围层，不动编辑器与字数/保存状态。
 *
 * 页面内的目录、频道切换、文章评论、编辑器工具栏都不属于站点 chrome，
 * 不要在 CSS 里按 data-focus-mode 一刀切隐藏。
 */
export type FocusModeScope = 'learning' | 'reading' | 'writing';

export const LEARNING_FOCUS_ROUTE = /^\/(?:study|pathfinder|competitions|masters|phd)(?:\/|$)/;

const WRITING_FOCUS_ROUTE = /^\/blog\/submit\/?$/;

const READING_FOCUS_ROUTE =
  /^\/(?:daily\/?|blog\/p\/[^/]+\/?|blog\/api-guide\/?|docs\/[^/]+\/?)$/;

/**
 * 给根布局的首屏内联脚本复用。
 *
 * 内联脚本没有 import 能力，所以这里同时保留正则对象和可插入字符串的 pattern，
 * 避免脚本与客户端判断各写一套、日后只改一边。pattern 只覆盖去掉语言前缀后的路径。
 */
export const FOCUS_MODE_PATH_PATTERN = [
  '/(?:study|pathfinder|competitions|masters|phd)(?:/|$)',
  '/daily(?:/?$)',
  '/blog/p/[^/]+(?:/?$)',
  '/blog/submit(?:/?$)',
  '/blog/api-guide(?:/?$)',
  '/docs/[^/]+(?:/?$)',
].join('|');

export const FOCUS_MODE_PATH_REGEX = new RegExp(`^(?:${FOCUS_MODE_PATH_PATTERN})`);

export const LEARNING_FOCUS_STORAGE_KEY = 'meteor:focus-mode';

export function normalizeFocusPath(pathname: string): string {
  return pathname.replace(/^\/(?:zh|en)(?=\/|$)/, '') || '/';
}

export function getFocusModeScope(pathname: string): FocusModeScope | null {
  const path = normalizeFocusPath(pathname);
  if (LEARNING_FOCUS_ROUTE.test(path)) return 'learning';
  if (WRITING_FOCUS_ROUTE.test(path)) return 'writing';
  if (READING_FOCUS_ROUTE.test(path)) return 'reading';
  return null;
}

export function isFocusModePath(pathname: string): boolean {
  return getFocusModeScope(pathname) !== null;
}

/** 兼容既有调用方：只回答「是不是学习区」。 */
export function isLearningFocusPath(pathname: string): boolean {
  return getFocusModeScope(pathname) === 'learning';
}

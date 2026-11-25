/**
 * 学习区专注模式的唯一路径口径。
 *
 * 学习相关入口不止 /study：学习与机会导航下的竞赛、硕士、博士都没有独立布局，
 * 只靠 /study 和 /pathfinder 两个 layout 判断会漏掉三页。路径来自 i18n 导航的
 * usePathname（已经剥掉 /zh、/en 前缀），所以这里不重复处理语言段。
 */
export const LEARNING_FOCUS_ROUTE = /^\/(?:study|pathfinder|competitions|masters|phd)(?:\/|$)/;

export const LEARNING_FOCUS_STORAGE_KEY = 'meteor:focus-mode';

export function normalizeFocusPath(pathname: string): string {
  return pathname.replace(/^\/(?:zh|en)(?=\/|$)/, '') || '/';
}

export function isLearningFocusPath(pathname: string): boolean {
  return LEARNING_FOCUS_ROUTE.test(normalizeFocusPath(pathname));
}

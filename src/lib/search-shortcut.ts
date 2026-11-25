export type SearchShortcutLabel = '⌘K' | 'Ctrl K';

/**
 * 搜索快捷键的可见标签。UI 里不要写死 ⌘K：
 * Windows/Linux 用户看到的是 Ctrl K，否则提示等于没有。
 */
export function getSearchShortcutLabel(): SearchShortcutLabel {
  if (typeof navigator === 'undefined') return '⌘K';
  return /mac|iphone|ipad|ipod/i.test(navigator.userAgent) ? '⌘K' : 'Ctrl K';
}

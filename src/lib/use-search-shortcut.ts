'use client';

import { useSyncExternalStore } from 'react';
import { getSearchShortcutLabel, type SearchShortcutLabel } from './search-shortcut';

const subscribe = () => () => {};
const getServerSnapshot = (): SearchShortcutLabel => '⌘K';

/**
 * 客户端读取平台快捷键，服务端先按 ⌘K 渲染，hydrate 后自动切到 Ctrl K。
 * 用 useSyncExternalStore 而不是 effect + setState：后者会触发级联渲染。
 */
export function useSearchShortcut(): SearchShortcutLabel {
  return useSyncExternalStore(subscribe, getSearchShortcutLabel, getServerSnapshot);
}

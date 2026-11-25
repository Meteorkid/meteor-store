'use client';

import { DEFAULT_SITE_THEME, GUEST_THEME_KEY, THEME_COOKIE, isSiteTheme, type SiteTheme } from '@/lib/appearance';

const listeners = new Set<() => void>();
let activeTheme: SiteTheme | null = null;

export function readGuestTheme(): SiteTheme | null {
  try {
    const value = window.localStorage.getItem(GUEST_THEME_KEY);
    return isSiteTheme(value) ? value : null;
  } catch {
    return null;
  }
}

export function resolveGuestTheme(initialTheme = DEFAULT_SITE_THEME): SiteTheme {
  return readGuestTheme() ?? initialTheme;
}

export function applyTheme(theme: SiteTheme, storeGuest = false): void {
  activeTheme = theme;
  document.documentElement.dataset.theme = theme;
  document.cookie = `${THEME_COOKIE}=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
  if (storeGuest) {
    try { window.localStorage.setItem(GUEST_THEME_KEY, theme); } catch { /* 浏览器禁用存储时保留 cookie。 */ }
  }
  listeners.forEach(listener => listener());
}

export function initializeTheme(initial: SiteTheme): SiteTheme {
  activeTheme ??= initial;
  return activeTheme;
}

export function getActiveTheme(): SiteTheme {
  return activeTheme ?? DEFAULT_SITE_THEME;
}

export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

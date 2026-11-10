'use client';

import { DEFAULT_SITE_THEME, GUEST_THEME_KEY, SITE_THEMES, THEME_COOKIE, type SiteTheme } from '@/lib/appearance';

const listeners = new Set<() => void>();
let activeTheme: SiteTheme | null = null;

function isTheme(value: unknown): value is SiteTheme {
  return SITE_THEMES.includes(value as SiteTheme);
}

export function readGuestTheme(): SiteTheme | null {
  try {
    const value = window.localStorage.getItem(GUEST_THEME_KEY);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
}

export function resolveGuestTheme(): SiteTheme {
  return readGuestTheme() ?? DEFAULT_SITE_THEME;
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
  return activeTheme ?? 'nebula';
}

export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

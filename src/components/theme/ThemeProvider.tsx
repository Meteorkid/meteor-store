'use client';

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { isSiteTheme, type SiteTheme } from '@/lib/appearance';
import { useAuth } from '@/components/AuthProvider';
import { applyTheme, getActiveTheme, initializeTheme, resolveGuestTheme, subscribeTheme } from './theme-client';

interface ThemeContextValue {
  theme: SiteTheme;
  saving: boolean;
  saveError: 'accountChanged' | 'saveFailed' | 'syncFailed' | null;
  setTheme: (theme: SiteTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ initialTheme, children }: { initialTheme: SiteTheme; children: ReactNode }) {
  initializeTheme(initialTheme);
  const theme = useSyncExternalStore(subscribeTheme, getActiveTheme, () => initialTheme);
  const { user, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<ThemeContextValue['saveError']>(null);
  const requestVersion = useRef(0);
  const userId = user?.id ?? null;

  useEffect(() => {
    if (loading) return;
    if (!userId) {
      applyTheme(resolveGuestTheme());
      return;
    }

    const controller = new AbortController();
    const version = ++requestVersion.current;
    fetch('/api/account/appearance', { cache: 'no-store', signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('sync');
        const data = await response.json() as { theme?: unknown };
        if (version !== requestVersion.current) return;
        if (isSiteTheme(data.theme)) {
          setSaveError(null);
          applyTheme(data.theme);
          return;
        }
        // 首次登录时把本机已经选择的主题带入账号，后续设备从这里同步。
        const guest = resolveGuestTheme();
        const save = await fetch('/api/account/appearance', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'x-appearance-user': userId },
          body: JSON.stringify({ theme: guest }),
          signal: controller.signal,
        });
        if (!save.ok) throw new Error('migrate');
        if (version === requestVersion.current) applyTheme(guest);
      })
      .catch(error => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        if (version === requestVersion.current) setSaveError('syncFailed');
      });
    return () => controller.abort();
  }, [loading, userId]);

  useEffect(() => {
    if (userId || loading) return;
    const onStorage = (event: StorageEvent) => {
      if (event.key && event.key !== 'meteor:theme:guest:v1') return;
      applyTheme(resolveGuestTheme());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [loading, userId]);

  const setTheme = (next: SiteTheme) => {
    if (next === theme) return;
    setSaveError(null);
    if (!userId) {
      applyTheme(next, true);
      return;
    }
    applyTheme(next);
    setSaving(true);
    const version = ++requestVersion.current;
    fetch('/api/account/appearance', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-appearance-user': userId },
      body: JSON.stringify({ theme: next }),
    })
      .then(response => {
        if (version !== requestVersion.current) return;
        if (response.status === 409) setSaveError('accountChanged');
        else if (!response.ok) setSaveError('saveFailed');
      })
      .catch(() => { if (version === requestVersion.current) setSaveError('saveFailed'); })
      .finally(() => { if (version === requestVersion.current) setSaving(false); });
  };

  return <ThemeContext value={{ theme, saving, saveError, setTheme }}>{children}</ThemeContext>;
}

export function useSiteTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useSiteTheme must be used inside ThemeProvider');
  return value;
}

export function useOptionalSiteTheme(): ThemeContextValue | null {
  return useContext(ThemeContext);
}

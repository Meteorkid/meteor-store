import { afterEach, describe, expect, it, vi } from 'vitest';
import { GUEST_THEME_KEY, THEME_COOKIE, isSiteTheme } from '../appearance';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('site appearance persistence', () => {
  it('只接受两套已实现主题', () => {
    expect(isSiteTheme('classic')).toBe(true);
    expect(isSiteTheme('nebula')).toBe(true);
    expect(isSiteTheme('light')).toBe(false);
    expect(isSiteTheme(null)).toBe(false);
  });

  it('游客切换同时写 DOM、活动 cookie 与本机偏好，并通知订阅者', async () => {
    const values = new Map<string, string>();
    const documentElement = { dataset: {} as Record<string, string> };
    vi.stubGlobal('document', { documentElement, cookie: '' });
    vi.stubGlobal('window', { localStorage: { setItem: (key: string, value: string) => values.set(key, value) } });
    const { applyTheme, subscribeTheme } = await import('../../components/theme/theme-client');
    const listener = vi.fn();
    const unsubscribe = subscribeTheme(listener);
    applyTheme('classic', true);
    expect(documentElement.dataset.theme).toBe('classic');
    expect((document as unknown as { cookie: string }).cookie).toContain(`${THEME_COOKIE}=classic`);
    expect(values.get(GUEST_THEME_KEY)).toBe('classic');
    expect(listener).toHaveBeenCalledOnce();
    unsubscribe();
  });

  it('没有游客偏好时回退星云主题，已有游客选择则保留', async () => {
    const values = new Map<string, string>();
    vi.stubGlobal('window', { localStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    } });
    const { resolveGuestTheme } = await import('../../components/theme/theme-client');
    expect(resolveGuestTheme()).toBe('nebula');
    values.set(GUEST_THEME_KEY, 'classic');
    expect(resolveGuestTheme()).toBe('classic');
  });
});

/** 全站主题保持暗色，与业务频道的独立强调色分开。 */
export const SITE_THEMES = ['classic', 'nebula', 'horizon', 'orbit'] as const;
export type SiteTheme = (typeof SITE_THEMES)[number];
export const DEFAULT_SITE_THEME: SiteTheme = 'nebula';
export const THEME_COOKIE = 'meteor-theme';
export const GUEST_THEME_KEY = 'meteor:theme:guest:v1';

export function isSiteTheme(value: unknown): value is SiteTheme {
  return SITE_THEMES.some(theme => theme === value);
}

export interface AppearancePreference {
  userId: string;
  theme: SiteTheme | null;
  updatedAt: string | null;
}

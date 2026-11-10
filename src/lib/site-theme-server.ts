import { cookies } from 'next/headers';
import { DEFAULT_SITE_THEME, isSiteTheme, THEME_COOKIE, type SiteTheme } from './appearance';

/** SSR 只读取非敏感的活动主题 cookie；账号主题由客户端同步并回写。 */
export async function getInitialSiteTheme(): Promise<SiteTheme> {
  const value = (await cookies()).get(THEME_COOKIE)?.value;
  return isSiteTheme(value) ? value : DEFAULT_SITE_THEME;
}

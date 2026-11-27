/** 首页路径的唯一判断：/、/zh、/zh/、/en、/en/。 */
export function isHomepagePath(pathname: string): boolean {
  return /^\/(?:zh|en)?\/?$/.test(pathname);
}

/**
 * 管理员判定。
 *
 * 刻意用环境变量而不是数据库字段：管理员身份不该受任何应用层 bug 影响。
 * 用户表里加一个 isAdmin 列，意味着任何一处能写 users 的路径都可能成为提权面；
 * 放在环境变量里，提权就需要拿到 Vercel 控制台。
 */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const admins = getAdminEmails();
  // 未配置时任何人都不是管理员——宁可后台进不去，也不能人人都是管理员
  if (admins.length === 0) return false;
  return admins.includes(email.trim().toLowerCase());
}

export function isAdminSession(
  session: { email?: string | null; emailVerified?: boolean } | null | undefined,
): boolean {
  return session?.emailVerified === true && isAdminEmail(session.email);
}

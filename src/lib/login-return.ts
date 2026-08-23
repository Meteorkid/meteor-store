const ALLOWED_LOGIN_RETURNS = new Set(['/apps/ex-memory']);

export function normalizeLoginReturn(value: string | null | undefined): string {
  return value && ALLOWED_LOGIN_RETURNS.has(value) ? value : '/';
}

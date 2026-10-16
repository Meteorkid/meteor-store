import { getProductTrack } from '@/data/product-tracks';

const ALLOWED_LOGIN_RETURNS = new Set([
  '/daily',
  '/masters',
  '/apps',
  '/apps/ex-memory',
  '/apps/tollow/trial',
  '/account',
  '/orders',
  '/redeem',
  '/blog/submit',
  '/blog/my-posts',
  '/blog/favorites',
  '/pathfinder/saved',
]);

export function normalizeLoginReturn(value: string | null | undefined): string {
  if (typeof value !== 'string' || !value) return '/';
  if (ALLOWED_LOGIN_RETURNS.has(value)) return value;

  // 投稿编辑只接受文章 ID 和入口标记；实际编辑权限仍由页面及 API 校验。
  const submitMatch = /^\/blog\/submit\?id=[A-Za-z0-9_-]{1,64}(?:&admin=1)?$/.exec(value);
  if (submitMatch?.[0] === value) return value;

  // 只接受已登记产品的详情页和两个获取入口，不放行任意 URL 或查询参数。
  const productMatch = /^\/products\/([a-z0-9]+(?:-[a-z0-9]+)*)(?:#(?:download|pricing))?$/.exec(value);
  return productMatch?.[0] === value && getProductTrack(productMatch[1]) ? value : '/';
}

export function buildLoginHref(returnTo: string): string {
  const next = normalizeLoginReturn(returnTo);
  return next === '/' ? '/login' : `/login?next=${encodeURIComponent(next)}`;
}

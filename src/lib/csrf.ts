import { NextRequest, NextResponse } from 'next/server';

/**
 * 跨站请求伪造（CSRF）Origin 校验 —— 纵深防御。
 *
 * 全站 cookie 已是 `sameSite: 'lax'`，能挡住主流 CSRF 攻击；这里再加一层
 * 「写接口必须来自本站 Origin」的校验，双保险覆盖到注册 / 登录 / 邀请码兑换等
 * 金钱相关接口。
 *
 * 策略（刻意保守，避免引人回归）：
 * - 无 `Origin` 头（curl、服务端到服务端、支付宝回调等非浏览器客户端）→ 放行。
 *   校验只拦「明摆着带 Origin 且明显跨站」的浏览器请求。
 * - 有 `Origin` 头且命中允许列表 → 放行。
 * - 有 `Origin` 头但不匹配 → 403。
 *
 * 允许列表由 `NEXT_PUBLIC_SITE_URL` 推导（自动收录 www / 非 www 两种形态），
 * 并固定收录生产域名与本地开发地址，保证任意入口访问不被误拦。
 */

const LOCALHOST_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000'];

export function buildAllowedOrigins(): Set<string> {
  const set = new Set<string>();

  const configured = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/+$/, '').toLowerCase();
  if (configured.startsWith('http://') || configured.startsWith('https://')) {
    set.add(configured);
    // 同时收录 www / 非 www 两种形态，避免从任一入口访问被误拦
    if (configured.includes('://www.')) {
      set.add(configured.replace('://www.', '://'));
    } else {
      set.add(configured.replace('://', '://www.'));
    }
  }

  // 固定兜底：生产域名（NEXT_PUBLIC_SITE_URL 缺失时也能用）
  set.add('https://www.imagentx.top');
  set.add('https://imagentx.top');

  LOCALHOST_ORIGINS.forEach((o) => set.add(o));

  return set;
}

const allowedOrigins = buildAllowedOrigins();

/**
 * 校验请求的 Origin 是否来自本站。匹配返回 null（放行），不匹配返回 403 响应。
 * 在写接口（POST/PATCH/PUT/DELETE）入口处调用：
 *
 *   const forbidden = assertMatchingOrigin(req);
 *   if (forbidden) return forbidden;
 */
export function assertMatchingOrigin(req: NextRequest): NextResponse | null {
  const origin = req.headers.get('origin');
  if (!origin) return null;

  const normalized = origin.replace(/\/+$/, '').toLowerCase();
  if (allowedOrigins.has(normalized)) return null;

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
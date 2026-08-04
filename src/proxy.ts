import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

/**
 * 每个请求生成一次性 nonce，注入到 CSP 的 script-src，替代 'unsafe-inline'。
 *
 * Next.js 16 的 SSR 流程：
 *   proxy → 生成 nonce 写入 request header
 *   → 服务端组件通过 headers() 读取，注入到 <Script> 等需要 inline 的位置
 *   → proxy 同时把带 nonce 的 CSP 写到 response header
 *
 * nonce 在单次请求内有效，每次请求重新生成，无法跨请求预测或重放。
 *
 * 同时保留 source 一个 backstop：即使 nonce 没成功传到某个 inline 脚本，
 * 'strict-dynamic' 让受 nonce 信任的脚本加载的子脚本也获得信任，
 * 不必为每个第三方脚本单独加白名单。
 */

const NONCE_HEADER = 'x-nonce';

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  // 32 字节随机 → base64
  const nonce = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');

  // 把 nonce 写到 request headers，让服务端组件能读到
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(NONCE_HEADER, nonce);
  const requestWithNonce = new NextRequest(request, { headers: requestHeaders });

  // 让 next-intl 处理 locale，并把带 nonce 的请求头继续传给渲染请求
  const intlResponse = intlMiddleware(requestWithNonce);

  // 构造本请求的 CSP，把 nonce 注入进去
  const csp = buildCsp(nonce);

  // 如果是重定向响应，直接返回（不需要添加 CSP）
  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  // 对于正常响应，添加 CSP header
  intlResponse.headers.set('Content-Security-Policy', csp);

  return intlResponse;
}

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV === 'development';
  const sentryIngest = 'https://*.ingest.us.sentry.io';

  // 头像走 R2 对象存储时，img-src 需要放行 R2 自定义域名（R2_PUBLIC_BASE）。
  // 未配置时不注入——避免把空字符串塞进 CSP 导致策略解析异常。
  const r2Base = process.env.R2_PUBLIC_BASE?.trim();
  const r2Origin = r2Base ? parseOrigin(r2Base) : '';

  return [
    "default-src 'self'",
    // nonce 替代 'unsafe-inline'：所有内联脚本必须带 nonce 才能跑
    // 'strict-dynamic' 让受 nonce 信任的脚本派生的子脚本也通过
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    // 样式目前仍依赖大量 inline；保留 'unsafe-inline' 直到样式系统完成 nonce 化
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: https://www.imagentx.top https://imagentx.top${r2Origin ? ` ${r2Origin}` : ''}`,
    "font-src 'self'",
    `connect-src 'self' https://*.neon.tech https://api.resend.com https://openapi.alipay.com ${sentryIngest}`,
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
    // JSON-LD 在 layout.tsx 用 application/ld+json + nonce 注入
  ].join('; ');
}

/** 从 https://cdn.example.com/foo/bar 中提取 https://cdn.example.com，避免把路径写进 CSP。 */
function parseOrigin(url: string): string {
  const match = /^(https:\/\/[^/]+)/i.exec(url.trim().replace(/\/+$/, ''));
  return match ? match[1] : '';
}

export const config = {
  // 只对 HTML 页面启用：静态资源、API、Next 内部资源都排除
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml)).*)',
  ],
};

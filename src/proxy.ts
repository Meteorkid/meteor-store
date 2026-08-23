import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/constants';

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

  // trial 路由（/apps/{id}/trial）会被产品详情页的 iframe 同源内嵌，
  // 需要放行 frame-ancestors；其余页面一律禁止被 iframe 嵌入。
  const pathname = new URL(request.url).pathname;
  const isTrial = /\/apps\/.+\/trial$/.test(pathname);

  // 构造本请求的 CSP，把 nonce 注入进去
  const csp = buildCsp(nonce, isTrial);

  // 如果是重定向响应，直接返回（不需要添加 CSP）
  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  // 对于正常响应，添加 CSP header
  intlResponse.headers.set('Content-Security-Policy', csp);

  return intlResponse;
}

function buildCsp(nonce: string, isTrial = false): string {
  const isDev = process.env.NODE_ENV === 'development';
  const sentryIngest = 'https://*.ingest.us.sentry.io';

  // 头像走 R2 对象存储时，img-src 需要放行 R2 自定义域名（R2_PUBLIC_BASE）。
  // 未配置时不注入——避免把空字符串塞进 CSP 导致策略解析异常。
  // 站点同时以 www / 非 www 两种形态访问，img-src 需一并放行
  const nonWwwSite = SITE_URL.replace('https://www.', 'https://');

  const r2Base = process.env.R2_PUBLIC_BASE?.trim();
  const r2Origin = r2Base ? parseOrigin(r2Base) : '';

  return [
    "default-src 'self'",
    // nonce 替代 'unsafe-inline'：所有内联脚本必须带 nonce 才能跑
    // 'strict-dynamic' 让受 nonce 信任的脚本派生的子脚本也通过
    // 'wasm-unsafe-eval' 只放行 WebAssembly 编译（站内应用如流体模拟、
    // MediaPipe 手势识别、three.js 模型加载都依赖 WASM），不放行任意 JS eval。
    // 生产去掉 'unsafe-eval'，仅 WASM 例外；开发环境保留 'unsafe-eval' 供 HMR。
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ''}`,
    // 样式目前仍依赖大量 inline；保留 'unsafe-inline' 直到样式系统完成 nonce 化。
    // 放行 Google Fonts 样式表（chakra-visualizer 的 Tutorial.css 用 @import 引入
    // Bebas Neue / Rajdhani / Noto Sans JP），否则自定义字体不加载（仅非致命警告）。
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    `img-src 'self' data: blob: ${SITE_URL} ${nonWwwSite}${r2Origin ? ` ${r2Origin}` : ''}`,
    // 放行 Google Fonts 字体文件（font-src 原先只允许 'self'，gstatic 被拦）
    "font-src 'self' https://fonts.gstatic.com",
    // connect-src：数据库/邮件/支付/Sentry 之外，放行 MediaPipe 模型 CDN。
    // 站内应用（chakra 手势识别、webgl-fluid-sim 手势）在运行时从
    // cdn.jsdelivr.net 拉取 @mediapipe/hands 的 .wasm / .tflite 模型，
    // 该 fetch 由 connect-src 管控——不放行则模型加载失败、摄像头无法启动。
    `connect-src 'self' https://*.neon.tech https://api.resend.com https://openapi.alipay.com https://cdn.jsdelivr.net ${sentryIngest}`,
    // 在线体验与现有 trial 均为同源 iframe；显式声明，避免未来扩大 default-src 时连带放宽。
    "frame-src 'self'",
    // trial 路由允许同源 iframe 内嵌；其余页面禁止被嵌入（防点击劫持）
    `frame-ancestors ${isTrial ? "'self'" : "'none'"}`,
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
  //
  // manifest.webmanifest / sw.js 与 robots.txt、sitemap.xml 同理：被 next-intl 重定向到
  // /zh/... 之后就是 404。PWA 清单 404 时浏览器只是静默地不再提示安装，
  // Service Worker 404 时离线兜底页永远装不上——两者都不报错，坏了极难发现。
  // （sw.js 已被下面的 .js 后缀规则覆盖，这里显式再列一次，防止将来有人收窄后缀名单。）
  //
  // 带扩展名的路径一律排除，**`.html` 也在内**：App Router 的页面路由从不带扩展名，
  // 所以带 .html 的请求必然是 public/ 下的静态文件——目前是搜索引擎站长平台的
  // 归属验证文件（如 baidu_verify_codeva-*.html）。漏掉它的话 next-intl 会把
  // /baidu_verify_xxx.html 重定向成 /zh/baidu_verify_xxx.html 然后 404，验证必然失败。
  //
  // **这里是白名单，不是"凡带点就排除"**：动态段可能合法地含点，
  // 一律排除会把它们踢出 next-intl 的语言处理。代价是每引入一种新静态格式都得补一次，
  // 而漏掉的表现极其隐蔽——请求被重定向到 /zh/<原路径>，那里落到 catch-all 404，
  // 于是**返回一个 200 的 HTML 页面**。浏览器拿 HTML 当视频/模型/JSON 解析，
  // 只会得到一个语焉不详的解码错误，看不出根因是中间件。
  // 历史教训：mp4（chakra 特效视频）、glb（骨骼模型）、json（tollow 的 i18n 文案）
  // 三类资源就是这样在生产静默坏掉的。
  // `src/lib/__tests__/proxy-matcher.test.ts` 会扫 public/ 下的实际扩展名来钉住这条，
  // 新增格式忘了补名单时 CI 会红。
  //
  // **`js` 不能放进后缀名单，只能按文件名逐个列**：博客标签是用户可自定义的，
  // `Three.js` 已经是现有文章的标签，`Node.js` / `Vue.js` 只是时间问题。
  // 拿 `js` 后缀一刀切会让 /zh/blog/tag/Three.js 整条绕开中间件——页面照常渲染，
  // 但**响应里一个 CSP 头都没有**，安静地少一层防护。public/ 下的脚本只有固定两个
  // （sw.js 与 meteor-runner.js，都被互相硬编码引用），逐个列出来即可；
  // 构建产物的 js 走 _next/static，上面已经排除。
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|robots.txt|sitemap.xml|manifest.webmanifest|sw\\.js|meteor-runner\\.js|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|css|txt|xml|html|json|md|mp4|webm|mov|glb|gltf|bin|wasm|woff|woff2|ttf)).*)',
  ],
};

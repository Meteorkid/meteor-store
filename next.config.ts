import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Sentry 上报域名（从 DSN 推导），必须放进 CSP 的 connect-src，
// 否则浏览器会直接拦掉上报请求，且是静默失败——错误监控看起来"接好了"其实一条都收不到
const SENTRY_INGEST = "https://*.ingest.us.sentry.io";

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js 需要 unsafe-inline 用于 SSR hydration，后续可迁移到 nonce-based
      // unsafe-eval 仅开发模式：React DevTools 调试功能需要，生产不放行
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      // 限制图片来源为自有域名和常用 CDN
      "img-src 'self' data: https://www.imagentx.top https://imagentx.top",
      "font-src 'self'",
      `connect-src 'self' https://*.neon.tech https://api.resend.com https://openapi.alipay.com ${SENTRY_INGEST}`,
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // 没配 SENTRY_AUTH_TOKEN 时跳过 source map 上传，避免构建噪音；
  // 配上之后 Sentry 里的堆栈才会映射回源码而不是压缩后的产物
  silent: !process.env.CI,
  telemetry: false,
  // 让客户端错误的堆栈能覆盖到 Next 生成的各类 chunk
  widenClientFileUpload: true,
});

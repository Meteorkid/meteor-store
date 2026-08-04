import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// CSP 由 src/middleware.ts 动态生成（每请求一个 nonce 注入到 script-src），
// 这里不再静态设置，避免双重 CSP header 让浏览器无所适从。
// 其余安全 header 是静态的，仍然从这里发出。
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/**
 * 从 R2_PUBLIC_BASE 派生 next/image 的 remotePatterns。
 * 构建时求值：R2_PUBLIC_BASE 在 Vercel 项目设置里配了就会读到。
 * 未配置时返回空数组——博客图片改写端点 /_next/image 会拒绝优化外链，但不影响渲染。
 */
function getR2RemotePattern(): URL[] {
  const base = process.env.R2_PUBLIC_BASE;
  if (!base) return [];
  try {
    return [new URL(base)];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  turbopack: {
    // 避免被用户主目录里的其它 lockfile 误导，固定以当前项目为解析根目录。
    root: process.cwd(),
  },
  images: {
    remotePatterns: getR2RemotePattern(),
  },
  headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

const nextConfigWithIntl = withNextIntl(nextConfig);

export default withSentryConfig(nextConfigWithIntl, {
  // 没配 SENTRY_AUTH_TOKEN 时跳过 source map 上传，避免构建噪音；
  // 配上之后 Sentry 里的堆栈才会映射回源码而不是压缩后的产物
  silent: !process.env.CI,
  telemetry: false,
  // 让客户端错误的堆栈能覆盖到 Next 生成的各类 chunk
  widenClientFileUpload: true,
});

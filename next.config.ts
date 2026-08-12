import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// CSP 由 src/proxy.ts 动态生成（每请求一个 nonce 注入到 script-src），
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
  typescript: {
    // 阿里云 2G 服务器部署时跳过 TS 检查（CI 已跑过 tsc --noEmit）
    // Vercel 和本地开发仍然检查（SKIP_TYPE_CHECK 未设）
    ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === '1',
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 768, 1024, 1280, 1536],
    remotePatterns: getR2RemotePattern(),
  },
  headers() {
    return [
      // 静态资源长期缓存（文件名含 content hash）
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // 公开资源
      {
        source: "/favicon.ico",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800" },
        ],
      },
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // trial 路由（/apps/{id}/trial）会被产品详情页的 iframe 同源内嵌，
      // 需要放行 X-Frame-Options；其余页面保持 DENY（防点击劫持）。
      // 注意：规则顺序靠后，且在 Next 中具体 source 优先于通配，因此这里覆盖生效。
      {
        source: "/:locale/apps/:id/trial",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },

  // 文件文章迁移到数据库投稿后的 301 重定向
  async redirects() {
    const slugs: Record<string, string> = {
      // zh
      'baxian-love-is-holding-up': 'rLP5ZNk6CUw',
      'ex-memory-technical-deep-dive': '8mgqUTBA_aE',
      'meteor-store-launch': '6BnBgpSxIYY',
      'meteor-store-literary-imagery-design-philosophy': '6Yqtk5rLvwo',
      'omnicrawl-why-another-crawler': 'jsGpMNYGJHE',
      'skeleton-anatomy-3d-web': '5NBMhcphSpo',
      'spouse-first-in-law': 'IWclJQYnHh8',
      // en (same slugs, different ids)
    };
    const enIds: Record<string, string> = {
      'baxian-love-is-holding-up': 'H2F_SGUPd6Y',
      'ex-memory-technical-deep-dive': 'cb3DqBWjt4c',
      'meteor-store-launch': 'x0lZUuE0mcQ',
      'meteor-store-literary-imagery-design-philosophy': 'MdtXYqdEJS0',
      'omnicrawl-why-another-crawler': 'urxZic77Ldw',
      'skeleton-anatomy-3d-web': '2LefwlrU0Cg',
      'spouse-first-in-law': 'fCkmSkUaQ0E',
    };

    const redirects = [];
    for (const [slug, id] of Object.entries(slugs)) {
      redirects.push({
        source: `/zh/blog/${slug}`,
        destination: `/zh/blog/p/${id}`,
        permanent: true,
      });
    }
    for (const [slug, id] of Object.entries(enIds)) {
      redirects.push({
        source: `/en/blog/${slug}`,
        destination: `/en/blog/p/${id}`,
        permanent: true,
      });
    }
    return redirects;
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

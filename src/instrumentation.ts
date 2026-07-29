import * as Sentry from '@sentry/nextjs';

/** Next.js 在服务端启动时调用一次，按运行时加载对应的 Sentry 配置 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }
}

/** 捕获 App Router 里未被处理的服务端错误（页面、路由处理器、Server Action） */
export const onRequestError = Sentry.captureRequestError;

import * as Sentry from '@sentry/nextjs';
import { scrubSentryEvent } from './lib/sentry-scrub';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  // 浏览器端只保留错误上报：这是个内容站，性能追踪的价值不抵它的包体积与配额消耗
  tracesSampleRate: 0,
  // 不开 Session Replay，它会显著增大客户端包并录制用户界面内容
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  sendDefaultPii: false,
  beforeSend: scrubSentryEvent,
  debug: false,
});

/** 让 Sentry 能标注客户端路由跳转 */
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

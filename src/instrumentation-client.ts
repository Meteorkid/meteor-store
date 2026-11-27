import { scrubSentryEvent } from './lib/sentry-scrub';

type SentryModule = typeof import('@sentry/nextjs');

let sentryPromise: Promise<SentryModule> | null = null;

function loadSentry(): Promise<SentryModule> {
  if (!sentryPromise) {
    sentryPromise = import('@sentry/nextjs').then(Sentry => {
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
      return Sentry;
    });
  }
  return sentryPromise;
}

// Sentry 的浏览器 SDK 约 270KB。它对首屏没有价值，却在每个页面都跟着
// root main chunk 进入关键路径；延迟到浏览器空闲时再加载，错误仍能上报，
// 但 hydration 和首屏交互不必等它。
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
  const idle = window.requestIdleCallback;
  if (typeof idle === 'function') {
    idle(() => void loadSentry(), { timeout: 3000 });
  } else {
    window.setTimeout(() => void loadSentry(), 1500);
  }
}

/** 让 Sentry 能标注客户端路由跳转；首次跳转时会顺带触发 SDK 加载。 */
export function onRouterTransitionStart(
  ...args: Parameters<SentryModule['captureRouterTransitionStart']>
) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  void loadSentry().then(Sentry => Sentry.captureRouterTransitionStart(...args));
}

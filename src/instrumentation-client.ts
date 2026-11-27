import { scrubSentryEvent } from './lib/sentry-scrub';

type SentryModule = typeof import('@sentry/nextjs');

let sentryPromise: Promise<SentryModule> | null = null;
let sentryInitialized = false;

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
      sentryInitialized = true;
      return Sentry;
    });
  }
  return sentryPromise;
}

// Sentry 浏览器 SDK 约 190KB，且初始化会占用主线程。它对首屏和正常浏览没有价值。
// 不要在 load 后定时预加载，也不要在客户端路由跳转时为了一条面包屑把 SDK 拉下来：
// 只有真正发生 error / unhandledrejection 时才按需加载，健康页面一次都不会下载它。
// 早期错误先缓存在内存里，SDK 就绪后补发；监听器本身已经在 SDK 加载前生效。
const EARLY_ERROR_LIMIT = 5;
let earlyErrors: unknown[] = [];

function sendEarlyErrors(Sentry: SentryModule) {
  const errors = earlyErrors;
  earlyErrors = [];
  for (const error of errors) Sentry.captureException(error);
}

function onEarlyError(event: ErrorEvent) {
  if (sentryInitialized) return; // 初始化后由 SDK 自己的全局处理器上报，避免重复
  if (event.error instanceof Error) {
    if (earlyErrors.length < EARLY_ERROR_LIMIT) earlyErrors.push(event.error);
    void loadSentry().then(sendEarlyErrors);
  }
}

function onUnhandledRejection(event: PromiseRejectionEvent) {
  if (sentryInitialized) return;
  if (earlyErrors.length < EARLY_ERROR_LIMIT) earlyErrors.push(event.reason);
  void loadSentry().then(sendEarlyErrors);
}

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
  window.addEventListener('error', onEarlyError);
  window.addEventListener('unhandledrejection', onUnhandledRejection);
}

/**
 * 客户端路由跳转面包屑：只在 SDK 因为真实错误已经加载后才记录。
 * 这里绝不能为了标注跳转而加载 SDK——一次普通点击就是 190KB 的代价。
 */
export function onRouterTransitionStart(
  ...args: Parameters<SentryModule['captureRouterTransitionStart']>
) {
  if (!sentryInitialized || !sentryPromise) return;
  void sentryPromise.then(Sentry => Sentry.captureRouterTransitionStart(...args));
}

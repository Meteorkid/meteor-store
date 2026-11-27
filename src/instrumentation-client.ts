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

// Sentry 浏览器 SDK 约 190KB，且初始化会占用主线程。它对首屏没有价值，
// 却在每个页面都跟着 root runtime 下载；默认空闲加载仍会和首屏抢 CPU
// （Lighthouse 里它的脚本执行接近 1.2 秒）。健康页面等到 load 后 8 秒再加载；
// 真正的早期错误由下面的监听器捕获，再按需提前加载 SDK。
const SENTRY_IDLE_DELAY_MS = 8000;
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

function scheduleSentry() {
  const start = () => {
    const idle = window.requestIdleCallback;
    if (typeof idle === 'function') {
      idle(() => void loadSentry(), { timeout: 3000 });
    } else {
      window.setTimeout(() => void loadSentry(), 1500);
    }
  };
  window.setTimeout(start, SENTRY_IDLE_DELAY_MS);
}

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
  window.addEventListener('error', onEarlyError);
  window.addEventListener('unhandledrejection', onUnhandledRejection);
  if (document.readyState === 'complete') {
    scheduleSentry();
  } else {
    window.addEventListener('load', scheduleSentry, { once: true });
  }
}

/** 让 Sentry 能标注客户端路由跳转；首次跳转时会顺带触发 SDK 加载。 */
export function onRouterTransitionStart(
  ...args: Parameters<SentryModule['captureRouterTransitionStart']>
) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  void loadSentry().then(Sentry => Sentry.captureRouterTransitionStart(...args));
}

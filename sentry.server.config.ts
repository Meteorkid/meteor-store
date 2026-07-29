import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // 只在生产上报：本地调试的报错自己看控制台就够了，不必占用配额
  enabled: process.env.NODE_ENV === 'production',
  // 免费额度有限，性能追踪按 10% 采样；错误本身不受此影响，永远全量上报
  tracesSampleRate: 0.1,
  // 不自动附带 IP、cookie、请求体等个人信息
  sendDefaultPii: false,
  debug: false,
});

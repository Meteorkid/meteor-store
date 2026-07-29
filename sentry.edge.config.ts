import * as Sentry from '@sentry/nextjs';

// middleware 与 edge 运行时走这份配置
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
  debug: false,
});

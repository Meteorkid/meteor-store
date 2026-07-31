import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['zh', 'en'] as const,
  defaultLocale: 'zh',
  localePrefix: 'always', // /zh 和 /en 都带前缀，对称清晰
});

export type Locale = (typeof routing.locales)[number];

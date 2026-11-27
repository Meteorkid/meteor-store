import { isHomepagePath } from './homepage-path';

/**
 * 首页真正会挂载的客户端组件所用到的命名空间。
 *
 * 全站 98 个命名空间一次性进 NextIntlClientProvider 时，首页也要背
 * Pathfinder、后台、账户、法律条款等 50 多组文案；其中 PathfinderHub
 * 一组就比整个首页文案还大。首页只保留这份白名单，其他路由不受影响。
 *
 * 新增首页客户端组件时，记得把它的 useTranslations 命名空间加进来；
 * `i18n-messages.test.ts` 会检查白名单里的命名空间在消息文件里存在。
 */
export const HOMEPAGE_MESSAGE_NAMESPACES = [
  'AppPage',
  'AuthProvider',
  'AvatarUpload',
  'BackToTop',
  'CTASection',
  'Captcha',
  'Comment',
  'EasterEggs',
  'ErrorPage',
  'ExMemoryExperiencePage',
  'FAQSection',
  'FeaturesSection',
  'Footer',
  'GlobalError',
  'Header',
  'HeroSection',
  'HomePage',
  'LoadingQuip',
  'MeteorRunner',
  'MeteorShower',
  'NewsletterSection',
  'NewsletterUnsubscribePage',
  'NotFoundPage',
  'NotificationBell',
  'OpenSourcePage',
  'PartnersSection',
  'PassOwnedBadge',
  'PassStatus',
  'PaymentModal',
  'Paywall',
  'PostStats',
  'PricingCard',
  'PricingPage',
  'PricingSection',
  'ProductDemo',
  'ProductShowcase',
  'ProductsPage',
  'Report',
  'SpotlightSearch',
  'StarMap',
  'StatsSection',
  'StoryLetter',
  'StoryPage',
  'TerminalSection',
  'common',
] as const;

export function selectClientMessages(
  messages: Record<string, unknown>,
  pathname: string | null | undefined,
): Record<string, unknown> {
  if (!isHomepagePath(pathname ?? '')) return messages;
  const allowed = new Set<string>(HOMEPAGE_MESSAGE_NAMESPACES);
  return Object.fromEntries(Object.entries(messages).filter(([namespace]) => allowed.has(namespace)));
}

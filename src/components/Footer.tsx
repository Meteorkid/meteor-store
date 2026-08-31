'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { localizeProducts } from '@/data/products';
import { selectProductLine } from '@/data/product-tracks';
import type { Locale } from '@/i18n/routing';
import { SHOW_PRICING } from '@/lib/constants';
import FooterCopyright from './FooterCopyright';
import BrandMark from './BrandMark';

const resourceLinks = [
  { key: 'docs', href: '/docs' },
  { key: 'blog', href: '/blog' },
  { key: 'story', href: '/story' },
  { key: 'support', href: '/support' },
] as const;

const companyLinks = [
  { key: 'contact', href: '/contact' },
  { key: 'feedback', href: '/feedback' },
] as const;

const legalLinks = [
  { key: 'privacy', href: '/privacy' },
  { key: 'terms', href: '/terms' },
  { key: 'eula', href: '/eula' },
  { key: 'refund', href: '/refund' },
] as const;

interface FooterProps {
  /** 首页版显示社交链接 */
  showSocial?: boolean;
}

export default function Footer({ showSocial = false }: FooterProps) {
  const t = useTranslations('Footer');
  const locale = useLocale() as Locale;
  // 页脚只列主线五款：12 条链接会把这一栏拉得比相邻栏长一倍，
  // 也让「这个站在卖什么」重新变得看不出来。实验室那七款走末尾一个入口
  const productLinks = selectProductLine(localizeProducts(locale)).map((p) => ({
    name: p.name,
    href: `/products/${p.id}`,
  }));

  return (
    <footer className="glass border-t border-white/[0.06]">
      <div className="container mx-auto px-4 py-16">
        <div className={`grid grid-cols-1 md:grid-cols-2 ${SHOW_PRICING ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-12`}>
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BrandMark className="h-7 w-7" />
              <span className="text-xl font-bold gradient-text">
                Meteor Store
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              {t('tagline')}
            </p>

            {showSocial && (
              <div className="flex gap-4">
                <a
                  href="mailto:meteor@stu.gpnu.edu.cn"
                  aria-label={t('email')}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            )}
          </div>

          {/* Products */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">{t('products')}</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/lab" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  {t('lab')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">{t('resources')}</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    {t(link.key)}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`/${locale}/blog/feed.xml`}
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20A2.18 2.18 0 0 1 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1Z" />
                  </svg>
                  {t('rss')}
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          {SHOW_PRICING && (
          <div>
            <h3 className="text-foreground font-semibold mb-4">{t('company')}</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          )}
        </div>

        {/* 星象装饰线：暗夜之上的一线星轨，衬在版权行上方 */}
        <div aria-hidden className="mx-auto mb-6 flex w-full max-w-xs items-center justify-center">
          <svg viewBox="0 0 200 24" className="h-6 w-full opacity-40">
            <path
              d="M16 12 L58 6 L100 18 L158 8 L190 14"
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <circle cx="16" cy="12" r="2" fill="#e8e8f4" />
            <circle cx="58" cy="6" r="2.4" fill="#c9c9dc" />
            <circle cx="100" cy="18" r="2" fill="#dcdce8" />
            <circle cx="158" cy="8" r="2.6" fill="#e8e8f4" />
            <circle cx="190" cy="14" r="2" fill="#cfcfe0" />
          </svg>
        </div>

        {/* 店灯：一盏极简的灯，衬在版权行上方 */}
        <div aria-label="店灯——仍有人在" role="img" className="mx-auto mb-6 flex w-full justify-center">
          <svg viewBox="0 0 24 36" className="h-8 w-auto opacity-25" fill="none">
            {/* 灯座 */}
            <rect x="8" y="30" width="8" height="3" rx="1" fill="rgba(255,255,255,0.5)" />
            {/* 灯身 */}
            <path d="M9 30 L7 14 L17 14 L15 30 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
            {/* 灯芯 / 火焰 */}
            <ellipse cx="12" cy="11" rx="2.5" ry="4" fill="rgba(251,191,36,0.35)" />
            <ellipse cx="12" cy="10" rx="1.2" ry="2.5" fill="rgba(251,191,36,0.55)" />
            {/* 光晕 */}
            <circle cx="12" cy="8" r="6" fill="rgba(251,191,36,0.06)" />
          </svg>
        </div>

        {/*
          一个不起眼的入口，通往断网兜底页里的小游戏。
          文案不直说是游戏——页脚这一带（星轨、店灯）本来就是留给闲笔的地方，
          说破了反而不像彩蛋；aria-label 补上真实用途，读屏用户不会被绕进去。

          **必须用原生 <a> 而不是 next-intl 的 Link**：/offline.html 是 public/ 下的
          静态文件，Link 会给它加上 locale 前缀变成 /zh/offline.html，那是个 404。
        */}
        <div className="mb-8 flex justify-center">
          <a
            href="/offline.html"
            aria-label={t('playAwayLabel')}
            className="t-footnote group inline-flex items-center gap-1.5 text-white/60 transition-colors hover:text-white/85"
          >
            <svg viewBox="0 0 16 16" aria-hidden className="h-3 w-3 opacity-70 transition-opacity group-hover:opacity-100">
              <path d="M8 1 L13 8 L8 15 L3 8 Z" fill="currentColor" />
            </svg>
            {t('playAway')}
          </a>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-6 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <FooterCopyright />
            <div className="flex gap-6">
              {legalLinks.map((link) => (
                <Link key={link.key} href={link.href} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  {t(link.key)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

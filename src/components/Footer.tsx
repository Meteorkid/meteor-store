'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { localizeProducts } from '@/data/products';
import type { Locale } from '@/i18n/routing';
import { SHOW_PRICING } from '@/lib/constants';
import FooterCopyright from './FooterCopyright';

const resourceLinks = [
  { key: 'docs', href: '/docs' },
  { key: 'blog', href: '/blog' },
  { key: 'story', href: '/story' },
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
  const products = localizeProducts(locale);

  const productLinks = products.map((p) => ({
    name: p.name,
    href: `/products/${p.id}`,
  }));

  return (
    <footer className="border-t border-border bg-background/50">
      <div className="container mx-auto px-4 py-16">
        <div className={`grid grid-cols-1 md:grid-cols-2 ${SHOW_PRICING ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-12`}>
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🚀</span>
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

        {/* Bottom bar */}
        <div className="border-t border-border mt-12 pt-8">
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

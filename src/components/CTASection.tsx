'use client';

import { useTranslations } from 'next-intl';
import GlowButton from './GlowButton';
import BlackHole from './BlackHole';
import { SHOW_PRICING } from '@/lib/constants';

interface CTASectionProps {
  variant?: 'bold' | 'subtle';
}

export default function CTASection({ variant = 'subtle' }: CTASectionProps) {
  const t = useTranslations('CTASection');
  const isBold = variant === 'bold';

  const trustBadges = SHOW_PRICING
    ? [t('badgeOpenSource'), t('badgeLifetimeUpdates'), t('badgeRefund')]
    : [t('badgeOpenSource'), t('badgeLifetimeUpdates')];

  return (
    <section className="relative py-16 md:py-24 overflow-visible">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl flex flex-col items-center">

          {/* 黑洞 —— 上方视觉中心 */}
          {isBold && (
            <div className="w-full max-w-[500px] mx-auto mb-6 md:mb-10">
              <BlackHole />
            </div>
          )}

          {/* CTA 文字 —— 黑洞下方 */}
          <div className="text-center">
            <h2 className="t-title-1 mb-4 text-white">
              {isBold ? t('boldTitle') : t('subtleTitle')}
            </h2>

            <p className="text-lg mb-8 text-white/70">
              {isBold
                ? t('boldDesc')
                : SHOW_PRICING ? t('subtleDescPricing') : t('subtleDescNoPricing')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlowButton variant="primary" size="lg" renderAs="a" href="/products">
                {t('browseProducts')}
              </GlowButton>
              <GlowButton
                variant="ghost"
                size="lg"
                renderAs="a"
                href="/docs"
                className="border-white/30 text-white hover:bg-white/10"
              >
                {t('githubOpenSource')}
              </GlowButton>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-white/60">
              {trustBadges.map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

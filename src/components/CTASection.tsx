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
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* 黑洞背景 — 全宽无边框中展示 */}
      {isBold && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-[700px] aspect-square">
            <BlackHole />
          </div>
        </div>
      )}

      {/* CTA 内容 — 浮在黑洞上方 */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="t-title-1 mb-4 text-white">
            {isBold ? t('boldTitle') : t('subtleTitle')}
          </h2>

          <p className="text-lg mb-8 text-white/70">
            {isBold
              ? t('boldDesc')
              : SHOW_PRICING ? t('subtleDescPricing') : t('subtleDescNoPricing')}
          </p>

          {/* CTA Buttons */}
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

          {/* Trust Badges */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-white/60">
            {trustBadges.map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-white/80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

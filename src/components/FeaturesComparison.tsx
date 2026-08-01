'use client';

import { useTranslations } from 'next-intl';
import { CheckIconSm } from './CheckIcon';

const plans = [
  {
    name: 'Basic',
    priceKey: 'plan1Price',
    descKey: 'plan1Desc',
    featureKeys: [
      { key: 'featureCore', included: true },
      { key: 'featureCommunitySupport', included: true },
      { key: 'featureBasicDocs', included: true },
      { key: 'featureApiAccess', included: false },
      { key: 'featurePrioritySupport', included: false },
      { key: 'featureCustomDev', included: false },
    ],
  },
  {
    name: 'Pro',
    price: '¥99',
    periodKey: 'plan2Period',
    descKey: 'plan2Desc',
    popular: true,
    featureKeys: [
      { key: 'featureCore', included: true },
      { key: 'featureCommunitySupport', included: true },
      { key: 'featureFullDocs', included: true },
      { key: 'featureApiAccess', included: true },
      { key: 'featurePrioritySupport', included: true },
      { key: 'featureCustomDev', included: false },
    ],
  },
  {
    name: 'Enterprise',
    priceKey: 'plan3Price',
    descKey: 'plan3Desc',
    featureKeys: [
      { key: 'featureCore', included: true },
      { key: 'featureDedicatedSupport', included: true },
      { key: 'featureFullDocs', included: true },
      { key: 'featureApiAccess', included: true },
      { key: 'featurePrioritySupport', included: true },
      { key: 'featureCustomDev', included: true },
    ],
  },
];

export default function FeaturesComparison() {
  const t = useTranslations('FeaturesComparison');

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-animate">
          <p className="text-sm text-primary uppercase tracking-widest font-medium mb-4">{t('eyebrow')}</p>
          <h2 className="t-title-1 text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 transition-all duration-300 scroll-animate ${
                plan.popular
                  ? 'border-primary/50 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent shadow-xl shadow-primary/10'
                  : 'border-white/[0.06] bg-white/[0.02]'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-[11px] font-semibold text-white tracking-wide uppercase">
                    {t('popular')}
                  </span>
                </div>
              )}

              <h3 className={`text-sm font-medium mb-2 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`}>
                {plan.name}
              </h3>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold text-white">{plan.priceKey ? t(plan.priceKey) : plan.price}</span>
                {plan.periodKey && <span className="text-sm text-white/40">{t(plan.periodKey)}</span>}
              </div>

              <p className="text-xs text-white/30 mb-6">{t(plan.descKey)}</p>

              <ul className="space-y-3">
                {plan.featureKeys.map((f) => (
                  <li key={f.key} className="flex items-center gap-2.5 text-sm">
                    {f.included ? (
                      <CheckIconSm />
                    ) : (
                      <svg className="w-4 h-4 text-white/15 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className={f.included ? 'text-white/60' : 'text-white/25'}>{t(f.key)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

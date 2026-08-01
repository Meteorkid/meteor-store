'use client';

import { useTranslations } from 'next-intl';
import CheckIcon from './CheckIcon';
import GlassCard from './GlassCard';

interface Feature {
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
  itemKeys?: string[];
}

const allFeatures: Feature[] = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    titleKey: 'feature1Title',
    descKey: 'feature1Desc',
    itemKeys: ['feature1Item1', 'feature1Item2', 'feature1Item3', 'feature1Item4'],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    titleKey: 'feature2Title',
    descKey: 'feature2Desc',
    itemKeys: ['feature2Item1', 'feature2Item2', 'feature2Item3', 'feature2Item4'],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    titleKey: 'feature3Title',
    descKey: 'feature3Desc',
    itemKeys: ['feature3Item1', 'feature3Item2', 'feature3Item3', 'feature3Item4'],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    titleKey: 'feature4Title',
    descKey: 'feature4Desc',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    titleKey: 'feature5Title',
    descKey: 'feature5Desc',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    titleKey: 'feature6Title',
    descKey: 'feature6Desc',
  },
];

interface FeaturesSectionProps {
  layout?: 'grid' | 'list';
  title?: string;
  subtitle?: string;
  featureCount?: number;
}

export default function FeaturesSection({
  layout = 'grid',
  title,
  subtitle,
  featureCount,
}: FeaturesSectionProps) {
  const t = useTranslations('FeaturesSection');
  const features = featureCount ? allFeatures.slice(0, featureCount) : allFeatures;

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-animate">
          <p className="text-sm text-primary uppercase tracking-widest font-medium mb-4">{t('eyebrow')}</p>
          <h2 className="t-title-1 text-foreground mb-4">{title ?? t('title')}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{subtitle ?? t('subtitle')}</p>
        </div>

        {layout === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <GlassCard
                key={feature.titleKey}
                className="group p-6 rounded-2xl scroll-animate"
                tilt
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  {feature.icon}
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {t(feature.titleKey)}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">{t(feature.descKey)}</p>

                {feature.itemKeys && (
                  <ul className="mt-4 space-y-1.5">
                    {feature.itemKeys.map((itemKey) => (
                      <li key={itemKey} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckIcon />
                        {t(itemKey)}
                      </li>
                    ))}
                  </ul>
                )}
              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature.titleKey}
                className="flex gap-5 scroll-animate"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{t(feature.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t(feature.descKey)}</p>

                  {feature.itemKeys && (
                    <ul className="space-y-1.5">
                      {feature.itemKeys.map((itemKey) => (
                        <li key={itemKey} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckIcon />
                          {t(itemKey)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

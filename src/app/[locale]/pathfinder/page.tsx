import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PathfinderClient from './PathfinderClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PathfinderPage' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    robots: { index: true, follow: true },
  };
}

const PAIN_ICONS = ['🗺️', '🧩', '📱'] as const;
const PLEDGE_ICONS = ['🎁', '🔒', '🚫', '📡'] as const;

export default async function PathfinderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'PathfinderPage' });

  const pains = [
    { icon: PAIN_ICONS[0], title: t('pain1Title'), desc: t('pain1Desc') },
    { icon: PAIN_ICONS[1], title: t('pain2Title'), desc: t('pain2Desc') },
    { icon: PAIN_ICONS[2], title: t('pain3Title'), desc: t('pain3Desc') },
  ];

  const pledges = [
    { icon: PLEDGE_ICONS[0], title: t('pledge1Title'), desc: t('pledge1Desc') },
    { icon: PLEDGE_ICONS[1], title: t('pledge2Title'), desc: t('pledge2Desc') },
    { icon: PLEDGE_ICONS[2], title: t('pledge3Title'), desc: t('pledge3Desc') },
    { icon: PLEDGE_ICONS[3], title: t('pledge4Title'), desc: t('pledge4Desc') },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
    <main className="pb-24 pt-12 sm:pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <section className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-6 flex-wrap justify-center">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-6/20 text-purple-200 border border-purple-5/30">
              {t('badgeMain')}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/15 text-orange-300 border border-orange-500/30">
              {t('badgeExtra')}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-300 border border-green-500/30">
              {t('badgeFree')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 gradient-text">
            {t('heroTitle')}
          </h1>
          <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-2xl mx-auto">
            {t('heroSubtitle')}<span className="text-purple-300 font-semibold">{t('heroSubtitleHighlight')}</span>{t('heroSubtitleSuffix')}
          </p>
          <p className="mt-4 text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t('heroDescription')}
          </p>
        </section>

        {/* 痛点说明 */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6 text-center">
            {t('painsTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {pains.map((p) => (
              <div key={p.title} className="glass-card rounded-2xl p-5">
                <div className="text-2xl mb-3" aria-hidden="true">{p.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 表单与结果：现实条件 → 今天开始 → 计划被打断 */}
        <PathfinderClient />

        {/* 公益承诺区 */}
        <section className="mt-16 sm:mt-24 max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6 text-center">
            {t('pledgesTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pledges.map((p) => (
              <div key={p.title} className="glass-card rounded-2xl p-5">
                <div className="text-2xl mb-2" aria-hidden="true">{p.icon}</div>
                <h3 className="font-semibold text-foreground mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* 隐私说明 */}
          <div className="mt-6 text-xs text-muted-foreground bg-black/15 border border-white/10 rounded-xl p-4 leading-relaxed">
            <p className="font-medium text-foreground/80 mb-1">{t('privacyTitle')}</p>
            <p>
              {t('privacyContent')}
            </p>
          </div>
        </section>

        {/* 结尾行动号召 */}
        <section className="mt-16 sm:mt-24 text-center">
          <p className="text-2xl sm:text-3xl font-bold gradient-text mb-4">
            {t('ctaTitle')}
          </p>
          <Link
            href="#conditions"
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-purple-6 to-violet-6 text-white font-semibold shadow-lg shadow-purple-6/30 hover:shadow-purple-6/50 transition"
          >
            {t('ctaButton')}
          </Link>
        </section>
      </div>
    </main>
      <Footer />
    </div>
  );
}

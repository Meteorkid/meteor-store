import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAdminPageSession } from '@/lib/admin-session';
import { isAdminSession } from '@/lib/admin';
import { getAdminStats } from '@/lib/admin-stats';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AdminDashboardPage' });
  const session = await getAdminPageSession();
  const allowed = session && isAdminSession(session);
  return {
    title: allowed ? t('metaTitle') : t('metaNotFound'),
    robots: { index: false, follow: false },
  };
}

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'AdminDashboardPage' });
  const session = await getAdminPageSession();
  if (!session || !isAdminSession(session)) notFound();

  const stats = await getAdminStats();

  const cards = [
    { label: t('totalPosts'), value: stats.totalPosts },
    { label: t('publishedPosts'), value: stats.publishedPosts },
    { label: t('pendingPosts'), value: stats.pendingPosts },
    { label: t('totalComments'), value: stats.totalComments },
    { label: t('pendingComments'), value: stats.pendingComments },
    { label: t('pendingReports'), value: stats.pendingReports },
    { label: t('pendingFeedback'), value: stats.pendingFeedback },
    { label: t('totalUsers'), value: stats.totalUsers },
  ];

  const passCards = [
    { label: t('activePass'), value: stats.activePassCount },
    { label: t('passMonthly'), value: stats.passMonthly },
    { label: t('passAnnual'), value: stats.passAnnual },
    { label: t('passLifetime'), value: stats.passLifetime },
    { label: t('inviteRedemptions'), value: stats.inviteRedemptionCount },
  ];

  return (
    <>
      <header className="mb-8">
        <h1 className="t-title-2">{t('title')}</h1>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="glass-card rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6"
          >
            <p className="t-footnote text-white/50">{card.label}</p>
            <p className="t-title-1 mt-2 text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <h2 className="t-title-3 mt-12 mb-4 text-white/70">{t('passSection')}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {passCards.map((card) => (
          <div
            key={card.label}
            className="glass-card rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-6"
          >
            <p className="t-footnote text-emerald-300/70">{card.label}</p>
            <p className="t-title-1 mt-2 text-emerald-300">{card.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}

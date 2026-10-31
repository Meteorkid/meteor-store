import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAdminPageSession } from '@/lib/admin-session';
import { isAdminSession } from '@/lib/admin';
import { getAdminStats } from '@/lib/admin-stats';
import { Link } from '@/i18n/navigation';

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
    { label: t('totalPosts'), value: stats.totalPosts, href: '/admin/posts' },
    { label: t('publishedPosts'), value: stats.publishedPosts, href: '/admin/posts' },
    { label: t('pendingPosts'), value: stats.pendingPosts, href: '/admin/review' },
    { label: t('totalComments'), value: stats.totalComments, href: '/admin/comments' },
    { label: t('pendingComments'), value: stats.pendingComments, href: '/admin/comments' },
    { label: t('pendingReports'), value: stats.pendingReports, href: '/admin/reports?status=pending' },
    { label: t('pendingFeedback'), value: stats.pendingFeedback, href: '/admin/feedback' },
    { label: t('totalUsers'), value: stats.totalUsers, href: '/admin/users' },
  ];

  const passCards = [
    { label: t('activePass'), value: stats.activePassCount, href: '/admin/commerce', action: t('viewOrders') },
    { label: t('passMonthly'), value: stats.passMonthly, href: '/admin/commerce', action: t('viewOrders') },
    { label: t('passAnnual'), value: stats.passAnnual, href: '/admin/commerce', action: t('viewOrders') },
    { label: t('passLifetime'), value: stats.passLifetime, href: '/admin/commerce', action: t('viewOrders') },
    { label: t('inviteRedemptions'), value: stats.inviteRedemptionCount, href: '/admin/users', action: t('viewAccounts') },
  ];

  return (
    <>
      <header className="mb-8">
        <h1 className="t-title-2">{t('title')}</h1>
        <p className="t-footnote mt-2 text-white/70">{t('navigationHint')}</p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="glass-card block min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300 active:border-violet-300/60 sm:p-6"
          >
            <p className="t-footnote text-white/70">{card.label}</p>
            <p className="t-title-1 mt-2 text-white">{card.value}</p>
            <span className="t-footnote mt-3 flex items-center justify-between gap-2 text-violet-200">{t('viewDetails')}<span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </div>

      <h2 className="t-title-3 mt-12 mb-4 text-white/70">{t('passSection')}</h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {passCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="glass-card block min-w-0 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300 active:border-emerald-300/60 sm:p-6"
          >
            <p className="t-footnote text-emerald-300/70">{card.label}</p>
            <p className="t-title-1 mt-2 text-emerald-300">{card.value}</p>
            <span className="t-footnote mt-3 flex items-center justify-between gap-2 text-emerald-200">{card.action}<span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </div>
    </>
  );
}

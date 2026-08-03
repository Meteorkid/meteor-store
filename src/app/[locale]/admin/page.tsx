import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminNav from '@/components/AdminNav';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { getAdminStats } from '@/lib/admin-stats';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AdminDashboardPage' });
  const session = await getSession();
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
  const session = await getSession();
  if (!session || !isAdminSession(session)) notFound();

  const stats = await getAdminStats();

  const cards = [
    { label: t('totalPosts'), value: stats.totalPosts },
    { label: t('publishedPosts'), value: stats.publishedPosts },
    { label: t('pendingPosts'), value: stats.pendingPosts },
    { label: t('totalComments'), value: stats.totalComments },
    { label: t('pendingComments'), value: stats.pendingComments },
    { label: t('totalUsers'), value: stats.totalUsers },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8">
            <h1 className="t-title-2">{t('title')}</h1>
          </header>

          <AdminNav />

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
        </div>
      </main>
      <Footer />
    </div>
  );
}
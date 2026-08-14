import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminNav from '@/components/AdminNav';
import AdminMfaManager from '@/components/AdminMfaManager';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AdminMfaPage' });
  const session = await getSession();
  const allowed = session && isAdminSession(session);
  return {
    title: allowed ? t('metaTitle') : t('metaNotFound'),
    robots: { index: false, follow: false },
  };
}

export const dynamic = 'force-dynamic';

export default async function AdminMfaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'AdminMfaPage' });
  const session = await getSession();
  if (!session || !isAdminSession(session)) notFound();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8">
            <h1 className="t-title-2">{t('title')}</h1>
            <p className="t-footnote mt-2 text-white/50">{t('subtitle')}</p>
          </header>

          <AdminNav />

          <AdminMfaManager />
        </div>
      </main>
      <Footer />
    </div>
  );
}

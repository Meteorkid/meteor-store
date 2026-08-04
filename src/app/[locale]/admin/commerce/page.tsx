import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminNav from '@/components/AdminNav';
import CommerceManager from '@/components/CommerceManager';
import { isAdminSession } from '@/lib/admin';
import { listCommerceOperations } from '@/lib/admin-commerce';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AdminCommercePage' });
  const session = await getSession();
  return {
    title: session && isAdminSession(session) ? t('metaTitle') : t('metaNotFound'),
    robots: { index: false, follow: false },
  };
}

export default async function AdminCommercePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'AdminCommercePage' });
  const session = await getSession();
  if (!session || !isAdminSession(session)) notFound();

  const data = await listCommerceOperations();
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8">
            <h1 className="t-title-2">{t('title')}</h1>
            <p className="mt-2 text-sm text-white/55">{t('description')}</p>
          </header>
          <AdminNav />
          <div className="mt-8">
            <CommerceManager initialOrders={data.orders} initialLicenses={data.licenses} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

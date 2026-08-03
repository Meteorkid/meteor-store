import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InviteCodeManager from '@/components/InviteCodeManager';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { products } from '@/data/products';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AdminInviteCodesPage' });
  const session = await getSession();
  const allowed = session && isAdminSession(session);
  return {
    title: allowed ? t('metaTitle') : t('metaNotFound'),
    robots: { index: false, follow: false },
  };
}

export const dynamic = 'force-dynamic';

export default async function InviteCodesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'AdminInviteCodesPage' });
  const session = await getSession();
  if (!session || !isAdminSession(session)) notFound();

  const productOptions = products.map((p) => ({
    id: p.id,
    name: p.name[locale as Locale],
    plans: p.pricing.map((pr) => ({
      id: pr.id,
      name: pr.name[locale as Locale],
    })),
  }));

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8">
            <h1 className="t-title-2">{t('title')}</h1>
            <p className="mt-2 text-sm text-gray-400">
              {t('description')}
            </p>
          </header>
          <InviteCodeManager products={productOptions} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

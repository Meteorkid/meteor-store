import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WechatBindForm from '@/components/WechatBindForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'WechatBindPage' });
  return { title: t('title'), robots: { index: false, follow: false } };
}

export default async function WechatBindPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto flex items-center justify-center px-4 py-16 md:py-24">
        <Suspense fallback={<div className="h-64 w-full max-w-sm animate-pulse rounded-2xl border border-white/10 bg-white/5" />}>
          <WechatBindForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

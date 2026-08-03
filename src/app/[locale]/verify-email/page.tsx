import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VerifyEmailClient from '@/components/VerifyEmailClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'VerifyEmailPage' });
  return {
    title: t('metaTitle'),
    robots: { index: false, follow: false },
  };
}

export default async function VerifyEmailPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-16">
        <VerifyEmailClient />
      </main>
      <Footer />
    </div>
  );
}

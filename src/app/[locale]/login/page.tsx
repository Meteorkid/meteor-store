import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthForm from '@/components/AuthForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'LoginPage' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ verified?: string }>;
}) {
  const { locale } = await params;
  const { verified } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'LoginPage' });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto flex items-center justify-center px-4 py-16 md:py-24">
        <AuthForm verified={verified === '1'} />
      </main>
      <Footer />
    </div>
  );
}

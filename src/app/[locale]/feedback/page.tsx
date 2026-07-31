import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeedbackForm from './FeedbackForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'FeedbackPage' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'FeedbackPage' });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
          <p className="text-gray-400 mb-10">
            {t('description')}
          </p>
          <FeedbackForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}

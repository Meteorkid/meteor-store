import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import NewsletterUnsubscribeForm from '@/components/NewsletterUnsubscribeForm';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'NewsletterUnsubscribePage' });
  return { title: t('metaTitle'), robots: { index: false, follow: false } };
}

export default async function NewsletterUnsubscribePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-16">
        <NewsletterUnsubscribeForm />
      </main>
      <Footer />
    </div>
  );
}

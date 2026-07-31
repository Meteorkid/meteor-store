import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TermsPage' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TermsPage' });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto prose prose-invert prose-gray">
          <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
          <p className="text-gray-400 text-sm mb-8">{t('lastUpdated')}：2025 年 1 月</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section1Title')}</h2>
            <p className="text-gray-300 leading-relaxed">
              {t('section1Content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section2Title')}</h2>
            <p className="text-gray-300 leading-relaxed">
              {t('section2Content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section3Title')}</h2>
            <ul className="text-gray-300 leading-relaxed space-y-1 list-disc list-inside">
              <li>{t('payment1')}</li>
              <li>{t('payment2')}</li>
              <li>{t('payment3')}</li>
              <li>{t('payment4')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section4Title')}</h2>
            <p className="text-gray-300 leading-relaxed">
              {t('section4Content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section5Title')}</h2>
            <p className="text-gray-300 leading-relaxed">
              {t('section5Content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section6Title')}</h2>
            <p className="text-gray-300 leading-relaxed">
              {t('section6Content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section7Title')}</h2>
            <p className="text-gray-300 leading-relaxed">
              {t('section7Content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section8Title')}</h2>
            <p className="text-gray-300 leading-relaxed">
              {t('section8Content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section9Title')}</h2>
            <p className="text-gray-300 leading-relaxed">
              {t('section9Content')}
            </p>
            <p className="text-gray-300 mt-2">
              {t('email')}：<a href="mailto:meteor@stu.gpnu.edu.cn" className="text-purple-400 hover:text-purple-300">meteor@stu.gpnu.edu.cn</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

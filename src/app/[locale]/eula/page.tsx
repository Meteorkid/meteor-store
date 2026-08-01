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
  const t = await getTranslations({ locale, namespace: 'EulaPage' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function EulaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'EulaPage' });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto prose prose-invert prose-gray">
          <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
          <p className="text-gray-400 text-sm mb-8">{t('lastUpdated')}：{t('lastUpdatedDate')}</p>

          <section className="mb-8">
            <p className="text-gray-300 leading-relaxed">
              {t('intro')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section1Title')}</h2>
            <ul className="text-gray-300 leading-relaxed space-y-1 list-disc list-inside">
              <li>{t('license1')}</li>
              <li>{t('license2')}</li>
              <li>{t('license3')}</li>
              <li>{t('license4')}</li>
              <li>{t('license5')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section2Title')}</h2>
            <p className="text-gray-300 leading-relaxed mb-2">{t('restrictionIntro')}</p>
            <ul className="text-gray-300 leading-relaxed space-y-1 list-disc list-inside">
              <li>{t('restriction1')}</li>
              <li>{t('restriction2')}</li>
              <li>{t('restriction3')}</li>
              <li>{t('restriction4')}</li>
              <li>{t('restriction5')}</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-2">
              {t('openSourceNote')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section3Title')}</h2>
            <p className="text-gray-300 leading-relaxed">
              {t('section3Content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section4Title')}</h2>
            <ul className="text-gray-300 leading-relaxed space-y-1 list-disc list-inside">
              <li>{t('activation1')}</li>
              <li>{t('activation2')}</li>
              <li>{t('activation3')}</li>
            </ul>
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

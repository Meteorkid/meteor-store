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
  const t = await getTranslations({ locale, namespace: 'RefundPage' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function RefundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'RefundPage' });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto prose prose-invert prose-gray">
          <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
          <p className="text-gray-400 text-sm mb-8">{t('lastUpdated')}：2026 年 7 月</p>

          <section className="mb-8">
            <p className="text-gray-300 leading-relaxed">
              {t('intro')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section1Title')}</h2>
            <ul className="text-gray-300 leading-relaxed space-y-1 list-disc list-inside">
              <li><strong>{t('refund1Title')}</strong>：{t('refund1Desc')}</li>
              <li><strong>{t('refund2Title')}</strong>：{t('refund2Desc')}</li>
              <li><strong>{t('refund3Title')}</strong>：{t('refund3Desc')}</li>
              <li><strong>{t('refund4Title')}</strong>：{t('refund4Desc')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section2Title')}</h2>
            <ul className="text-gray-300 leading-relaxed space-y-1 list-disc list-inside">
              <li>{t('noRefund1')}</li>
              <li>{t('noRefund2')}</li>
              <li>{t('noRefund3')}</li>
              <li>{t('noRefund4')}</li>
              <li>{t('noRefund5')}</li>
              <li>{t('noRefund6')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section3Title')}</h2>
            <ol className="text-gray-300 leading-relaxed space-y-1 list-decimal list-inside">
              <li>{t('process1')}</li>
              <li>{t('process2')}</li>
              <li>{t('process3')}</li>
              <li>{t('process4')}</li>
              <li>{t('process5')}</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('section4Title')}</h2>
            <ul className="text-gray-300 leading-relaxed space-y-1 list-disc list-inside">
              <li>{t('afterRefund1')}</li>
              <li>{t('afterRefund2')}</li>
              <li>{t('afterRefund3')}</li>
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
              {t('email')}：<a href="mailto:meteor@stu.gpnu.edu.cn" className="text-purple-400 hover:text-purple-300">meteor@stu.gpnu.edu.cn</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

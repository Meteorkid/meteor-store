import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/navigation';
import { OPERATOR } from '@/lib/constants';

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
          <p className="text-gray-400 text-sm mb-8">{t('lastUpdated')}：{t('lastUpdatedDate')}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('operatorTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('operatorContent')}</p>
            <dl className="text-gray-300 leading-relaxed mt-3 space-y-1">
              {OPERATOR.name && (
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-gray-500">{t('operatorName')}：</dt>
                  <dd>{OPERATOR.name}</dd>
                </div>
              )}
              {OPERATOR.creditCode && (
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-gray-500">{t('operatorCreditCode')}：</dt>
                  <dd>{OPERATOR.creditCode}</dd>
                </div>
              )}
              {OPERATOR.address && (
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-gray-500">{t('operatorAddress')}：</dt>
                  <dd>{OPERATOR.address}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('serviceTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('serviceContent')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('accountTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('accountContent')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('paymentTitle')}</h2>
            <ul className="text-gray-300 leading-relaxed space-y-1 list-disc list-inside">
              <li>{t('payment1')}</li>
              <li>{t('payment2')}</li>
              <li>{t('payment3')}</li>
              <li>{t('payment4')}</li>
              <li>{t('payment5')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('refundTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('refundContent')}</p>
            <p className="mt-2">
              <Link href="/refund" className="text-purple-400 hover:text-purple-300">{t('refundLinkText')}</Link>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('ipTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('ipContent')}</p>
            <p className="mt-2">
              <Link href="/eula" className="text-purple-400 hover:text-purple-300">{t('ipLinkText')}</Link>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('conductTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('conductContent')}</p>
            <ul className="text-gray-300 leading-relaxed mt-2 space-y-1 list-disc list-inside">
              <li>{t('conduct1')}</li>
              <li>{t('conduct2')}</li>
              <li>{t('conduct3')}</li>
              <li>{t('conduct4')}</li>
              <li>{t('conduct5')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('disclaimerTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('disclaimerContent')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terminationTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('terminationContent')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('changesTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('changesContent')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('lawTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('lawContent')}</p>
            {OPERATOR.jurisdiction && (
              <p className="text-gray-300 mt-2">
                {t('lawJurisdiction')}：{OPERATOR.jurisdiction}
              </p>
            )}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('contactTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('contactContent')}</p>
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

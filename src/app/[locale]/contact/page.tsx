import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { OPERATOR } from '@/lib/constants';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ContactPage' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ContactPage' });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-gray-400 text-lg mb-12">
            {t('description')}
          </p>

          {/* 联系方式卡片 */}
          <div className="space-y-6">
            {/* 经营者信息（《电子商务法》第 15 条要求的主体公示） */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg>
                <h2 className="text-lg font-semibold">{t('operatorTitle')}</h2>
              </div>
              <dl className="space-y-2 text-sm">
                {OPERATOR.name && (
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-gray-500">{t('operatorName')}：</dt>
                    <dd className="text-gray-300">{OPERATOR.name}</dd>
                  </div>
                )}
                {OPERATOR.creditCode && (
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-gray-500">{t('operatorCreditCode')}：</dt>
                    <dd className="text-gray-300">{OPERATOR.creditCode}</dd>
                  </div>
                )}
                {OPERATOR.address && (
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-gray-500">{t('operatorAddress')}：</dt>
                    <dd className="text-gray-300">{OPERATOR.address}</dd>
                  </div>
                )}
              </dl>
              <p className="mt-4 text-xs text-gray-600">{t('operatorNote')}</p>
            </div>

            {/* 邮箱 */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                <h2 className="text-lg font-semibold">{t('email')}</h2>
              </div>
              <p className="text-gray-400 mb-3">
                {t('emailDescription')}
              </p>
              <a
                href="mailto:meteor@stu.gpnu.edu.cn"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                meteor@stu.gpnu.edu.cn
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            {/* 工作时间 */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h2 className="text-lg font-semibold">{t('responseTime')}</h2>
              </div>
              <p className="text-gray-400">
                {t('responseDescription')}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

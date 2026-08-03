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
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🏪</span>
                <h2 className="text-lg font-semibold">{t('operatorTitle')}</h2>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-gray-500">{t('operatorName')}：</dt>
                  <dd className="text-gray-300">{t('operatorNamePlaceholder')}</dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-gray-500">{t('operatorCreditCode')}：</dt>
                  <dd className="text-gray-300">{t('operatorCreditCodePlaceholder')}</dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-gray-500">{t('operatorAddress')}：</dt>
                  <dd className="text-gray-300">{t('operatorAddressPlaceholder')}</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs text-gray-600">{t('operatorNote')}</p>
            </div>

            {/* 邮箱 */}
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📧</span>
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

            {/* GitHub */}
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🐙</span>
                <h2 className="text-lg font-semibold">GitHub</h2>
              </div>
              <p className="text-gray-400 mb-3">
                {t('githubDescription')}
              </p>
              <a
                href="https://github.com/Meteorkid"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                github.com/Meteorkid
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            {/* 工作时间 */}
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">⏰</span>
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

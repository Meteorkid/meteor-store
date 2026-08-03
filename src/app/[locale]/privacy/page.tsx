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
  const t = await getTranslations({ locale, namespace: 'PrivacyPage' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PrivacyPage' });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto prose prose-invert prose-gray">
          <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
          <p className="text-gray-400 text-sm mb-8">{t('lastUpdated')}：{t('lastUpdatedDate')}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('controllerTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('controllerContent')}</p>
            <dl className="text-gray-300 leading-relaxed mt-3 space-y-1">
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-gray-500">{t('controllerName')}：</dt>
                <dd>{t('controllerNamePlaceholder')}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-gray-500">{t('controllerAddress')}：</dt>
                <dd>{t('controllerAddressPlaceholder')}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-gray-500">{t('controllerEmail')}：</dt>
                <dd><a href="mailto:meteor@stu.gpnu.edu.cn" className="text-purple-400 hover:text-purple-300">meteor@stu.gpnu.edu.cn</a></dd>
              </div>
            </dl>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('collectTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('collectContent')}</p>
            <ul className="text-gray-300 leading-relaxed mt-2 space-y-1 list-disc list-inside">
              <li><strong>{t('accountInfo')}</strong>：{t('accountInfoDesc')}</li>
              <li><strong>{t('paymentInfo')}</strong>：{t('paymentInfoDesc')}</li>
              <li><strong>{t('usageData')}</strong>：{t('usageDataDesc')}</li>
              <li><strong>{t('contactInfo')}</strong>：{t('contactInfoDesc')}</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-3">{t('collectSensitiveNote')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('basisTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('basisContent')}</p>
            <ul className="text-gray-300 leading-relaxed mt-2 space-y-1 list-disc list-inside">
              <li>{t('basis1')}</li>
              <li>{t('basis2')}</li>
              <li>{t('basis3')}</li>
              <li>{t('basis4')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('useTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('useContent')}</p>
            <ul className="text-gray-300 leading-relaxed mt-2 space-y-1 list-disc list-inside">
              <li>{t('purpose1')}</li>
              <li>{t('purpose2')}</li>
              <li>{t('purpose3')}</li>
              <li>{t('purpose4')}</li>
              <li>{t('purpose5')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('cookieTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('cookieContent')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('shareTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('shareContent')}</p>
            <ul className="text-gray-300 leading-relaxed mt-2 space-y-1 list-disc list-inside">
              <li>{t('share1')}</li>
              <li>{t('share2')}</li>
              <li>{t('share3')}</li>
              <li>{t('share4')}</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-3">{t('shareThirdPartyNote')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('retentionTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('retentionContent')}</p>
            <ul className="text-gray-300 leading-relaxed mt-2 space-y-1 list-disc list-inside">
              <li>{t('retention1')}</li>
              <li>{t('retention2')}</li>
              <li>{t('retention3')}</li>
              <li>{t('retention4')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('crossBorderTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('crossBorderContent')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('securityTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('securityContent')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('minorsTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('minorsContent')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('rightsTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('rightsContent')}</p>
            <ul className="text-gray-300 leading-relaxed mt-2 space-y-1 list-disc list-inside">
              <li>{t('right1')}</li>
              <li>{t('right2')}</li>
              <li>{t('right3')}</li>
              <li>{t('right4')}</li>
              <li>{t('right5')}</li>
              <li>{t('right6')}</li>
              <li>{t('right7')}</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-3">{t('rightsExercise')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('changesTitle')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('changesContent')}</p>
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

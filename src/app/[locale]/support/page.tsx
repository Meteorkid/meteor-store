import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SupportPage' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'SupportPage' });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        <div className="mx-auto max-w-4xl px-4 py-20">
          {/* 页头 */}
          <div className="mb-12 text-center">
            <p className="t-eyebrow mb-4 text-white/60">{t('eyebrow')}</p>
            <h1 className="t-title-1 mb-4">{t('title')}</h1>
            <p className="t-body mx-auto max-w-2xl text-white/60">
              {t('description')}
            </p>
          </div>

          {/* 收款码双卡片 */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* 支付宝 */}
            <div className="glass-card relative overflow-hidden rounded-xl p-8 text-center">
              <div
                className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-blue-500/15 blur-[80px]"
                aria-hidden="true"
              />
              <h2 className="t-title-3 t-on-glass relative mb-6">{t('alipayTitle')}</h2>
              <div className="relative inline-block rounded-lg bg-white p-2">
                <Image
                  src="/alipay-qr.png"
                  alt={t('alipayTitle')}
                  width={240}
                  height={360}
                  unoptimized
                  className="h-auto w-60 rounded-md"
                />
              </div>
              <p className="t-body relative mt-6 text-white/60">{t('alipayHint')}</p>
            </div>

            {/* 微信 */}
            <div className="glass-card relative overflow-hidden rounded-xl p-8 text-center">
              <div
                className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-green-500/15 blur-[80px]"
                aria-hidden="true"
              />
              <h2 className="t-title-3 t-on-glass relative mb-6">{t('wechatTitle')}</h2>
              <div className="relative inline-block rounded-lg bg-white p-2">
                <Image
                  src="/wechat-qr.png"
                  alt={t('wechatTitle')}
                  width={240}
                  height={327}
                  unoptimized
                  className="h-auto w-60 rounded-md"
                />
              </div>
              <p className="t-body relative mt-6 text-white/60">{t('wechatHint')}</p>
            </div>
          </div>

          {/* 免责说明 */}
          <p className="t-footnote mt-12 text-center text-white/50">
            {t('disclaimer')}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

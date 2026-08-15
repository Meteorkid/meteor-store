import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import GlassCard from '@/components/GlassCard';
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

      <main className="relative overflow-hidden">
        {/* 背景氛围光：玻璃背后要有可折射的彩色内容，纯黑底上 backdrop-filter 读不出来 */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[110px]" />
          <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />
          <div className="absolute -right-32 top-1/3 h-72 w-72 rounded-full bg-emerald-500/8 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 py-20">
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
            <GlassCard className="group relative overflow-hidden rounded-xl p-8 text-center">
              <div
                className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-blue-500/15 blur-[80px]"
                aria-hidden="true"
              />
              {/* hover 泛蓝光：光晕层 opacity 增强（.glass-card:hover 的阴影是未分层 CSS，hover:shadow-* 覆盖不了） */}
              <div
                className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-blue-500/25 opacity-0 blur-[100px] transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
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
                  className="h-auto w-60 rounded-md transition-transform duration-300 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:scale-100 hover:scale-[1.02]"
                />
              </div>
              <p className="t-body relative mt-6 text-white/60">{t('alipayHint')}</p>
            </GlassCard>

            {/* 微信 */}
            <GlassCard className="group relative overflow-hidden rounded-xl p-8 text-center">
              <div
                className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-green-500/15 blur-[80px]"
                aria-hidden="true"
              />
              {/* hover 泛绿光 */}
              <div
                className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-green-500/25 opacity-0 blur-[100px] transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
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
                  className="h-auto w-60 rounded-md transition-transform duration-300 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:scale-100 hover:scale-[1.02]"
                />
              </div>
              <p className="t-body relative mt-6 text-white/60">{t('wechatHint')}</p>
            </GlassCard>
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

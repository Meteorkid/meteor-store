import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PricingSection from '@/components/PricingSection';
import { products } from '@/data/products';
import { webAppCount } from '@/data/app-manifest';
import { SHOW_PRICING } from '@/lib/constants';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PricingPage' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

/**
 * Meteor Pass 的独立定价页。
 *
 * 定价入口统一指向这里，不再整页跳回首页再锚点下滑。展示内容直接复用首页的
 * PricingSection（全站唯一定价区块），价格与权益仍只由 src/data/pass.ts 决定，
 * 不新增第二套定价数据。关闭定价（SHOW_PRICING=false）时整页 404，与首页
 * 不渲染定价区块的行为保持一致。
 */
export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if (!SHOW_PRICING) notFound();

  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PricingPage' });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="t-eyebrow text-primary mb-4 text-center">{t('eyebrow')}</p>
          <h1 className="t-title-1 text-foreground mb-3 text-center">{t('title')}</h1>
          <p className="text-muted-foreground mx-auto mb-4 max-w-2xl text-center text-lg">
            {t('description')}
          </p>
        </div>

        <PricingSection productCount={products.length} webAppCount={webAppCount} />
      </main>
      <Footer />
    </div>
  );
}
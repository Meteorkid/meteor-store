import type { Metadata } from 'next';
import { buildOpenGraphMetadata } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PricingSection from '@/components/PricingSection';
import { SectionMasthead } from '@/components/section/SectionPage';
import { productLineIds } from '@/data/product-tracks';
import { SHOW_PRICING } from '@/lib/constants';
import { currentFreeLicenseOffers } from '@/lib/software-licenses/offers';

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
    ...buildOpenGraphMetadata({ title: t('title'), description: t('description'), path: `/{locale}/pricing`, locale }),
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
      <SectionMasthead
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description', { count: productLineIds.length })}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
        <PricingSection
          productCount={productLineIds.length}
          freeLicenseOffers={currentFreeLicenseOffers(locale === 'en' ? 'en' : 'zh')}
          cosmic
          showHeader={false}
        />
      </main>
      <Footer />
    </div>
  );
}

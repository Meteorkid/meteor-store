import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products, localizeProduct } from '@/data/products';
import { selectLabProducts } from '@/data/product-tracks';
import type { Locale } from '@/i18n/routing';

/**
 * 实验室 —— 收纳不属于主产品线的作品，一律免费。
 *
 * 这些东西的作用是**证明能做**，不是卖钱：一个写得出 GPU 流体模拟和 3D 解剖的人
 * 做的 macOS 工具，可信度不一样。所以这一页不出现购买入口，也不进首页争夺注意力。
 * 只声明 title/description，**不要加 alternates**——那会顶掉布局里的 canonical。
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'LabPage' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'LabPage' });

  const labProducts = selectLabProducts(
    products.map((product) => localizeProduct(product, locale as Locale)),
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="t-eyebrow mb-3 uppercase text-violet-300">{t('eyebrow')}</p>
          <h1 className="t-display mb-4 text-white">{t('heading')}</h1>
          <p className="t-body text-white/60">{t('intro')}</p>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {labProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 3} />
          ))}
        </div>

        {/* 回到主线：实验室是旁支，不该是死路 */}
        <div className="mt-14 text-center">
          <p className="t-footnote mb-4 text-white/50">{t('backNote')}</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            {t('backCta')}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

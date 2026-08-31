import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import PassOwnedBadge from '@/components/PassOwnedBadge';
import { products, localizeProduct } from '@/data/products';
import { labProductIds, selectProductLine } from '@/data/product-tracks';
import type { Locale } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: string }>;
}

/**
 * 产品页 —— 只列主线五款。
 *
 * **不再按 category 筛选**：站点收缩成一条产品线之后，「爬虫/AI/设计/工具」
 * 四个分类里有三个只剩零到一款，筛选按钮点下去是空页面。实验室那七款在 /lab，
 * 这里只留一个入口——把它们混进来会让「这个站在卖什么」重新变得看不出来。
 */
export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ProductsPage' });

  const lineProducts = selectProductLine(
    products.map((product) => localizeProduct(product, locale as Locale)),
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-12 md:py-16">
        {/* Page Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-violet-300">Meteor Products</p>
          <h1 className="t-display mb-4 text-white">{t('title')}</h1>
          <p className="t-body text-gray-400">{t('description')}</p>
        </div>

        <PassOwnedBadge />

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {lineProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 3} />
          ))}
        </div>

        {/* 实验室入口 */}
        <div className="glass-card mt-14 rounded-2xl px-6 py-7 text-center">
          <h2 className="t-title-3 mb-2 text-white">{t('labHeading')}</h2>
          <p className="t-footnote mb-5 text-white/60">
            {t('labNote', { count: labProductIds.length })}
          </p>
          <Link
            href="/lab"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-6 py-3 text-white/80 transition-colors hover:border-white/20 hover:text-white"
          >
            {t('labCta')}
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

import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import PassOwnedBadge from '@/components/PassOwnedBadge';
import { products, localizeProduct } from '@/data/products';
import { selectProductsInDisplayOrder } from '@/data/product-order';
import type { Locale } from '@/i18n/routing';

interface Props {
  searchParams: Promise<{ category?: string }>;
  params: Promise<{ locale: string }>;
}

export default async function ProductsPage({ searchParams, params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ProductsPage' });
  const { category: selectedCategory = 'all' } = await searchParams;

  const allProducts = selectProductsInDisplayOrder(
    products.map((product) => localizeProduct(product, locale as Locale)),
  );
  const filteredProducts = selectedCategory === 'all'
    ? allProducts
    : allProducts.filter((p) => p.category === selectedCategory);

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

        {/* Category Filter */}
        <CategoryFilter selected={selectedCategory} />

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 3} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">{t('noProducts')}</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

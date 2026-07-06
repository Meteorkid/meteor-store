import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import { products } from '@/data/products';

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category: selectedCategory = 'all' } = await searchParams;

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-12 md:py-16">
        {/* Page Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-violet-300">Meteor Products</p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-6xl">作品，不只是图标</h1>
          <p className="text-lg leading-8 text-gray-400">查看每个产品的真实界面、核心体验与运行平台。</p>
        </div>

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
            <p className="text-gray-400">该分类下暂无产品</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { products } from '@/data/products';
import { categoryLabels } from '@/lib/constants';

export const metadata: Metadata = {
  title: '文档 - Meteor Store',
  description: 'Meteor Store 产品使用文档与开发指南',
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">文档</h1>
          <p className="text-gray-400 text-lg mb-12">
            浏览各产品的使用指南与开发文档
          </p>

          {/* 按分类组织产品文档 */}
          {Object.entries(categoryLabels).map(([category, label]) => {
            const categoryProducts = products.filter((p) => p.category === category);
            if (categoryProducts.length === 0) return null;

            return (
              <section key={category} className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 text-gray-200">{label}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryProducts.map((product) => (
                    <a
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="block p-6 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/50 transition-colors"
                    >
                      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-400 text-sm">{product.tagline}</p>
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}

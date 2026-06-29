import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PricingCard from '@/components/PricingCard';
import { products } from '@/data/products';
import { ANNUAL_DISCOUNT, SHOW_PRICING } from '@/lib/constants';

interface ProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ annual?: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return {
      title: '产品未找到 - Meteor Store',
    };
  }

  return {
    title: `${product.name} - ${product.tagline} | Meteor Store`,
    description: product.description,
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { id } = await params;
  const { annual } = await searchParams;
  const isAnnual = annual === 'true';
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Back button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回产品列表
        </Link>

        {/* Product Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">{product.icon}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">{product.name}</h1>
              <p className="text-xl text-gray-400">{product.tagline}</p>
            </div>
          </div>
          <p className="text-lg text-gray-300 max-w-3xl">{product.description}</p>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">功能特点</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <svg
                  className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        {SHOW_PRICING && (
          <div id="pricing" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">定价方案</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {product.pricing.map((plan, index) => (
                <PricingCard
                  key={plan.name}
                  name={plan.name}
                  price={
                    isAnnual && plan.period === '月'
                      ? Math.floor(plan.price * ANNUAL_DISCOUNT)
                      : plan.price
                  }
                  basePrice={plan.price}
                  period={
                    isAnnual && plan.period === '月'
                      ? '月 (年付)'
                      : plan.period
                  }
                  features={plan.features}
                  isPopular={index === 1}
                  productId={product.id}
                  productName={product.name}
                  isAnnual={isAnnual && plan.period === '月'}
                />
              ))}
            </div>
          </div>
        )}

        {/* GitHub Link */}
        <div className="text-center">
          <a
            href={product.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-lg text-white font-medium hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            在 GitHub 上查看
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}

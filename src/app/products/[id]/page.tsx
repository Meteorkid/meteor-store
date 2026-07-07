import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PricingCard from '@/components/PricingCard';
import ProductGallery from '@/components/ProductGallery';
import ProductVisual from '@/components/ProductVisual';
import ProductMark from '@/components/ProductMark';
import { products } from '@/data/products';
import { ANNUAL_DISCOUNT, SHOW_PRICING } from '@/lib/constants';

interface ProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ annual?: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);
  return product
    ? { title: `${product.name} - ${product.tagline} | Meteor Store`, description: product.description }
    : { title: '产品未找到 - Meteor Store' };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { id } = await params;
  const { annual } = await searchParams;
  const product = products.find((item) => item.id === id);
  if (!product) notFound();

  const isAnnual = annual === 'true';

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <Link href="/products" className="mb-10 inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-white">
          <span aria-hidden>←</span> 返回产品列表
        </Link>

        <section className="mb-20 grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <ProductMark product={product} size="lg" />
              <div className="flex flex-wrap gap-2">
                {product.platforms.map((platform) => (
                  <span key={platform} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">{product.name}</h1>
            <p className="mt-4 text-xl text-violet-200">{product.tagline}</p>
            <p className="mt-5 text-lg leading-8 text-gray-400">{product.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={product.github} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-200">
                在 GitHub 上查看
              </a>
              {product.demo && (
                <a href={product.demo} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                  打开在线演示
                </a>
              )}
            </div>
          </div>
          <ProductVisual product={product} priority className="shadow-[0_35px_100px_rgba(76,29,149,0.28)]" />
        </section>

        <ProductGallery product={product} />

        <section className="mb-20">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Highlights</p>
          <h2 className="mb-7 text-2xl font-bold text-white md:text-3xl">功能特点</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {product.features.map((feature) => (
              <div key={feature} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <span className="mt-0.5 text-green-400" aria-hidden>✓</span>
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {SHOW_PRICING && (
          <section id="pricing" className="mb-16">
            <h2 className="mb-6 text-center text-2xl font-bold text-white">定价方案</h2>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
              {product.pricing.map((plan, index) => (
                <PricingCard
                  key={plan.name}
                  name={plan.name}
                  price={isAnnual && plan.period === '月' ? Math.floor(plan.price * ANNUAL_DISCOUNT) : plan.price}
                  basePrice={plan.price}
                  period={isAnnual && plan.period === '月' ? '月 (年付)' : plan.period}
                  features={plan.features}
                  isPopular={index === 1}
                  productId={product.id}
                  productName={product.name}
                  isAnnual={isAnnual && plan.period === '月'}
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

import { notFound } from 'next/navigation';
import TransitionLink from '@/components/TransitionLink';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PricingCard from '@/components/PricingCard';
import ProductGallery from '@/components/ProductGallery';
import ProductVisual from '@/components/ProductVisual';
import InstallCommand from '@/components/InstallCommand';
import DownloadSection from '@/components/DownloadSection';
import ProductDemoEmbed from '@/components/ProductDemoEmbed';
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
        <TransitionLink href="/products" className="mb-10 inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-white">
          <span aria-hidden>←</span> 返回产品列表
        </TransitionLink>

        <section className="mb-20 grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {product.platforms.map((platform) => (
                  <span key={platform} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl" style={{ viewTransitionName: `product-title-${product.id}` }}>{product.name}</h1>
            <p className="mt-4 text-xl text-violet-200">{product.tagline}</p>
            <p className="mt-5 text-lg leading-8 text-gray-400">{product.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {product.downloads?.[0] ? (
                <a href={product.downloads[0].url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  {product.downloads[0].label}
                </a>
              ) : null}
              <a href={product.github} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                GitHub 源码
              </a>
              {product.demo && (
                <a href={product.demo} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                  在线演示
                </a>
              )}
            </div>
          </div>
          <ProductVisual product={product} priority className="shadow-[0_35px_100px_rgba(76,29,149,0.28)]" transitionName={`product-visual-${product.id}`} />
        </section>

        <InstallCommand product={product} />

        <DownloadSection product={product} />

        <ProductGallery product={product} />

        <ProductDemoEmbed product={product} />

        <section className="mb-20">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Highlights</p>
          <h2 className="mb-7 text-2xl font-bold text-white md:text-3xl">功能特点</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {product.features.map((feature, i) => (
              <div
                key={feature}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.06] ${
                  i === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 transition-opacity group-hover:opacity-[0.04]`} />
                <div className="relative">
                  <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08] text-sm font-semibold text-violet-300">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className={`mt-2 leading-relaxed text-gray-300 ${i === 0 ? 'text-lg' : 'text-sm'}`}>
                    {feature}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20 flex flex-wrap items-center gap-4">
          <a
            href={product.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm text-gray-300 transition-colors hover:border-white/20 hover:text-white"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
            Star on GitHub
          </a>
          <span className="text-sm text-gray-500">开源 · {product.platforms.join(' · ')}</span>
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

        <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/40 via-zinc-950 to-purple-950/30 p-8 text-center md:p-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Get started</p>
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">准备好了吗？</h2>
          <p className="mx-auto mb-8 max-w-lg text-gray-400">
            {product.name} 完全开源。在 GitHub 上查看代码、提 Issue、参与贡献——或者直接用起来。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={product.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
            >
              查看源码
            </a>
            <a
              href="mailto:meteor@stu.gpnu.edu.cn"
              className="rounded-full border border-white/15 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              联系我
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

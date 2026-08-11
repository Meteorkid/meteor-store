import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import TransitionLink from '@/components/TransitionLink';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PricingCard from '@/components/PricingCard';
import ProductGallery from '@/components/ProductGallery';
import ProductVisual from '@/components/ProductVisual';
import InstallCommand from '@/components/InstallCommand';
import DownloadSection from '@/components/DownloadSection';
import ProductDemoEmbed from '@/components/ProductDemoEmbed';
import ProductAppTrial from '@/components/ProductAppTrial';
import PassOwnedBadge from '@/components/PassOwnedBadge';
import ProductPricingCards from '@/components/ProductPricingCards';
import { products, localizeProduct } from '@/data/products';
import { ANNUAL_DISCOUNT, SHOW_PRICING } from '@/lib/constants';
import { routing, type Locale } from '@/i18n/routing';

interface ProductPageProps {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ annual?: string }>;
}

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    products.map((product) => ({ locale, id: product.id }))
  );
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { locale, id } = await params;
  const raw = products.find((item) => item.id === id);
  const t = await getTranslations({ locale, namespace: 'ProductDetailPage' });
  if (!raw) return { title: t('notFound') };
  const product = localizeProduct(raw, locale as Locale);
  return { title: `${product.name} - ${product.tagline} | Meteor Store`, description: product.description };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'ProductDetailPage' });
  const { annual } = await searchParams;
  const raw = products.find((item) => item.id === id);
  if (!raw) notFound();

  const product = localizeProduct(raw, locale as Locale);
  const isAnnual = annual === 'true';

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <TransitionLink href="/products" className="mb-10 inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-white">
          <span aria-hidden>←</span> {t('backToProducts')}
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
              {product.demo && (
                <a href={product.demo} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                  {t('liveDemo')}
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

        <ProductAppTrial product={product} />

        <section className="mb-20">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Highlights</p>
          <h2 className="mb-7 text-2xl font-bold text-white md:text-3xl">{t('features')}</h2>
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

        {SHOW_PRICING && (
          <>
          <PassOwnedBadge />
          <section id="pricing" className="mb-16">
            <h2 className="mb-6 text-center text-2xl font-bold text-white">{t('pricing')}</h2>
            {product.status === 'coming_soon' ? (
              <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-12 text-center">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">{t('comingSoon')}</p>
                <p className="text-lg text-gray-300">
                  {t('comingSoonDesc', { name: product.name })}
                </p>
              </div>
            ) : (
              <>
            <ProductPricingCards
              plans={product.pricing.map((plan) => ({
                name: plan.name,
                price: isAnnual && plan.period === '月' ? Math.floor(plan.price * ANNUAL_DISCOUNT) : plan.price,
                basePrice: plan.price,
                originalPrice: plan.originalPrice,
                period: isAnnual && plan.period === '月'
                  ? t('periodMonthlyAnnual')
                  : plan.period === '月'
                    ? t('periodMonthly')
                    : plan.period === '年'
                      ? t('periodYearly')
                      : t('periodLifetime'),
                features: plan.features,
                isPopular: false,
              }))}
              productId={product.id}
              productName={product.name}
              isAnnual={isAnnual && product.pricing.some((p) => p.period === '月')}
            />

            {/* 单品与全站会员是同一套商业模式的两条路径，这里给出通往 Pass 的入口。
                用 next-intl 的 Link 而不是 TransitionLink：后者是原生 next/link，
                不补语言前缀，而路由是 localePrefix:'always'，英文用户会被弹回中文首页 */}
            <p className="mt-8 text-center text-sm text-white/60">
              {t('passPrompt')}
              <Link
                href="/pricing"
                className="ml-2 text-violet-300 transition-colors hover:text-violet-200"
              >
                {t('passCta')}
              </Link>
            </p>
              </>
            )}
          </section>
          </>
        )}

        <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/40 via-zinc-950 to-purple-950/30 p-8 text-center md:p-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Get started</p>
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">{t('readyTitle')}</h2>
          <p className="mx-auto mb-8 max-w-lg text-gray-400">
            {t('readyDesc', { name: product.name })}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:meteor@stu.gpnu.edu.cn"
              className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
            >
              {t('contactMe')}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

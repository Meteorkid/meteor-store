import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { and, eq, or } from 'drizzle-orm';
import TransitionLink from '@/components/TransitionLink';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGallery from '@/components/ProductGallery';
import ProductVisual from '@/components/ProductVisual';
import InstallCommand from '@/components/InstallCommand';
import DownloadSection from '@/components/DownloadSection';
import ProductDemoEmbed from '@/components/ProductDemoEmbed';
import PassOwnedBadge from '@/components/PassOwnedBadge';
import ProductPricingCards from '@/components/ProductPricingCards';
import { getAppTrialHref } from '@/data/app-manifest';
import { products, localizeProduct } from '@/data/products';
import { getProductWithCurrentDownloads } from '@/lib/product-updates/catalog';
import { ANNUAL_DISCOUNT, SHOW_PRICING, SITE_URL } from '@/lib/constants';
import { safeJsonLd } from '@/lib/seo';
import { buildBreadcrumbSchema, buildProductSchema } from '@/lib/structured-data';
import { routing, type Locale } from '@/i18n/routing';
import { isSoftwareLicensingEnabled } from '@/lib/software-licenses/config';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

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
  const raw = await getProductWithCurrentDownloads(id);
  const t = await getTranslations({ locale, namespace: 'ProductDetailPage' });
  if (!raw) return { title: t('notFound') };
  const product = localizeProduct(raw, locale as Locale);
  // 根布局会用 `%s | Meteor Store` 统一补品牌名，这里重复写会产生两个后缀。
  return { title: `${product.name} - ${product.tagline}`, description: product.description };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'ProductDetailPage' });
  // 面包屑的文字必须与页面上真实可见的导航一致，所以直接复用 Header 的译名，
  // 而不是在产品页再写一套「产品/首页」——两处一旦不同步，结构化数据就在说谎
  const tNav = await getTranslations({ locale, namespace: 'Header' });
  const { annual } = await searchParams;
  const raw = await getProductWithCurrentDownloads(id);
  if (!raw) notFound();

  const product = localizeProduct(raw, locale as Locale);
  const isAnnual = annual === 'true';
  const trialHref = getAppTrialHref(product.id);
  const primaryDownload = product.downloads?.find((download) => download.icon !== 'github');
  const softwareTrial = isSoftwareLicensingEnabled() && (id === 'xnook' || id === 'xisland');
  // 领过码就把下载区的引导换成「去账户页查看」，不再劝人重复领取一次。
  const licenseClaimed = softwareTrial ? await hasClaimedLicense(id) : false;

  // 产品实体 + 面包屑。价格是否下发跟着 SHOW_PRICING 走，见 structured-data.ts 的说明。
  const productSchema = buildProductSchema({ product, locale: locale as Locale, showPricing: SHOW_PRICING });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: tNav('home'), url: `${SITE_URL}/${locale}` },
    { name: tNav('products'), url: `${SITE_URL}/${locale}/products` },
    { name: product.name, url: `${SITE_URL}/${locale}/products/${product.id}` },
  ]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 结构化数据：JSON-LD 是数据块不是可执行脚本，不受 CSP script-src 约束，
          与 blog/[slug] 的做法一致，无需 nonce */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd([productSchema, breadcrumbSchema]) }}
      />
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
              {primaryDownload ? (
                <a href="#download" className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  {primaryDownload.label}
                </a>
              ) : null}
              {/* 开发者主要从 GitHub 找工具，产品页不给入口等于关掉唯一免费的发现渠道。 */}
              {softwareTrial && (
                <a
                  href={licenseClaimed ? '/account#software-licenses' : '#pricing'}
                  className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/10 px-5 py-2.5 text-sm font-semibold text-violet-100 transition-colors hover:bg-violet-500/20"
                >
                  {licenseClaimed ? t('licenseClaimOwnedCta') : t('claimLicenseCta')}
                </a>
              )}
              {product.github && (
                <a
                  href={product.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33s1.7.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z" /></svg>
                  {t('viewOnGitHub')}
                </a>
              )}
              {product.demo && (
                <a href={product.demo} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                  {t('liveDemo')}
                </a>
              )}
              {product.experienceUrl && (
                <Link
                  href={product.experienceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
                >
                  <span aria-hidden>✦</span>
                  {t('onlineExperience')}
                </Link>
              )}
              {trialHref && (
                <Link
                  href={trialHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
                >
                  <span aria-hidden>✦</span>
                  {t('onlineExperience')}
                </Link>
              )}
            </div>
            {product.id === 'ex-memory' && (
              <div className="mt-5 text-sm leading-relaxed text-white/70">
                <p>{t('exMemorySetup')}</p>
                <p className="mt-3">{t('exMemoryPrivacy')}</p>
                <div className="mt-3 flex flex-wrap gap-4">
                  <Link href="/docs/ex-memory-first-import" className="text-violet-300 underline underline-offset-4">{t('exMemoryGuide')}</Link>
                  <Link href="/privacy#ex-memory" className="text-violet-300 underline underline-offset-4">{t('privacyPolicy')}</Link>
                </div>
              </div>
            )}
            {product.id === 'duocast' && (
              <div className="mt-5 flex flex-wrap gap-4 text-sm">
                <Link href="/docs/duocast-first-play" className="text-violet-300 underline underline-offset-4">{t('duocastGuide')}</Link>
              </div>
            )}
          </div>
          <ProductVisual product={product} priority className="shadow-[0_35px_100px_rgb(var(--site-glass-shadow)/0.28)]" transitionName={`product-visual-${product.id}`} />
        </section>

        <InstallCommand product={product} />

        <DownloadSection product={product} licenseClaimed={licenseClaimed} />

        <ProductGallery product={product} />

        <ProductDemoEmbed product={product} />

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
            {softwareTrial && <div className="mx-auto mb-6 max-w-2xl rounded-2xl border border-violet-400/20 bg-violet-500/5 p-5 text-center">
              <p className="text-white">{locale === 'en' ? 'Limited-time free: claim a lifetime license, no payment needed.' : '限时免费：领取永久激活码，无需付款。'}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{locale === 'en' ? 'Download and try every feature for 14 days. Claim the free plan below — the activation code is emailed to your registered address and also shown in your account. Up to 3 devices per product, with device unlinking.' : '下载后可先完整体验 14 天。在下方「限时免费」档领取，激活码会发到注册邮箱，也可在账户页查看。每款最多激活 3 台设备，支持解绑换机。'}</p>
              <Link href="/pricing" className="mt-3 inline-block text-violet-300 underline underline-offset-4">{locale === 'en' ? 'See other activation options' : '查看其他激活方案'}</Link>
            </div>}
            {product.status === 'coming_soon' ? (
              <div className="glass-card mx-auto max-w-2xl rounded-3xl px-8 py-12 text-center">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">{t(product.experienceUrl ? 'trialAvailable' : 'comingSoon')}</p>
                <p className="text-lg text-gray-300">
                  {t(product.id === 'ex-memory' ? 'exMemoryTrialAvailableDesc' : product.experienceUrl ? 'trialAvailableDesc' : 'comingSoonDesc', { name: product.name })}
                </p>
              </div>
            ) : (
              <>
            <ProductPricingCards
              plans={product.pricing.map((plan) => ({
                id: plan.id,
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
              // 桌面软件（XIsland / XNook）领取的是永久激活码，去账户页的激活码面板取；
              // 其余可直接下载的产品仍然只把用户带到下载区，不逼他先登录。
              claimDoneHref={product.id === 'xisland' || product.id === 'xnook' ? '/account#software-licenses' : undefined}
              downloadAnchor={
                product.id !== 'xisland' && product.id !== 'xnook' && product.downloads?.some((d) => !d.gated)
                  ? '#download'
                  : undefined
              }
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
            {t(product.id === 'ex-memory' ? 'exMemoryStartDesc' : product.experienceUrl ? 'experienceReadyDesc' : 'readyDesc', { name: product.name })}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {product.experienceUrl && (
              <Link href={product.experienceUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-violet-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500">
                {t('onlineExperience')}
              </Link>
            )}
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

/**
 * 当前账号是否已领过这款桌面软件的永久授权。
 *
 * 只用于下载区那句引导的措辞，不是访问控制——真正的门控在 `/api/download`
 * 与软件客户端的激活流程里。所以查询失败按「未领取」降级：多显示一次领取入口
 * 只是文案不精确，而抛错会让整张产品页 500，代价不对等。
 *
 * 判定口径与 `/api/claim` 写入的形状一致：一条 paid 订单（免费档也是 ¥0 + paid），
 * userId 或邮箱任一命中即算——游客态下单、后补账号的历史订单也能认出来。
 */
async function hasClaimedLicense(productId: string): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session) return false;
    const [claimed] = await db
      .select({ id: orders.id })
      .from(orders)
      .where(
        and(
          eq(orders.productId, productId),
          eq(orders.status, 'paid'),
          or(eq(orders.userId, session.userId), eq(orders.email, session.email)),
        ),
      )
      .limit(1);
    return Boolean(claimed);
  } catch (error) {
    console.error('读取软件授权状态失败，下载区按未领取展示:', { productId, error });
    return false;
  }
}

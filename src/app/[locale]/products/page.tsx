import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import PassOwnedBadge from '@/components/PassOwnedBadge';
import CelestialField from '@/components/CelestialField';
import ProductStarStory from '@/components/ProductStarStory';
import MansionChart from '@/components/section/MansionChart';
import { mansionChartCopy } from '@/components/section/mansion-chart-copy';
import { SectionMasthead, SectionTabs } from '@/components/section/SectionPage';
import { products, localizeProduct } from '@/data/products';
import { flagshipProductIds, selectLabProducts, selectProductLine } from '@/data/product-tracks';
import { FOUR_SYMBOLS, mansionsOf } from '@/data/celestial';
import type { Locale } from '@/i18n/routing';
import { buildOpenGraphMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ProductsPage' });
  return {
    title: t('title'),
    description: t('description'),
    ...buildOpenGraphMetadata({ title: t('title'), description: t('description'), path: `/${locale}/products`, locale }),
  };
}

/**
 * 产品页 —— 一张完整的星图，而不是两段互不相干的货架。
 *
 * 页首仍然是星图叙事，但从整屏 Hero 收到信息条，让第一张产品卡在首屏内出现。
 * 二十八宿不是装饰：主线落青龙、实验室落玄武，页面用一张完整的四象七宿索引
 * 解释每个宿名的位置，并把朱雀、白虎留白给未来作品。
 */
export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ProductsPage' });

  const all = products.map((product) => localizeProduct(product, locale as Locale));
  const line = selectProductLine(all);
  const lab = selectLabProducts(all);
  const flagship = line.slice(0, flagshipProductIds.length);
  const funnel = line.slice(flagshipProductIds.length);

  const dragon = FOUR_SYMBOLS.azureDragon;
  const tortoise = FOUR_SYMBOLS.blackTortoise;
  const dragonMansions = mansionsOf('azureDragon');
  const tortoiseMansions = mansionsOf('blackTortoise');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        <div className="relative overflow-hidden">
          <CelestialField seed="products-atlas" rgb={dragon.rgb} count={128} className="products-atlas-field" />
          {/* 顶部光晕贯穿信息条与栏目条，避免两段独立背景在滚动时重新起图。 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[820px] -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl"
            style={{ background: `radial-gradient(circle, rgb(${dragon.rgb} / 0.10) 0%, transparent 70%)` }}
          />
          <ProductStarStory rgb={dragon.rgb} />

          <SectionMasthead
            className="relative z-10"
            accent={dragon.rgb}
            eyebrow={t('eyebrow')}
            title={t('title')}
            description={t('description')}
            actions={(
              <>
                <a href="#core" className="inline-flex min-h-11 items-center rounded-xl bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-white/85">
                  {t('browseLine')}
                </a>
                <a href="#lab" className="inline-flex min-h-11 items-center rounded-xl border border-white/15 bg-white/[0.04] px-5 text-sm font-semibold text-white transition-colors hover:bg-white/[0.08]">
                  {t('browseLab')}
                </a>
              </>
            )}
            aside={(
              <div className="glass-card rounded-2xl p-5">
                <p className="t-eyebrow text-white/60">{t('chartEyebrow')}</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div>
                    <strong className="block t-title-3 tabular-nums text-white">{all.length}</strong>
                    <span className="t-footnote text-white/50">{t('statWorks')}</span>
                  </div>
                  <div>
                    <strong className="block t-title-3 tabular-nums text-white">2</strong>
                    <span className="t-footnote text-white/50">{t('statRegions')}</span>
                  </div>
                  <div>
                    <strong className="block t-title-3 tabular-nums text-white">28</strong>
                    <span className="t-footnote text-white/50">{t('statMansions')}</span>
                  </div>
                </div>
                <p className="mt-4 border-t border-white/10 pt-3 t-footnote text-pretty text-white/55">
                  {t('chartAside', { line: line.length, lab: lab.length })}
                </p>
              </div>
            )}
          />

          <SectionTabs
            className="relative z-10 bg-black/20 backdrop-blur-sm"
            ariaLabel={t('sectionNav')}
            accent={dragon.rgb}
            items={[
              { href: '#core', label: t('navAll'), active: true, count: all.length },
              { href: '#core', label: t('navLine'), count: line.length },
              { href: '#free', label: t('groupFree'), count: funnel.length },
              { href: '#lab', label: t('navLab'), count: lab.length },
              { href: '#mansion-chart', label: t('navChart') },
            ]}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 pt-6">
          <PassOwnedBadge />
        </div>

        {/* ── 主线星区 · 东方青龙 ── */}
        <section id="core" className="relative scroll-mt-24 pb-12 pt-10 md:pb-16 md:pt-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, rgb(${dragon.rgb} / 0.28), transparent)` }}
          />
          <div className="mx-auto w-full max-w-7xl px-4">
            <SectionHeading
              symbol={`${dragon.label[locale as Locale]} · ${line.length} 件`}
              rgb={dragon.rgb}
              title={t('lineTitle')}
              note={t('lineNote')}
            />

            <GroupLabel text={t('groupCore')} rgb={dragon.rgb} />
            <div className="mb-12 grid grid-cols-1 gap-7 md:grid-cols-2">
              {flagship.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority
                  mansion={dragonMansions[i]}
                  mansionSymbol={dragon.shortLabel[locale as Locale]}
                  mansionPosition={i + 1}
                  mansionTotal={dragonMansions.length}
                  mansionRgb={dragon.rgb}
                />
              ))}
            </div>

            <section id="free" className="scroll-mt-24">
              <GroupLabel text={t('groupFree')} rgb={dragon.rgb} note={t('groupFreeNote')} />
              <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                {funnel.map((product, i) => {
                  const position = flagship.length + i;
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      mansion={dragonMansions[position]}
                      mansionSymbol={dragon.shortLabel[locale as Locale]}
                      mansionPosition={position + 1}
                      mansionTotal={dragonMansions.length}
                      mansionRgb={dragon.rgb}
                    />
                  );
                })}
              </div>
            </section>
          </div>
        </section>

        <MansionChart
          locale={locale as Locale}
          lineCount={line.length}
          labCount={lab.length}
          copy={mansionChartCopy[locale as Locale]}
        />

        {/* ── 星轨分隔：两个星区之间的过渡 ── */}
        <div aria-hidden="true" className="relative mx-auto my-2 h-px w-full max-w-4xl">
          <div
            className="h-px w-full"
            style={{
              background: `linear-gradient(90deg, transparent, rgb(${dragon.rgb} / 0.22) 30%, rgb(${tortoise.rgb} / 0.22) 70%, transparent)`,
            }}
          />
          <span
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: `rgb(${tortoise.rgb} / 0.7)`, boxShadow: `0 0 12px rgb(${tortoise.rgb} / 0.5)` }}
          />
        </div>

        {/* ── 实验室星区 · 北方玄武 ── */}
        <section id="lab" className="relative scroll-mt-24 overflow-hidden py-14 md:py-20">
          <CelestialField seed="lab-black-tortoise" rgb={tortoise.rgb} className="products-atlas-field" />
          <div className="mx-auto w-full max-w-7xl px-4">
            <SectionHeading
              symbol={`${tortoise.label[locale as Locale]} · ${lab.length} 件`}
              rgb={tortoise.rgb}
              title={t('labTitle')}
              note={t('labNote')}
            />
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {lab.map((product, i) => {
                const mansion = tortoiseMansions[i];
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    mansion={mansion}
                    mansionLabel={mansion ? undefined : (locale === 'en' ? 'Guest star' : '客星')}
                    mansionSymbol={tortoise.shortLabel[locale as Locale]}
                    mansionPosition={mansion ? i + 1 : undefined}
                    mansionTotal={mansion ? tortoiseMansions.length : undefined}
                    mansionRgb={tortoise.rgb}
                  />
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/** 星区标题：四象名作眉标，正标题下压一条同色细线 */
function SectionHeading({ symbol, rgb, title, note }: { symbol: string; rgb: string; title: string; note: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="t-eyebrow mb-4 flex items-center gap-2.5 uppercase" style={{ color: `rgb(${rgb} / 0.95)` }}>
        <span aria-hidden="true" className="h-px w-6" style={{ background: `rgb(${rgb} / 0.7)` }} />
        {symbol}
      </p>
      <h2 className="t-title-1 mb-3 text-balance text-white">{title}</h2>
      <div aria-hidden="true" className="mb-4 h-px w-16" style={{ background: `rgb(${rgb} / 0.45)` }} />
      <p className="t-body max-w-2xl text-pretty text-white/60">{note}</p>
    </div>
  );
}

/** 组标题：一颗小星 + 标签，比 h3 更轻，用来分「核心 / 免费」两组 */
function GroupLabel({ text, rgb, note }: { text: string; rgb: string; note?: string }) {
  return (
    <div className="mb-5">
      <h3 className="t-title-4 flex items-center gap-2.5 text-white/85">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: `rgb(${rgb} / 0.9)`, boxShadow: `0 0 10px rgb(${rgb} / 0.6)` }}
        />
        {text}
      </h3>
      {note && <p className="t-footnote mt-1.5 pl-4 text-white/60">{note}</p>}
    </div>
  );
}

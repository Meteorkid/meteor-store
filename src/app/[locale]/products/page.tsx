import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import PassOwnedBadge from '@/components/PassOwnedBadge';
import CelestialField from '@/components/CelestialField';
import { products, localizeProduct } from '@/data/products';
import { flagshipProductIds, selectLabProducts, selectProductLine } from '@/data/product-tracks';
import { FOUR_SYMBOLS, mansionsOf } from '@/data/celestial';
import type { Locale } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: string }>;
}

/**
 * 产品页 —— 一页承载主线与实验室两个星区。
 *
 * **实验室不再单独一页**：分成两页时它等于藏起来了，访客要多点一次才知道
 * 这些东西存在，而它们恰恰是「这个人能做什么」最有说服力的证据。放在主线下方，
 * 滚下去就看得到，同时用不同的星象配色把两者的性质分开——
 * 主线是东方青龙（主生发，正在做的），实验室是北方玄武（主收藏，做过的）。
 *
 * 星象素材全部来自 src/data/celestial.ts，与博客的星图、Pass 档位的
 * 「月相一轮 / 斗转一周 / 长明不息」同一套语汇，不另起炉灶。
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
        {/* ── 页首 ── */}
        <section className="relative overflow-hidden px-4 pt-16 pb-10 md:pt-24 md:pb-12">
          <CelestialField seed="products-hero" rgb={dragon.rgb} count={64} />
          {/* 顶部光晕：让玻璃有可折射的东西，纯黑底上 backdrop-filter 读不出来 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl"
            style={{ background: `radial-gradient(circle, rgb(${dragon.rgb} / 0.10) 0%, transparent 70%)` }}
          />
          <div className="container relative mx-auto max-w-3xl text-center">
            <p className="t-eyebrow mb-5 uppercase text-white/45">Meteor Products</p>
            {/* text-balance：中文长标题在窄一点的容器里会把最后一两个字甩成孤行，
                balance 让浏览器把每行拉到差不多长 */}
            <h1 className="t-display mb-5 text-balance bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="t-body mx-auto max-w-xl text-pretty text-white/60">{t('description')}</p>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <PassOwnedBadge />
        </div>

        {/* ── 主线星区 · 东方青龙 ── */}
        <section className="relative overflow-hidden py-14 md:py-20">
          <CelestialField seed="line-azure-dragon" rgb={dragon.rgb} />
          <div className="container relative mx-auto px-4">
            <SectionHeading
              symbol={dragon.label[locale as Locale]}
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
                  mansionRgb={dragon.rgb}
                />
              ))}
            </div>

            <GroupLabel text={t('groupFree')} rgb={dragon.rgb} note={t('groupFreeNote')} />
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {funnel.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  mansion={dragonMansions[flagship.length + i]}
                  mansionRgb={dragon.rgb}
                />
              ))}
            </div>
          </div>
        </section>

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
        <section id="lab" className="relative scroll-mt-20 overflow-hidden py-14 md:py-20">
          <CelestialField seed="lab-black-tortoise" rgb={tortoise.rgb} />
          <div className="container relative mx-auto px-4">
            <SectionHeading
              symbol={tortoise.label[locale as Locale]}
              rgb={tortoise.rgb}
              title={t('labTitle')}
              note={t('labNote')}
            />
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {lab.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  mansion={tortoiseMansions[i]}
                  mansionRgb={tortoise.rgb}
                />
              ))}
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
      <p className="t-body text-pretty text-white/60">{note}</p>
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
      {note && <p className="t-footnote mt-1.5 pl-4 text-white/45">{note}</p>}
    </div>
  );
}

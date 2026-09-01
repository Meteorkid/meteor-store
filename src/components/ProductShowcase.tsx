'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import AdvancedProductCard from './AdvancedProductCard';
import { localizeProducts } from '@/data/products';
import { flagshipProductIds, labProductIds, selectProductLine } from '@/data/product-tracks';
import type { Locale } from '@/i18n/routing';

/**
 * 首页产品区 —— 只展示主线五款，按「付费主体 / 免费入口」两组呈现。
 *
 * 这里**不再按 category 筛选**：分类筛选是「一个货架上摆着 12 款互不相关的东西」
 * 时才需要的东西，而站点已经收缩成一条产品线 + 一个实验室。实验室那七款走 /lab，
 * 不在首页争夺注意力——它们的作用是证明能力，不是卖钱。
 */
export default function ProductShowcase() {
  const t = useTranslations('ProductShowcase');
  const locale = useLocale() as Locale;

  const line = selectProductLine(localizeProducts(locale));
  const flagship = line.slice(0, flagshipProductIds.length);
  const funnel = line.slice(flagshipProductIds.length);

  // 协同关系：四步讲清这条线为什么是一条线，而不是四个各卖各的工具
  const chain = ['chainStatux', 'chainXisland', 'chainXnook', 'chainPhone'] as const;

  return (
    <section id="products" className="py-20">
      <div className="container mx-auto px-4">
        {/* 产品线叙事 */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="t-eyebrow mb-3 uppercase text-violet-300">{t('lineEyebrow')}</p>
          <h2 className="t-title-1 mb-4 text-foreground">{t('lineTitle')}</h2>
          <p className="t-body text-white/60">{t('lineSubtitle')}</p>
        </div>

        {/* 协同关系图：窄屏竖排，宽屏横排 */}
        <ol className="mx-auto mb-14 flex max-w-4xl flex-col gap-3 md:flex-row md:items-stretch md:gap-2">
          {chain.map((key, index) => (
            <li key={key} className="flex flex-1 items-center gap-2">
              <div className="glass-card flex-1 rounded-xl px-4 py-3">
                <p className="t-footnote text-white/80">{t(key)}</p>
              </div>
              {index < chain.length - 1 && (
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 rotate-90 text-white/25 md:rotate-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </li>
          ))}
        </ol>

        {/* 付费主体 */}
        <h3 className="t-title-4 mb-5 text-white/70">{t('groupCore')}</h3>
        <div className="mb-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {flagship.map((product) => (
            <AdvancedProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* 免费入口 */}
        <h3 className="t-title-4 mb-2 text-white/70">{t('groupFree')}</h3>
        <p className="t-footnote mb-5 text-white/50">{t('groupFreeNote')}</p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {funnel.map((product) => (
            <AdvancedProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* 出口：产品页 + 其中的实验室区块（实验室不再单独一页）*/}
        <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            {t('viewAll')}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/products#lab"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-6 py-3 text-white/70 transition-colors hover:border-white/20 hover:text-white"
          >
            {t('viewLab', { count: labProductIds.length })}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

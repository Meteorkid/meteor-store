'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import PricingCard from './PricingCard';
import RedeemDialog from './RedeemDialog';
import { PASS_NAME, PASS_PRODUCT_ID, passPlans } from '@/data/pass';
import type { Locale } from '@/i18n/routing';

interface PricingSectionProps {
  /** 站内产品总数 */
  productCount: number;
  /** 其中能在浏览器里直接打开的（已登记进 app-manifest 的）数量 */
  webAppCount: number;
}

/**
 * 全站唯一的定价区块：卖 Meteor Pass 的三个档位（月付 / 年付 / 买断）。
 *
 * 这里**不再**拼接不同产品的档位当成方案卖——那样价格没有梯度、
 * 月价和年价还会并排出现。想单买某个应用的人走产品页，这里只给一个入口。
 * 价格与权益全部来自 src/data/pass.ts，改价只动那一个文件。
 *
 * 两个数量由服务端算好传进来：客户端组件 import products 会把 800 行的
 * 产品目录（含双语描述与 features）整个打进客户端 bundle，只为数个数不划算。
 */
export default function PricingSection({ productCount, webAppCount }: PricingSectionProps) {
  const t = useTranslations('PricingSection');
  const locale = useLocale() as Locale;
  const [redeemOpen, setRedeemOpen] = useState(false);

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 scroll-animate">
          <p className="t-eyebrow text-primary mb-4">{t('eyebrow')}</p>
          <h2 className="t-title-1 text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('subtitle', { count: productCount, appCount: webAppCount })}
          </p>
        </div>

        {/* Pass 三档 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {passPlans.map((plan, index) => (
            <div
              key={plan.id}
              className="scroll-animate"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PricingCard
                name={plan.name[locale]}
                price={plan.price}
                originalPrice={plan.originalPrice}
                // 买断没有计费周期，价格后面不缀单位；档位名本身已经写着「买断」
                period={
                  plan.id === 'monthly'
                    ? t('periodMonthly')
                    : plan.id === 'annual'
                      ? t('periodAnnual')
                      : undefined
                }
                features={plan.features.map((feature) => feature[locale])}
                isPopular={plan.popular}
                productId={PASS_PRODUCT_ID}
                productName={PASS_NAME[locale]}
              />
            </div>
          ))}
        </div>

        {/* 邀请码兑换 —— 与购买并列的第二条获取路径 */}
        <div className="text-center mt-10 scroll-animate" style={{ animationDelay: '0.3s' }}>
          <button
            type="button"
            onClick={() => setRedeemOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
          >
            <span aria-hidden>🎟️</span>
            {t('redeemCta')}
          </button>
        </div>

        {/* 其它获取方式 */}
        <div className="text-center mt-10 scroll-animate space-y-4" style={{ animationDelay: '0.4s' }}>
          <div>
            <Link
              href="/student"
              className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm font-medium text-violet-300 transition-colors hover:bg-violet-500/20"
            >
              {t('studentCta')}
            </Link>
          </div>

          <p className="text-muted-foreground">
            {t('singleAppPrompt')}
            <Link
              href="/products"
              className="ml-2 text-primary transition-colors hover:text-primary/80"
            >
              {t('singleAppCta')}
            </Link>
          </p>

          <p className="text-muted-foreground">
            {t('enterprisePrompt')}
            <a
              href="mailto:meteor@stu.gpnu.edu.cn"
              className="ml-2 text-primary transition-colors hover:text-primary/80"
            >
              {t('enterpriseCta')}
            </a>
          </p>

          <p className="t-footnote text-white/60 max-w-xl mx-auto">
            {t('scopeNote')}
          </p>
        </div>
      </div>

      <RedeemDialog isOpen={redeemOpen} onClose={() => setRedeemOpen(false)} />
    </section>
  );
}

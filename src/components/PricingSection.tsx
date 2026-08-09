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
  /**
   * 星座星图模式：三档作为星座的三颗主星，星轨连线横向贯穿卡片。
   * 首页的定价区块保持默认（false）不变，只有独立定价页开启。
   */
  cosmic?: boolean;
  /**
   * 是否渲染区块标题（eyebrow + 标题 + 副标题）。
   * 独立定价页自带 hero 标题，会传 false 避免和页首出现两个「定价」。
   */
  showHeader?: boolean;
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
export default function PricingSection({
  productCount,
  webAppCount,
  cosmic = false,
  showHeader = true,
}: PricingSectionProps) {
  const t = useTranslations('PricingSection');
  const locale = useLocale() as Locale;
  const [redeemOpen, setRedeemOpen] = useState(false);

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section header —— 独立定价页自带 hero 标题时隐藏，避免「定价」重复 */}
        {showHeader && (
          <div className="text-center mb-16 scroll-animate">
            <p className="t-eyebrow text-primary mb-4">{t('eyebrow')}</p>
            <h2 className="t-title-1 text-foreground mb-4">
              {t('title')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('subtitle', { count: productCount, appCount: webAppCount })}
            </p>
          </div>
        )}

        {/* Pass 三档 —— cosmic 模式下背景铺一片星座星图：
            三档作为星座的三颗主星，星轨连线横向贯穿，玻璃卡背后透出夜空。
            连线是纯装饰，不承载交互，prefers-reduced-motion 下不播动画。 */}
        <div className="relative max-w-5xl mx-auto">
          {cosmic && <ConstellationField />}

          <div className={`grid grid-cols-1 gap-8 md:grid-cols-3 ${cosmic ? 'pl-4 md:pl-0' : ''}`}>
            {passPlans.map((plan, index) => (
              <div
                key={plan.id}
                className="scroll-animate"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PricingCard
                  name={plan.name[locale]}
                  subtitle={plan.celestialLabel[locale]}
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

/**
 * 定价页专属的星座星图背景：三档价格卡是三颗主星，星轨连线横向贯穿，
 * 背景铺一层弥散星点与紫色光晕，让纯黑背景不再平坦。
 *
 * - 纯装饰，`aria-hidden`，不承载交互、不拦截点击
 * - `id` 用于渐变引用，避免 SSR 下多个实例撞 id
 * - 连线/星点用确定性坐标（写死），不做随机，保证每次渲染一致、无水合抖动
 * - 星点给稳定的小尺寸，避免移动端小屏下糊成一团
 */
function ConstellationField() {
  const SPEC = [
    { x: '16%', y: '34%', r: 2.5, halo: 42 },
    { x: '50%', y: '30%', r: 3, halo: 52 },
    { x: '84%', y: '34%', r: 2.5, halo: 42 },
  ];
  const FIELD_STARS = [
    { x: 8, y: 22, r: 1.2 },
    { x: 15, y: 62, r: 1.6 },
    { x: 24, y: 44, r: 1 },
    { x: 33, y: 70, r: 1.4 },
    { x: 42, y: 55, r: 1.1 },
    { x: 58, y: 66, r: 1.5 },
    { x: 66, y: 45, r: 1 },
    { x: 74, y: 60, r: 1.6 },
    { x: 82, y: 40, r: 1.1 },
    { x: 91, y: 68, r: 1.3 },
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
    >
      <div className="absolute inset-0 hidden md:block">
        {/* 星轨连线：三颗主星之间的贯穿线，两端渐隐 */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="pricing-orbit" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0" />
              <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* 贯穿三卡的星轨 */}
          <path
            d="M 16 34 C 30 20, 38 42, 50 30 C 60 20, 70 42, 84 34"
            fill="none"
            stroke="url(#pricing-orbit)"
            strokeWidth="0.35"
            strokeLinecap="round"
          />
          {/* 次级伴线，增加层次 */}
          <path
            d="M 16 34 L 50 30 L 84 34"
            fill="none"
            stroke="#a78bfa"
            strokeOpacity="0.28"
            strokeWidth="0.2"
            strokeLinecap="round"
            strokeDasharray="1.4 2.4"
          />
        </svg>

        {/* 三颗主星：光晕 + 星核 */}
        {SPEC.map((s, i) => (
          <span
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: s.x, top: s.y }}
          >
            <span
              className="absolute rounded-full blur-[6px]"
              style={{
                width: s.halo,
                height: s.halo,
                left: -s.halo / 2,
                top: -s.halo / 2,
                background: 'radial-gradient(circle, rgba(167,139,250,0.5), transparent 70%)',
              }}
            />
            <span
              className="block rounded-full bg-white"
              style={{ width: s.r * 4, height: s.r * 4, boxShadow: '0 0 8px rgba(167,139,250,0.9)' }}
            />
          </span>
        ))}

        {/* 背景散星 */}
        {FIELD_STARS.map((s, i) => (
          <span
            key={`f${i}`}
            className="absolute rounded-full bg-white/70"
            style={{
              width: s.r * 2,
              height: s.r * 2,
              left: `${s.x}%`,
              top: `${s.y}%`,
            }}
          />
        ))}
      </div>

      {/* 移动端纵向星轨：在卡片左侧保留三档之间的文化联系 */}
      <div className="absolute -left-1 inset-y-2 w-5 md:hidden">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 20 100" preserveAspectRatio="none">
          <path
            d="M10 2 C3 20, 17 34, 10 50 C3 66, 17 80, 10 98"
            fill="none"
            stroke="#a78bfa"
            strokeOpacity="0.42"
            strokeWidth="0.6"
            strokeLinecap="round"
          />
          <path
            d="M10 16 L10 50 L10 84"
            fill="none"
            stroke="#a78bfa"
            strokeOpacity="0.24"
            strokeWidth="0.35"
            strokeDasharray="1.5 2.5"
          />
        </svg>
        {[16, 50, 84].map((top) => (
          <span
            key={top}
            className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_rgba(167,139,250,0.95)]"
            style={{ top: `${top}%` }}
          />
        ))}
      </div>
    </div>
  );
}

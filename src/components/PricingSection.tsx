'use client';

import { useState, useMemo } from 'react';
import PricingCard from './PricingCard';
import { findProduct } from '@/lib/products';
import { ANNUAL_DISCOUNT } from '@/lib/constants';

// 从产品目录选取 3 个推荐产品及其中间档方案
const featuredProducts = [
  { productId: 'omnicrawl', tierIndex: 1 },   // Pro
  { productId: 'ex-memory', tierIndex: 1 },   // Premium
  { productId: 'skeleton-anatomy', tierIndex: 1 }, // Professional
];

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = useMemo(() => featuredProducts
    .map(({ productId, tierIndex }) => {
      const product = findProduct(productId);
      if (!product) return null;
      const tier = product.pricing[tierIndex];
      if (!tier) return null;
      return {
        name: tier.name,
        basePrice: tier.price,
        period: tier.period || '月',
        productName: product.name,
        productId: product.id,
        href: `/products/${product.id}`,
        features: tier.features,
        isPopular: true,
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null), []);

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            简单透明的定价
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            选择适合你的方案
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              月付
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              role="switch"
              aria-checked={isAnnual}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isAnnual ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              年付
              <span className="ml-1 text-xs text-success">省 {Math.round((1 - ANNUAL_DISCOUNT) * 100)}%</span>
            </span>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.productId}
              className="scroll-animate"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PricingCard
                name={plan.name}
                price={
                  isAnnual && plan.period === '月'
                    ? Math.floor(plan.basePrice * ANNUAL_DISCOUNT)
                    : plan.basePrice
                }
                basePrice={plan.basePrice}
                period={
                  isAnnual && plan.period === '月'
                    ? '月 (年付)'
                    : plan.period
                }
                features={plan.features}
                isPopular={plan.isPopular}
                productName={plan.productName}
                productId={plan.productId}
                href={plan.href}
                isAnnual={isAnnual && plan.period === '月'}
              />
            </div>
          ))}
        </div>

        {/* Student + Enterprise CTA */}
        <div className="text-center mt-12 scroll-animate space-y-4" style={{ animationDelay: '0.4s' }}>
          <div>
            <a
              href="/student"
              className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm font-medium text-violet-300 transition-colors hover:bg-violet-500/20"
            >
              🎓 学生？用教育邮箱验证，全部免费
            </a>
          </div>
          <p className="text-muted-foreground">
            需要更大的规模？
            <a
              href="mailto:meteor@stu.gpnu.edu.cn"
              className="ml-2 text-primary hover:text-primary/80 transition-colors"
            >
              联系我们获取定制方案 →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

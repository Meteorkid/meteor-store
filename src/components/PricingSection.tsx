'use client';

import { useState } from 'react';
import PricingCard from './PricingCard';

const pricingPlans = [
  {
    name: 'Basic',
    price: 29,
    period: '月',
    productName: 'Ex-Memory',
    productId: 'ex-memory',
    href: '/products/ex-memory',
    features: [
      '基础功能',
      '1 个项目',
      '社区支持',
      '基础文档',
    ],
    isPopular: false,
  },
  {
    name: 'Pro',
    price: 99,
    period: '月',
    productName: 'OmniCrawl',
    productId: 'omnicrawl',
    href: '/products/omnicrawl',
    features: [
      '所有 Basic 功能',
      '无限项目',
      '优先支持',
      '高级文档',
      'API 访问',
      '自定义域名',
    ],
    isPopular: true,
  },
  {
    name: 'Enterprise',
    price: 299,
    period: '月',
    productName: 'Skeleton Anatomy',
    productId: 'skeleton-anatomy',
    href: '/products/skeleton-anatomy',
    features: [
      '所有 Pro 功能',
      '专属客户经理',
      '定制开发',
      'SLA 保障',
      '私有部署',
      '培训服务',
    ],
    isPopular: false,
  },
];

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  
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
              <span className="ml-1 text-xs text-success">省 20%</span>
            </span>
          </div>
        </div>
        
        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={plan.name}
              className="scroll-animate"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PricingCard
                name={plan.name}
                price={isAnnual ? Math.floor(plan.price * 0.8) : plan.price}
                period={isAnnual ? '月 (年付)' : plan.period}
                features={plan.features}
                isPopular={plan.isPopular}
                productName={plan.productName}
                productId={plan.productId}
                href={plan.href}
              />
            </div>
          ))}
        </div>
        
        {/* Enterprise CTA */}
        <div className="text-center mt-12 scroll-animate" style={{ animationDelay: '0.4s' }}>
          <p className="text-muted-foreground mb-4">
            需要更大的规模？
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            联系我们获取定制方案
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

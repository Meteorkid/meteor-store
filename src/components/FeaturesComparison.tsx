'use client';

import { CheckIconSm } from './CheckIcon';

const plans = [
  {
    name: 'Basic',
    price: '免费',
    description: '适合个人开发者试用',
    features: [
      { name: '核心功能', included: true },
      { name: '社区支持', included: true },
      { name: '基础文档', included: true },
      { name: 'API 访问', included: false },
      { name: '优先支持', included: false },
      { name: '定制开发', included: false },
    ],
  },
  {
    name: 'Pro',
    price: '¥99',
    period: '/月',
    description: '适合专业开发者和小团队',
    popular: true,
    features: [
      { name: '核心功能', included: true },
      { name: '社区支持', included: true },
      { name: '完整文档', included: true },
      { name: 'API 访问', included: true },
      { name: '优先支持', included: true },
      { name: '定制开发', included: false },
    ],
  },
  {
    name: 'Enterprise',
    price: '定制',
    description: '适合大型团队和企业',
    features: [
      { name: '核心功能', included: true },
      { name: '专属支持', included: true },
      { name: '完整文档', included: true },
      { name: 'API 访问', included: true },
      { name: '优先支持', included: true },
      { name: '定制开发', included: true },
    ],
  },
];

export default function FeaturesComparison() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-animate">
          <p className="text-sm text-primary uppercase tracking-widest font-medium mb-4">方案对比</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            选择适合你的方案
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            从免费开始，按需升级
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 transition-all duration-300 scroll-animate ${
                plan.popular
                  ? 'border-primary/50 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent shadow-xl shadow-primary/10'
                  : 'border-white/[0.06] bg-white/[0.02]'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-[11px] font-semibold text-white tracking-wide uppercase">
                    推荐
                  </span>
                </div>
              )}

              <h3 className={`text-sm font-medium mb-2 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`}>
                {plan.name}
              </h3>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                {plan.period && <span className="text-sm text-white/40">{plan.period}</span>}
              </div>

              <p className="text-xs text-white/30 mb-6">{plan.description}</p>

              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f.name} className="flex items-center gap-2.5 text-sm">
                    {f.included ? (
                      <CheckIconSm />
                    ) : (
                      <svg className="w-4 h-4 text-white/15 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className={f.included ? 'text-white/60' : 'text-white/25'}>{f.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

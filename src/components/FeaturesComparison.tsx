'use client';

const features = [
  { name: '基础功能', basic: true, pro: true, enterprise: true },
  { name: '高级功能', basic: false, pro: true, enterprise: true },
  { name: 'API 访问', basic: false, pro: true, enterprise: true },
  { name: '自定义域名', basic: false, pro: true, enterprise: true },
  { name: '优先支持', basic: false, pro: true, enterprise: true },
  { name: '专属客户经理', basic: false, pro: false, enterprise: true },
  { name: '定制开发', basic: false, pro: false, enterprise: true },
  { name: 'SLA 保障', basic: false, pro: false, enterprise: true },
  { name: '私有部署', basic: false, pro: false, enterprise: true },
  { name: '培训服务', basic: false, pro: false, enterprise: true },
];

export default function FeaturesComparison() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            功能对比
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            查看各套餐包含的功能
          </p>
        </div>
        
        {/* Comparison table */}
        <div className="max-w-4xl mx-auto overflow-x-auto scroll-animate" style={{ animationDelay: '0.1s' }}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-foreground font-semibold">功能</th>
                <th className="text-center py-4 px-4 text-foreground font-semibold">Basic</th>
                <th className="text-center py-4 px-4 text-primary font-semibold">Pro</th>
                <th className="text-center py-4 px-4 text-foreground font-semibold">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr 
                  key={feature.name}
                  className={`border-b border-border ${index % 2 === 0 ? 'bg-secondary/30' : ''}`}
                >
                  <td className="py-4 px-4 text-foreground">{feature.name}</td>
                  <td className="py-4 px-4 text-center">
                    {feature.basic ? (
                      <svg className="w-5 h-5 text-success mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-muted-foreground mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {feature.pro ? (
                      <svg className="w-5 h-5 text-primary mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-muted-foreground mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {feature.enterprise ? (
                      <svg className="w-5 h-5 text-success mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-muted-foreground mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

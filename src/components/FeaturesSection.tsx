'use client';

const features = [
  {
    icon: '🚀',
    title: '高性能',
    description: '所有工具都经过精心优化，确保最佳性能',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '🔒',
    title: '安全可靠',
    description: '隐私保护是我们的首要任务',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: '💡',
    title: '持续更新',
    description: '我们不断改进产品，添加新功能',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: '🎯',
    title: '精准定位',
    description: '针对不同场景优化，满足各种需求',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: '📱',
    title: '跨平台支持',
    description: '支持多种操作系统和设备',
    gradient: 'from-indigo-500 to-violet-500',
  },
  {
    icon: '💬',
    title: '优质服务',
    description: '提供及时的技术支持和帮助',
    gradient: 'from-pink-500 to-rose-500',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-secondary/5">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            为什么选择我们
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            我们致力于提供最优质的开发者工具和 AI 应用
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group relative p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 scroll-animate"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-muted-foreground">
                {feature.description}
              </p>
              
              {/* Hover effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

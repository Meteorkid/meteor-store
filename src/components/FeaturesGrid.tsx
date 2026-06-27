'use client';

const features = [
  {
    icon: '⚡',
    title: '极速性能',
    description: '所有工具都经过精心优化，确保最佳性能体验',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: '🛡️',
    title: '安全可靠',
    description: '隐私保护是我们的首要任务，数据安全有保障',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: '🔄',
    title: '持续更新',
    description: '我们不断改进产品，添加新功能，保持领先',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '🎯',
    title: '精准定位',
    description: '针对不同场景优化，满足各种专业需求',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: '📱',
    title: '跨平台支持',
    description: '支持多种操作系统和设备，随时随地使用',
    gradient: 'from-indigo-500 to-violet-500',
  },
  {
    icon: '💬',
    title: '优质服务',
    description: '提供及时的技术支持和帮助，解决您的问题',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: '🔧',
    title: '易于集成',
    description: '简单的 API 和文档，轻松集成到您的项目',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: '📊',
    title: '数据分析',
    description: '强大的数据分析功能，助您做出明智决策',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: '🎨',
    title: '精美设计',
    description: '精心设计的用户界面，提升使用体验',
    gradient: 'from-fuchsia-500 to-purple-500',
  },
];

export default function FeaturesGrid() {
  return (
    <section className="py-20 bg-gradient-to-b from-secondary/5 to-transparent">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            核心特性
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            我们的产品具备以下核心特性
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
              <div className="text-5xl mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                {feature.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
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

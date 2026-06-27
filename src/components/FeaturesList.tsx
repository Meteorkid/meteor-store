'use client';

const features = [
  {
    icon: '🚀',
    title: '高性能',
    description: '所有工具都经过精心优化，确保最佳性能体验',
    items: ['极速响应', '低内存占用', '优化算法', '并行处理'],
  },
  {
    icon: '🔒',
    title: '安全可靠',
    description: '隐私保护是我们的首要任务，数据安全有保障',
    items: ['端到端加密', '本地存储', '零知识证明', '安全审计'],
  },
  {
    icon: '💡',
    title: '易于使用',
    description: '简洁直观的界面设计，上手即用',
    items: ['直观界面', '详细文档', '视频教程', '社区支持'],
  },
  {
    icon: '🔄',
    title: '持续更新',
    description: '我们不断改进产品，添加新功能，保持领先',
    items: ['定期更新', '新功能开发', 'bug 修复', '性能优化'],
  },
];

export default function FeaturesList() {
  return (
    <section className="py-20">
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
        
        {/* Features list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="flex gap-6 scroll-animate"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="text-5xl flex-shrink-0">
                {feature.icon}
              </div>
              
              {/* Content */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                
                {/* Items */}
                <ul className="space-y-2">
                  {feature.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

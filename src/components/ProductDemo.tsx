'use client';

import { useState } from 'react';

const demos = [
  {
    id: 'omnicrawl',
    name: 'OmniCrawl',
    title: '万能爬虫框架',
    description: '支持多种反爬策略，轻松获取网页数据',
    features: ['多线程爬取', '反爬绕过', '数据解析', '导出多种格式'],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'ex-memory',
    name: 'Ex-Memory',
    title: '前任记忆智能体',
    description: 'AI 驱动的记忆分析系统，帮助你整理和回忆',
    features: ['AI 分析', '情感识别', '时间线', '智能搜索'],
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'skeleton-anatomy',
    name: 'Skeleton Anatomy',
    title: '3D 骨骼解剖图谱',
    description: '交互式 3D 人体骨骼解剖学习工具',
    features: ['3D 渲染', '交互操作', '详细标注', '学习模式'],
    gradient: 'from-green-500 to-emerald-500',
  },
];

export default function ProductDemo() {
  const [activeDemo, setActiveDemo] = useState(0);
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            产品演示
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            查看我们的产品如何工作
          </p>
        </div>
        
        {/* Demo tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 scroll-animate" style={{ animationDelay: '0.1s' }}>
          {demos.map((demo, index) => (
            <button
              key={demo.id}
              onClick={() => setActiveDemo(index)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeDemo === index
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {demo.name}
            </button>
          ))}
        </div>
        
        {/* Demo content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Demo preview */}
          <div className="scroll-animate" style={{ animationDelay: '0.2s' }}>
            <div className={`relative aspect-video rounded-2xl bg-gradient-to-br ${demos[activeDemo].gradient} p-8 flex items-center justify-center`}>
              {/* Placeholder for GIF */}
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-lg font-medium">{demos[activeDemo].name} 演示</p>
                <p className="text-sm opacity-80">GIF 展示区域</p>
              </div>
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Demo info */}
          <div className="scroll-animate" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {demos[activeDemo].title}
            </h3>
            <p className="text-muted-foreground mb-6">
              {demos[activeDemo].description}
            </p>
            
            {/* Features list */}
            <ul className="space-y-3 mb-8">
              {demos[activeDemo].features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-foreground">
                  <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            
            {/* CTA */}
            <a
              href={`/products/${demos[activeDemo].id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              查看详情
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

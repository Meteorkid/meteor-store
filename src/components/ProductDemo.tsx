'use client';

import { useState } from 'react';
import Link from 'next/link';

const demos = [
  {
    id: 'omnicrawl',
    name: 'OmniCrawl',
    tagline: '智能爬虫框架',
    description: '一行代码启动多线程爬虫，内置反爬绕过和数据解析能力',
    code: `import { Crawler } from 'omnicrawl';

const crawler = new Crawler({
  targets: ['https://example.com/products'],
  concurrency: 10,
  antiBot: true,
  parser: 'auto',
});

const results = await crawler.run();
console.log(\`爬取 \${results.length} 条数据\`);`,
    features: ['多线程并发', '反爬绕过', '智能解析', '多格式导出'],
  },
  {
    id: 'ex-memory',
    name: 'Ex-Memory',
    tagline: 'AI 记忆系统',
    description: '持久化 AI 对话记忆，支持语义搜索和时间线回溯',
    code: `import { Memory } from 'ex-memory';

const memory = new Memory({
  provider: 'openai',
  persistence: 'local',
});

await memory.store('讨论了产品路线图');
await memory.store('确定了 v2.0 发布日期');

const context = await memory.retrieve('路线图');
// → 返回相关的对话片段`,
    features: ['语义记忆', '时间线', '上下文召回', '本地存储'],
  },
  {
    id: 'skeleton-anatomy',
    name: 'Skeleton Anatomy',
    tagline: '3D 解剖图谱',
    description: '交互式 WebGL 3D 人体骨骼，支持标注、测量和学习模式',
    code: `import { SkeletonViewer } from 'skeleton-anatomy';

const viewer = new SkeletonViewer({
  container: '#app',
  quality: 'high',
  annotations: true,
});

viewer.setAngle('lateral');
viewer.highlight('femur');
viewer.measure('tibia', 'fibula');`,
    features: ['WebGL 3D', '交互标注', '测量工具', '学习模式'],
  },
];

export default function ProductDemo() {
  const [activeDemo, setActiveDemo] = useState(0);

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 scroll-animate">
          <p className="text-sm text-primary uppercase tracking-widest font-medium mb-4">代码驱动</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            简洁的 API，强大的能力
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            每款工具都追求极简的使用体验
          </p>
        </div>

        {/* Demo tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 scroll-animate">
          {demos.map((demo, index) => (
            <button
              key={demo.id}
              onClick={() => setActiveDemo(index)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeDemo === index
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              {demo.name}
            </button>
          ))}
        </div>

        {/* Demo content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
          {/* Terminal Code Block */}
          <div className="scroll-animate">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0d1117] overflow-hidden shadow-2xl shadow-black/20">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-xs text-white/30 ml-2 font-mono">{demos[activeDemo].id}.ts</span>
              </div>

              {/* Code */}
              <pre className="p-5 overflow-x-auto text-sm leading-relaxed">
                <code className="text-white/80 font-mono">
                  {demos[activeDemo].code.split('\n').map((line, i) => (
                    <div key={i} className="flex">
                      <span className="text-white/15 w-8 text-right mr-4 select-none">{i + 1}</span>
                      <span
                        className={
                          line.startsWith('import') || line.startsWith('const ')
                            ? 'text-[#7ee787]'
                            : line.includes('//')
                            ? 'text-white/30'
                            : 'text-white/70'
                        }
                      >
                        {line || ' '}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>

          {/* Info Panel */}
          <div className="scroll-animate lg:sticky lg:top-24">
            <div className="mb-6">
              <span className="text-xs text-primary font-medium uppercase tracking-wider">{demos[activeDemo].tagline}</span>
              <h3 className="text-2xl font-bold text-foreground mt-2 mb-3">{demos[activeDemo].name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{demos[activeDemo].description}</p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {demos[activeDemo].features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                  <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href={`/products/${demos[activeDemo].id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-6 to-pink-6 text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              查看完整文档
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

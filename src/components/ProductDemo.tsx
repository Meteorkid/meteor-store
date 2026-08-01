'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const demos = [
  {
    id: 'omnicrawl',
    name: 'OmniCrawl',
    taglineKey: 'demo1Tagline',
    descKey: 'demo1Desc',
    code: `import { Crawler } from 'omnicrawl';

const crawler = new Crawler({
  targets: ['https://example.com/products'],
  concurrency: 10,
  antiBot: true,
  parser: 'auto',
});

const results = await crawler.run();
console.log(\`爬取 \${results.length} 条数据\`);`,
    featureKeys: ['demo1Feature1', 'demo1Feature2', 'demo1Feature3', 'demo1Feature4'],
  },
  {
    id: 'ex-memory',
    name: 'Ex-Memory',
    taglineKey: 'demo2Tagline',
    descKey: 'demo2Desc',
    code: `import { Memory } from 'ex-memory';

const memory = new Memory({
  provider: 'openai',
  persistence: 'local',
});

await memory.store('讨论了产品路线图');
await memory.store('确定了 v2.0 发布日期');

const context = await memory.retrieve('路线图');
// → 返回相关的对话片段`,
    featureKeys: ['demo2Feature1', 'demo2Feature2', 'demo2Feature3', 'demo2Feature4'],
  },
  {
    id: 'skeleton-anatomy',
    name: 'Skeleton Anatomy',
    taglineKey: 'demo3Tagline',
    descKey: 'demo3Desc',
    code: `import { SkeletonViewer } from 'skeleton-anatomy';

const viewer = new SkeletonViewer({
  container: '#app',
  quality: 'high',
  annotations: true,
});

viewer.setAngle('lateral');
viewer.highlight('femur');
viewer.measure('tibia', 'fibula');`,
    featureKeys: ['demo3Feature1', 'demo3Feature2', 'demo3Feature3', 'demo3Feature4'],
  },
];

export default function ProductDemo() {
  const t = useTranslations('ProductDemo');
  const [activeDemo, setActiveDemo] = useState(0);

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 scroll-animate">
          <p className="text-sm text-primary uppercase tracking-widest font-medium mb-4">{t('eyebrow')}</p>
          <h2 className="t-title-1 text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('subtitle')}
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
                        {line || ' '}
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
              <span className="text-xs text-primary font-medium uppercase tracking-wider">{t(demos[activeDemo].taglineKey)}</span>
              <h3 className="text-2xl font-bold text-foreground mt-2 mb-3">{demos[activeDemo].name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t(demos[activeDemo].descKey)}</p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {demos[activeDemo].featureKeys.map((fKey) => (
                <div key={fKey} className="flex items-center gap-2 text-sm text-foreground/80">
                  <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t(fKey)}
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href={`/products/${demos[activeDemo].id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-6 to-pink-6 text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {t('viewDocs')}
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

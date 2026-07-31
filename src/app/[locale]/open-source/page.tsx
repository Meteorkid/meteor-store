import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { products } from '@/data/products';

export const metadata: Metadata = {
  title: '开源项目 - Meteor Store',
  description: '全部开源，全部免费。浏览 Meteor Store 的开源项目集合。',
};

const languageColors: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178C6',
  JavaScript: '#F1E05A',
  Swift: '#F05138',
  'C++': '#f34b7d',
  Rust: '#DEA584',
};

const projectMeta: Record<string, { language: string; description: string }> = {
  omnicrawl: {
    language: 'Python',
    description: '基于 Scrapling + curl_cffi + Playwright 的全能爬虫框架，一套 API 三个引擎，自动绕过反爬。',
  },
  'ex-memory': {
    language: 'Python',
    description: 'LLM + RAG 让 AI 学会一个人的说话风格。导入聊天记录，还原语气和用词习惯。',
  },
  'skeleton-anatomy': {
    language: 'TypeScript',
    description: '浏览器里的 3D 人体骨骼模型，支持旋转、缩放、标注，面向医学生和解剖学爱好者。',
  },
  'ui-design-system': {
    language: 'TypeScript',
    description: 'Claude Code 的 UI/UX 设计 Skill。三层 Token 体系 + shadcn 组件最佳实践。',
  },
  statux: {
    language: 'TypeScript',
    description: '终端状态栏工具，在 iTerm2 里实时显示 AI Agent 运行状态。',
  },
  xisland: {
    language: 'Swift',
    description: '把 iPhone 的灵动岛搬到 macOS 菜单栏，显示系统状态和音乐控制。',
  },
  tollow: {
    language: 'TypeScript',
    description: '沉浸式长文打字练习。选一本书，逐段练习，支持中英文。',
  },
  xnook: {
    language: 'Swift',
    description: 'macOS 效率小工具集，窗口管理、快捷键、剪贴板增强。',
  },
  'chakra-visualizer': {
    language: 'TypeScript',
    description: '用摄像头捕捉手势，识别火影忍者结印并播放忍术特效。纯前端实现。',
  },
};

export default function OpenSourcePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          {/* Hero */}
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
            Open Source
          </p>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">开源项目</h1>
          <p className="mb-6 max-w-2xl text-lg text-gray-400">
            全部开源，全部免费。每一款都是自己的痒点产品。
          </p>

          {/* Stats bar */}
          <div className="mb-14 flex flex-wrap gap-6 text-sm text-gray-500">
            <span><strong className="text-white">{products.length}</strong> 个项目</span>
            <span><strong className="text-white">MIT</strong> 协议</span>
            <span>
              <a
                href="https://github.com/Meteorkid"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                github.com/Meteorkid →
              </a>
            </span>
          </div>

          {/* Project grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {products.map((product) => {
              const meta = projectMeta[product.id];
              const lang = meta?.language || 'TypeScript';
              const langColor = languageColors[lang] || '#8b949e';
              const desc = meta?.description || product.tagline;

              return (
                <a
                  key={product.id}
                  href={product.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-all hover:border-white/15 hover:bg-white/[0.04]"
                >
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="text-xl" aria-hidden>{product.icon}</span>
                      <h2 className="text-lg font-bold text-white transition-colors group-hover:text-emerald-300">
                        {product.name}
                      </h2>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-gray-400">{desc}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    {/* Language dot */}
                    <span className="flex items-center gap-1.5">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: langColor }}
                      />
                      {lang}
                    </span>

                    {/* Platforms */}
                    <span className="flex flex-wrap gap-1">
                      {product.platforms.slice(0, 3).map((p) => (
                        <span
                          key={p}
                          className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[11px]"
                        >
                          {p}
                        </span>
                      ))}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="mb-4 text-gray-400">
              想要贡献？欢迎提交 Issue 和 Pull Request。
            </p>
            <a
              href="https://github.com/Meteorkid"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              在 GitHub 上关注
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

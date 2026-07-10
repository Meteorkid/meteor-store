import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { products } from '@/data/products';
import { categoryLabels } from '@/lib/constants';

export const metadata: Metadata = {
  title: '文档 - Meteor Store',
  description: 'Meteor Store 产品快速上手指南、安装命令与开发文档',
};

const categoryOrder = ['developer', 'ai', 'design', 'utility'] as const;

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          {/* Hero */}
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-violet-300">
            Documentation
          </p>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">文档中心</h1>
          <p className="mb-6 max-w-2xl text-lg text-gray-400">
            每款产品的快速上手指南。复制命令，30 秒跑起来。
          </p>

          {/* Quick nav */}
          <nav className="mb-14 flex flex-wrap gap-2">
            {categoryOrder.map((cat) => {
              const label = categoryLabels[cat];
              if (!label) return null;
              return (
                <a
                  key={cat}
                  href={`#cat-${cat}`}
                  className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-gray-400 transition-colors hover:border-violet-500/40 hover:text-white"
                >
                  {label}
                </a>
              );
            })}
          </nav>

          {/* Per-category sections */}
          {categoryOrder.map((category) => {
            const label = categoryLabels[category];
            const items = products.filter((p) => p.category === category);
            if (!items.length || !label) return null;

            return (
              <section key={category} id={`cat-${category}`} className="mb-16 scroll-mt-24">
                <h2 className="mb-8 text-2xl font-bold text-white">{label}</h2>
                <div className="space-y-6">
                  {items.map((product) => (
                    <DocCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            );
          })}

          {/* Bottom CTA */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="mb-1 text-lg font-semibold text-white">找不到想要的？</p>
            <p className="mb-6 text-gray-400">每个项目的 README 都有完整 API 文档和进阶用法。</p>
            <a
              href="https://github.com/Meteorkid"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
            >
              <GithubIcon />
              浏览 GitHub
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function DocCard({ product }: { product: (typeof products)[number] }) {
  const qs = product.quickstart;

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] transition-colors hover:border-white/15">
      {/* Header row */}
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <span className="text-2xl" aria-hidden>{product.icon}</span>
            <Link
              href={`/products/${product.id}`}
              className="text-xl font-bold text-white transition-colors hover:text-violet-300"
            >
              {product.name}
            </Link>
            {/* Platform badges */}
            <div className="flex flex-wrap gap-1.5">
              {product.platforms.map((p) => (
                <span
                  key={p}
                  className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] font-medium text-gray-500"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">{product.tagline}</p>
        </div>

        {/* Action links */}
        <div className="flex shrink-0 items-center gap-3">
          <a
            href={product.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:border-white/20 hover:text-white"
          >
            <GithubIcon />
            README
          </a>
          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:border-violet-500/40 hover:text-violet-300"
          >
            详情 →
          </Link>
        </div>
      </div>

      {/* Terminal / Download block */}
      {qs && (
        <div className="border-t border-white/[0.06] bg-zinc-950/60">
          {qs.command ? (
            <div className="flex items-center gap-4 px-6 py-3">
              <div className="flex items-center gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-emerald-300/80">
                <span className="select-none text-white/25">$ </span>
                {qs.command}
              </code>
            </div>
          ) : qs.download ? (
            <div className="flex items-center justify-between px-6 py-3">
              <span className="text-sm text-gray-500">macOS 应用，下载即装即用</span>
              <a
                href={qs.download}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
              >
                下载 ↓
              </a>
            </div>
          ) : null}
          {qs.note && (
            <p className="border-t border-white/[0.04] px-6 py-2.5 text-xs text-white/30">
              {qs.note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function GithubIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

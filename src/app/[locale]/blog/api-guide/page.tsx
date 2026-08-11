import type { Metadata } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { markdownToHtml } from '@/lib/markdown';



export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'zh' ? '博客发布 API 调用指南' : 'Blog Publishing API Guide';
  return {
    title,
    description: locale === 'zh'
      ? '通过个人访问令牌在 Codex、Claude Code 等工具中管理博客投稿的完整指南。'
      : 'Complete guide for managing blog posts via personal access tokens in Codex, Claude Code, and other tools.',
  };
}

export default async function ApiGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const mdPath = join(process.cwd(), 'docs/blog-publishing-api.md');
  const md = readFileSync(mdPath, 'utf-8');
  const html = markdownToHtml(md);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="t-title-1">
                {locale === 'zh' ? '博客发布 API 调用指南' : 'Blog Publishing API Guide'}
              </h1>
              <p className="t-body mt-2 text-white/60">
                {locale === 'zh'
                  ? '通过个人访问令牌在 Codex、Claude Code 等工具中管理博客投稿。'
                  : 'Manage blog posts via personal access tokens in Codex, Claude Code, and other tools.'}
              </p>
            </div>
            <a
              href="/api/guide"
              download
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2.5 10.5v2a1 1 0 001 1h9a1 1 0 001-1v-2M8 2.5v8M5 7.5l3 3 3-3" />
              </svg>
              {locale === 'zh' ? '下载 Markdown' : 'Download .md'}
            </a>
          </header>

          <article
            className="prose prose-invert prose-violet max-w-none
              prose-headings:text-white/90 prose-headings:font-semibold
              prose-h2:t-title-2 prose-h3:t-title-3
              prose-p:text-white/75 prose-p:leading-relaxed
              prose-a:text-violet-300 prose-a:no-underline hover:prose-a:underline
              prose-code:rounded-md prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:text-violet-200
              prose-pre:rounded-xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/40
              prose-table:overflow-hidden prose-table:rounded-xl prose-table:border prose-table:border-white/10
              prose-th:bg-white/[0.04] prose-th:px-4 prose-th:py-3 prose-th:text-sm prose-th:font-medium prose-th:text-white/70
              prose-td:border-t prose-td:border-white/5 prose-td:px-4 prose-td:py-3 prose-td:text-sm prose-td:text-white/70
              prose-li:text-white/70
              prose-strong:text-white/85"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

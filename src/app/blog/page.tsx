import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogList from '@/components/BlogList';

export const metadata: Metadata = {
  title: '博客 - Meteor Store',
  description: 'Meteor Store 技术博客与产品动态',
  alternates: {
    types: { 'application/rss+xml': '/blog/feed.xml' },
  },
};

export default function BlogPage() {
  return (
    <div className="blog-scope min-h-screen bg-black text-white">
      <Header />
      <main className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <header className="relative mb-16">
            <div aria-hidden className="blog-glow" />
            <p className="relative mb-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/35">
              Journal
            </p>
            <h1 className="relative mb-5 text-5xl font-bold tracking-tight md:text-7xl">博客</h1>
            <p className="relative max-w-xl text-lg leading-relaxed text-white/45">
              技术与产品在左，情感、文学与辩论在右。
            </p>
            <a
              href="/blog/feed.xml"
              className="relative mt-6 inline-flex items-center gap-1.5 text-xs text-white/30 transition-colors duration-200 hover:text-white/70"
            >
              <span aria-hidden>◉</span> RSS 订阅
            </a>
          </header>

          <BlogList />
        </div>
      </main>
      <Footer />
    </div>
  );
}

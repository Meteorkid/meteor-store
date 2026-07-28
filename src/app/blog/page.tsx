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
      <main className="relative container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-4xl">
          {/* 当前位置由导航栏表达，这里只留一句上下文，把版面还给文章 */}
          <header className="relative mb-8 flex items-baseline justify-between gap-6">
            <h1 className="sr-only">博客</h1>
            <p className="t-footnote text-white/60">
              技术与产品在左，情感、文学与辩论在右。
            </p>
            <a
              href="/blog/feed.xml"
              className="t-footnote shrink-0 text-white/60 transition-colors duration-200 hover:text-white/70"
            >
              <span aria-hidden>◉</span> RSS
            </a>
          </header>

          <BlogList />
        </div>
      </main>
      <Footer />
    </div>
  );
}

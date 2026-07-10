import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogList from '@/components/BlogList';

export const metadata: Metadata = {
  title: '博客 - Meteor Store',
  description: 'Meteor Store 技术博客与产品动态',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-violet-300">Blog</p>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">博客</h1>
          <p className="mb-10 text-lg text-gray-400">
            产品更新、技术分享与幕后故事
          </p>
          <BlogList />
        </div>
      </main>
      <Footer />
    </div>
  );
}

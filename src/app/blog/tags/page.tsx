import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TagDirectory from '@/components/TagDirectory';
import { getFeedTags } from '@/data/blog-feed';

export const metadata: Metadata = {
  title: '全部标签 - Meteor Store 博客',
  description: '按热度排列的全部文章标签',
};

export default async function BlogTagsPage() {
  const tags = await getFeedTags();

  return (
    <div className="blog-scope min-h-screen bg-black text-white">
      <Header />
      <main className="relative container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-4xl">
          <header className="relative mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="t-title-2">全部标签</h1>
              <span aria-hidden className="t-footnote text-white/20">/</span>
              <p className="t-footnote text-white/60">按文章数排列，字号越大越热</p>
            </div>
            <Link
              href="/blog"
              className="t-footnote shrink-0 text-white/60 transition-colors duration-200 hover:text-white"
            >
              ← 回到博客
            </Link>
          </header>

          <TagDirectory tags={tags} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

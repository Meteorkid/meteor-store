import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogListClient from '@/components/BlogListClient';
import { toSummary } from '@/data/blog';
import { blogSections } from '@/data/blog-sections';
import { allTags, findTag, getPostsByTag } from '@/data/blog-tags';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams() {
  return allTags.map((t) => ({ tag: t.label }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = findTag(decodeURIComponent((await params).tag));
  return tag
    ? {
        title: `#${tag.label} - Meteor Store 博客`,
        description: `标签「${tag.label}」下的 ${tag.count} 篇文章`,
      }
    : { title: '标签未找到 - Meteor Store' };
}

export default async function BlogTagPage({ params }: TagPageProps) {
  const tag = findTag(decodeURIComponent((await params).tag));
  if (!tag) notFound();

  const posts = getPostsByTag(tag.key).map(toSummary);
  const counts = Object.fromEntries(blogSections.map((s) => [s.id, 0]));

  return (
    <div className="blog-scope min-h-screen bg-black text-white">
      <Header />
      <main className="relative container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-4xl">
          <header className="relative mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="t-title-2">#{tag.label}</h1>
              <span aria-hidden className="t-footnote text-white/20">/</span>
              <p className="t-footnote tabular-nums text-white/60">{tag.count} 篇</p>
            </div>
            <Link
              href="/blog/tags"
              className="t-footnote shrink-0 text-white/60 transition-colors duration-200 hover:text-white"
            >
              全部标签 →
            </Link>
          </header>

          <BlogListClient posts={posts} counts={counts} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

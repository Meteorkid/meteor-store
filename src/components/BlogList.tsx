'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { blogPosts, blogCategoryLabels, type BlogPost } from '@/data/blog';

type CategoryFilter = 'all' | BlogPost['category'];
type SortMode = 'newest' | 'oldest' | 'reading-time';

const categories: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'tech', label: '技术分享' },
  { value: 'product', label: '产品动态' },
  { value: 'story', label: '幕后故事' },
];

const sortOptions: { value: SortMode; label: string }[] = [
  { value: 'newest', label: '最新发布' },
  { value: 'oldest', label: '最早发布' },
  { value: 'reading-time', label: '阅读时长' },
];

function getAllTags(posts: BlogPost[]): string[] {
  const set = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}

export default function BlogList() {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [sort, setSort] = useState<SortMode>('newest');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => getAllTags(blogPosts), []);

  const filtered = useMemo(() => {
    let posts = [...blogPosts];

    if (category !== 'all') {
      posts = posts.filter((p) => p.category === category);
    }
    if (activeTag) {
      posts = posts.filter((p) => p.tags.includes(activeTag));
    }

    switch (sort) {
      case 'newest':
        posts.sort((a, b) => b.date.localeCompare(a.date));
        break;
      case 'oldest':
        posts.sort((a, b) => a.date.localeCompare(b.date));
        break;
      case 'reading-time':
        posts.sort((a, b) => a.readingTime - b.readingTime);
        break;
    }

    return posts;
  }, [category, sort, activeTag]);

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => { setCategory(cat.value); setActiveTag(null); }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                category === cat.value
                  ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30'
                  : 'text-gray-500 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort select */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          className="w-fit cursor-pointer rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-gray-400 outline-none transition-colors hover:border-white/20 focus:border-violet-500/50"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Tag cloud */}
      <div className="mb-8 flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              activeTag === tag
                ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30'
                : 'bg-white/[0.04] text-gray-500 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="mb-6 text-sm text-gray-600">
        {filtered.length === blogPosts.length
          ? `共 ${filtered.length} 篇文章`
          : `筛选出 ${filtered.length} / ${blogPosts.length} 篇`}
      </p>

      {/* Post list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] py-16 text-center">
          <p className="text-gray-500">没有匹配的文章</p>
          <button
            type="button"
            onClick={() => { setCategory('all'); setActiveTag(null); }}
            className="mt-3 text-sm text-violet-300 transition-colors hover:text-violet-200"
          >
            清除筛选
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.06] md:p-8"
            >
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
                  {blogCategoryLabels[post.category]}
                </span>
                <time className="text-gray-500" dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
                <span className="text-gray-600">{post.readingTime} 分钟阅读</span>
              </div>
              <h2 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-violet-200 md:text-2xl">
                {post.title}
              </h2>
              <p className="mb-4 leading-relaxed text-gray-400">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-md px-2 py-0.5 text-xs ${
                      activeTag === tag
                        ? 'bg-violet-500/15 text-violet-300'
                        : 'bg-white/[0.06] text-gray-500'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

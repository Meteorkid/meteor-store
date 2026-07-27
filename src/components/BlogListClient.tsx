'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { BlogPostSummary } from '@/data/blog';
import { blogSectionLabels, getSectionById } from '@/data/blog-sections';

type SortMode = 'newest' | 'oldest' | 'reading-time';

const sortOptions: { value: SortMode; label: string }[] = [
  { value: 'newest', label: '最新发布' },
  { value: 'oldest', label: '最早发布' },
  { value: 'reading-time', label: '阅读时长' },
];

function getAllTags(posts: BlogPostSummary[]): string[] {
  const set = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}

interface BlogListClientProps {
  /** 只接收摘要字段，正文留在服务端，不进客户端 bundle */
  posts: BlogPostSummary[];
  /** 分区页里徽章已是冗余信息，可隐藏 */
  showSectionBadge?: boolean;
}

export default function BlogListClient({ posts, showSectionBadge = true }: BlogListClientProps) {
  const [sort, setSort] = useState<SortMode>('newest');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => getAllTags(posts), [posts]);

  const filtered = useMemo(() => {
    const result = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : [...posts];

    switch (sort) {
      case 'newest':
        result.sort((a, b) => b.date.localeCompare(a.date));
        break;
      case 'oldest':
        result.sort((a, b) => a.date.localeCompare(b.date));
        break;
      case 'reading-time':
        result.sort((a, b) => a.readingTime - b.readingTime);
        break;
    }

    return result;
  }, [posts, sort, activeTag]);

  return (
    <div>
      {/* 标签 + 排序 */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                activeTag === tag
                  ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30'
                  : 'bg-white/[0.04] text-gray-500 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          aria-label="排序方式"
          className="w-fit shrink-0 cursor-pointer rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-gray-400 outline-none transition-colors hover:border-white/20 focus:border-violet-500/50"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <p className="mb-6 text-sm text-gray-600">
        {activeTag
          ? `筛选出 ${filtered.length} / ${posts.length} 篇`
          : `共 ${posts.length} 篇文章`}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] py-16 text-center">
          <p className="text-gray-500">{activeTag ? '没有匹配的文章' : '这个分区还没有文章'}</p>
          {activeTag && (
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className="mt-3 text-sm text-violet-300 transition-colors hover:text-violet-200"
            >
              清除筛选
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((post) => {
            const section = getSectionById(post.section);
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.06] md:p-8"
              >
                <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
                  {showSectionBadge && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        section?.accent ?? 'bg-white/[0.06] text-gray-400'
                      }`}
                    >
                      {blogSectionLabels[post.section]}
                    </span>
                  )}
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
            );
          })}
        </div>
      )}
    </div>
  );
}

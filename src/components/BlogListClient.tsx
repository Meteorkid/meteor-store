'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { BlogPostSummary } from '@/data/blog';
import { getSectionById } from '@/data/blog-sections';

type SortMode = 'newest' | 'oldest' | 'reading-time';

const sortOptions: { value: SortMode; label: string }[] = [
  { value: 'newest', label: '最新' },
  { value: 'oldest', label: '最早' },
  { value: 'reading-time', label: '最短' },
];

/** 编辑部风格的日期：2026.07.01 */
function formatDate(date: string): string {
  return date.replace(/-/g, '.');
}

function getAllTags(posts: BlogPostSummary[]): string[] {
  const set = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}

/** 每篇文章带上自己分区的主题色，让扫描线/序号跟着分区走 */
function accentStyle(sectionId: string): React.CSSProperties {
  const rgb = getSectionById(sectionId)?.rgb;
  return rgb ? ({ '--accent': rgb } as React.CSSProperties) : {};
}

interface BlogListClientProps {
  /** 只接收摘要字段，正文留在服务端，不进客户端 bundle */
  posts: BlogPostSummary[];
  /** 分区页里分区名是冗余信息，可隐藏 */
  showSectionLabel?: boolean;
}

export default function BlogListClient({ posts, showSectionLabel = true }: BlogListClientProps) {
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

  const [lede, ...rest] = filtered;
  const ledeSection = lede ? getSectionById(lede.section) : undefined;

  return (
    <div>
      {/* 工具条：标签在左，排序在右 */}
      <div className="mb-12 flex flex-col gap-5 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-4 flex min-w-0 flex-1 gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`shrink-0 rounded-md px-2 py-1 text-xs transition-colors duration-200 ${
                activeTag === tag
                  ? 'bg-white/10 text-white'
                  : 'text-white/30 hover:text-white/70'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-1 self-start text-xs sm:self-auto sm:border-l sm:border-white/10 sm:pl-4">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSort(opt.value)}
              aria-pressed={sort === opt.value}
              className={`rounded-md px-2 py-1 transition-colors duration-200 ${
                sort === opt.value ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/70'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-white/40">{activeTag ? '没有匹配的文章' : '这个分区还在等第一篇'}</p>
          {activeTag && (
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className="mt-3 text-sm text-white/70 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
            >
              清除筛选
            </button>
          )}
        </div>
      ) : (
        <>
          {/* 头条：最新一篇拿到最大的版面 */}
          <Link
            href={`/blog/${lede.slug}`}
            style={accentStyle(lede.section)}
            className="blog-lede group mb-16 block"
          >
            <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              {showSectionLabel && ledeSection && (
                <span
                  className="font-medium"
                  style={{ color: `rgb(${ledeSection.rgb})` }}
                >
                  {ledeSection.label}
                </span>
              )}
              <time className="tabular-nums text-white/35" dateTime={lede.date}>
                {formatDate(lede.date)}
              </time>
              <span className="text-white/25">{lede.readingTime} min</span>
            </div>

            <h2 className="blog-lede__title mb-5 max-w-3xl text-3xl font-bold leading-[1.15] tracking-tight md:text-5xl">
              {lede.title}
            </h2>

            <p className="max-w-2xl text-base leading-relaxed text-white/45">{lede.excerpt}</p>

            <span className="mt-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors duration-200 group-hover:text-white">
              读下去
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </Link>

          {/* 索引：其余文章排成带序号的编辑部目录 */}
          {rest.length > 0 && (
            <div className="blog-stagger">
              {rest.map((post, i) => {
                const section = getSectionById(post.section);
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    style={{ ...accentStyle(post.section), animationDelay: `${Math.min(i, 8) * 45}ms` }}
                    className="blog-row group"
                  >
                    <div className="blog-row__inner flex gap-4 py-7 sm:gap-8">
                      <span className="blog-row__index w-8 shrink-0 pt-1 text-xs text-white/20 sm:w-12">
                        {String(i + 2).padStart(2, '0')}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                          <time className="tabular-nums text-white/30" dateTime={post.date}>
                            {formatDate(post.date)}
                          </time>
                          {showSectionLabel && section && (
                            <>
                              <span aria-hidden className="text-white/15">·</span>
                              <span style={{ color: `rgb(${section.rgb} / 0.75)` }}>{section.label}</span>
                            </>
                          )}
                          <span aria-hidden className="text-white/15">·</span>
                          <span className="text-white/25">{post.readingTime} min</span>
                        </div>

                        <h3 className="mb-2 text-lg font-semibold leading-snug text-white/85 transition-colors duration-200 group-hover:text-white md:text-xl">
                          {post.title}
                        </h3>

                        <p className="line-clamp-2 text-sm leading-relaxed text-white/35">{post.excerpt}</p>
                      </div>

                      <span
                        aria-hidden
                        className="blog-row__arrow hidden shrink-0 self-center text-lg text-white/50 sm:block"
                      >
                        →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <p className="mt-10 text-xs tabular-nums text-white/25">
            {activeTag ? `${filtered.length} / ${posts.length} 篇` : `共 ${posts.length} 篇`}
          </p>
        </>
      )}
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { BlogPostSummary } from '@/data/blog';
import {
  getSectionById,
  getSectionsByChannel,
  type BlogSectionId,
} from '@/data/blog-sections';
import type { TagSummary } from '@/data/blog-tags';

type SortMode = 'newest' | 'oldest' | 'reading-time';

const sortOptions: { value: SortMode; label: string }[] = [
  { value: 'newest', label: '最新' },
  { value: 'oldest', label: '最早' },
  { value: 'reading-time', label: '最短' },
];

const channelGroups = getSectionsByChannel();

/** 编辑部风格的日期：2026.07.01 */
function formatDate(date: string): string {
  return date.replace(/-/g, '.');
}

/** 每篇文章带上自己分区的主题色 */
function accentStyle(sectionId: string): React.CSSProperties {
  const rgb = getSectionById(sectionId)?.rgb;
  return rgb ? ({ '--blog-accent': rgb } as React.CSSProperties) : {};
}

interface BlogListClientProps {
  /** 只接收摘要字段，正文留在服务端，不进客户端 bundle */
  posts: BlogPostSummary[];
  /** 各分区文章数，由服务端算好传入，避免把正文带进来 */
  counts: Record<string, number>;
  /** 当前分区，未传表示「全部」 */
  activeSectionId?: BlogSectionId;
  /** 导航里展示的热门标签；标签页与分区页不需要重复展示 */
  hotTags?: TagSummary[];
  /** 标签总数，用于「全部标签」入口 */
  totalTagCount?: number;
}

export default function BlogListClient({
  posts,
  counts,
  activeSectionId,
  hotTags,
  totalTagCount = 0,
}: BlogListClientProps) {
  const [sort, setSort] = useState<SortMode>('newest');

  const showSectionLabel = !activeSectionId;

  const filtered = useMemo(() => {
    const result = [...posts];

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
  }, [posts, sort]);

  const [lede, ...rest] = filtered;
  const ledeSection = lede ? getSectionById(lede.section) : undefined;

  return (
    <div className="relative">
      {/* 光晕垫在工具条背后，玻璃才有东西可折射 */}
      <div aria-hidden className="blog-glow" />

      {/* 一个玻璃工具条收纳全部导航与筛选，而不是散落的小字 */}
      <div className="blog-toolbar glass relative mb-12 p-2">
        <nav
          aria-label="博客分区"
          className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <Link
            href="/blog"
            aria-current={activeSectionId ? undefined : 'page'}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeSectionId
                ? 'text-white/50 hover:text-white'
                : 'bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]'
            }`}
          >
            全部
          </Link>

          {channelGroups.map(({ channel, sections }) => (
            <div key={channel.id} className="flex shrink-0 items-center gap-1">
              <span aria-hidden className="mx-2 h-5 w-px bg-white/10" />
              <span className="t-eyebrow mr-1 shrink-0 text-white/60">{channel.label}</span>
              {sections.map((s) => {
                const active = s.id === activeSectionId;
                const count = counts[s.id] ?? 0;
                return (
                  <Link
                    key={s.id}
                    href={`/blog/section/${s.slug}`}
                    title={s.description}
                    aria-current={active ? 'page' : undefined}
                    style={{ '--tab-accent': s.rgb } as React.CSSProperties}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      active ? 'blog-tab--active' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {s.label}
                    {count > 0 && (
                      <span className="ml-1.5 text-[11px] font-normal tabular-nums opacity-70">{count}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* 热门标签：动态层。分区是骨架，标签是当下大家在聊什么 */}
      {hotTags && hotTags.length > 0 && (
        <nav aria-label="热门标签" className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-2">
          <span className="t-eyebrow mr-1 text-white/45">热门标签</span>
          {hotTags.map((tag) => (
            <Link
              key={tag.key}
              href={tag.href}
              className="t-footnote inline-flex items-baseline gap-1 rounded-lg px-2.5 py-1 text-white/70 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white"
            >
              #{tag.label}
              <span className="tabular-nums text-white/45">{tag.count}</span>
            </Link>
          ))}
          {totalTagCount > hotTags.length && (
            <Link
              href="/blog/tags"
              className="t-footnote rounded-lg px-2.5 py-1 text-white/60 underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-white"
            >
              全部 {totalTagCount} 个标签 →
            </Link>
          )}
        </nav>
      )}

      {/* 排序 */}
      <div className="mb-10 flex items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
        <div role="group" aria-labelledby="blog-sort-label" className="flex items-center gap-1">
          <span id="blog-sort-label" className="t-eyebrow mr-1 text-white/45">排序</span>
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSort(opt.value)}
              aria-pressed={sort === opt.value}
              className={`t-footnote rounded-lg px-2.5 py-1 transition-colors duration-200 ${
                sort === opt.value ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <span className="t-footnote tabular-nums text-white/60">{posts.length} 篇</span>
      </div>

      {filtered.length === 0 ? (
        <div className="py-14 text-center">
          <p className="t-body text-white/60">
            这里还没有文章
          </p>
        </div>
      ) : (
        <>
          {/* 头条：玻璃卡片 + 背后的分区色晕，材质本身就是层级 */}
          <div className="relative mb-16" style={accentStyle(lede.section)}>
            <div aria-hidden className="blog-lede-halo" />
            <Link
              href={`/blog/${lede.slug}`}
              className="glass-card group relative block rounded-3xl p-7 md:p-11"
            >
              <div className="t-footnote mb-6 flex flex-wrap items-center gap-x-3 gap-y-1">
                {showSectionLabel && ledeSection && (
                  <span className="font-semibold" style={{ color: `rgb(${ledeSection.rgb})` }}>
                    {ledeSection.label}
                  </span>
                )}
                <time className="tabular-nums text-white/60" dateTime={lede.date}>
                  {formatDate(lede.date)}
                </time>
                <span aria-hidden className="text-white/20">·</span>
                <span className="text-white/60">{lede.readingTime} 分钟</span>
              </div>

              <h2 className="t-title-1 blog-lede__title mb-6 max-w-3xl">{lede.title}</h2>

              <p className="t-body t-on-glass max-w-2xl opacity-60">{lede.excerpt}</p>

              <span className="t-footnote mt-8 inline-flex items-center gap-2 font-medium text-white/60 transition-colors duration-200 group-hover:text-white">
                读下去
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </div>

          {/* 索引：平铺在背景上，与头条形成材质对比 */}
          {rest.length > 0 && (
            <section className="blog-stagger">
              {rest.map((post, i) => {
                const section = getSectionById(post.section);
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    style={{ ...accentStyle(post.section), animationDelay: `${Math.min(i, 8) * 45}ms` }}
                    className="blog-row group"
                  >
                    <div className="blog-row__inner flex gap-3 py-8 sm:gap-4">
                      <span className="blog-row__index t-footnote w-6 shrink-0 pt-1 text-white/60 sm:w-7">
                        {String(i + 2).padStart(2, '0')}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="t-footnote mb-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                          <time className="tabular-nums text-white/60" dateTime={post.date}>
                            {formatDate(post.date)}
                          </time>
                          {showSectionLabel && section && (
                            <>
                              <span aria-hidden className="text-white/15">·</span>
                              <span style={{ color: `rgb(${section.rgb} / 0.8)` }}>{section.label}</span>
                            </>
                          )}
                        </div>

                        <h2 className="t-title-3 mb-2.5 text-white/90 transition-colors duration-200 group-hover:text-white">
                          {post.title}
                        </h2>

                        <p className="line-clamp-2 text-[0.9375rem] leading-relaxed text-white/60">
                          {post.excerpt}
                        </p>
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
            </section>
          )}
        </>
      )}
    </div>
  );
}

'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { FeedPostSummary } from '@/data/blog-feed';
import {
  getSectionById,
  getSectionsByChannel,
  type BlogSectionId,
} from '@/data/blog-sections';
import type { TagSummary } from '@/data/blog-tags';
import type { Locale } from '@/i18n/routing';
import { useAuth } from './AuthProvider';
import BlogTimeline from './BlogTimeline';
import type { ActiveTag } from './BlogList';

type SortMode = 'newest' | 'oldest' | 'reading-time' | 'event-newest' | 'event-oldest';

const sortOptions: {
  value: SortMode;
  labelKey: 'sortNewest' | 'sortOldest' | 'sortShortest' | 'sortEventNewest' | 'sortEventOldest';
}[] = [
  { value: 'newest', labelKey: 'sortNewest' },
  { value: 'oldest', labelKey: 'sortOldest' },
  { value: 'reading-time', labelKey: 'sortShortest' },
  { value: 'event-newest', labelKey: 'sortEventNewest' },
  { value: 'event-oldest', labelKey: 'sortEventOldest' },
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
  posts: FeedPostSummary[];
  /** 各分区文章数，由服务端算好传入，避免把正文带进来 */
  counts: Record<string, number>;
  /** 当前分区，未传表示「全部」。与 activeTag 可叠加双重筛选 */
  activeSectionId?: BlogSectionId;
  /** 当前标签，未传表示「全部」。与 activeSectionId 可叠加双重筛选 */
  activeTag?: ActiveTag | null;
  /** 导航里展示的热门标签，所有列表页都展示，作为第二重筛选入口 */
  hotTags?: TagSummary[];
  /** 标签总数，用于「全部标签」入口 */
  totalTagCount?: number;
  /** 各文章收藏数，服务端批量查询后传入。key = post.slug（对投稿即 post.id） */
  favoriteCounts?: Record<string, number>;
}

export default function BlogListClient({
  posts,
  counts,
  activeSectionId,
  activeTag = null,
  hotTags,
  totalTagCount = 0,
  favoriteCounts = {},
}: BlogListClientProps) {
  const [sort, setSort] = useState<SortMode>('newest');
  const { user } = useAuth();
  const locale = useLocale() as Locale;
  const t = useTranslations('BlogList');

  // 时间轴锚点注册表：slug → 文章 DOM 元素（排序/加载后由 React 更新 ref）
  const anchorsRef = useRef<Map<string, HTMLElement>>(new Map());
  const registerAnchor = useCallback((slug: string) => {
    return (el: HTMLElement | null) => {
      if (el) anchorsRef.current.set(slug, el);
      else anchorsRef.current.delete(slug);
    };
  }, []);

  const showSectionLabel = !activeSectionId;

  // 双重筛选：分区维度选中时，标签链接带上 ?section=；标签维度选中时，分区链接带上 ?tag=
  const activeSectionSlug = activeSectionId ? getSectionById(activeSectionId)?.slug : undefined;
  const withTag = (path: string) => (activeTag ? `${path}?tag=${encodeURIComponent(activeTag.label)}` : path);
  const withSection = (path: string) =>
    activeSectionSlug ? `${path}?section=${encodeURIComponent(activeSectionSlug)}` : path;

  // 当前标签若不在热门列表里（冷门标签页），补在列表最前，保证高亮可见
  const displayTags = useMemo<TagSummary[]>(() => {
    if (!hotTags) return [];
    if (!activeTag || hotTags.some((t) => t.key === activeTag.key)) return hotTags;
    return [{ key: activeTag.key, label: activeTag.label, count: 0, href: `/blog/tag/${encodeURIComponent(activeTag.label)}` }, ...hotTags];
  }, [hotTags, activeTag]);

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
      case 'event-newest':
        result.sort((a, b) => b.eventDate.localeCompare(a.eventDate));
        break;
      case 'event-oldest':
        result.sort((a, b) => a.eventDate.localeCompare(b.eventDate));
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

      {/* 右侧垂直时间轴：文章数 >= 2 时展示 */}
      {filtered.length >= 2 && <BlogTimeline posts={filtered} anchorsRef={anchorsRef} />}

      {/* 一个玻璃工具条收纳全部导航与筛选，而不是散落的小字 */}
      <div className="blog-toolbar glass relative mb-12 p-2">
        <nav
          aria-label={t('sectionsAria')}
          className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <Link
            href={withTag('/blog')}
            aria-current={activeSectionId ? undefined : 'page'}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeSectionId
                ? 'text-white/50 hover:text-white'
                : 'bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]'
            }`}
          >
            {t('all')}
          </Link>

          {channelGroups.map(({ channel, sections }) => (
            <div key={channel.id} className="flex shrink-0 items-center gap-1">
              <span aria-hidden className="mx-2 h-5 w-px bg-white/10" />
              <span className="t-eyebrow mr-1 shrink-0 text-white/60">{channel.label[locale]}</span>
              {sections.map((s) => {
                const active = s.id === activeSectionId;
                const count = counts[s.id] ?? 0;
                return (
                  <Link
                    key={s.id}
                    href={withTag(`/blog/section/${s.slug}`)}
                    title={s.description[locale]}
                    aria-current={active ? 'page' : undefined}
                    style={{ '--tab-accent': s.rgb } as React.CSSProperties}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      active ? 'blog-tab--active' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {s.label[locale]}
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

      {/* 热门标签：动态层。分区是骨架，标签是当下大家在聊什么。与分区维度并存，支持双重筛选 */}
      {displayTags.length > 0 && (
        <nav aria-label={t('tagsAria')} className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-2">
          <span className="t-eyebrow mr-1 text-white/45">{t('hotTags')}</span>
          {displayTags.map((tag) => {
            const active = activeTag?.key === tag.key;
            return (
              <Link
                key={tag.key}
                href={withSection(tag.href)}
                aria-current={active ? 'page' : undefined}
                className={`t-footnote inline-flex items-baseline gap-1 rounded-lg px-2.5 py-1 transition-colors duration-200 ${
                  active
                    ? 'bg-white/[0.14] text-white'
                    : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                #{tag.label}
                {tag.count > 0 && <span className="tabular-nums text-white/45">{tag.count}</span>}
              </Link>
            );
          })}
          {totalTagCount > (hotTags?.length ?? 0) && (
            <Link
              href="/blog/tags"
              className="t-footnote rounded-lg px-2.5 py-1 text-white/60 underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-white"
            >
              {t('allTags', { count: totalTagCount })}
            </Link>
          )}
        </nav>
      )}

      {/* 排序 */}
      <div className="mb-10 flex items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
        <div role="group" aria-labelledby="blog-sort-label" className="flex flex-wrap items-center gap-x-1 gap-y-1">
          <span id="blog-sort-label" className="t-eyebrow mr-1 text-white/45">{t('sort')}</span>
          {sortOptions.slice(0, 3).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSort(opt.value)}
              aria-pressed={sort === opt.value}
              className={`t-footnote rounded-lg px-2.5 py-1 transition-colors duration-200 ${
                sort === opt.value ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {t(opt.labelKey)}
            </button>
          ))}
          <span aria-hidden className="mx-1 h-4 w-px bg-white/15" />
          {sortOptions.slice(3).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSort(opt.value)}
              aria-pressed={sort === opt.value}
              className={`t-footnote rounded-lg px-2.5 py-1 transition-colors duration-200 ${
                sort === opt.value ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {t(opt.labelKey)}
            </button>
          ))}
        </div>
        <div className="t-footnote flex items-center gap-3">
          <span className="tabular-nums text-white/60">{t('count', { count: posts.length })}</span>
          <span aria-hidden className="text-white/15">·</span>
          {/* 读完想写一篇的时候，入口该在这里 */}
          <Link
            href={user ? '/blog/submit' : '/login'}
            className="text-white/60 underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-white"
          >
            {t('write')}
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-14 text-center">
          <p className="t-body text-white/60">
            {t('empty')}
          </p>
        </div>
      ) : (
        <>
          {/* 头条：玻璃卡片 + 背后的分区色晕，材质本身就是层级 */}
          <div className="relative mb-16" style={accentStyle(lede.section)}>
            <div aria-hidden className="blog-lede-halo" />
            <Link
              href={lede.href}
              ref={registerAnchor(lede.slug)}
              className="glass-card group relative block rounded-3xl p-7 md:p-11"
            >
              <div className="t-footnote mb-6 flex flex-wrap items-center gap-x-3 gap-y-1">
                {showSectionLabel && ledeSection && (
                  <span className="font-semibold" style={{ color: `rgb(${ledeSection.rgb})` }}>
                    {ledeSection.label[locale]}
                  </span>
                )}
                <time className="tabular-nums text-white/60" dateTime={lede.date}>
                  {formatDate(lede.date)}
                </time>
                <span aria-hidden className="text-white/20">·</span>
                <span className="text-white/60">{t('minutes', { count: lede.readingTime })}</span>
                {lede.author && (
                  <>
                    <span aria-hidden className="text-white/20">·</span>
                    <span className="text-white/60">{lede.author}</span>
                  </>
                )}
              </div>

              <h2 className="t-title-1 blog-lede__title mb-6 max-w-3xl">{lede.title}</h2>

              <p className="t-body t-on-glass max-w-2xl opacity-60">{lede.excerpt}</p>

              <span className="t-footnote mt-8 inline-flex items-center gap-2 font-medium text-white/60 transition-colors duration-200 group-hover:text-white">
                {t('readMore')}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </div>

          {/* 索引：平铺在背景上，与头条形成材质对比 */}
          {rest.length > 0 && (
            <section className="blog-stagger">
              {rest.map((post, i) => {
                const section = getSectionById(post.section);
                const favCount = favoriteCounts[post.slug] ?? 0;
                return (
                  <Link
                    key={post.slug}
                    href={post.href}
                    ref={registerAnchor(post.slug)}
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
                              <span style={{ color: `rgb(${section.rgb} / 0.8)` }}>{section.label[locale]}</span>
                            </>
                          )}
                          {post.author && (
                            <>
                              <span aria-hidden className="text-white/15">·</span>
                              <span className="text-white/60">{post.author}</span>
                            </>
                          )}
                          {favCount > 0 && (
                            <>
                              <span aria-hidden className="text-white/15">·</span>
                              <span
                                className="inline-flex items-center gap-1 tabular-nums text-white/45"
                                title={t('favoritesCount', { count: favCount })}
                              >
                                <svg
                                  width="11"
                                  height="11"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                </svg>
                                {favCount}
                              </span>
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

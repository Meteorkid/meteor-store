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
import { normalizeTag, type TagSummary } from '@/data/blog-tags';
import type { Locale } from '@/i18n/routing';
import { useAuth } from './AuthProvider';
import BlogTimeline from './BlogTimeline';

/** 排序维度：按发布时间 date，还是按内容描述的事件时间 eventDate */
type SortDimension = 'date' | 'eventDate';
/** 排序方向：desc 降序（新在前），asc 升序（旧在前） */
type SortDirection = 'desc' | 'asc';

const sortDimensions: {
  value: SortDimension;
  labelKey: 'sortByPublish' | 'sortByEvent';
}[] = [
  { value: 'date', labelKey: 'sortByPublish' },
  { value: 'eventDate', labelKey: 'sortByEvent' },
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
  /** 当前分区，未传表示「全部」。分区是骨架，标签在其上多选叠加 */
  activeSectionId?: BlogSectionId;
  /** 初始选中的标签（来自 URL 等外部入口），交客户端原位增删 */
  initialTags?: TagSummary[];
  /** 导航里展示的热门标签，作为第一屏的多选入口 */
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
  initialTags = [],
  hotTags,
  totalTagCount = 0,
  favoriteCounts = {},
}: BlogListClientProps) {
  const [dimension, setDimension] = useState<SortDimension>('date');
  const [direction, setDirection] = useState<SortDirection>('desc');
  // 选中的标签集：点击热门标签切换，❌ 移除单个，清除全部一键清空
  const [selectedTags, setSelectedTags] = useState<TagSummary[]>(initialTags);
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

  const toggleTag = useCallback((tag: TagSummary) => {
    setSelectedTags((prev) =>
      prev.some((t) => t.key === tag.key)
        ? prev.filter((t) => t.key !== tag.key)
        : [...prev, tag],
    );
  }, []);

  const clearTags = useCallback(() => setSelectedTags([]), []);

  // 多标签「任一命中」：命中任一已选标签的文章都保留；不选标签时为全部
  const filtered = useMemo(() => {
    const getTime = (p: FeedPostSummary) => (dimension === 'date' ? p.date : p.eventDate);
    const result = [...posts].filter((p) => {
      if (selectedTags.length === 0) return true;
      return selectedTags.some((tag) => p.tags.some((t) => normalizeTag(t) === tag.key));
    });
    result.sort((a, b) => {
      const cmp = getTime(a).localeCompare(getTime(b));
      return direction === 'desc' ? -cmp : cmp;
    });
    return result;
  }, [posts, selectedTags, dimension, direction]);

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
            href="/blog/stars"
            title={t('starMap')}
            className="shrink-0 rounded-full px-3 py-2 text-sm font-medium text-white/50 transition-colors duration-200 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="inline-block">
              <path d="M12 2l2.9 6.26 6.6.64-5 4.4 1.5 6.5L12 16.9 5.99 19.8 7.5 13.3l-5-4.4 6.6-.64z" />
            </svg>
            <span className="sr-only">{t('starMap')}</span>
          </Link>
          <Link
            href="/blog"
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
                    href={`/blog/section/${s.slug}`}
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

      {/* 已选标签：原位管理，每个带 ✕ 移除，一键清除全部 */}
      {selectedTags.length > 0 && (
        <div aria-label={t('selectedAria')} className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-2">
          <span className="t-eyebrow mr-1 text-white/45">{t('selectedTags')}</span>
          {selectedTags.map((tag) => (
            <span
              key={tag.key}
              className="t-footnote inline-flex items-center gap-1.5 rounded-lg bg-white/[0.12] px-2.5 py-1 text-white"
            >
              #{tag.label}
              <button
                type="button"
                onClick={() => toggleTag(tag)}
                aria-label={t('removeTag', { tag: tag.label })}
                className="-m-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-white/60 transition-colors duration-200 hover:bg-white/[0.14] hover:text-white"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clearTags}
            className="t-footnote rounded-lg px-2.5 py-1 text-white/60 underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-white"
          >
            {t('clearAllTags')}
          </button>
        </div>
      )}

      {/* 热门标签：动态层。分区是骨架，标签是当下大家在聊什么。点击即原位多选，可叠加 */}
      {hotTags && hotTags.length > 0 && (
        <nav aria-label={t('tagsAria')} className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-2">
          <span className="t-eyebrow mr-1 text-white/45">{t('hotTags')}</span>
          {hotTags.map((tag) => {
            const on = selectedTags.some((t) => t.key === tag.key);
            return (
              <button
                key={tag.key}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed={on}
                className={`t-footnote inline-flex items-baseline gap-1 rounded-lg px-2.5 py-1 transition-colors duration-200 ${
                  on
                    ? 'bg-white/[0.14] text-white'
                    : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                #{tag.label}
                {tag.count > 0 && <span className="tabular-nums text-white/45">{tag.count}</span>}
              </button>
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
          {sortDimensions.map((dim) => {
            const active = dimension === dim.value;
            return (
              <button
                key={dim.value}
                type="button"
                onClick={() => {
                  if (active) {
                    // 再点一次当前维度 = 切换升序/降序
                    setDirection(direction === 'desc' ? 'asc' : 'desc');
                  } else {
                    // 切到另一个维度，默认降序（新/晚在前）
                    setDimension(dim.value);
                    setDirection('desc');
                  }
                }}
                aria-pressed={active}
                title={active ? t(direction === 'desc' ? 'sortDesc' : 'sortAsc') : undefined}
                className={`t-footnote inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition-colors duration-200 ${
                  active ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {t(dim.labelKey)}
                <span aria-hidden className="text-[0.8em] leading-none">
                  {active ? (direction === 'desc' ? '↓' : '↑') : '↕'}
                </span>
              </button>
            );
          })}
        </div>
        <div className="t-footnote flex items-center gap-3">
          <span className="tabular-nums text-white/60">{t('count', { count: filtered.length })}</span>
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
            {selectedTags.length > 0 ? t('emptyFiltered') : t('empty')}
          </p>
          {selectedTags.length > 0 && (
            <button
              type="button"
              onClick={clearTags}
              className="t-footnote mt-4 rounded-lg px-3 py-1.5 text-white/60 underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-white"
            >
              {t('clearAllTags')}
            </button>
          )}
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
                <time className="tabular-nums text-white/60" dateTime={dimension === 'date' ? lede.date : lede.eventDate}>
                  {formatDate(dimension === 'date' ? lede.date : lede.eventDate)}
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
                          <time className="tabular-nums text-white/60" dateTime={dimension === 'date' ? post.date : post.eventDate}>
                            {formatDate(dimension === 'date' ? post.date : post.eventDate)}
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

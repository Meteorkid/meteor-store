'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { TagSummary } from '@/data/blog-tags';

interface TagDirectoryProps {
  tags: TagSummary[];
}

/**
 * 全部标签页。
 *
 * 只接收 { label, key, count, href }，一千个标签也就几十 KB，
 * 所以筛选放在客户端做——不必为此加一个搜索接口。
 * 等标签量真的到需要分页的程度再改成服务端。
 *
 * 标签除了搜索，还能原位多选：点标签切换选中，选中的标签排成
 * 带 ✕ 的胶囊，可单个移除或一键清除；点「浏览」跳到博客列表
 * 按所选标签过滤（博客列表自己也支持继续多选）。
 */
export default function TagDirectory({ tags }: TagDirectoryProps) {
  const t = useTranslations('TagDirectory');
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<TagSummary[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tags;
    return tags.filter((tag) => tag.key.includes(q));
  }, [tags, query]);

  const toggleTag = (tag: TagSummary) => {
    setSelectedTags((prev) =>
      prev.some((t) => t.key === tag.key)
        ? prev.filter((t) => t.key !== tag.key)
        : [...prev, tag],
    );
  };

  const clearTags = () => setSelectedTags([]);

  // 用归一化 key 拼 URL，博客列表端 findFeedTags 按 key 解析出完整标签
  const browseHref =
    selectedTags.length > 0
      ? `/blog?tags=${selectedTags.map((t) => encodeURIComponent(t.key)).join(',')}`
      : '/blog';

  // 热度分档，用字号和亮度区分，比单纯列数字更快能扫出重点
  const max = tags[0]?.count ?? 1;
  const weight = (count: number) => {
    const ratio = count / max;
    if (ratio > 0.66) return 'text-lg font-semibold text-white';
    if (ratio > 0.33) return 'text-[0.9375rem] font-medium text-white/85';
    return 'text-[0.9375rem] text-white/70';
  };

  return (
    <div>
      <div className="mb-8">
        <label htmlFor="tag-search" className="sr-only">
          {t('searchLabel')}
        </label>
        <input
          id="tag-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-[0.9375rem] text-white placeholder-white/50 transition-colors focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/40"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="t-footnote tabular-nums text-white/60" role="status">
            {query.trim()
              ? t('matchCount', { matched: filtered.length, total: tags.length })
              : t('totalCount', { total: tags.length })}
          </p>
          <p className="t-footnote text-white/45">{t('multiSelectHint')}</p>
        </div>
      </div>

      {/* 已选标签：原位管理，每个带 ✕ 移除，一键清除全部 */}
      {selectedTags.length > 0 && (
        <div aria-label={t('selectedAria')} className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-2">
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

          <Link
            href={browseHref}
            className="t-footnote ml-auto inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 font-medium text-white transition-colors duration-200 hover:bg-white/[0.16]"
          >
            {t('browse', { count: selectedTags.length })} →
          </Link>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="t-body py-16 text-center text-white/60">{t('noMatch')}</p>
      ) : (
        <ul className="flex flex-wrap gap-x-3 gap-y-3">
          {filtered.map((tag) => {
            const on = selectedTags.some((t) => t.key === tag.key);
            return (
              <li key={tag.key}>
                <button
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={on}
                  className={`inline-flex items-baseline gap-1.5 rounded-xl border px-3.5 py-2 transition-colors duration-200 ${
                    on
                      ? 'border-white/25 bg-white/[0.12]'
                      : 'border-white/[0.07] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.06]'
                  }`}
                >
                  <span className={weight(tag.count)}>#{tag.label}</span>
                  <span className="t-footnote tabular-nums text-white/45">{tag.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
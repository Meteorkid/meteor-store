'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
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
 */
export default function TagDirectory({ tags }: TagDirectoryProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tags;
    return tags.filter((t) => t.key.includes(q));
  }, [tags, query]);

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
          搜索标签
        </label>
        <input
          id="tag-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索标签…"
          className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-[0.9375rem] text-white placeholder-white/50 transition-colors focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/40"
        />
        <p className="t-footnote mt-2 tabular-nums text-white/60" role="status">
          {query.trim()
            ? `匹配到 ${filtered.length} / ${tags.length} 个标签`
            : `共 ${tags.length} 个标签`}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="t-body py-16 text-center text-white/60">没有匹配的标签</p>
      ) : (
        <ul className="flex flex-wrap gap-x-3 gap-y-3">
          {filtered.map((tag) => (
            <li key={tag.key}>
              <Link
                href={tag.href}
                className="inline-flex items-baseline gap-1.5 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-2 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <span className={weight(tag.count)}>#{tag.label}</span>
                <span className="t-footnote tabular-nums text-white/45">{tag.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

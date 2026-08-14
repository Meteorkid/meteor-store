'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from '@/i18n/navigation';
import { searchHelpEntries, type HelpSearchEntry } from '@/data/help-search';

interface HelpCenterSearchProps {
  entries: HelpSearchEntry[];
  placeholder: string;
  noResults: string;
  initialQuery?: string;
}

export default function HelpCenterSearch({
  entries,
  placeholder,
  noResults,
  initialQuery = '',
}: HelpCenterSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = query.trim()
    ? searchHelpEntries(entries, query).slice(0, 8)
    : [];

  // 渲染期调整：查询变化时重置选中项（React Compiler：不在 effect 里同步 setState）
  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  const goTo = useCallback(
    (slug: string) => {
      setOpen(false);
      router.push(`/docs/${slug}`);
    },
    [router],
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[activeIndex]) goTo(results[activeIndex].slug);
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
        >
          ⌘
        </span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setOpen(true);
          }}
          onBlur={() => {
            // 延迟关闭以允许点击结果
            setTimeout(() => setOpen(false), 150);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="glass w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-12 pr-4 text-[1.0625rem] text-white placeholder:text-white/30 outline-none transition-colors focus:border-violet-400/60 focus:bg-white/[0.06]"
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls="help-search-results"
          aria-activedescendant={
            open && results[activeIndex]
              ? `help-result-${results[activeIndex].slug}`
              : undefined
          }
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/30 outline-none hover:text-white/60 focus-visible:ring-2 focus-visible:ring-violet-300"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <ul
          ref={listRef}
          id="help-search-results"
          role="listbox"
          className="glass-lg absolute inset-x-0 top-full z-50 mt-2 max-h-[22rem] overflow-y-auto rounded-2xl border border-white/10 bg-black/95 p-2 shadow-2xl"
        >
          {results.map((entry, index) => (
            <li
              key={entry.slug}
              id={`help-result-${entry.slug}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={() => goTo(entry.slug)}
              className={`cursor-pointer rounded-xl px-4 py-3 outline-none transition-colors ${
                index === activeIndex
                  ? 'bg-violet-500/20 text-white'
                  : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <p className="text-[0.9375rem] font-medium">{entry.title}</p>
              <p className="t-footnote mt-0.5 line-clamp-1 text-white/40">
                {entry.excerpt}
              </p>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className="glass-lg absolute inset-x-0 top-full z-50 mt-2 rounded-2xl border border-white/10 bg-black/95 p-6 text-center shadow-2xl">
          <p className="text-white/50">{noResults}</p>
        </div>
      )}
    </div>
  );
}

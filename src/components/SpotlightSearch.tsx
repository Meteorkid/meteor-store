'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  searchEntries,
  getIndex,
  getHighlightRanges,
  type SearchGroup,
  type SearchEntry,
} from '@/lib/search-index';
import type { Locale } from '@/i18n/routing';

const GROUP_ORDER: SearchGroup[] = ['产品', '页面', '帮助', '彩蛋'];

const RECENT_KEY = 'spotlight:recent';
const MAX_RECENT = 5;
const POPULAR_IDS = [
  'page-products',
  'page-docs',
  'page-blog',
  'page-student',
  'page-open-source',
];

function getRecentIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRecentId(id: string) {
  try {
    const ids = getRecentIds().filter(r => r !== id);
    ids.unshift(id);
    localStorage.setItem(RECENT_KEY, JSON.stringify(ids.slice(0, MAX_RECENT)));
  } catch { /* noop */ }
}

function removeAllRecent() {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch { /* noop */ }
}

function HighlightedText({
  text,
  query,
  className,
}: {
  text: string;
  query: string;
  className?: string;
}) {
  const ranges = useMemo(() => getHighlightRanges(text, query), [text, query]);
  if (ranges.length === 0) return <span className={className}>{text}</span>;

  const chars = Array.from(text);
  const parts: React.ReactNode[] = [];
  let prev = 0;
  for (const { start, end } of ranges) {
    if (start > prev) parts.push(chars.slice(prev, start).join(''));
    parts.push(
      <mark
        key={start}
        className="bg-purple-400/25 text-inherit rounded-sm"
      >
        {chars.slice(start, end).join('')}
      </mark>,
    );
    prev = end;
  }
  if (prev < chars.length) parts.push(chars.slice(prev).join(''));
  return <span className={className}>{parts}</span>;
}

/**
 * Spotlight 聚焦搜索（⌘K / Ctrl+K / 「/」唤起）。
 */
export default function SpotlightSearch() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations('SpotlightSearch');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchEntries(query, locale), [query, locale]);

  // 面板打开时刷新最近访问列表：渲染期调整状态，避免 effect 里同步 setState
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setRecentIds(getRecentIds());
  }

  // 查询变化时重置选中项到第一条：同样是渲染期调整状态
  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  const defaultEntries = useMemo(() => {
    const index = getIndex(locale);
    const recent = recentIds
      .map(id => index.find(e => e.id === id))
      .filter((e): e is SearchEntry => e != null);
    const popular = POPULAR_IDS.filter(id => !recentIds.includes(id))
      .map(id => index.find(e => e.id === id))
      .filter((e): e is SearchEntry => e != null);
    return { recent, popular };
  }, [recentIds]);

  const isEmpty = query.trim() === '';
  const allDefault = useMemo(
    () => [...defaultEntries.recent, ...defaultEntries.popular],
    [defaultEntries],
  );
  const activeItems = isEmpty ? allDefault : results;

  const panelAlpha = Math.min(0.45 + query.length * 0.05, 0.92);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  const navigate = useCallback(
    (entry: SearchEntry) => {
      saveRecentId(entry.id);
      close();
      router.push(entry.href);
    },
    [close, router],
  );

  const handleClearRecent = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    removeAllRecent();
    setRecentIds([]);
  }, []);

  // 全局快捷键 + Header 事件唤起
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(o => !o);
        return;
      }
      if (e.key === '/' && !open) {
        const target = e.target as HTMLElement;
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        )
          return;
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('spotlight:open', onOpenEvent);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('spotlight:open', onOpenEvent);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!open) return null;

  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, activeItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeItems[activeIndex]) navigate(activeItems[activeIndex]);
        break;
      case 'Tab':
        e.preventDefault();
        break;
    }
  };

  const renderItem = (entry: SearchEntry, globalIdx: number) => {
    const active = globalIdx === activeIndex;
    return (
      <button
        key={entry.id}
        data-index={globalIdx}
        role="option"
        aria-selected={active}
        onClick={() => navigate(entry)}
        onMouseEnter={() => setActiveIndex(globalIdx)}
        className={`w-full flex items-center justify-between gap-4 px-5 py-2.5 text-left transition-colors duration-100 ${
          active ? 'bg-purple-500/20' : 'hover:bg-white/[0.04]'
        }`}
      >
        <span className="min-w-0">
          {isEmpty ? (
            <span
              className={`block text-sm truncate ${active ? 'text-white' : 'text-white/80'}`}
            >
              {entry.title}
            </span>
          ) : (
            <HighlightedText
              text={entry.title}
              query={query}
              className={`block text-sm truncate ${active ? 'text-white' : 'text-white/80'}`}
            />
          )}
          {entry.subtitle &&
            (isEmpty ? (
              <span className="block text-xs text-white/35 truncate">
                {entry.subtitle}
              </span>
            ) : (
              <HighlightedText
                text={entry.subtitle}
                query={query}
                className="block text-xs text-white/35 truncate"
              />
            ))}
        </span>
        {active && (
          <span
            className="shrink-0 text-[10px] text-purple-300/80 font-mono"
            aria-hidden="true"
          >
            ↵
          </span>
        )}
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('dialogAriaLabel')}
      onKeyDown={onPanelKeyDown}
    >
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px] animate-spotlight-fade"
        onClick={close}
        aria-hidden="true"
      />

      {/* 玻璃面板 */}
      <div
        className="glass-lg relative w-full max-w-xl rounded-2xl overflow-hidden animate-spotlight-in"
        style={{
          backgroundColor: `rgba(18, 14, 32, ${panelAlpha})`,
          transition: 'background-color 150ms ease',
        }}
      >
        {/* 输入行 */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08]">
          <svg
            className="w-5 h-5 text-white/40 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('placeholder')}
            aria-label={t('inputAriaLabel')}
            autoComplete="off"
            spellCheck={false}
            maxLength={60}
            className="flex-1 bg-transparent outline-none text-white text-base placeholder:text-white/30 caret-purple-400"
          />
          <kbd className="hidden sm:block text-[10px] text-white/30 border border-white/15 rounded px-1.5 py-0.5 font-mono">
            ESC
          </kbd>
        </div>

        {/* 结果区 */}
        <div
          ref={listRef}
          className="max-h-[46vh] overflow-y-auto overscroll-contain py-2"
          role="listbox"
          aria-label={t('resultsAriaLabel')}
        >
          {isEmpty ? (
            <>
              {defaultEntries.recent.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-5 pt-3 pb-1.5">
                    <p className="text-[11px] text-white/30 uppercase tracking-widest">
                      {t('recentLabel')}
                    </p>
                    <button
                      type="button"
                      onClick={handleClearRecent}
                      className="text-[11px] text-white/20 hover:text-white/40 transition-colors"
                    >
                      {t('clear')}
                    </button>
                  </div>
                  {defaultEntries.recent.map(entry =>
                    renderItem(entry, allDefault.indexOf(entry)),
                  )}
                </div>
              )}
              <div>
                <p className="px-5 pt-3 pb-1.5 text-[11px] text-white/30 uppercase tracking-widest">
                  {t('popularLabel')}
                </p>
                {defaultEntries.popular.map(entry =>
                  renderItem(entry, allDefault.indexOf(entry)),
                )}
              </div>
              <p className="px-5 py-3 text-[11px] text-white/25 text-center border-t border-white/[0.06] mt-1">
                {t('hint')}
              </p>
            </>
          ) : results.length === 0 ? (
            <p className="px-5 py-6 text-sm text-white/40 text-center">
              {t('empty')}{' '}
              <button
                className="text-purple-300 hover:text-purple-200 underline underline-offset-2"
                onClick={() => {
                  close();
                  router.push('/#terminal');
                }}
              >
                {t('terminalLink')}
              </button>
            </p>
          ) : (
            GROUP_ORDER.map(group => {
              const groupResults = results.filter(r => r.group === group);
              if (groupResults.length === 0) return null;
              const groupLabel = group === '产品' ? t('groupProduct')
                : group === '页面' ? t('groupPage')
                : group === '帮助' ? t('groupHelp')
                : t('groupEasterEgg');
              return (
                <div key={group}>
                  <p className="px-5 pt-3 pb-1.5 text-[11px] text-white/30 uppercase tracking-widest">
                    {groupLabel}
                  </p>
                  {groupResults.map(entry =>
                    renderItem(entry, results.indexOf(entry)),
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

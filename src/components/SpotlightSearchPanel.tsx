'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  getIndex,
  getHighlightRanges,
  getBreadcrumb,
  tryQuickMath,
  parseSearchQuery,
  type SearchGroup,
  type SearchEntry,
  type QuickMathResult,
} from '@/lib/search-index';
import type { Locale } from '@/i18n/routing';
import { SITE_URL } from '@/lib/constants';

// ── 常量 ──────────────────────────────────────────────

const GROUP_ORDER: SearchGroup[] = ['产品', '页面', '帮助', '博客', '彩蛋'];

const RECENT_KEY = 'spotlight:recent';
const HISTORY_KEY = 'spotlight:history';
const MAX_RECENT = 5;
const MAX_HISTORY = 8;
const DEBOUNCE_MS = 200;
const INITIAL_LIMIT = 8;

const POPULAR_IDS = [
  'page-products', 'page-docs', 'page-blog', 'page-student', 'page-open-source',
];

// ── localStorage ──────────────────────────────────────

function getRecentIds(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}
function saveRecentId(id: string) {
  try {
    const ids = getRecentIds().filter(r => r !== id);
    ids.unshift(id);
    localStorage.setItem(RECENT_KEY, JSON.stringify(ids.slice(0, MAX_RECENT)));
  } catch { /* noop */ }
}
function removeAllRecent() {
  try { localStorage.removeItem(RECENT_KEY); } catch { /* noop */ }
}
function getSearchHistory(): string[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}
function saveSearchHistory(query: string) {
  try {
    const q = query.trim();
    if (!q) return;
    const history = getSearchHistory().filter(h => h !== q);
    history.unshift(q);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  } catch { /* noop */ }
}
function removeSearchHistory(query: string) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(getSearchHistory().filter(h => h !== query)));
  } catch { /* noop */ }
}

// ── 辅助组件 ──────────────────────────────────────────

function HighlightedText({ text, query, className }: {
  text: string; query: string; className?: string;
}) {
  const ranges = useMemo(() => getHighlightRanges(text, query), [text, query]);
  if (ranges.length === 0) return <span className={className}>{text}</span>;
  const chars = Array.from(text);
  const parts: React.ReactNode[] = [];
  let prev = 0;
  for (const { start, end } of ranges) {
    if (start > prev) parts.push(chars.slice(prev, start).join(''));
    parts.push(<mark key={start} className="bg-purple-400/25 text-inherit rounded-sm">{chars.slice(start, end).join('')}</mark>);
    prev = end;
  }
  if (prev < chars.length) parts.push(chars.slice(prev).join(''));
  return <span className={className}>{parts}</span>;
}

function SkeletonRow({ index }: { index: number }) {
  return (
    <div className="flex items-center gap-3 px-5 py-2.5" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="w-4 h-4 rounded bg-white/[0.06] animate-pulse shrink-0" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="h-3.5 rounded bg-white/[0.06] animate-pulse w-3/4" />
        <div className="h-2.5 rounded bg-white/[0.04] animate-pulse w-1/2" />
      </div>
    </div>
  );
}

function copyToClipboard(text: string): boolean {
  try { navigator.clipboard.writeText(text); return true; } catch { return false; }
}

// ── 搜索 API 结果类型 ─────────────────────────────────

interface SearchAPIResponse {
  results: SearchEntry[];
  hasFuzzy?: boolean;
}

// ── 主组件 ────────────────────────────────────────────

export default function SpotlightSearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations('SpotlightSearch');

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentIds, setRecentIds] = useState<string[]>(() => getRecentIds());
  const [searchHistory, setSearchHistory] = useState<string[]>(() => getSearchHistory());
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [hasFuzzy, setHasFuzzy] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(INITIAL_LIMIT);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // 解析前缀过滤
  const parsedQuery = useMemo(() => parseSearchQuery(query), [query]);
  const hasActiveFilter = parsedQuery.groupFilter !== null;
  const displayQuery = parsedQuery.query || query.trim();

  // 快速计算
  const quickMath = useMemo(() => tryQuickMath(displayQuery), [displayQuery]);

  // ── API 搜索 ──────────────────────────────────────────
  // 渲染期调整：查询清空时重置搜索结果（React Compiler：不在 effect 里同步 setState）
  const [prevDisplayQuery, setPrevDisplayQuery] = useState(displayQuery);
  if (displayQuery !== prevDisplayQuery) {
    setPrevDisplayQuery(displayQuery);
    if (!displayQuery) {
      setResults([]);
      setHasFuzzy(false);
      setIsSearching(false);
      setVisibleLimit(INITIAL_LIMIT);
    }
  }

  useEffect(() => {
    if (!displayQuery) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        // setState 放进异步回调（React Compiler：不在 effect 里同步 setState）
        setIsSearching(true);
        setVisibleLimit(INITIAL_LIMIT);
        const url = `/api/spotlight/search?q=${encodeURIComponent(displayQuery)}&locale=${locale}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) { setResults([]); return; }
        const data: SearchAPIResponse = await res.json();
        const apiResults = data.results ?? [];

        // 如果用户指定了前缀，客户端二次过滤
        if (parsedQuery.groupFilter) {
          setResults(apiResults.filter(r => r.group === parsedQuery.groupFilter));
        } else {
          setResults(apiResults);
        }
        setHasFuzzy(data.hasFuzzy ?? false);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setResults([]);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, DEBOUNCE_MS);

    return () => { clearTimeout(timer); controller.abort(); };
  }, [displayQuery, locale, parsedQuery.groupFilter]);

  // 重置选中项
  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  // ── 默认条目 ─────────────────────────────────────────
  const defaultEntries = useMemo(() => {
    const index = getIndex(locale);
    const recent = recentIds.map(id => index.find(e => e.id === id)).filter((e): e is SearchEntry => e != null);
    const popular = POPULAR_IDS.filter(id => !recentIds.includes(id)).map(id => index.find(e => e.id === id)).filter((e): e is SearchEntry => e != null);
    return { recent, popular };
  }, [recentIds, locale]);

  const isEmpty = query.trim() === '';
  const allDefault = useMemo(() => [...defaultEntries.recent, ...defaultEntries.popular], [defaultEntries]);
  const visibleResults = useMemo(() => results.slice(0, visibleLimit), [results, visibleLimit]);
  const hasMore = results.length > visibleLimit;

  // 活动条目
  const activeEntries = useMemo((): Array<SearchEntry | { __math: QuickMathResult }> => {
    if (isEmpty) return allDefault;
    const list: Array<SearchEntry | { __math: QuickMathResult }> = [...visibleResults];
    if (quickMath) list.unshift({ __math: quickMath } as unknown as SearchEntry);
    return list;
  }, [isEmpty, allDefault, visibleResults, quickMath]);

  const activeItems = activeEntries;
  const totalItems = activeItems.length;

  // 结果统计
  const resultStats = useMemo(() => {
    if (isEmpty || results.length === 0) return null;
    const counts: Partial<Record<SearchGroup, number>> = {};
    for (const r of results) {
      counts[r.group] = (counts[r.group] || 0) + 1;
    }
    return GROUP_ORDER.filter(g => counts[g]).map(g => `${counts[g]}`).join(' · ');
  }, [isEmpty, results]);

  const panelAlpha = Math.min(0.45 + query.length * 0.05, 0.92);

  // ── 光晕色调 ────────────────────────────────────────
  const glowHue = useMemo(() => {
    if (parsedQuery.groupFilter === '博客') return 30;   // 暖金
    if (parsedQuery.groupFilter === '产品') return 260;  // 蓝紫
    if (parsedQuery.groupFilter === '帮助') return 200;  // 青
    if (quickMath) return 140;                           // 绿
    return 270;                                          // 默认紫
  }, [parsedQuery.groupFilter, quickMath]);

  // ── 导航 ────────────────────────────────────────────
  const close = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setQuery(''); setActiveIndex(0); setResults([]);
      setVisibleLimit(INITIAL_LIMIT); setIsClosing(false); onClose();
    }, 180);
  }, [onClose]);

  const navigate = useCallback((entry: SearchEntry) => {
    saveRecentId(entry.id);
    if (query.trim()) saveSearchHistory(query);
    close();
    router.push(entry.href);
  }, [close, router, query]);

  const navigateNewTab = useCallback((entry: SearchEntry) => {
    saveRecentId(entry.id);
    if (query.trim()) saveSearchHistory(query);
    close();
    window.open(entry.href, '_blank');
  }, [close, query]);

  const handleClearRecent = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); removeAllRecent(); setRecentIds([]);
  }, []);

  // ── 焦点陷阱 ────────────────────────────────────────
  useEffect(() => {
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'input, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', handleTab);
    };
  }, []);

  // 结果变化播报
  useEffect(() => {
    if (!isEmpty && !isSearching && results.length > 0) {
      // aria-live 由下方标记处理
    }
  }, [isEmpty, isSearching, results.length]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const activeItem = activeItems[activeIndex] as SearchEntry | undefined;

  // ── 键盘 ────────────────────────────────────────────
  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    const { key, metaKey, ctrlKey } = e;

    // ⌘Delete / ⌘Backspace → 清空输入
    if ((metaKey || ctrlKey) && (key === 'Backspace' || key === 'Delete')) {
      e.preventDefault();
      setQuery('');
      inputRef.current?.focus();
      return;
    }

    // ⌘C 复制链接
    if ((metaKey || ctrlKey) && key.toLowerCase() === 'c') {
      if (activeItem && 'href' in activeItem) {
        e.preventDefault();
        copyToClipboard(window.location.origin + activeItem.href);
        setCopiedId(activeItem.id);
        setTimeout(() => setCopiedId(null), 1500);
      }
      return;
    }

    switch (key) {
      case 'Escape':
        e.preventDefault(); close(); break;
      case 'ArrowDown':
        e.preventDefault(); setActiveIndex(i => Math.min(i + 1, totalItems - 1)); break;
      case 'ArrowUp':
        e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); break;
      case 'Enter': {
        e.preventDefault();
        if (!activeItem) break;
        if (metaKey || ctrlKey) {
          if ('href' in activeItem) navigateNewTab(activeItem as SearchEntry);
          return;
        }
        if ('__math' in activeItem) {
          const math = (activeItem as unknown as { __math: QuickMathResult }).__math;
          copyToClipboard(math.result);
          setCopiedId('__math');
          setTimeout(() => setCopiedId(null), 1500);
          return;
        }
        navigate(activeItem as SearchEntry);
        break;
      }
      case 'PageDown':
        e.preventDefault();
        if (!isEmpty && activeItem && 'group' in activeItem) {
          const g = (activeItem as SearchEntry).group;
          for (let i = activeIndex + 1; i < totalItems; i++) {
            const item = activeItems[i] as SearchEntry;
            if (item.group !== g) { setActiveIndex(i); break; }
          }
        }
        break;
      case 'PageUp':
        e.preventDefault();
        if (!isEmpty && activeItem && 'group' in activeItem) {
          const g = (activeItem as SearchEntry).group;
          for (let i = activeIndex - 1; i >= 0; i--) {
            const item = activeItems[i] as SearchEntry;
            if (item.group !== g) { setActiveIndex(i); break; }
          }
        }
        break;
      case 'Tab':
        break;
    }
  };

  // ── 渲染条目 ────────────────────────────────────────
  const renderItem = (entryLike: SearchEntry | { __math: QuickMathResult }, globalIdx: number) => {
    if ('__math' in entryLike) {
      const math = (entryLike as unknown as { __math: QuickMathResult }).__math;
      const active = globalIdx === activeIndex;
      return (
        <div key="__math" data-index={globalIdx} role="option" aria-selected={active}
          onMouseEnter={() => setActiveIndex(globalIdx)}
          className={`w-full flex items-center justify-between gap-4 px-5 py-2.5 ${active ? 'bg-purple-500/20' : ''}`}>
          <span className="min-w-0 flex items-center gap-3">
            
            <span>
              <span className="text-sm text-white/60 font-mono">{math.expression} = </span>
              <span className="text-sm text-white font-mono font-semibold">{math.result}</span>
            </span>
          </span>
          <span className="shrink-0 text-[10px] text-white/25">{copiedId === '__math' ? '已复制 ✓' : '↵ 复制'}</span>
        </div>
      );
    }

    const entry = entryLike as SearchEntry;
    const active = globalIdx === activeIndex;
    const breadcrumb = getBreadcrumb(entry);

    return (
      <button key={entry.id} data-index={globalIdx} role="option" aria-selected={active}
        onClick={() => navigate(entry)} onMouseEnter={() => setActiveIndex(globalIdx)}
        style={{ animationDelay: `${globalIdx * 30}ms` }}
        className={`w-full flex items-center justify-between gap-4 px-5 py-2.5 text-left
          transition-all duration-150 ease-out
          ${active ? 'bg-purple-500/20 border-l-2 border-purple-400 pl-[18px]' : 'border-l-2 border-transparent hover:bg-white/[0.04]'}
          ${!isEmpty ? 'animate-search-result-in' : ''}`}>
        <span className="min-w-0 flex items-center gap-3">
          <span className="min-w-0">
            <span className="flex items-center gap-1.5">
              {isEmpty ? (
                <span className={`block text-sm truncate ${active ? 'text-white' : 'text-white/80'}`}>{entry.title}</span>
              ) : (
                <HighlightedText text={entry.title} query={displayQuery}
                  className={`block text-sm truncate ${active ? 'text-white' : 'text-white/80'}`} />
              )}
            </span>
            {breadcrumb && breadcrumb.label && (
              <span className="text-[10px] text-white/25 truncate">{breadcrumb.label} › {entry.title}</span>
            )}
            {entry.subtitle && !breadcrumb?.label && (
              isEmpty ? (
                <span className="block text-xs text-white/35 truncate">{entry.subtitle}</span>
              ) : (
                <HighlightedText text={entry.subtitle} query={displayQuery}
                  className="block text-xs text-white/35 truncate" />
              )
            )}
          </span>
        </span>
        <span className="shrink-0 flex items-center gap-1.5">
          {copiedId === entry.id && <span className="text-[10px] text-green-300/80">已复制</span>}
          {active && <span className="text-[10px] text-purple-300/80 font-mono" aria-hidden="true">↵</span>}
        </span>
      </button>
    );
  };

  // ── 页脚 ────────────────────────────────────────────
  const footerHint = useMemo(() => {
    if (isEmpty) return t('hint');
    if (isSearching) return '搜索中…';
    if (activeItem && 'href' in activeItem)
      return `↵ 打开  ⌘↵ 新标签  ⌘C 复制  ${hasActiveFilter ? '' : '提示: blog: help: @ 过滤  '}⌘⌫ 清空`;
    if (activeItem && '__math' in activeItem) return '↵ 复制结果  ⌘⌫ 清空';
    return 'Esc 关闭  ⌘⌫ 清空';
  }, [isEmpty, isSearching, activeItem, hasActiveFilter, t]);

  const handleMaskClick = useCallback(() => close(), [close]);

  return (
    <div
      ref={panelRef}
      className={`fixed inset-0 z-[100] flex items-start justify-center pt-[18vh] px-4
        ${isClosing ? 'animate-spotlight-out' : 'animate-spotlight-in'}`}
      role="dialog" aria-modal="true" aria-label={t('dialogAriaLabel')}
      onKeyDown={onPanelKeyDown}
    >
      {/* 遮罩 */}
      <div
        className={`absolute inset-0 bg-black/45 backdrop-blur-[2px] ${isClosing ? 'animate-spotlight-fade-out' : 'animate-spotlight-fade'}`}
        onClick={handleMaskClick} aria-hidden="true"
      />

      {/* 环境光晕 */}
      {!isEmpty && (
        <div
          className="absolute top-[16vh] left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none transition-colors duration-500"
          style={{
            background: `radial-gradient(ellipse at center, hsla(${glowHue}, 60%, 50%, 0.08) 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* 玻璃面板 */}
      <div
        className={`glass-lg relative w-full max-w-xl rounded-2xl overflow-hidden ${isClosing ? 'animate-spotlight-panel-out' : 'animate-spotlight-panel-in'}`}
        style={{ backgroundColor: `rgba(18, 14, 32, ${panelAlpha})`, transition: 'background-color 150ms ease' }}
      >
        {/* 输入行 */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08]">
          <svg
            className={`w-5 h-5 shrink-0 transition-colors duration-200 ${isSearching ? 'text-purple-400 animate-spin' : 'text-white/40'}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
          </svg>
          {/* 过滤器标记 */}
          {hasActiveFilter && (
            <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
              {parsedQuery.groupFilter === '博客' ? 'blog:' :
               parsedQuery.groupFilter === '帮助' ? 'help:' :
               parsedQuery.groupFilter === '产品' ? '@' :
               parsedQuery.groupFilter === '页面' ? 'page:' : ''}
            </span>
          )}
          <input
            ref={inputRef}
            type="text" value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={hasActiveFilter
              ? `在${parsedQuery.groupFilter}中搜索…`
              : t('placeholder')}
            aria-label={t('inputAriaLabel')}
            autoComplete="off" spellCheck={false} maxLength={60}
            className="flex-1 bg-transparent outline-none text-white text-base placeholder:text-white/30 caret-purple-400"
          />
          <kbd className="hidden sm:block text-[10px] text-white/30 border border-white/15 rounded px-1.5 py-0.5 font-mono">ESC</kbd>
        </div>

        {/* 结果区 */}
        <div ref={listRef} className="max-h-[46vh] overflow-y-auto overscroll-contain py-2"
          role="listbox" aria-label={t('resultsAriaLabel')}
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* 屏幕阅读器播报 */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {!isEmpty && !isSearching && results.length > 0
              ? `找到 ${results.length} 条结果`
              : !isEmpty && !isSearching && results.length === 0
                ? '未找到结果'
                : ''}
          </div>

          {isEmpty ? (
            <>
              {searchHistory.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-5 pt-3 pb-1.5">
                    <p className="text-[11px] text-white/30 uppercase tracking-widest">最近搜索</p>
                    <button type="button"
                      onClick={() => { setSearchHistory([]); localStorage.removeItem(HISTORY_KEY); }}
                      className="text-[11px] text-white/20 hover:text-white/40 transition-colors">清除</button>
                  </div>
                  {searchHistory.map((h, i) => (
                    <button key={h} data-index={i} role="option" aria-selected={i === activeIndex}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => { setQuery(h); inputRef.current?.focus(); }}
                      className={`w-full flex items-center justify-between gap-4 px-5 py-2 text-left transition-colors ${i === activeIndex ? 'bg-purple-500/20' : 'hover:bg-white/[0.04]'}`}>
                      <span className="flex items-center gap-3 min-w-0">
                        
                        <span className="text-sm text-white/60 truncate">{h}</span>
                      </span>
                      <button onClick={(e) => { e.stopPropagation(); removeSearchHistory(h); setSearchHistory(getSearchHistory()); }}
                        className="text-[10px] text-white/20 hover:text-white/50 transition-colors shrink-0" aria-label={`删除 ${h}`}>✕</button>
                    </button>
                  ))}
                </div>
              )}
              {defaultEntries.recent.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-5 pt-3 pb-1.5">
                    <p className="text-[11px] text-white/30 uppercase tracking-widest">{t('recentLabel')}</p>
                    <button type="button" onClick={handleClearRecent}
                      className="text-[11px] text-white/20 hover:text-white/40 transition-colors">{t('clear')}</button>
                  </div>
                  {defaultEntries.recent.map(entry => renderItem(entry, searchHistory.length + allDefault.indexOf(entry)))}
                </div>
              )}
              <div>
                <p className="px-5 pt-3 pb-1.5 text-[11px] text-white/30 uppercase tracking-widest">{t('popularLabel')}</p>
                {defaultEntries.popular.map(entry => renderItem(entry, searchHistory.length + allDefault.indexOf(entry)))}
              </div>
            </>
          ) : isSearching && visibleResults.length === 0 ? (
            <div>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} index={i} />)}</div>
          ) : !isSearching && activeItems.length === 0 ? (
            <div className="px-5 py-6 space-y-3">
              <p className="text-sm text-white/40 text-center">
                {t('empty')}{' '}
                <button className="text-purple-300 hover:text-purple-200 underline underline-offset-2"
                  onClick={() => { close(); router.push('/#terminal'); }}>{t('terminalLink')}</button>
              </p>
              <div className="flex justify-center gap-2">
                <button className="text-xs text-white/30 hover:text-white/50 transition-colors underline underline-offset-2"
                  onClick={() => { close(); router.push('/feedback'); }}>反馈建议</button>
                <span className="text-white/15">·</span>
                <button className="text-xs text-white/30 hover:text-white/50 transition-colors underline underline-offset-2"
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(displayQuery + ' site:' + new URL(SITE_URL).hostname)}`, '_blank')}>
                  站内搜索</button>
              </div>
            </div>
          ) : (
            <>
              {/* "你是想搜…？"模糊提示 */}
              {hasFuzzy && !isSearching && (
                <div className="px-5 py-1.5 text-[11px] text-amber-300/50">
                  你是不是想搜…
                </div>
              )}

              {/* 过滤指示 */}
              {hasActiveFilter && !isSearching && (
                <div className="px-5 py-1.5 text-[11px] text-purple-300/50 flex items-center gap-1">
                  仅显示{parsedQuery.groupFilter} · {results.length} 条
                  <button className="underline underline-offset-2 hover:text-purple-200 ml-1"
                    onClick={() => setQuery(displayQuery)}>清除过滤</button>
                </div>
              )}

              {GROUP_ORDER.map(group => {
                const groupResults = visibleResults.filter(r => r.group === group);
                if (groupResults.length === 0) return null;
                const label = group === '产品' ? t('groupProduct')
                  : group === '页面' ? t('groupPage')
                  : group === '帮助' ? t('groupHelp')
                  : group === '博客' ? t('groupBlog')
                  : t('groupEasterEgg');
                return (
                  <div key={group}>
                    <p className="px-5 pt-3 pb-1.5 text-[11px] text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                      <span aria-hidden="true">{''}</span> {label}
                    </p>
                    {groupResults.map(entry =>
                      renderItem(entry, (quickMath ? 1 : 0) + visibleResults.indexOf(entry)))}
                  </div>
                );
              })}

              {hasMore && (
                <button onClick={() => setVisibleLimit(prev => prev + INITIAL_LIMIT)}
                  className="w-full px-5 py-2.5 text-center text-xs text-white/35 hover:text-white/60 transition-colors border-t border-white/[0.06] mt-1">
                  显示更多（共 {results.length} 条）…
                </button>
              )}
            </>
          )}
        </div>

        {/* 页脚 */}
        <div className="px-5 py-2 border-t border-white/[0.06] text-[10px] text-white/25 text-center font-mono flex items-center justify-between">
          <span className="text-white/15">{resultStats}</span>
          <span>{footerHint}</span>
        </div>
      </div>
    </div>
  );
}

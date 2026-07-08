'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { searchEntries, SearchGroup } from '@/lib/search-index';

const GROUP_ORDER: SearchGroup[] = ['产品', '页面', '帮助', '彩蛋'];

/**
 * Spotlight 聚焦搜索（⌘K / Ctrl+K / 「/」唤起）。
 * 核心细节：面板背景不透明度随输入长度递增（0.45 → 0.92），
 * 打字越多面板越"实"，正在输入的文字始终清晰。
 */
export default function SpotlightSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchEntries(query), [query]);

  // 透明度随输入递增：空态轻盈，输入后变实保证可读
  const panelAlpha = Math.min(0.45 + query.length * 0.05, 0.92);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  const navigate = useCallback((href: string) => {
    close();
    router.push(href);
  }, [close, router]);

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
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
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

  // 打开时聚焦输入框并锁定页面滚动
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, [open]);

  // 高亮项滚入可视区
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  if (!open) return null;

  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[activeIndex]) navigate(results[activeIndex].href);
        break;
      case 'Tab':
        e.preventDefault(); // 面板内不放焦点走
        break;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="全站搜索"
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
        style={{ backgroundColor: `rgba(18, 14, 32, ${panelAlpha})`, transition: 'background-color 150ms ease' }}
      >
        {/* 输入行 */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08]">
          <svg className="w-5 h-5 text-white/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="找产品、找文档，或者输入 meteor 试试"
            aria-label="搜索"
            autoComplete="off"
            spellCheck={false}
            maxLength={60}
            className="flex-1 bg-transparent outline-none text-white text-base placeholder:text-white/30 caret-purple-400"
          />
          <kbd className="hidden sm:block text-[10px] text-white/30 border border-white/15 rounded px-1.5 py-0.5 font-mono">ESC</kbd>
        </div>

        {/* 结果区 */}
        <div ref={listRef} className="max-h-[46vh] overflow-y-auto overscroll-contain py-2" role="listbox" aria-label="搜索结果">
          {query.trim() === '' ? (
            <p className="px-5 py-6 text-sm text-white/35 text-center">
              ⌘K 随时唤起 · ↑↓ 选择 · Enter 直达
            </p>
          ) : results.length === 0 ? (
            <p className="px-5 py-6 text-sm text-white/40 text-center">
              什么都没找到，但你可以去终端碰碰运气 →{' '}
              <button
                className="text-purple-300 hover:text-purple-200 underline underline-offset-2"
                onClick={() => navigate('/#terminal')}
              >
                店主的终端
              </button>
            </p>
          ) : (
            GROUP_ORDER.map(group => {
              const groupResults = results.filter(r => r.group === group);
              if (groupResults.length === 0) return null;
              return (
                <div key={group}>
                  <p className="px-5 pt-3 pb-1.5 text-[11px] text-white/30 uppercase tracking-widest">{group}</p>
                  {groupResults.map(entry => {
                    const idx = results.indexOf(entry);
                    const active = idx === activeIndex;
                    return (
                      <button
                        key={entry.id}
                        data-index={idx}
                        role="option"
                        aria-selected={active}
                        onClick={() => navigate(entry.href)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`w-full flex items-center justify-between gap-4 px-5 py-2.5 text-left transition-colors duration-100 ${
                          active ? 'bg-purple-500/20' : 'hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className="min-w-0">
                          <span className={`block text-sm truncate ${active ? 'text-white' : 'text-white/80'}`}>
                            {entry.title}
                          </span>
                          {entry.subtitle && (
                            <span className="block text-xs text-white/35 truncate">{entry.subtitle}</span>
                          )}
                        </span>
                        {active && (
                          <span className="shrink-0 text-[10px] text-purple-300/80 font-mono" aria-hidden="true">↵</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useHelpPanel } from './HelpPanelContext';
import HelpToc from './HelpToc';
import { MeteorTrail, ConstellationDot } from './HelpDecorations';
import { useLocale } from 'next-intl';

interface HelpArticleData {
  title: string;
  html: string;
  headings: { id: string; text: string; level: 2 | 3 }[];
  category: string;
}

/**
 * 浮动侧边帮助面板
 * - 玻璃材质半透明背景，融入宇宙主题
 * - 左侧拖拽调整宽度
 * - 内部可滚动，独立目录导航
 */
export default function HelpPanel() {
  const { state, closePanel, setWidth } = useHelpPanel();
  const locale = useLocale();
  const isZh = locale === 'zh';

  const [article, setArticle] = useState<HelpArticleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  // 加载文章内容
  useEffect(() => {
    if (!state.open || !state.slug) return;
    let cancelled = false;

    // setState 全部放进异步回调（React Compiler：不在 effect 里同步 setState）
    fetch(`/api/help-panel?slug=${encodeURIComponent(state.slug)}&locale=${locale}`)
      .then((res) => {
        if (cancelled) return null;
        setLoading(true);
        setError(false);
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then((data) => {
        if (cancelled || data === null) return;
        setArticle(data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [state.open, state.slug, locale]);

  // 拖拽调整宽度
  const onDragStart = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startWidth.current = state.width;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';

    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const delta = startX.current - ev.clientX;
      setWidth(startWidth.current + delta);
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [state.width, setWidth]);

  // ESC 关闭
  useEffect(() => {
    if (!state.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [state.open, closePanel]);

  if (!state.open) return null;

  return (
    <>
      {/* 背景遮罩 — 仅移动端 */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
        onClick={closePanel}
        aria-hidden="true"
      />

      {/* 面板 */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 z-50 flex h-full flex-col border-l border-white/[0.08] bg-black/85 backdrop-blur-xl"
        style={{ width: state.width }}
        role="complementary"
        aria-label={isZh ? '帮助面板' : 'Help panel'}
      >
        {/* 拖拽手柄 */}
        <div
          className="absolute -left-1 top-0 z-10 h-full w-2 cursor-ew-resize hover:bg-violet-400/20 active:bg-violet-400/30"
          onMouseDown={onDragStart}
          aria-hidden="true"
        />

        {/* 顶部栏 */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <MeteorTrail className="h-4 w-4 shrink-0" />
            <span className="t-footnote truncate text-white/70">
              {loading ? (isZh ? '加载中…' : 'Loading…') : article?.title ?? ''}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <a
              href={state.slug ? `/${locale}/docs/${state.slug}` : '/docs'}
              className="rounded p-1.5 text-white/30 outline-none transition-colors hover:text-white/60 focus-visible:ring-2 focus-visible:ring-violet-300"
              title={isZh ? '全屏打开' : 'Open full page'}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 8.25M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 8.25M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15.75M20.25 20.25h-4.5m4.5 0v-4.5m0 4.5L15 15.75" />
              </svg>
            </a>
            <button
              onClick={closePanel}
              className="rounded p-1.5 text-white/30 outline-none transition-colors hover:text-white/60 focus-visible:ring-2 focus-visible:ring-violet-300"
              aria-label={isZh ? '关闭帮助面板' : 'Close help panel'}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-white/40">
                <ConstellationDot active />
                <ConstellationDot />
                <ConstellationDot />
                <span className="t-footnote">{isZh ? '加载中…' : 'Loading…'}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="py-12 text-center">
              <p className="t-body mb-3 text-white/60">{isZh ? '加载失败' : 'Failed to load'}</p>
              <a
                href={state.slug ? `/${locale}/docs/${state.slug}` : '/docs'}
                className="t-footnote text-violet-400 hover:text-violet-300"
              >
                {isZh ? '→ 全屏查看' : '→ Open full page'}
              </a>
            </div>
          )}

          {article && !loading && !error && (
            <>

              
              <HelpToc headings={article.headings} variant="collapsible" />

              {/* 正文 */}
              <div
                className="help-content prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: article.html }}
              />

              {/* 底部：全屏查看链接 */}
              <div className="mt-8 border-t border-white/[0.06] pt-4">
                <a
                  href={state.slug ? `/${locale}/docs/${state.slug}` : '/docs'}
                  className="t-footnote inline-flex items-center gap-1.5 text-white/40 outline-none transition-colors hover:text-white/70 focus-visible:ring-2 focus-visible:ring-violet-300"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 8.25M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 8.25M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15.75M20.25 20.25h-4.5m4.5 0v-4.5m0 4.5L15 15.75" />
                  </svg>
                  {isZh ? '全屏查看' : 'Open full page'}
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

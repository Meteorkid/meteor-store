'use client';

import { useHelpPanel } from './HelpPanelContext';
import { useLocale } from 'next-intl';

/**
 * 侧边栏查看按钮 — 在文章卡片或详情页中使用
 * 点击后以浮动面板形式打开帮助文章，方便对照操作
 */
export function OpenInPanelButton({
  slug,
  variant = 'icon',
  className = '',
}: {
  slug: string;
  variant?: 'icon' | 'text';
  className?: string;
}) {
  const { openPanel } = useHelpPanel();
  const locale = useLocale();
  const isZh = locale === 'zh';

  if (variant === 'text') {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          openPanel(slug);
        }}
        className={`t-footnote inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-white/50 outline-none backdrop-blur-sm transition-all duration-300 hover:border-violet-400/30 hover:bg-white/[0.06] hover:text-white/75 focus-visible:ring-2 focus-visible:ring-violet-300 ${className}`}
        title={isZh ? '在侧边栏查看，方便对照操作' : 'Open in side panel for side-by-side reference'}
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
        {isZh ? '侧边栏查看' : 'Side panel'}
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openPanel(slug);
      }}
      className={`rounded p-1 text-white/20 outline-none transition-all duration-300 hover:text-violet-300/70 hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-violet-300 ${className}`}
      title={isZh ? '在侧边栏查看，方便对照操作' : 'Open in side panel'}
      aria-label={isZh ? '在侧边栏查看' : 'Open in side panel'}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    </button>
  );
}

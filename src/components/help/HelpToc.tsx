'use client';

import { useEffect, useState, useRef } from 'react';
import { ConstellationDot } from './HelpDecorations';
import type { HelpHeading } from '@/lib/help-markdown';

/**
 * 星图风格目录，带滚动高亮 (scroll spy)
 * 桌面侧栏和移动端折叠面板共用
 */
export default function HelpToc({
  headings,
  variant = 'sidebar',
}: {
  headings: HelpHeading[];
  variant?: 'sidebar' | 'collapsible';
}) {
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    // 收集页面中所有标题元素
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    // 用 IntersectionObserver 监听哪个标题在视口顶部附近
    const observer = new IntersectionObserver(
      (entries) => {
        // 找出所有当前可见的标题
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target.id);

        if (visible.length > 0) {
          // 取第一个可见的（最靠上的）
          setActiveId(visible[0]);
        }
      },
      {
        // 观察区域从顶部偏移，使标题在靠近顶部时就被激活
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  if (variant === 'collapsible') {
    return (
      <details className="mb-6 lg:hidden" open>
        <summary className="t-footnote mb-3 cursor-pointer text-white/40 outline-none hover:text-white/60">
          目录
        </summary>
        <nav className="relative border-l border-white/[0.06] pl-3">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                  // 手动更新 active，因为 scrollIntoView 动画期间 observer 可能不触发
                  setActiveId(heading.id);
                }}
                className={`t-footnote block rounded-sm py-1 outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-violet-300 ${
                  isActive
                    ? 'text-violet-200'
                    : 'text-white/45 hover:text-white/75'
                }`}
                style={{ paddingLeft: heading.level === 3 ? '0.75rem' : '0' }}
              >
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute -left-[5px] mt-[0.35rem] inline-block h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_6px_rgba(196,181,253,0.5)]"
                    style={{ left: heading.level === 3 ? 'calc(0.75rem - 5px)' : '-5px' }}
                  />
                )}
                {heading.text}
              </a>
            );
          })}
        </nav>
      </details>
    );
  }

  // 桌面侧栏变体
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <ConstellationDot active />
        <p className="t-eyebrow text-white/35">目录</p>
      </div>
      <nav className="relative">
        {/* 竖连线 */}
        <div
          aria-hidden
          className="absolute left-[3px] top-2 h-[calc(100%-16px)] w-px bg-gradient-to-b from-violet-400/15 via-violet-400/10 to-transparent"
        />
        <ul className="space-y-2.5">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <li
                key={heading.id}
                className="relative"
                style={{ paddingLeft: heading.level === 3 ? '1rem' : '0' }}
              >
                {/* 节点 */}
                <span
                  aria-hidden
                  className={`absolute top-[0.6rem] h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-violet-300 shadow-[0_0_6px_rgba(196,181,253,0.5)]'
                      : 'bg-white/15'
                  }`}
                  style={{ left: heading.level === 3 ? '0.5rem' : '0' }}
                />
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                    setActiveId(heading.id);
                  }}
                  className={`group t-footnote block rounded-sm py-1 pl-4 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-violet-300 ${
                    isActive
                      ? 'text-violet-200'
                      : 'text-white/45 hover:text-white/80'
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

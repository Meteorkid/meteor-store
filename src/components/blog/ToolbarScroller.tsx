'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * 横向工具条的滚动容器。
 *
 * 桌面上所有分区都放得下；移动端放不下时，进入分区页要能看到当前分区，
 * 而不是只剩右侧一小截高亮。这里只调整容器自身的横向滚动位置，
 * 不使用 scrollIntoView，避免连带滚动整页。
 */
export default function ToolbarScroller({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const boxRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const revealActive = () => {
      const active = box.querySelector<HTMLElement>('[aria-current="page"]');
      if (!active) return;

      const boxRect = box.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      const margin = 10;

      if (activeRect.left < boxRect.left + margin) {
        box.scrollLeft -= boxRect.left + margin - activeRect.left;
      } else if (activeRect.right > boxRect.right - margin) {
        box.scrollLeft += activeRect.right - (boxRect.right - margin);
      }
    };

    revealActive();

    const observer = new ResizeObserver(revealActive);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      ref={boxRef}
      aria-label={label}
      className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {children}
    </nav>
  );
}

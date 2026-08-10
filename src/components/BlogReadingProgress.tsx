'use client';

import { useEffect, useRef } from 'react';

/**
 * 顶部阅读进度条。
 * 直接改 transform，不走 React state —— 滚动是高频事件，
 * 每帧触发 re-render 得不偿失。
 */
export default function BlogReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      rafId = 0;
      const el = barRef.current;
      if (!el) return;
      const article = document.querySelector('article') || document.querySelector('.blog-prose');
      const max = (article
        ? article.getBoundingClientRect().bottom + window.scrollY - window.innerHeight
        : document.documentElement.scrollHeight - window.innerHeight);
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      el.style.transform = `scaleX(${ratio})`;
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={barRef} aria-hidden className="blog-progress" style={{ transform: 'scaleX(0)' }} />;
}

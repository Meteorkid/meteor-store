'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * 全局初始化组件：
 * 1. 滚动动画 — IntersectionObserver 驱动
 * 2. 路由切换加载进度条（DOM 直接操作，无 React state）
 */
export default function ScrollAnimateInit() {
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const observedRef = useRef<WeakSet<Element>>(new WeakSet());
  const barRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 路由变化时显示进度条（DOM 直接操作，避免 effect 内 setState）
  useEffect(() => {
    let bar = barRef.current;
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'fixed top-0 left-0 right-0 z-[100] h-[2px]';
      bar.innerHTML =
        '<div class="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500 animate-loading-bar"></div>';
      document.body.appendChild(bar);
      barRef.current = bar;
    }
    bar.style.display = '';
    const t = setTimeout(() => {
      if (bar) bar.style.display = 'none';
    }, 400);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  // 滚动动画
  useEffect(() => {
    const timeouts = timeoutsRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          observer.unobserve(el);

          const delayStr = (el as HTMLElement).style.animationDelay;
          const delayMs = delayStr ? parseFloat(delayStr) * 1000 : 0;

          if (delayMs > 0) {
            const id = setTimeout(() => {
              el.classList.add('visible');
              timeouts.delete(id);
            }, delayMs);
            timeouts.add(id);
          } else {
            el.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const observeElement = (el: Element) => {
      if (observedRef.current.has(el)) return;
      observedRef.current.add(el);
      observer.observe(el);
    };

    // 限定查询范围到主内容区域
    const root = document.getElementById('__next') || document.body;
    root.querySelectorAll('.scroll-animate').forEach(observeElement);

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.classList.contains('scroll-animate')) {
            observeElement(node);
          }
          node.querySelectorAll?.('.scroll-animate').forEach(observeElement);
        }
      }
    });

    mutationObserver.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      timeouts.forEach((id) => clearTimeout(id));
      timeouts.clear();
      // 清理进度条 DOM
      barRef.current?.remove();
      barRef.current = null;
    };
  }, []);

  return null;
}

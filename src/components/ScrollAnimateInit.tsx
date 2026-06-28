'use client';

import { useEffect, useRef } from 'react';

/**
 * 全局滚动动画初始化：使用单一共享 IntersectionObserver 为所有带
 * scroll-animate 类的元素添加 visible 类，触发淡入动画。
 */
export default function ScrollAnimateInit() {
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const observedRef = useRef<WeakSet<Element>>(new WeakSet());

  useEffect(() => {
    const timeouts = timeoutsRef.current;

    // 单一共享 observer，处理所有 scroll-animate 元素
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          observer.unobserve(el);

          // 读取 JS 属性获取 delay，兼容 React style 对象
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

    // 观察单个元素（去重）
    const observeElement = (el: Element) => {
      if (observedRef.current.has(el)) return;
      observedRef.current.add(el);
      observer.observe(el);
    };

    // 初始扫描
    document.querySelectorAll('.scroll-animate').forEach(observeElement);

    // 监听动态添加的元素（仅监听 body 直接子节点变化，避免 subtree: true 的性能开销）
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

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      timeouts.forEach((id) => clearTimeout(id));
      timeouts.clear();
    };
  }, []);

  return null;
}

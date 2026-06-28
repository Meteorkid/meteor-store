'use client';

import { useEffect, useRef } from 'react';

/**
 * 全局滚动动画初始化：为所有带 scroll-animate 类的元素添加 IntersectionObserver，
 * 当元素进入视口时自动添加 visible 类触发淡入动画。
 */
export default function ScrollAnimateInit() {
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const observedRef = useRef<Set<Element>>(new Set());

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    const observed = observedRef.current;

    const observeElement = (el: Element) => {
      if (observed.has(el)) return;
      observed.add(el);

      const entryObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // 直接读取 JS 属性获取 delay，兼容 React style 对象
              const delayStr = (entry.target as HTMLElement).style.animationDelay;
              const delayMs = delayStr ? parseFloat(delayStr) * 1000 : 0;

              if (delayMs > 0) {
                const id = setTimeout(() => {
                  entry.target.classList.add('visible');
                  timeouts.delete(id);
                }, delayMs);
                timeouts.add(id);
              } else {
                entry.target.classList.add('visible');
              }
              entryObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      entryObserver.observe(el);
    };

    // 初始扫描
    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observeElement(el);
    });

    // 监听动态添加的元素
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.classList.contains('scroll-animate')) {
              observeElement(node);
            }
            node.querySelectorAll?.('.scroll-animate').forEach((el) => {
              observeElement(el);
            });
          }
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      timeouts.forEach((id) => clearTimeout(id));
      timeouts.clear();
    };
  }, []);

  return null;
}

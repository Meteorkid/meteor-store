'use client';

import { useEffect } from 'react';

/**
 * 全局滚动动画初始化：为所有带 scroll-animate 类的元素添加 IntersectionObserver，
 * 当元素进入视口时自动添加 visible 类触发淡入动画。
 */
export default function ScrollAnimateInit() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 读取 animationDelay 实现交错动画
            const delay = entry.target.getAttribute('style');
            const match = delay?.match(/animationDelay:\s*([\d.]+)s/);
            const delayMs = match ? parseFloat(match[1]) * 1000 : 0;

            if (delayMs > 0) {
              setTimeout(() => {
                entry.target.classList.add('visible');
              }, delayMs);
            } else {
              entry.target.classList.add('visible');
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

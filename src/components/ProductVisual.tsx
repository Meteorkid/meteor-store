'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { LocalizedProduct } from '@/data/products';
import { useReducedMotion } from '@/lib/motion';
import MotionCover from './product-covers/MotionCover';
import styles from './product-covers/cover.module.css';

interface ProductVisualProps {
  product: LocalizedProduct;
  /** 首屏封面预加载；其余真实截图懒加载。 */
  priority?: boolean;
  /** 入屏播放新制作的操作短片；原录屏仅保留在详情画廊。 */
  showDemo?: boolean;
  className?: string;
  transitionName?: string;
}

export default function ProductVisual({
  product,
  priority = false,
  showDemo = true,
  className = '',
  transitionName,
}: ProductVisualProps) {
  const t = useTranslations('ProductDetailPage');
  const coverRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const cover = coverRef.current;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!cover || !showDemo || reducedMotion || connection?.saveData || !('IntersectionObserver' in window)) return;

    let inView = false;
    const update = () => setActive(inView && document.visibilityState === 'visible');
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    }, { threshold: 0.15 });
    observer.observe(cover);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, [showDemo, reducedMotion]);

  return (
    <div
      ref={coverRef}
      role="img"
      aria-label={t('coverAlt', { name: product.name, description: product.tagline })}
      data-product-cover={product.id}
      data-active={active && showDemo && !reducedMotion}
      className={`${styles.cover} relative aspect-[16/10] overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#0a0e17] ${className}`}
      style={transitionName ? { viewTransitionName: transitionName } : undefined}
    >
      <MotionCover productId={product.id} priority={priority} animate={active && showDemo && !reducedMotion} />
    </div>
  );
}

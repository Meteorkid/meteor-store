'use client';

import Image from 'next/image';
import { useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { LocalizedProduct } from '@/data/products';
import { useReducedMotion } from '@/lib/motion';

interface ProductVisualProps {
  product: LocalizedProduct;
  priority?: boolean;
  demoOnHover?: boolean;
  className?: string;
  transitionName?: string;
}

export default function ProductVisual({
  product,
  priority = false,
  demoOnHover = false,
  className = '',
  transitionName,
}: ProductVisualProps) {
  const t = useTranslations('ProductDetailPage');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reducedMotion = useReducedMotion();

  // preload="none" + 悬浮才播：演示片只在用户真的看它时才下载。
  // 原来用 <Image unoptimized> 渲染 GIF，靠 CSS 隐藏——而 display:none 拦不住下载，
  // 列表页一进来就把十几个演示文件全拉下来了。
  const playDemo = useCallback(() => {
    if (reducedMotion) return;
    videoRef.current?.play().catch(() => {});
  }, [reducedMotion]);

  const stopDemo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  }, []);

  return (
    <div
      className={`relative aspect-[16/10] overflow-hidden rounded-[1.4rem] border border-white/10 bg-zinc-950 shadow-2xl ${className}`}
      style={transitionName ? { viewTransitionName: transitionName } : undefined}
      onMouseEnter={demoOnHover ? playDemo : undefined}
      onMouseLeave={demoOnHover ? stopDemo : undefined}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-25`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.18),transparent_36%),linear-gradient(to_bottom,transparent_55%,rgba(0,0,0,0.35))]" />

      {product.media ? (
        <>
          <Image
            src={product.media.cover}
            alt={t('productInterface', { name: product.name })}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-center"
          />
          {demoOnHover && product.media.demo && (
            <video
              ref={videoRef}
              src={product.media.demo}
              aria-label={t('demoAlt', { name: product.name })}
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 hidden h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-safe:md:block"
            />
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
          <div>
            <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs text-white/70 backdrop-blur">
              METEOR LAB
            </span>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
              {product.platforms.join(' · ')}
            </p>
            <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {product.name}
            </p>
            <p className="mt-1 max-w-sm text-sm text-white/65">{product.tagline}</p>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
  );
}

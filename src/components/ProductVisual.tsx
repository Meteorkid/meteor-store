'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { LocalizedProduct } from '@/data/products';
import { useReducedMotion } from '@/lib/motion';

interface ProductVisualProps {
  product: LocalizedProduct;
  priority?: boolean;
  /** 是否在卡片上播放演示片。进入视口即自动播放，不需要悬浮。 */
  showDemo?: boolean;
  className?: string;
  transitionName?: string;
}

export default function ProductVisual({
  product,
  priority = false,
  showDemo = false,
  className = '',
  transitionName,
}: ProductVisualProps) {
  const t = useTranslations('ProductDetailPage');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  /**
   * 进入视口（含提前量）就播，离开就暂停。
   *
   * 早先是「悬浮才播」（GIF 时代就如此），代价是卡片在鼠标碰上去之前完全是静止的，
   * 而移动端压根没有悬浮——那里的演示片从来就没被看见过。
   *
   * rootMargin 给 250px 提前量：等卡片真正进入视口才开始缓冲的话，
   * 会先看到封面、隔一会儿才突然动起来，滚动时一路都是这种跳变。
   * 提前触发让淡入在卡片露头之前就开始。
   *
   * **播放仍然只给可见的那几张**：12 个视频同时解码是实打实的 CPU 与耗电开销，
   * 而看不见的那些解了也没人看。缓冲归缓冲（preload="auto"），播放归播放。
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: '250px 0px', threshold: 0 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div
      className={`relative aspect-[16/10] overflow-hidden rounded-[1.4rem] border border-white/10 bg-zinc-950 shadow-2xl ${className}`}
      style={transitionName ? { viewTransitionName: transitionName } : undefined}
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
          {showDemo && product.media.demo && (
            /*
              盖在封面之上，真正开始播了才淡入（onPlaying）。
              封面因此仍然是首屏可见的那一层——视频还在缓冲时不会先露出一块黑底，
              prefers-reduced-motion 下不播，看到的就一直是封面。
            */
            <video
              ref={videoRef}
              src={product.media.demo}
              aria-label={t('demoAlt', { name: product.name })}
              muted
              loop
              playsInline
              /*
                preload="auto"：12 个演示片合计只有 1.07MB（改造前那批 GIF 是 6.5MB，
                而且当时靠 display:none 隐藏——Chrome 照样会下载）。为这点体积让
                每张卡片滚到眼前就能立刻动起来是划算的；靠 play() 现拉的话，
                滚动过程中会一路看到「封面→卡顿→突然开始」的跳变。
              */
              preload="auto"
              onPlaying={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${playing ? 'opacity-100' : 'opacity-0'}`}
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

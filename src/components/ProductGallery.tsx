'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { LocalizedProduct } from '@/data/products';
import ImageLightbox from '@/components/ImageLightbox';

/**
 * 产品页「宣传片 + 界面实景」。
 *
 * 2026-11 重做：原来的演示位放的是一段 GIF 转码的 MP4（360–480px / 6fps），
 * 在大屏上糊得看不出界面。现在换成从 1080p 宣传片切出的 720p 片段，
 * 用 `<video controls preload="none">` + 海报帧：不点播放就不下载视频，
 * 点开有声音、可全屏，也不再自动循环烧流量。
 *
 * 画面比例统一 16:9。此前是 16:10，而物料全部是 16:9，
 * `object-cover` 会左右各啃掉一截，把界面边缘切掉。
 */
export default function ProductGallery({ product }: { product: LocalizedProduct }) {
  const t = useTranslations('ProductDetailPage');
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; trigger: HTMLButtonElement } | null>(null);

  const media = product.media;
  if (!media) return null;
  const hasFilm = Boolean(media.demo);
  const screenshots = media.screenshots ?? [];
  if (!hasFilm && screenshots.length === 0) return null;

  return (
    <>
      <section className="mb-20">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Preview</p>
            <h2 className="text-2xl font-bold text-white md:text-3xl">{t('galleryTitle')}</h2>
          </div>
          <p className="hidden text-sm text-gray-500 sm:block">{t('clickToZoom')}</p>
        </div>

        {hasFilm && (
          <figure className="mb-6 overflow-hidden rounded-[1.5rem] border border-violet-500/20 bg-white/[0.03] p-2">
            <div className="relative aspect-video overflow-hidden rounded-[1.1rem] bg-zinc-950">
              <video
                // 海报帧先顶上，preload="none" 让首屏不为一段没人点的视频付流量
                poster={media.demoPoster}
                controls
                muted
                loop
                playsInline
                preload="none"
                aria-label={t('demoAlt', { name: product.name })}
                className="h-full w-full object-contain"
              >
                {media.demoWebm ? <source src={media.demoWebm} type="video/webm" /> : null}
                <source src={media.demo} type="video/mp4" />
              </video>
              <span className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-violet-600/80 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                {t('filmBadge')}
              </span>
            </div>
            <figcaption className="px-3 pb-2 pt-3 text-sm text-gray-400">
              {t('demoAlt', { name: product.name })}
            </figcaption>
          </figure>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {screenshots.map((screenshot, index) => (
            <figure
              key={screenshot.src}
              className={`group cursor-zoom-in overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-2 transition-colors hover:border-white/20 ${
                index === 0 && screenshots.length % 2 === 1 ? 'md:col-span-2' : ''
              }`}
            >
              <button
                type="button"
                onClick={(event) => setLightbox({ ...screenshot, trigger: event.currentTarget })}
                aria-label={t('zoomAriaScreenshot', { alt: screenshot.alt })}
                className="relative block aspect-video w-full overflow-hidden rounded-[1.1rem] bg-zinc-950 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300"
              >
                <Image
                  src={screenshot.src}
                  alt={screenshot.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.015]"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                  <span className="scale-0 rounded-full bg-white/20 p-3 backdrop-blur-md transition-transform group-hover:scale-100">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </span>
                </div>
              </button>
              <figcaption className="px-3 pb-2 pt-3 text-sm text-gray-400">{screenshot.alt}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {lightbox && (
        <ImageLightbox src={lightbox.src} alt={lightbox.alt} trigger={lightbox.trigger} onClose={() => setLightbox(null)} />
      )}
    </>
  );
}

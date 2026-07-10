'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/data/products';
import ImageLightbox from '@/components/ImageLightbox';

export default function ProductGallery({ product }: { product: Product }) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  if (!product.media?.screenshots.length && !product.media?.demo) return null;

  return (
    <>
      <section className="mb-20">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Preview</p>
            <h2 className="text-2xl font-bold text-white md:text-3xl">产品实景</h2>
          </div>
          <p className="hidden text-sm text-gray-500 sm:block">点击图片可放大查看</p>
        </div>

        {product.media?.demo && (
          <figure
            className="group mb-5 cursor-zoom-in overflow-hidden rounded-[1.5rem] border border-violet-500/20 bg-white/[0.03] p-2 transition-colors hover:border-violet-500/40"
            onClick={() => setLightbox({ src: product.media!.demo!, alt: `${product.name} 动态演示` })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setLightbox({ src: product.media!.demo!, alt: `${product.name} 动态演示` })}
            aria-label={`放大查看：${product.name} 动态演示`}
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.1rem] bg-zinc-950">
              <Image
                src={product.media.demo}
                alt={`${product.name} 动态演示`}
                fill
                unoptimized
                sizes="100vw"
                className="object-contain transition-transform duration-500 group-hover:scale-[1.015]"
              />
              <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-violet-600/80 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                GIF
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                <span className="scale-0 rounded-full bg-white/20 p-3 backdrop-blur-md transition-transform group-hover:scale-100">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </span>
              </div>
            </div>
            <figcaption className="px-3 pb-2 pt-3 text-sm text-gray-400">{product.name} 动态演示</figcaption>
          </figure>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {(product.media?.screenshots ?? []).map((screenshot, index) => (
            <figure
              key={screenshot.src}
              className={`group cursor-zoom-in overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-2 transition-colors hover:border-white/20 ${
                index === 0 && product.media!.screenshots.length % 2 === 1 ? 'md:col-span-2' : ''
              }`}
              onClick={() => setLightbox(screenshot)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setLightbox(screenshot)}
              aria-label={`放大查看：${screenshot.alt}`}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.1rem] bg-zinc-950">
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
              </div>
              <figcaption className="px-3 pb-2 pt-3 text-sm text-gray-400">{screenshot.alt}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {lightbox && (
        <ImageLightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </>
  );
}

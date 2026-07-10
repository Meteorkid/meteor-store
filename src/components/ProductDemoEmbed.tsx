'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/data/products';

/**
 * 产品详情页在线演示嵌入：点击后才加载 iframe（避免拖慢首屏），
 * 封面截图做占位；加载失败时用户可通过右上角链接在新窗口打开。
 */
export default function ProductDemoEmbed({ product }: { product: Product }) {
  const [loaded, setLoaded] = useState(false);

  if (!product.demo) return null;

  return (
    <section className="mb-20">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Live demo</p>
          <h2 className="text-2xl font-bold text-white md:text-3xl">在线试玩</h2>
        </div>
        <a
          href={product.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-sm text-violet-300 transition-colors hover:text-violet-200"
        >
          在新窗口打开 ↗
        </a>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-950">
        {loaded ? (
          <iframe
            src={product.demo}
            title={`${product.name} 在线演示`}
            className="h-full w-full"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            allow="camera; microphone; accelerometer; gyroscope"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="group absolute inset-0 flex flex-col items-center justify-center"
            aria-label={`加载 ${product.name} 在线演示`}
          >
            {product.media && (
              <Image
                src={product.media.cover}
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-40 transition-opacity group-hover:opacity-30"
                aria-hidden="true"
              />
            )}
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-transform group-hover:scale-110">
              <span className="ml-1 text-2xl text-white" aria-hidden="true">▶</span>
            </span>
            <span className="relative mt-4 text-sm text-white/70">点击加载在线演示</span>
          </button>
        )}
      </div>

      <p className="mt-3 text-xs text-white/35">演示运行在产品真实站点上，若加载缓慢可在新窗口打开。</p>
    </section>
  );
}

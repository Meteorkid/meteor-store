'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import type { LocalizedProduct } from '@/data/products';

/**
 * 产品详情页「免费试用」内嵌区块：仅对站内集成的纯 Web 应用（有 appUrl）渲染。
 * 点击后才加载免门控试用路由 /{locale}/apps/{id}/trial 的 iframe，
 * 未购用户也能直接体验完整功能，避免首屏拖慢。
 */
export default function ProductAppTrial({ product }: { product: LocalizedProduct }) {
  const t = useTranslations('ProductDetailPage');
  const locale = useLocale();
  const [loaded, setLoaded] = useState(false);

  if (!product.appUrl) return null;

  const trialHref = `/${locale}/apps/${product.id}/trial`;

  return (
    <section className="mb-20">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Try it free</p>
          <h2 className="text-2xl font-bold text-white md:text-3xl">{t('trialTitle', { name: product.name })}</h2>
        </div>
        <a
          href={trialHref}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-sm text-violet-300 transition-colors hover:text-violet-200"
        >
          {t('openInNewWindow')}
        </a>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-950">
        {loaded ? (
          <iframe
            src={trialHref}
            title={t('trialTitle', { name: product.name })}
            className="h-full w-full"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            allow="camera; microphone; accelerometer; gyroscope"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="group absolute inset-0 flex flex-col items-center justify-center"
            aria-label={t('loadTrialAria', { name: product.name })}
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
            <span className="relative mt-4 text-sm text-white/70">{t('loadTrial')}</span>
          </button>
        )}
      </div>

      <p className="mt-3 text-xs text-white/35">{t('trialHint')}</p>
    </section>
  );
}
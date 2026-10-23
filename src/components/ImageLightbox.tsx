'use client';

import { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useReducedMotion } from '@/lib/motion';

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
  trigger?: HTMLElement;
}

export default function ImageLightbox({ src, alt, onClose, trigger }: ImageLightboxProps) {
  const t = useTranslations('common');
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });
  useEffect(() => { if (reducedMotion) videoRef.current?.pause(); }, [reducedMotion]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    const previousOverflow = document.body.style.overflow;
    let restoreFocus = true;
    // 原生模态框负责焦点环绕和背景 inert，不再叠加 document 级焦点陷阱。
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    const handOffToSearch = () => {
      restoreFocus = false;
      // 捕获阶段先释放灯箱和滚动锁，随后搜索才读取原滚动状态并接管焦点。
      flushSync(() => onCloseRef.current());
    };
    window.addEventListener('spotlight:open', handOffToSearch, true);
    return () => {
      window.removeEventListener('spotlight:open', handOffToSearch, true);
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (restoreFocus && previousFocus?.isConnected && previousFocus.getClientRects().length > 0) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [trigger]);

  // 产品演示片已从 GIF 换成 MP4，灯箱要同时认图片和视频两种来源
  const isVideo = /\.(mp4|webm)$/i.test(src);

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-0 h-full w-full max-h-none max-w-none items-center justify-center border-0 bg-black/90 p-0 text-white backdrop-blur-sm open:flex"
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      onKeyDown={(event) => { if (event.key === 'Escape') event.stopPropagation(); }}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      aria-modal="true"
      aria-label={alt}
    >
      {/* 保留播放器内部原生键盘顺序，只在弹窗首尾拦住通往浏览器界面的 Tab。 */}
      <span
        className="sr-only"
        tabIndex={0}
        aria-hidden="true"
        onFocus={() => (videoRef.current ?? closeRef.current)?.focus({ preventScroll: true })}
      />
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label={t('lightboxClose')}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        {isVideo ? (
          <video
            ref={videoRef}
            src={src}
            aria-label={alt}
            className="max-h-[90vh] w-auto rounded-xl object-contain"
            controls
            autoPlay={!reducedMotion}
            muted
            loop
            playsInline
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={1920}
            height={1200}
            className="max-h-[90vh] w-auto rounded-xl object-contain"
            quality={95}
            priority
          />
        )}
        <p className="mt-3 text-center text-sm text-white/50">{alt}</p>
      </div>
      <span className="sr-only" tabIndex={0} aria-hidden="true" onFocus={() => closeRef.current?.focus({ preventScroll: true })} />
    </dialog>
  );
}

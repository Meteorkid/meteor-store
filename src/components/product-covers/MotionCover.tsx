'use client';

import Image from 'next/image';
import { getProductCoverSource } from '@/data/product-cover-sources';
import styles from './cover.module.css';

function OperationMovie({ src }: { src: string }) {
  return (
    <video
      data-motion-video="true"
      className={styles.movie}
      src={src}
      autoPlay
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      ref={(node) => {
        if (node && node.readyState >= 2) node.dataset.ready = 'true';
      }}
      onLoadedData={(event) => { event.currentTarget.dataset.ready = 'true'; }}
      onPlaying={(event) => { event.currentTarget.dataset.ready = 'true'; }}
      onError={(event) => { event.currentTarget.dataset.failed = 'true'; }}
      onPointerEnter={(event) => {
        const video = event.currentTarget;
        if (video.ended) {
          video.currentTime = 0;
          void video.play().catch(() => {});
        }
      }}
    />
  );
}

/** 仅可见时挂载短片，离屏即释放；静态首图始终保留，播放失败也不留空白。 */
export default function MotionCover({ productId, priority = false, animate = false }: {
  productId: string;
  priority?: boolean;
  animate?: boolean;
}) {
  const source = getProductCoverSource(productId);
  return (
    <div className={styles.stage} aria-hidden="true">
      <Image
        data-cover-frame="poster"
        src={source.poster}
        alt=""
        fill
        unoptimized
        preload={priority}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className={styles.poster}
      />
      {animate && source.video && <OperationMovie key={source.video} src={source.video} />}
    </div>
  );
}

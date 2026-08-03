'use client';

import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';

const QUIP_KEYS = ['quip1', 'quip2', 'quip3', 'quip4'] as const;

// 稳定的随机快照：一次会话内只随机一次，避免每次渲染闪动
let quipSnapshot: string | null = null;
const quipListeners = new Set<() => void>();

function subscribeQuip(notify: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  if (quipSnapshot === null) {
    quipSnapshot = QUIP_KEYS[Math.floor(Math.random() * QUIP_KEYS.length)];
  }
  quipListeners.add(notify);
  return () => { quipListeners.delete(notify); };
}

function readQuip(): string | null {
  if (typeof window === 'undefined') return null;
  if (quipSnapshot === null) {
    quipSnapshot = QUIP_KEYS[Math.floor(Math.random() * QUIP_KEYS.length)];
  }
  return quipSnapshot;
}

function readQuipServer(): string | null {
  return null;
}

/** 加载态随机俏皮话（客户端随机，避免 SSR 水合不一致） */
export default function LoadingQuip() {
  const t = useTranslations('LoadingQuip');
  const quipKey = useSyncExternalStore(subscribeQuip, readQuip, readQuipServer);

  return (
    <p className="text-center text-white/30 text-sm font-mono py-6" aria-live="polite">
      {quipKey ? t(quipKey) : t('default')}
    </p>
  );
}

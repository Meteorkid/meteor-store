'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const QUIP_KEYS = ['quip1', 'quip2', 'quip3', 'quip4'] as const;

/** 加载态随机俏皮话（客户端随机，避免 SSR 水合不一致） */
export default function LoadingQuip() {
  const t = useTranslations('LoadingQuip');
  const [quipKey, setQuipKey] = useState<string | null>(null);

  useEffect(() => {
    setQuipKey(QUIP_KEYS[Math.floor(Math.random() * QUIP_KEYS.length)]);
  }, []);

  return (
    <p className="text-center text-white/30 text-sm font-mono py-6" aria-live="polite">
      {quipKey ? t(quipKey) : t('default')}
    </p>
  );
}

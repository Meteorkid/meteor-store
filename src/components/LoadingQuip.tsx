'use client';

import { useState, useEffect } from 'react';

const QUIPS = [
  '正在把流星捞上来…',
  '正在数店主的奶茶钱…',
  '正在给比特们排队…',
  '马上好，代码在赶来的路上',
];

/** 加载态随机俏皮话（客户端随机，避免 SSR 水合不一致） */
export default function LoadingQuip() {
  const [quip, setQuip] = useState('');

  useEffect(() => {
    setQuip(QUIPS[Math.floor(Math.random() * QUIPS.length)]);
  }, []);

  return (
    <p className="text-center text-white/30 text-sm font-mono py-6" aria-live="polite">
      {quip || '加载中…'}
    </p>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/motion';

const WIDE = 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ０１２３４５６７８９＃＄％＆＊＜＞';
const NARROW = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>{}[]~';

function isWide(ch: string): boolean {
  return (ch.codePointAt(0) || 0) >= 0x2E80;
}

function rnd(wide: boolean): string {
  const pool = wide ? WIDE : NARROW;
  return pool[Math.floor(Math.random() * pool.length)];
}

function scramble(chars: string[], locked: number): string {
  return chars.map((ch, i) => {
    if (i < locked || ch === ' ') return ch;
    return rnd(isWide(ch));
  }).join('');
}

interface Props {
  text: string;
  className?: string;
  delay?: number;
}

export default function ScrambleText({ text, className = '', delay = 0 }: Props) {
  const reduced = useReducedMotion();
  // SSR 与首帧默认显示原文，避免慢 hydration / 脚本失败时留下大块视觉空洞；
  // 客户端 effect 再用乱码覆盖做 scramble 渐进增强
  const [display, setDisplay] = useState(text);

  // 安静模式直接渲染原文，跳过动画 effect
  useEffect(() => {
    if (reduced) return;

    const chars = [...text];
    let locked = 0;
    let frame = 0;
    let iid: ReturnType<typeof setInterval> | undefined;

    const tid = setTimeout(() => {
      setDisplay(scramble(chars, 0));
      iid = setInterval(() => {
        frame++;
        if (frame > 3) locked = Math.min(locked + 1, chars.length);
        setDisplay(scramble(chars, locked));
        if (locked >= chars.length) clearInterval(iid);
      }, 40);
    }, delay);

    return () => { clearTimeout(tid); if (iid !== undefined) clearInterval(iid); };
  }, [text, delay, reduced]);

  if (reduced) return <span className={className}>{text}</span>;
  return <span className={className}>{display}</span>;
}

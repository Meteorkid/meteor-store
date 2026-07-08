'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import AsciiMobius from './AsciiMobius';
import { useReducedMotion } from '@/lib/motion';

// three.js 场景惰性加载（~180KB gz 不进首屏包），加载期间先看 ASCII 环
const MobiusGlass = dynamic(() => import('./MobiusGlass'), {
  ssr: false,
  loading: () => <AsciiMobius className="w-full h-full" />,
});

/** 探测 WebGL 可用性（一次） */
function probeWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Hero 3D 主角的降级链路：
 * 桌面 + WebGL + 允许动画 → 玻璃莫比乌斯环（真 3D）
 * 其余（移动端/无 WebGL/reduced-motion/加载中）→ ASCII 莫比乌斯环
 * 高配看玻璃，低配看字符艺术——两个都是作品，同一套数学。
 */
export default function Hero3D({ className = '' }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)').matches;
    setCapable(desktop && probeWebGL());
    setReady(true);
  }, []);

  // SSR/未探测完成：先渲染 ASCII（也避免水合闪烁）
  if (!ready) {
    return <div className={className}><AsciiMobius className="w-full h-full" /></div>;
  }

  if (!capable || reducedMotion) {
    return <div className={className}><AsciiMobius className="w-full h-full" /></div>;
  }

  return (
    <div className={className}>
      <MobiusGlass className="w-full h-full" />
    </div>
  );
}

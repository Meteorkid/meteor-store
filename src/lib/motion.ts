'use client';

import { useEffect, useState } from 'react';

/** 用户是否偏好减少动画（前庭障碍/晕动症关怀，动效组件必须遵守） */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/** 深夜时段判定（本地时间 0:00–5:00），树洞模式的开关 */
export function isLateNight(date: Date = new Date()): boolean {
  const hour = date.getHours();
  return hour >= 0 && hour < 5;
}

/**
 * 帧率守卫：连续多帧低于阈值时调用 onDegrade，让动效自动降级。
 * 返回每帧调用的 tick 函数（传入当前时间戳）。
 */
export function createFrameGuard(onDegrade: () => void, minFps = 25, badFramesLimit = 60) {
  let last = 0;
  let badFrames = 0;
  let degraded = false;

  return function tick(now: number) {
    if (last > 0 && !degraded) {
      const fps = 1000 / (now - last);
      badFrames = fps < minFps ? badFrames + 1 : 0;
      if (badFrames >= badFramesLimit) {
        degraded = true;
        onDegrade();
      }
    }
    last = now;
  };
}

/** Konami 秘技序列匹配器：喂入 KeyboardEvent.key，命中完整序列时返回 true */
export function createKonamiMatcher() {
  const SEQUENCE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a',
  ];
  let index = 0;

  return function feed(key: string): boolean {
    const expected = SEQUENCE[index];
    if (key === expected || key.toLowerCase() === expected) {
      index++;
      if (index === SEQUENCE.length) {
        index = 0;
        return true;
      }
    } else {
      // 失配时若当前键恰好是序列开头，则从第 1 位重新计数
      index = key === SEQUENCE[0] ? 1 : 0;
    }
    return false;
  };
}

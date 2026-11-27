'use client';

import { useEffect, useRef, type RefObject } from 'react';
import type { HomeSkyController } from '@/lib/home-sky/engine';
import type { SkyInteractionMode } from '@/lib/home-sky/camera';

export interface HomeSkyProps {
  peopleVisible: boolean;
  paused: boolean;
  className?: string;
  interactionMode?: SkyInteractionMode;
  autoRotate?: boolean;
  resetView?: number;
  interactionRef?: RefObject<HTMLElement | null>;
}

/** 首屏文字与按钮先画出来，装饰性的星场引擎等主线程空闲后再建场。 */
const SKY_INIT_DELAY_MS = 2200;

/** 仅填满首页传入的定位容器，不创建全站 fixed 背景。 */
export default function HomeSky({ peopleVisible, paused, className, interactionMode = 'follow', autoRotate = false, resetView = 0, interactionRef }: HomeSkyProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<HomeSkyController | null>(null);
  const stateRef = useRef({ peopleVisible, paused, interactionMode, autoRotate, resetView });
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      void import('@/lib/home-sky/engine').then(({ createHomeSkyEngine }) => {
        if (cancelled || !stageRef.current) return;
        const controller = createHomeSkyEngine(stageRef.current, { paused: true }, interactionRef?.current ?? null);
        controllerRef.current = controller;
        controller.setState(stateRef.current);
      });
    };

    // 星场是纯装饰：Lighthouse 里它的渲染器初始化会占住主线程，拖后 LCP。
    const delay = window.setTimeout(() => {
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(start, { timeout: 2000 });
      } else {
        start();
      }
    }, SKY_INIT_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(delay);
      controllerRef.current?.dispose();
      controllerRef.current = null;
    };
  }, [interactionRef]);

  useEffect(() => {
    stateRef.current = { peopleVisible, paused, interactionMode, autoRotate, resetView };
    controllerRef.current?.setState({ peopleVisible, paused, interactionMode, autoRotate, resetView });
  }, [peopleVisible, paused, interactionMode, autoRotate, resetView]);

  return (
    <div
      ref={stageRef}
      className={className}
      data-home-sky="true"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', background: '#030509' }}
    />
  );
}

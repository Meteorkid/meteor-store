'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { createHomeSkyEngine, type HomeSkyController } from '@/lib/home-sky/engine';
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

/** 仅填满首页传入的定位容器，不创建全站 fixed 背景。 */
export default function HomeSky({ peopleVisible, paused, className, interactionMode = 'follow', autoRotate = false, resetView = 0, interactionRef }: HomeSkyProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<HomeSkyController | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    // 首次effect先静态建场，再由下面的prop effect一次同步用户选择。
    const controller = createHomeSkyEngine(stage, { paused: true }, interactionRef?.current ?? null);
    controllerRef.current = controller;
    return () => {
      controller.dispose();
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, [interactionRef]);

  useEffect(() => {
    controllerRef.current?.setState({ peopleVisible, paused, interactionMode, autoRotate, resetView });
  }, [peopleVisible, paused, interactionMode, autoRotate, resetView, interactionRef]);

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

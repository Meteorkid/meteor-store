'use client';

import { useEffect, useRef } from 'react';
import { createHomeSkyEngine, type HomeSkyController } from '@/lib/home-sky/engine';

export interface HomeSkyProps {
  peopleVisible: boolean;
  paused: boolean;
  className?: string;
}

/** 仅填满首页传入的定位容器，不创建全站 fixed 背景。 */
export default function HomeSky({ peopleVisible, paused, className }: HomeSkyProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<HomeSkyController | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    // 首次effect先静态建场，再由下面的prop effect一次同步用户选择。
    const controller = createHomeSkyEngine(stage, { paused: true });
    controllerRef.current = controller;
    return () => {
      controller.dispose();
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.setState({ peopleVisible, paused });
  }, [peopleVisible, paused]);

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

'use client';

import { useEffect, useRef } from 'react';
import './fluid-sim.css';

/**
 * WebGL 流体模拟容器组件。
 * fluidSim 模块在 import 时自执行初始化（读取 #fluidCanvas、启动动画循环），
 * 因此必须在 canvas 挂载之后（useEffect 内）再动态 import。
 * 卸载时调用 destroyFluidSim 停止动画循环并销毁 dat.gui。
 */
export default function WebGLFluidSim() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    // 动态 import，确保 #fluidCanvas 已在 DOM 中
    import('@/lib/apps/webgl-fluid-sim/fluidSim')
      .then((mod) => {
        if (cancelled) {
          mod.destroyFluidSim();
        }
      })
      .catch((err) => {
        console.error('WebGL Fluid Sim init error:', err);
      });

    return () => {
      cancelled = true;
      // 模块加载完成后才可能有资源需要清理
      import('@/lib/apps/webgl-fluid-sim/fluidSim')
        .then((mod) => mod.destroyFluidSim())
        .catch(() => {
          // 模块未加载成功则无需清理
        });
    };
  }, []);

  return (
    <div ref={containerRef} className="fluid-sim-root">
      <canvas id="fluidCanvas" />
      {/* 以下为手势/摄像头背景的可选 DOM，fluidSim 会按需读取，缺失时自动降级 */}
      <video id="gestureVideo" style={{ display: 'none' }} playsInline muted />
      <canvas id="cameraBg" style={{ display: 'none' }} />
      <div id="fogOverlay" style={{ display: 'none' }} />
    </div>
  );
}
'use client';

import { GUI } from 'dat.gui';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import './fluid-sim.css';

/**
 * WebGL 流体模拟容器组件。
 * fluidSim 模块在 import 时自执行初始化（读取 #fluidCanvas、启动动画循环），
 * 因此必须在 canvas 挂载之后（useEffect 内）再动态 import。
 * 卸载时调用 destroyFluidSim 停止动画循环并销毁 dat.gui。
 * 挂载前先探测 WebGL 支持，不支持时渲染降级提示而非空白画布。
 */
/**
 * 探测当前环境是否支持 WebGL。
 * 用探针 canvas 尝试创建 context——headless 测试、禁用 GPU 加速的设备、
 * 老浏览器会返回 null。返回 false 时直接渲染降级提示，不进 fluidSim。
 */
function detectWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    return !!(
      probe.getContext('webgl2') ||
      probe.getContext('webgl') ||
      probe.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

// useSyncExternalStore 需要一个 subscribe 函数；这里是无订阅的一次性能力探测，用 no-op
const noopSubscribe = () => () => {};

export default function WebGLFluidSim() {
  const containerRef = useRef<HTMLDivElement>(null);
  // 用 useSyncExternalStore 读取「是否支持 WebGL」这一外部能力快照：
  // 服务端(SSR/水合首帧)返回 false，客户端取真实探测结果，水合后自动对齐。
  const webglSupported = useSyncExternalStore(
    noopSubscribe,
    () => detectWebGL(),
    () => false,
  );

  // 仅在 WebGL 可用时才挂载 #fluidCanvas 并动态加载 fluidSim。
  // fluidSim 模块在 import 时自执行初始化（读取 #fluidCanvas、启动动画循环），
  // 因此必须在 canvas 挂载之后（useEffect 内）再动态 import。
  useEffect(() => {
    if (!webglSupported) return;
    let cancelled = false;

    // 源应用把 dat.gui 作为 UMD 全局变量 dat 使用（new dat.GUI）。
    // Next 里需要用模块导入，并在动态 import fluidSim 之前把它挂到全局，
    // 否则 fluidSim 初始化时抛 `ReferenceError: dat is not defined`。
    globalThis.dat = { GUI };

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
  }, [webglSupported]);

  // 不支持 WebGL 时给出友好提示，而不是空白画布或触发布局级错误边界
  if (!webglSupported) {
    return (
      <div className="fluid-sim-root fluid-sim-unsupported">
        <div className="fluid-sim-unsupported-inner">
          <p className="fsu-zh">此设备不支持 WebGL，无法运行流体模拟。</p>
          <p className="fsu-en">
            This device does not support WebGL, so the fluid simulation cannot run.
          </p>
        </div>
      </div>
    );
  }

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
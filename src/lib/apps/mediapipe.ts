'use client';

/**
 * MediaPipe UMD 全局加载器。
 *
 * @mediapipe/hands / camera_utils / drawing_utils 的 package.json 都标记
 * `"sideEffects": []`，且主文件是 Closure IIFE（无 ESM 导出）。于是：
 *   - `import "@mediapipe/hands"` 这类裸副作用导入会被 webpack 直接 tree-shake 掉，
 *     全局 `window.Hands` / `window.Camera` 等永远不会被设置；
 *   - `import { Hands } from "@mediapipe/hands"` 会因无具名导出而构建失败。
 * 因此只能像官方 demo 一样用 `<script>` 标签加载，脚本执行后把全局挂到 window。
 *
 * 运行时文件全部放在 public/vendor/mediapipe 下并同源加载，避免在线体验依赖
 * jsDelivr 的可用性。WASM 编译仍需要 CSP 的 `'wasm-unsafe-eval'`。
 * MediaPipe Hands 0.4 在主线程运行、不创建 Worker，故无需 worker-src。
 */

const MEDIAPIPE_HANDS_BASE = '/vendor/mediapipe/hands';

export const MEDIAPIPE_RUNTIME_SCRIPTS = [
  `${MEDIAPIPE_HANDS_BASE}/hands.js`,
  '/vendor/mediapipe/camera_utils/camera_utils.js',
  '/vendor/mediapipe/drawing_utils/drawing_utils.js',
] as const;

export function getMediaPipeHandsAssetUrl(file: string): string {
  return `${MEDIAPIPE_HANDS_BASE}/${file}`;
}

declare global {
  // 这些全局由 UMD 脚本设置，无类型声明，这里统一标 any。
  interface Window {
    Hands?: any;
    Camera?: any;
    HAND_CONNECTIONS?: any;
    drawConnectors?: any;
    drawLandmarks?: any;
  }
}

let loadPromise: Promise<void> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load MediaPipe script: ${src}`));
    document.body.appendChild(s);
  });
}

/**
 * 确保 MediaPipe 全局脚本已加载（幂等，多次调用只加载一次）。
 * 解析时 `window.Hands` 与 `window.Camera` 已可用。
 */
export function loadMediaPipe(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (!loadPromise) {
    loadPromise = Promise.all(MEDIAPIPE_RUNTIME_SCRIPTS.map(loadScript)).then(() => {
      if (!window.Hands || !window.Camera) {
        throw new Error('MediaPipe globals not available after load');
      }
    });
  }
  return loadPromise;
}

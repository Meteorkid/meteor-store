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
 * 本项目 CSP 用 `script-src 'self' 'nonce-…' 'strict-dynamic'`，动态 `<script>`
 * 由受信任的 bundle 创建，strict-dynamic 会放行其加载与执行，无需额外域名白名单。
 * 模型文件（.wasm / .binarypb / .tflite）由 MediaPipe 内部 fetch，走 connect-src
 * （已在 proxy.ts 放行 cdn.jsdelivr.net）；WASM 编译走 `'wasm-unsafe-eval'`。
 * MediaPipe Hands 0.4 在主线程运行、不创建 Worker，故无需 worker-src。
 */

const SCRIPTS = [
  'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js',
  'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
  'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
];

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
    loadPromise = Promise.all(SCRIPTS.map(loadScript)).then(() => {
      if (!window.Hands || !window.Camera) {
        throw new Error('MediaPipe globals not available after load');
      }
    });
  }
  return loadPromise;
}
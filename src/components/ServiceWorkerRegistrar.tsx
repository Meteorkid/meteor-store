'use client';

import { useEffect } from 'react';

/**
 * 注册 /sw.js。它只提供断网时的离线兜底页，不参与任何正常内容的分发——
 * 缓存策略与「为什么这样设计」写在 public/sw.js 顶部，改之前先读那段。
 *
 * **只在生产环境注册**：dev 下 Turbopack 靠自己的一套请求处理做 HMR，
 * 多一层 SW 只会让"改了代码没生效"变得更难排查。要本地验证离线效果，
 * 跑 `pnpm build && pnpm start`，然后在 DevTools 里勾 Network → Offline。
 */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // 逃生舱：线上真出了缓存问题，让用户/自己在 Console 里一行命令清干净。
    // 注册失败或压根没注册时也要能用，所以挂在 effect 最前面。
    const w = window as Window & { __meteorSwReset?: () => void };
    w.__meteorSwReset = () => {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => {
          if (r.active) r.active.postMessage('meteor-sw-reset');
          r.unregister();
        });
      });
      if ('caches' in window) {
        caches.keys().then((ks) => ks.forEach((k) => caches.delete(k)));
      }
    };

    if (process.env.NODE_ENV !== 'production') return;

    // 等 load 之后再注册：SW 的 install 会去抓预缓存资源，
    // 放在首屏加载期间做等于跟真正要紧的资源抢带宽。
    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* 注册失败只是没有离线兜底，不影响站点任何功能，静默即可 */
      });
    };

    if (document.readyState === 'complete') {
      register();
      return;
    }
    window.addEventListener('load', register);
    return () => window.removeEventListener('load', register);
  }, []);

  return null;
}

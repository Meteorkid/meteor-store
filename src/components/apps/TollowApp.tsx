'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import '@/apps/tollow/styles/index.css';

/**
 * Tollow 打字练习应用包装组件。
 * 源应用 main.tsx 的 createRoot 与一次性初始化服务被跳过，这里直接动态加载根组件 <App/>。
 * App 内部使用 HashRouter（已在源根组件改为 HashRouter），可安全地在 Next 的
 * /apps/tollow 路由下工作，Next 不会接管 hash 内的子路径。
 *
 * 源应用启动时初始化了 i18n / analytics / performance / security 四个服务。
 * App 渲染必需的是国际化（i18n）；其余服务在无后端时由各自的 try/catch 兜底，
 * 为避免 securityService 包装全局 fetch 影响全站，这里只初始化 i18n。
 */
const TollowAppInner = dynamic(() => import('@/apps/tollow/core/App'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-white/60">
      正在加载 Tollow…
    </div>
  ),
});

export default function TollowApp() {
  useEffect(() => {
    let cancelled = false;

    import('@/apps/tollow/i18n')
      .then((mod) => {
        if (!cancelled) return mod.initializeLanguage();
      })
      .catch((err) => {
        console.error('Tollow i18n init error:', err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="tollow-root tollow-app h-screen w-full overflow-auto">
      <TollowAppInner />
    </div>
  );
}
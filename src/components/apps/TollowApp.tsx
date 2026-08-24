'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import '@/apps/tollow/styles/index.css';
import {
  configureTollowAccountStorage,
  releaseTollowAccountStorage,
  startTollowAccountSync,
} from '@/apps/tollow/services/accountSyncService';
import {
  configureTollowFavoriteCloudSync,
  startTollowFavoriteSync,
} from '@/apps/tollow/services/favoriteService';
import type { TollowAccessLevel } from '@/lib/tollow-plans';
import { TollowAccessProvider } from '@/apps/tollow/core/access';

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
  loading: () => <TollowLoading label="正在加载 Tollow…" />,
});

function TollowLoading({ label }: { label: string }) {
  return (
    <div className="tollow-boot" role="status" aria-live="polite">
      <span className="tollow-boot-mark" aria-hidden="true">T</span>
      <span className="tollow-boot-label">{label}</span>
    </div>
  );
}

export default function TollowApp({
  userId,
  accessLevel,
}: {
  userId: string;
  accessLevel: TollowAccessLevel;
}) {
  const storageKey = `${userId}:${accessLevel}`;
  const [readyStorageKey, setReadyStorageKey] = useState<string | null>(null);
  const storageReady = readyStorageKey === storageKey;

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

  useEffect(() => {
    let cancelled = false;
    configureTollowAccountStorage(userId);
    const cloudEnabled = accessLevel === 'pro';
    configureTollowFavoriteCloudSync(cloudEnabled);
    const sync = cloudEnabled ? startTollowAccountSync(userId) : null;
    const stopFavoriteSync = cloudEnabled ? startTollowFavoriteSync() : null;
    if (sync) {
      void sync.ready.finally(() => {
        if (!cancelled) setReadyStorageKey(storageKey);
      });
    } else {
      queueMicrotask(() => {
        if (!cancelled) setReadyStorageKey(storageKey);
      });
    }

    return () => {
      cancelled = true;
      stopFavoriteSync?.();
      sync?.stop();
      configureTollowFavoriteCloudSync(false);
      releaseTollowAccountStorage(userId);
    };
  }, [accessLevel, storageKey, userId]);

  return (
    <div className="tollow-root tollow-app h-screen w-full overflow-auto">
      {storageReady ? (
        <TollowAccessProvider level={accessLevel}>
          <TollowAppInner />
        </TollowAccessProvider>
      ) : (
        <TollowLoading label="正在准备账号数据…" />
      )}
    </div>
  );
}

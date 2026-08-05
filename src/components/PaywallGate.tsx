'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from './AuthProvider';
import type { Entitlement } from '@/lib/entitlements';

interface PaywallGateProps {
  /** 需要付费才能访问的产品 id */
  productId: string;
  /** 未付费/未登录时展示的 fallback（默认渲染购买引导卡片） */
  fallback?: ReactNode;
  /** 已付费用户看到的内容 */
  children: ReactNode;
}

/**
 * 付费门控：登录 + 已购该产品才渲染 children，否则渲染 fallback。
 * 数据来自 /api/entitlements，仅对本人可见。
 */
export default function PaywallGate({ productId, fallback, children }: PaywallGateProps) {
  const t = useTranslations('Paywall');
  const { user, loading: authLoading } = useAuth();
  const [entitlements, setEntitlements] = useState<Entitlement[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEntitlements = useCallback(async (): Promise<Entitlement[] | null> => {
    try {
      const res = await fetch('/api/entitlements');
      if (!res.ok) return null;
      const data = await res.json();
      return data.entitlements ?? null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    // 未登录时无需请求，保持初始空态即可
    if (!user) return;
    fetchEntitlements().then((list) => {
      setEntitlements(list);
      setLoading(false);
    });
  }, [user, fetchEntitlements]);

  // 未登录：直接视为无权限，跳过请求
  const hasAccess = user
    ? (entitlements ?? []).some((e) => e.productId === productId)
    : false;

  if (authLoading || (user && loading)) {
    return (
      <div className="flex min-h-[240px] items-center justify-center text-sm text-white/40">
        {t('loadingCheck')}
      </div>
    );
  }

  if (hasAccess) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  // 默认购买引导卡片
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
      <div className="mb-4 text-4xl">🔒</div>
      <h2 className="mb-2 text-xl font-bold text-white">{t('lockedTitle')}</h2>
      <p className="mb-6 text-sm text-white/50">{t('lockedDesc')}</p>
      {user ? (
        <Link
          href={`/products/${productId}`}
          className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
        >
          {t('buyNow')}
        </Link>
      ) : (
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
        >
          {t('loginToContinue')}
        </Link>
      )}
    </div>
  );
}
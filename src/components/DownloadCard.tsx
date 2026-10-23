'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from './AuthProvider';
import { buildLoginHref } from '@/lib/login-return';

type AccessStatus = 'checking' | 'owned' | 'unowned' | 'login' | 'error' | 'changed';

interface DownloadCardProps {
  productId: string;
  /** 下载条目 id，传给下载接口的 file 参数 */
  fileId: string;
  label: string;
  note?: string;
  icon: ReactNode;
  iconColor: string;
  recommended: boolean;
  gated: boolean;
  version?: string;
  sha256?: string;
}

/**
 * 单个下载入口。
 *
 * 门控条目在这里做的判断**只是显示层**：真正的关卡在 `/api/download/[productId]`，
 * 它校验 entitlement 之后才签发预签名 URL。所以即使有人改 DOM 把按钮点亮，
 * 拿到的也只是一个会返回 403 的接口地址——安装包地址从头到尾没进过页面。
 * （对比 `/apps/{id}`：那里渲染的是应用本体，藏在客户端就等于没藏，必须服务端门控。）
 */
export default function DownloadCard({
  productId,
  fileId,
  label,
  note,
  icon,
  iconColor,
  recommended,
  gated,
  version,
  sha256,
}: DownloadCardProps) {
  const t = useTranslations('ProductDetailPage');
  const { user, loading, refresh } = useAuth();
  const ownerId = user?.id ?? null;
  const key = JSON.stringify([gated, loading, ownerId, productId]);
  const [access, setAccess] = useState<{ key: string; status: AccessStatus }>({ key, status: 'checking' });
  const [attempt, setAttempt] = useState(0);
  // 身份或产品变化时立即撤下上一轮的入口，不能等迟到的请求完成。
  if (access.key !== key) setAccess({ key, status: 'checking' });

  useEffect(() => {
    if (!gated || loading || !ownerId) return;
    const controller = new AbortController();
    const update = (status: AccessStatus) => {
      if (!controller.signal.aborted) setAccess(current => current.key === key ? { key, status } : current);
    };
    const timeout = setTimeout(() => { update('error'); controller.abort(); }, 15_000);
    void (async () => {
      try {
        const response = await fetch('/api/entitlements', { cache: 'no-store', signal: controller.signal });
        if (response.status === 401) { update('login'); return; }
        if (!response.ok) throw new Error('Entitlements unavailable');
        const data = await response.json();
        if (!data || typeof data.userId !== 'string' || !Array.isArray(data.entitlements)
          || !data.entitlements.every((item: unknown) => item && typeof item === 'object' && 'productId' in item && typeof item.productId === 'string')) {
          throw new Error('Invalid entitlements');
        }
        if (data.userId !== ownerId) { update('changed'); return; }
        update(data.entitlements.some((item: { productId: string }) => item.productId === productId) ? 'owned' : 'unowned');
      } catch { update('error'); }
      finally { clearTimeout(timeout); }
    })();
    return () => { controller.abort(); clearTimeout(timeout); };
  }, [gated, loading, ownerId, productId, key, attempt]);

  const retry = () => {
    setAccess({ key, status: 'checking' });
    setAttempt(value => value + 1);
  };

  const cardClass = `glass-card glass-card-badge-safe group relative flex items-start gap-4 rounded-2xl p-5 transition-all duration-200 ${
    recommended
      ? '!border-violet-500/30 !bg-violet-500/[0.06] hover:!border-violet-500/50 hover:!bg-violet-500/[0.1]'
      : ''
  }`;

  const meta = [version, sha256 ? `SHA-256 ${sha256.slice(0, 12)}…` : null]
    .filter(Boolean)
    .join(' · ');

  const body = (
    <>
      {recommended && (
        <span className="absolute -top-2.5 right-4 rounded-full bg-violet-600 px-2.5 py-0.5 text-[10px] font-semibold text-white">
          {t('recommended')}
        </span>
      )}
      <span className={`mt-0.5 shrink-0 ${iconColor} transition-transform group-hover:scale-110`}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-white">{label}</p>
        {note && <p className="mt-1 t-footnote text-white/70">{note}</p>}
        {meta && <p className="mt-1 break-words font-mono t-footnote text-white/60">{meta}</p>}
      </div>
    </>
  );

  const arrow = (
    <svg
      className="ml-auto mt-1 h-4 w-4 shrink-0 text-gray-600 transition-all group-hover:translate-x-0.5 group-hover:text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  );

  const lockIcon = (
    <svg className="ml-auto mt-1 h-4 w-4 shrink-0 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );

  // 非门控：无需登录，但对象在私有 bucket，地址由下载接口临时签发，这里不落死链接
  if (!gated) {
    return (
      <a
        href={`/api/download/${productId}?file=${encodeURIComponent(fileId)}`}
        className={`${cardClass} hover:scale-[1.02]`}
      >
        {body}
        {arrow}
      </a>
    );
  }

  if (loading || (user && ownerId && access.status === 'checking')) {
    return (
      <div className={`${cardClass} opacity-60`} aria-busy="true">
        {body}
        <span className="ml-auto mt-1 shrink-0 t-footnote text-white/60">{t('downloadChecking')}</span>
      </div>
    );
  }

  // 会话过期时保留产品及下载锚点，不能把读取失败解释成尚未购买。
  if (!user || access.status === 'login') {
    return (
      <Link href={buildLoginHref(`/products/${productId}#download`)} className={`${cardClass} flex-wrap`}>
        {body}
        {lockIcon}
        <span className={access.status === 'login' ? 'basis-full t-footnote text-white/70' : 'sr-only'}>
          {t(access.status === 'login' ? 'downloadSessionExpired' : 'downloadLoginHint')}
        </span>
      </Link>
    );
  }

  if (!ownerId || access.status === 'error' || access.status === 'changed') {
    const changed = !ownerId || access.status === 'changed';
    return (
      <div className={`${cardClass} flex-wrap`}>
        {body}
        <div className="basis-full">
          <p role="alert" className="t-footnote text-white/70">{t(changed ? 'downloadAccountChanged' : 'downloadUnavailable')}</p>
          <button
            type="button"
            onClick={changed ? async () => { await refresh(); retry(); } : retry}
            className="mt-3 rounded-lg border border-white/20 px-3 py-2 text-sm text-white focus-visible:outline-2 focus-visible:outline-violet-300"
          >
            {t(changed ? 'downloadRefresh' : 'downloadRetry')}
          </button>
        </div>
      </div>
    );
  }

  if (access.status === 'unowned') {
    return (
      <Link href={`/products/${productId}#pricing`} className={cardClass}>
        {body}
        {lockIcon}
        <span className="sr-only">{t('downloadLockedHint')}</span>
      </Link>
    );
  }

  return (
    <a
      href={`/api/download/${productId}?file=${encodeURIComponent(fileId)}`}
      className={`${cardClass} hover:scale-[1.02]`}
    >
      {body}
      {arrow}
    </a>
  );
}

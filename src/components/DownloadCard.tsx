'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from './AuthProvider';
import type { Entitlement } from '@/lib/entitlements';

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
  const { user } = useAuth();
  const [entitled, setEntitled] = useState<boolean | null>(null);

  useEffect(() => {
    if (!gated || !user) return;
    // setState 全部走 .then 回调，避免 react-hooks/set-state-in-effect
    fetch('/api/entitlements')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { entitlements?: Entitlement[] } | null) => {
        setEntitled(Boolean(data?.entitlements?.some((e) => e.productId === productId)));
      })
      .catch(() => setEntitled(false));
  }, [gated, user, productId]);

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
        {note && <p className="mt-1 text-xs text-gray-500">{note}</p>}
        {meta && <p className="mt-1 font-mono text-[11px] text-gray-600">{meta}</p>}
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

  // 门控下载：未登录 / 未授权时给引导，不给链接
  if (!user) {
    return (
      <Link href="/login" className={cardClass}>
        {body}
        {lockIcon}
        <span className="sr-only">{t('downloadLoginHint')}</span>
      </Link>
    );
  }

  if (entitled === null) {
    return (
      <div className={`${cardClass} opacity-60`}>
        {body}
        <span className="ml-auto mt-1 shrink-0 text-[11px] text-gray-500">{t('downloadChecking')}</span>
      </div>
    );
  }

  if (!entitled) {
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

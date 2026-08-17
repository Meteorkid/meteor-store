'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

export default function WechatAccountBinding({ bound, email }: { bound: boolean; email?: string }) {
  const t = useTranslations('AccountPage');
  const locale = useLocale();
  const router = useRouter();
  const [unbinding, setUnbinding] = useState(false);
  const [error, setError] = useState('');

  const handleUnbind = async () => {
    if (unbinding) return;
    setUnbinding(true);
    setError('');
    const res = await fetch('/api/auth/wechat/unbind', { method: 'POST' });
    setUnbinding(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error || t('wechatUnbindFailed'));
      return;
    }
    router.refresh();
  };

  return (
    <section className="mt-8 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 md:p-9">
      <h2 className="t-title-3 mb-1.5 text-white/90">{t('wechatTitle')}</h2>
      <p className="t-footnote mb-5 text-white/60">{t('wechatDesc')}</p>
      {bound ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
            {t('wechatBound')}
          </span>
          {email && (
            <span className="text-sm text-white/70">
              {t('wechatBoundAs')} <span className="font-medium text-white/90">{email}</span>
            </span>
          )}
          <button
            type="button"
            onClick={handleUnbind}
            disabled={unbinding}
            className="inline-flex rounded-xl border border-white/15 px-5 py-2.5 text-[0.9375rem] font-semibold text-white/80 transition-colors hover:bg-white/[0.06] disabled:opacity-50"
          >
            {unbinding ? t('wechatUnbinding') : t('wechatUnbind')}
          </button>
        </div>
      ) : (
        <a
          href={`/api/auth/wechat?locale=${locale}`}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-emerald-500"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M9.5 3C5.36 3 2 5.86 2 9.39c0 2.02 1.06 3.82 2.72 5L4.2 16.9c-.14.5.43.9.87.58l2.93-1.75c.48.12.98.18 1.5.18.3 0 .6-.02.88-.05a5.5 5.5 0 0 1-.14-1.19c0-3.2 3.04-5.8 6.79-5.8.12 0 .23 0 .35.01C16.79 5.57 13.43 3 9.5 3zM7 7.36c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9zm5 0c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z" />
            <path d="M22 13.67c0-3.07-2.97-5.57-6.63-5.57s-6.63 2.5-6.63 5.57 2.97 5.56 6.63 5.56c.6 0 1.18-.07 1.73-.2l2.6 1.55c.4.25.9-.07.78-.52l-.4-1.42A4.9 4.9 0 0 0 22 13.67zM12.96 12.1c-.42 0-.77-.34-.77-.76s.35-.76.77-.76.77.34.77.76-.35.76-.77.76zm4.85 0c-.42 0-.77-.34-.77-.76s.35-.76.77-.76.77.34.77.76-.34.76-.77.76z" />
          </svg>
          {t('wechatBind')}
        </a>
      )}
      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

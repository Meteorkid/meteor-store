'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';

type VerificationStatus = 'processing' | 'success' | 'error';

export default function VerifyEmailClient() {
  const t = useTranslations('VerifyEmailPage');
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>('processing');
  const tokenRef = useRef<string | null | undefined>(undefined);
  const requestRef = useRef<Promise<Response> | null>(null);

  useEffect(() => {
    if (tokenRef.current === undefined) {
      tokenRef.current = new URLSearchParams(window.location.hash.slice(1)).get('token');
      window.history.replaceState(null, '', window.location.pathname);
    }
    const token = tokenRef.current;

    if (!token) {
      Promise.resolve().then(() => setStatus('error'));
      return;
    }

    let cancelled = false;
    let redirectTimer: ReturnType<typeof setTimeout> | undefined;
    requestRef.current ??= fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    requestRef.current
      .then((response) => {
        if (!response.ok) throw new Error('verification failed');
        if (cancelled) return;
        setStatus('success');
        redirectTimer = setTimeout(() => router.replace('/login?verified=1'), 900);
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [router]);

  const icon = status === 'processing' ? '⌛' : status === 'success' ? '✓' : '!';

  return (
    <div className="glass-card w-full max-w-md rounded-3xl p-8 text-center md:p-10" aria-live="polite">
      <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/15 text-2xl text-violet-300" aria-hidden>
        {icon}
      </span>
      <h1 className="t-title-2 text-white">{t(`${status}Title`)}</h1>
      <p className="mt-3 text-sm leading-relaxed text-white/60">{t(`${status}Description`)}</p>
      {status === 'error' && (
        <Link
          href="/login"
          className="mt-6 inline-block rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
        >
          {t('backToLogin')}
        </Link>
      )}
    </div>
  );
}

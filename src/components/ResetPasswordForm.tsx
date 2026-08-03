'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type ResetStatus = 'checking' | 'ready' | 'success' | 'error';

export default function ResetPasswordForm() {
  const t = useTranslations('ResetPasswordPage');
  const tokenRef = useRef<string | null>(null);
  const [status, setStatus] = useState<ResetStatus>('checking');
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    tokenRef.current = new URLSearchParams(window.location.hash.slice(1)).get('token');
    window.history.replaceState(null, '', window.location.pathname);
    Promise.resolve().then(() => setStatus(tokenRef.current ? 'ready' : 'error'));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (newPassword !== confirmation) {
      setError(t('passwordMismatch'));
      return;
    }
    if (!tokenRef.current) {
      setStatus('error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenRef.current, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t('resetFailed'));
      tokenRef.current = null;
      setStatus('success');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t('resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (status === 'checking') {
    return <p className="text-sm text-white/60" aria-live="polite">{t('checking')}</p>;
  }

  if (status === 'error') {
    return (
      <div className="glass-card w-full max-w-md rounded-3xl p-8 text-center md:p-10" aria-live="polite">
        <h1 className="t-title-2 text-white">{t('invalidTitle')}</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{t('invalidDescription')}</p>
        <Link href="/forgot-password" className="mt-6 inline-block rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500">
          {t('requestAgain')}
        </Link>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="glass-card w-full max-w-md rounded-3xl p-8 text-center md:p-10" aria-live="polite">
        <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-2xl text-emerald-300" aria-hidden>✓</span>
        <h1 className="t-title-2 text-white">{t('successTitle')}</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{t('successDescription')}</p>
        <Link href="/login" className="mt-6 inline-block rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500">
          {t('goToLogin')}
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-card w-full max-w-md rounded-3xl p-8 md:p-10">
      <h1 className="t-title-2 text-white">{t('title')}</h1>
      <p className="mt-3 text-sm leading-relaxed text-white/60">{t('description')}</p>
      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <div>
          <label htmlFor="reset-password" className="mb-1.5 block text-sm font-medium text-gray-300">{t('newPassword')}</label>
          <input
            id="reset-password"
            type="password"
            required
            minLength={8}
            maxLength={200}
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-violet-500/50"
          />
        </div>
        <div>
          <label htmlFor="reset-confirmation" className="mb-1.5 block text-sm font-medium text-gray-300">{t('confirmPassword')}</label>
          <input
            id="reset-confirmation"
            type="password"
            required
            minLength={8}
            maxLength={200}
            autoComplete="new-password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-violet-500/50"
          />
        </div>
        {error && <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
        >
          {loading ? t('resetting') : t('submit')}
        </button>
      </form>
    </div>
  );
}

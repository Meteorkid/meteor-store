'use client';

import { useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function ForgotPasswordForm() {
  const t = useTranslations('ForgotPasswordPage');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t('requestFailed'));
      setSent(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t('requestFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="glass-card w-full max-w-md rounded-3xl p-8 text-center md:p-10" aria-live="polite">
        <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/15 text-2xl text-violet-300" aria-hidden>✉</span>
        <h1 className="t-title-2 text-white">{t('sentTitle')}</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{t('sentDescription')}</p>
        <Link href="/login" className="mt-6 inline-block text-sm text-violet-400 transition-colors hover:text-violet-300">
          {t('backToLogin')}
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
          <label htmlFor="forgot-email" className="mb-1.5 block text-sm font-medium text-gray-300">{t('emailLabel')}</label>
          <input
            id="forgot-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-violet-500/50"
          />
        </div>
        {error && <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
        >
          {loading ? t('sending') : t('submit')}
        </button>
      </form>
      <Link href="/login" className="mt-5 block text-center text-sm text-gray-500 transition-colors hover:text-white">
        {t('backToLogin')}
      </Link>
    </div>
  );
}

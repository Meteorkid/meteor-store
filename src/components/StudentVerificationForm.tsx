'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from './AuthProvider';

type Status = 'checking' | 'ready' | 'requesting' | 'sent' | 'success' | 'error';

export default function StudentVerificationForm() {
  const t = useTranslations('StudentPage');
  const locale = useLocale();
  const { user, loading, refresh } = useAuth();
  const [studentEmail, setStudentEmail] = useState('');
  const [status, setStatus] = useState<Status>('checking');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get('token');
    window.history.replaceState(null, '', window.location.pathname);
    if (!token) {
      Promise.resolve().then(() => setStatus('ready'));
      return;
    }

    let cancelled = false;
    fetch('/api/student/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('invalid');
        await refresh();
        if (!cancelled) setStatus('success');
      })
      .catch(() => {
        if (!cancelled) {
          setError(t('invalidLink'));
          setStatus('error');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [refresh, t]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('requesting');
    setError('');
    try {
      const response = await fetch('/api/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentEmail,
          locale: locale === 'en' ? 'en' : 'zh',
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t('requestFailed'));
      if (data.alreadyVerified) {
        await refresh();
        setStatus('success');
        return;
      }
      setStudentEmail('');
      setStatus('sent');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t('requestFailed'));
      setStatus('error');
    }
  };

  if (status === 'checking' || loading) {
    return <p className="text-sm text-white/60" aria-live="polite">{t('checking')}</p>;
  }

  if (status === 'success' || user?.isStudent) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-8 text-center" aria-live="polite">
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-xl text-emerald-300" aria-hidden>✓</span>
        <h2 className="text-lg font-semibold text-emerald-200">{t('verifiedTitle')}</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-300">{t('verifiedDescription')}</p>
        <Link href="/account" className="mt-5 inline-block text-sm text-emerald-300 underline decoration-emerald-300/30 underline-offset-4">
          {t('viewAccount')}
        </Link>
      </div>
    );
  }

  if (status === 'sent') {
    return (
      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.06] p-8 text-center" aria-live="polite">
        <h2 className="text-lg font-semibold text-violet-200">{t('sentTitle')}</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-300">{t('sentDescription')}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <h2 className="text-lg font-semibold text-white">{t('loginTitle')}</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">{t('loginDescription')}</p>
        <Link href="/login" className="mt-5 inline-block rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500">
          {t('goToLogin')}
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-left">
      <h2 className="text-lg font-semibold text-white">{t('formTitle')}</h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-400">{t('formDescription')}</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="student-email" className="mb-1.5 block text-sm font-medium text-gray-300">{t('emailLabel')}</label>
          <input
            id="student-email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            value={studentEmail}
            onChange={(event) => setStudentEmail(event.target.value)}
            placeholder={t('emailPlaceholder')}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-violet-500/50"
          />
        </div>
        {error && <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={status === 'requesting'}
          className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
        >
          {status === 'requesting' ? t('requesting') : t('submit')}
        </button>
      </form>
    </div>
  );
}

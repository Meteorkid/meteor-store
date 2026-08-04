'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type Status = 'checking' | 'ready' | 'requesting' | 'sent' | 'success' | 'error';

export default function NewsletterUnsubscribeForm() {
  const t = useTranslations('NewsletterUnsubscribePage');
  const locale = useLocale();
  const [email, setEmail] = useState('');
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
    fetch('/api/newsletter/unsubscribe/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('invalid');
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
  }, [t]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('requesting');
    setError('');
    try {
      const response = await fetch('/api/newsletter/unsubscribe/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale: locale === 'en' ? 'en' : 'zh' }),
      });
      if (!response.ok) throw new Error('request-failed');
      setStatus('sent');
      setEmail('');
    } catch {
      setError(t('requestFailed'));
      setStatus('error');
    }
  };

  if (status === 'checking') {
    return <p className="text-sm text-white/60" aria-live="polite">{t('checking')}</p>;
  }

  if (status === 'success') {
    return (
      <div className="glass-card w-full max-w-md rounded-3xl p-8 text-center md:p-10" aria-live="polite">
        <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-2xl text-emerald-300" aria-hidden>✓</span>
        <h1 className="t-title-2 text-white">{t('successTitle')}</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{t('successDescription')}</p>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500">
          {t('backHome')}
        </Link>
      </div>
    );
  }

  if (status === 'sent') {
    return (
      <div className="glass-card w-full max-w-md rounded-3xl p-8 text-center md:p-10" aria-live="polite">
        <h1 className="t-title-2 text-white">{t('sentTitle')}</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{t('sentDescription')}</p>
      </div>
    );
  }

  return (
    <div className="glass-card w-full max-w-md rounded-3xl p-8 md:p-10">
      <h1 className="t-title-2 text-white">{t('title')}</h1>
      <p className="mt-3 text-sm leading-relaxed text-white/60">{t('description')}</p>
      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <div>
          <label htmlFor="newsletter-unsubscribe-email" className="mb-1.5 block text-sm font-medium text-gray-300">{t('emailLabel')}</label>
          <input
            id="newsletter-unsubscribe-email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-violet-500/50"
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

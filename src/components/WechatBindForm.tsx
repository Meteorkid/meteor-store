'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

type BindResult = {
  success?: boolean;
  mode?: 'login' | 'register';
  verificationRequired?: boolean;
  emailSent?: boolean;
  resendTicket?: string;
  error?: string;
  code?: string;
};

export default function WechatBindForm() {
  const t = useTranslations('WechatBindPage');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState<{
    email: string;
    emailSent: boolean;
    resendTicket?: string;
  } | null>(null);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading || !token) return;
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/wechat/bind', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        token,
        mode,
        email,
        password,
        name: name || undefined,
        mfaCode: mfaCode || undefined,
        locale,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as BindResult;
    setLoading(false);

    if (data.code === 'MFA_REQUIRED') {
      setMfaRequired(true);
      setError(data.error || t('mfaRequired'));
      return;
    }
    if (data.error) {
      setError(data.error);
      setMfaCode('');
      return;
    }
    if (data.mode === 'register') {
      setPendingVerification({
        email,
        emailSent: data.emailSent !== false,
        resendTicket: data.resendTicket,
      });
      return;
    }
    router.push('/account');
    router.refresh();
  };

  const handleResend = async () => {
    if (!pendingVerification?.resendTicket || resending || resent) return;
    setResending(true);
    setError('');
    const res = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ resendTicket: pendingVerification.resendTicket }),
    });
    setResending(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error || t('resendFailed'));
      return;
    }
    setResent(true);
  };

  if (!token) {
    return (
      <div className="w-full max-w-sm text-center">
        <p className="text-sm text-gray-400">{t('missingToken')}</p>
      </div>
    );
  }

  if (pendingVerification) {
    return (
      <div className="w-full max-w-sm text-center" aria-live="polite">
        <span className="mb-4 inline-block text-4xl" aria-hidden>✉️</span>
        <h1 className="t-title-2 mb-3 text-white">{t('checkEmailTitle')}</h1>
        <p className="text-sm leading-relaxed text-gray-400">
          {pendingVerification.emailSent ? t('checkEmailSent') : t('checkEmailSendFailed')}
        </p>
        <p className="mt-3 font-mono text-sm text-white/70">{pendingVerification.email}</p>
        <p className="mt-3 text-xs leading-relaxed text-gray-500">{t('verifyThenRescan')}</p>
        {resent && (
          <p className="mt-4 rounded-lg bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-400">
            {t('verificationResent')}
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">{error}</p>
        )}
        <button
          type="button"
          onClick={handleResend}
          disabled={resending || resent}
          className="mt-6 w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
        >
          {resending ? t('resending') : resent ? t('verificationResent') : t('resend')}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6">
      <span className="mb-3 inline-block text-3xl" aria-hidden>💬</span>
      <h1 className="t-title-2 mb-2 text-white">{t('title')}</h1>
      <p className="mb-5 text-sm text-gray-400">{t('subtitle')}</p>

      <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-white/5 p-1 text-sm font-medium">
        <button
          type="button"
          onClick={() => { setMode('login'); setError(''); setMfaRequired(false); setMfaCode(''); }}
          className={`rounded-lg py-2 transition-colors ${mode === 'login' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
        >
          {t('bindExisting')}
        </button>
        <button
          type="button"
          onClick={() => { setMode('register'); setError(''); setMfaRequired(false); setMfaCode(''); }}
          className={`rounded-lg py-2 transition-colors ${mode === 'register' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
        >
          {t('registerNew')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bind-email" className="mb-1.5 block text-sm text-gray-400">{t('emailLabel')}</label>
          <input
            id="bind-email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            autoComplete="email"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-violet-500"
          />
        </div>

        {mode === 'register' && (
          <div>
            <label htmlFor="bind-name" className="mb-1.5 block text-sm text-gray-400">{t('nicknameLabel')}</label>
            <input
              id="bind-name"
              type="text"
              maxLength={30}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('nicknamePlaceholder')}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-violet-500"
            />
          </div>
        )}

        {mode === 'login' && (
          <div>
            <label htmlFor="bind-password" className="mb-1.5 block text-sm text-gray-400">{t('passwordLabel')}</label>
            <input
              id="bind-password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t('passwordPlaceholder')}
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-violet-500"
            />
          </div>
        )}

        {mfaRequired && (
          <div>
            <label htmlFor="bind-mfa" className="mb-1.5 block text-sm text-gray-400">{t('mfaLabel')}</label>
            <input
              id="bind-mfa"
              type="text"
              inputMode="numeric"
              required
              value={mfaCode}
              onChange={e => setMfaCode(e.target.value)}
              placeholder={t('mfaPlaceholder')}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-violet-500"
            />
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400" aria-live="polite">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
        >
          {loading ? t('processing') : mode === 'login' ? t('bindButton') : t('registerButton')}
        </button>
      </form>

      {mode === 'register' && (
        <p className="mt-4 text-xs leading-relaxed text-gray-500">{t('registerHint')}</p>
      )}
    </div>
  );
}

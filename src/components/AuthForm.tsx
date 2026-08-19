'use client';

import { useState, useCallback, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useAuth } from './AuthProvider';
import SliderCaptcha from './SliderCaptcha';

type Mode = 'login' | 'register';

interface PendingVerification {
  email: string;
  resendTicket: string;
  emailSent?: boolean;
}

/** MFA 挑战态：密码已验证，等用户输入动态码/恢复码 */
interface PendingMfa {
  ticket: string;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${'*'.repeat(Math.max(2, local.length - visible.length))}@${domain}`;
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
  );
}

export default function AuthForm({
  verified = false,
  wechatError = null,
  mfaChallenge = false,
}: {
  verified?: boolean;
  wechatError?: string | null;
  /** 微信扫码回调判定需要二次验证时重定向带 ?mfa=1；票在 httpOnly cookie 里 */
  mfaChallenge?: boolean;
}) {
  const t = useTranslations('LoginPage');
  const locale = useLocale();
  const wechatErrorKey =
    wechatError === 'unavailable'
      ? t('wechatUnavailable')
      : wechatError === 'invalid'
        ? t('wechatInvalid')
        : wechatError === 'unverified'
          ? t('wechatEmailUnverified')
          : wechatError === 'error'
            ? t('wechatError')
            : wechatError
              ? t('wechatError')
              : null;
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [captcha, setCaptcha] = useState<{ token: string } | null>(null);
  const [pendingVerification, setPendingVerification] = useState<PendingVerification | null>(null);
  // 初始态由服务端传入的 prop 决定，服务端与客户端首帧一致，不会 hydration 不匹配。
  // ticket 为空串表示「票在 httpOnly cookie 里，由服务端自己取」。
  const [pendingMfa, setPendingMfa] = useState<PendingMfa | null>(
    mfaChallenge ? { ticket: '' } : null,
  );
  const [mfaCode, setMfaCode] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const { login, register, resendVerification, verifyMfa, user } = useAuth();
  const router = useRouter();

  const handleCaptchaVerify = useCallback((data: { token: string }) => {
    setCaptcha(data);
  }, []);

  const handleResend = async () => {
    if (!pendingVerification || resending) return;
    setResending(true);
    setError('');
    const resendError = await resendVerification(pendingVerification.resendTicket);
    setResending(false);
    if (resendError) {
      setError(resendError);
      return;
    }
    setResent(true);
    setPendingVerification((current) => current ? { ...current, emailSent: true } : current);
  };

  const handleMfaSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!pendingMfa || loading) return;
    setError('');
    setLoading(true);
    const result = await verifyMfa(pendingMfa.ticket, mfaCode.trim(), rememberDevice);
    setLoading(false);
    if (result.error) {
      // 验证码错误或 ticket 过期：留在本页提示，用户可点「返回登录」重新走密码
      setError(result.error);
      setMfaCode('');
      return;
    }
    setPendingMfa(null);
    setMfaCode('');
    setPassword('');
    router.push('/');
  };

  if (user) {
    return (
      <div className="w-full max-w-sm text-center">
        <span className="mb-4 inline-block text-4xl">👋</span>
        <p className="mb-2 text-lg font-semibold">{t('loggedInAs', { name: user.name || user.email })}</p>
        <p className="mb-6 text-sm text-gray-400">{t('loggedInHint')}</p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
        >
          {t('backHome')}
        </Link>
      </div>
    );
  }

  if (pendingVerification) {
    return (
      <div className="w-full max-w-sm text-center" aria-live="polite">
        <span className="mb-4 inline-block text-4xl" aria-hidden>✉️</span>
        <h1 className="t-title-2 mb-3 text-white">{t('checkEmailTitle')}</h1>
        <p className="text-sm leading-relaxed text-gray-400">
          {pendingVerification.emailSent === true
            ? t('checkEmailSent')
            : pendingVerification.emailSent === false
              ? t('checkEmailSendFailed')
              : t('emailUnverified')}
        </p>
        <p className="mt-3 font-mono text-sm text-white/70">
          {maskEmail(pendingVerification.email)}
        </p>
        {resent && (
          <p className="mt-4 rounded-lg bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-400">
            {t('verificationResent')}
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={handleResend}
          disabled={resending || resent}
          className="mt-6 w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
        >
          {resending ? t('resendingVerification') : resent ? t('verificationResentButton') : t('resendVerification')}
        </button>
        <button
          type="button"
          onClick={() => {
            setPendingVerification(null);
            setMode('login');
            setError('');
            setResent(false);
          }}
          className="mt-4 text-sm text-gray-500 transition-colors hover:text-white"
        >
          {t('backToLogin')}
        </button>
      </div>
    );
  }

  if (pendingMfa) {
    return (
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-2xl font-bold">{t('mfaTitle')}</h1>
        <p className="mb-8 text-sm text-gray-400">{t('mfaSubtitle')}</p>
        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">{error}</p>
        )}
        <form onSubmit={handleMfaSubmit} className="space-y-4">
          <div>
            <label htmlFor="auth-mfa-code" className="mb-1.5 block text-sm font-medium text-gray-300">
              {t('mfaCodeLabel')}
            </label>
            <input
              id="auth-mfa-code"
              type="text"
              inputMode="text"
              autoComplete="one-time-code"
              required
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              placeholder={t('mfaCodePlaceholder')}
              autoFocus
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center font-mono text-lg tracking-widest text-white placeholder-gray-600 outline-none transition-colors focus:border-violet-500/50"
            />
            <p className="mt-2 text-center text-xs text-gray-600">{t('mfaRecoveryHint')}</p>
          </div>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-white/70">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/10 accent-violet-500"
            />
            <span>
              {t('mfaRememberDevice')}
              <span className="mt-0.5 block text-xs text-white/60">
                {t('mfaRememberDeviceHint')}
              </span>
            </span>
          </label>
          <button
            type="submit"
            disabled={loading || mfaCode.trim().length < 6}
            className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
          >
            {loading ? t('processing') : t('mfaVerifyButton')}
          </button>
        </form>
        <button
          type="button"
          onClick={() => {
            setPendingMfa(null);
            setMfaCode('');
            setError('');
            setPassword('');
          }}
          className="mt-4 w-full text-center text-sm text-gray-500 transition-colors hover:text-white"
        >
          {t('backToLogin')}
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && password !== confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    if (mode === 'register' && !captcha) {
      setError(t('captchaRequired'));
      return;
    }

    setLoading(true);

    const result = mode === 'login'
      ? await login(email, password)
      : await register(email, password, name || undefined, captcha ?? undefined);

    setLoading(false);

    if (result.verification) {
      setPendingVerification(result.verification);
      setPassword('');
      setConfirmPassword('');
      setCaptcha(null);
    } else if (result.mfa) {
      setPendingMfa({ ticket: result.mfa.ticket });
      setPassword('');
      setError('');
    } else if (result.error) {
      setError(result.error);
    } else {
      router.push('/');
    }
  };

  const inputClass = 'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-violet-500/50';

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
        <button
          type="button"
          onClick={() => { setMode('login'); setError(''); setConfirmPassword(''); setCaptcha(null); }}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            mode === 'login' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
          }`}
        >
          {t('loginButton')}
        </button>
        <button
          type="button"
          onClick={() => { setMode('register'); setError(''); }}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            mode === 'register' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
          }`}
        >
          {t('registerButton')}
        </button>
      </div>

      <h1 className="mb-2 text-2xl font-bold">
        {mode === 'login' ? t('welcomeBack') : t('createAccount')}
      </h1>
      <p className="mb-8 text-sm text-gray-400">
        {mode === 'login' ? t('loginSubtitle') : t('registerSubtitle')}
      </p>

      {verified && (
        <p className="mb-5 rounded-lg bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-400" role="status">
          {t('emailVerifiedSuccess')}
        </p>
      )}

      {wechatErrorKey && (
        <p className="mb-5 rounded-lg bg-amber-500/10 px-4 py-2.5 text-sm text-amber-400" role="alert">
          {wechatErrorKey}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label htmlFor="auth-name" className="mb-1.5 block text-sm font-medium text-gray-300">
              {t('nicknameLabel')} <span className="text-gray-600">{t('nicknameOptional')}</span>
            </label>
            <input
              id="auth-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('nicknamePlaceholder')}
              className={inputClass}
            />
          </div>
        )}

        <div>
          <label htmlFor="auth-email" className="mb-1.5 block text-sm font-medium text-gray-300">
            {t('emailLabel')}
          </label>
          <input
            id="auth-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="auth-password" className="mb-1.5 block text-sm font-medium text-gray-300">
            {t('passwordLabel')}
          </label>
          <div className="relative">
            <input
              id="auth-password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'register' ? t('passwordPlaceholderRegister') : t('passwordPlaceholderLogin')}
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
              aria-label={showPassword ? t('hidePassword') : t('showPassword')}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {mode === 'login' && (
            <div className="mt-2 text-right">
              <Link href="/forgot-password" className="text-xs text-violet-400 transition-colors hover:text-violet-300">
                {t('forgotPassword')}
              </Link>
            </div>
          )}
        </div>

        {mode === 'register' && (
          <div>
            <label htmlFor="auth-confirm" className="mb-1.5 block text-sm font-medium text-gray-300">
              {t('confirmPasswordLabel')}
            </label>
            <div className="relative">
              <input
                id="auth-confirm"
                type={showConfirm ? 'text' : 'password'}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('confirmPasswordPlaceholder')}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
                aria-label={showConfirm ? t('hidePassword') : t('showPassword')}
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>
          </div>
        )}

        {mode === 'register' && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">{t('captchaLabel')}</label>
            <SliderCaptcha onVerify={handleCaptchaVerify} />
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">{error}</p>
        )}

        {mode === 'register' && (
          <label className="flex items-start gap-2.5 text-xs leading-relaxed text-gray-400">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-violet-600"
            />
            <span>
              {t('agreeCheckboxPrefix')}{' '}
              <Link href="/terms" className="text-violet-400 hover:text-violet-300">{t('termsLink')}</Link>
              {t('agreeSep')}
              <Link href="/privacy" className="text-violet-400 hover:text-violet-300">{t('privacyLink')}</Link>
              {' '}{t('and')}{' '}
              <Link href="/eula" className="text-violet-400 hover:text-violet-300">{t('eulaLink')}</Link>
            </span>
          </label>
        )}

        <button
          type="submit"
          disabled={loading || (mode === 'register' && (!captcha || !agreed))}
          className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
        >
          {loading ? t('processing') : mode === 'login' ? t('loginButton') : t('registerButton')}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-gray-600">
        {mode === 'login' ? t('noAccount') : t('hasAccount')}
        <button
          type="button"
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setConfirmPassword(''); setCaptcha(null); }}
          className="ml-1 text-violet-400 hover:text-violet-300"
        >
          {mode === 'login' ? t('registerNow') : t('goLogin')}
        </button>
      </p>

      {mode === 'login' && (
        <div className="mt-6">
          <div className="mb-4 flex items-center gap-3 text-xs text-gray-600">
            <span className="h-px flex-1 bg-white/10" />
            {t('wechatOr')}
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <a
            href={`/api/auth/wechat?locale=${locale}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-3 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M9.5 3C5.36 3 2 5.86 2 9.39c0 2.02 1.06 3.82 2.72 5L4.2 16.9c-.14.5.43.9.87.58l2.93-1.75c.48.12.98.18 1.5.18.3 0 .6-.02.88-.05a5.5 5.5 0 0 1-.14-1.19c0-3.2 3.04-5.8 6.79-5.8.12 0 .23 0 .35.01C16.79 5.57 13.43 3 9.5 3zM7 7.36c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9zm5 0c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z"/>
              <path d="M22 13.67c0-3.07-2.97-5.57-6.63-5.57s-6.63 2.5-6.63 5.57 2.97 5.56 6.63 5.56c.6 0 1.18-.07 1.73-.2l2.6 1.55c.4.25.9-.07.78-.52l-.4-1.42A4.9 4.9 0 0 0 22 13.67zM12.96 12.1c-.42 0-.77-.34-.77-.76s.35-.76.77-.76.77.34.77.76-.35.76-.77.76zm4.85 0c-.42 0-.77-.34-.77-.76s.35-.76.77-.76.77.34.77.76-.34.76-.77.76z"/>
            </svg>
            {t('wechatLogin')}
          </a>
        </div>
      )}

      {mode === 'login' && (
        <div className="mt-8 border-t border-white/[0.06] pt-6">
          <p className="text-center text-xs text-gray-600">
            {t('agreePrefix')}{' '}
            <Link href="/terms" className="text-gray-400 hover:text-white">{t('termsLink')}</Link>
            {' '}{t('and')}{' '}
            <Link href="/privacy" className="text-gray-400 hover:text-white">{t('privacyLink')}</Link>
          </p>
        </div>
      )}
    </div>
  );
}

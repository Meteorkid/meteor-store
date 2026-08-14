'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import QRCode from 'qrcode';

type Step = 'loading' | 'disabled' | 'setup' | 'enabled';

interface SetupData {
  secret: string;
  otpauthUrl: string;
}

export default function AdminMfaManager() {
  const t = useTranslations('AdminMfaPage');
  const [step, setStep] = useState<Step>('loading');
  const [setup, setSetup] = useState<SetupData | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  // 拉取当前状态：setState 都在异步回调里
  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/mfa')
      .then(async (res) => {
        if (!res.ok) throw new Error('failed');
        return res.json();
      })
      .then((data: { enabled: boolean }) => {
        if (cancelled) return;
        setStep(data.enabled ? 'enabled' : 'disabled');
      })
      .catch(() => {
        if (!cancelled) setStep('disabled');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSetup = useCallback(async () => {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setup' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t('operationFailed'));
        return;
      }
      setSetup({ secret: data.secret, otpauthUrl: data.otpauthUrl });
      // 二维码本地生成，secret 不出浏览器
      const url = await QRCode.toDataURL(data.otpauthUrl, { margin: 1, width: 220 });
      setQrDataUrl(url);
      setStep('setup');
    } catch {
      setError(t('operationFailed'));
    } finally {
      setBusy(false);
    }
  }, [t]);

  const handleEnable = useCallback(async () => {
    if (!setup || busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'enable', code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t('operationFailed'));
        return;
      }
      setRecoveryCodes(data.recoveryCodes as string[]);
      setSetup(null);
      setQrDataUrl('');
      setCode('');
      setStep('enabled');
    } catch {
      setError(t('operationFailed'));
    } finally {
      setBusy(false);
    }
  }, [setup, code, busy, t]);

  const handleDisable = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disable', code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t('operationFailed'));
        return;
      }
      setCode('');
      setRecoveryCodes(null);
      setStep('disabled');
    } catch {
      setError(t('operationFailed'));
    } finally {
      setBusy(false);
    }
  }, [code, busy, t]);

  const handleCopySecret = useCallback(async () => {
    if (!setup) return;
    try {
      await navigator.clipboard.writeText(setup.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 剪贴板不可用时静默失败，用户可手动选中复制
    }
  }, [setup]);

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center font-mono text-lg tracking-widest text-white placeholder-gray-600 outline-none transition-colors focus:border-violet-500/50';

  if (step === 'loading') {
    return <p className="t-body text-white/50">{t('loading')}</p>;
  }

  return (
    <div className="mt-8 space-y-6">
      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">{error}</p>
      )}

      {step === 'disabled' && (
        <div className="glass-card rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
          <h2 className="t-title-4 text-white">{t('disabledTitle')}</h2>
          <p className="t-footnote mt-2 text-white/50">{t('disabledDesc')}</p>
          <button
            type="button"
            onClick={handleSetup}
            disabled={busy}
            className="mt-4 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
          >
            {busy ? t('processing') : t('startSetup')}
          </button>
        </div>
      )}

      {step === 'setup' && setup && (
        <div className="glass-card rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
          <h2 className="t-title-4 text-white">{t('setupTitle')}</h2>
          <p className="t-footnote mt-2 text-white/50">{t('setupScanHint')}</p>
          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {qrDataUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={qrDataUrl}
                alt={t('qrAlt')}
                width={220}
                height={220}
                className="rounded-xl border border-white/10 bg-white p-2"
              />
            )}
            <div className="w-full max-w-xs">
              <p className="t-footnote text-white/50">{t('manualEntryLabel')}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <code className="flex-1 break-all rounded-lg bg-white/5 px-3 py-2 font-mono text-xs text-white/80">
                  {setup.secret}
                </code>
                <button
                  type="button"
                  onClick={handleCopySecret}
                  className="shrink-0 rounded-lg bg-white/10 px-3 py-2 text-xs text-white/80 transition-colors hover:bg-white/20"
                >
                  {copied ? t('copied') : t('copy')}
                </button>
              </div>
              <label htmlFor="admin-mfa-enable-code" className="t-footnote mt-5 block text-white/50">
                {t('verifyCodeLabel')}
              </label>
              <input
                id="admin-mfa-enable-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
                placeholder="000000"
                className={`${inputClass} mt-1.5`}
              />
              <button
                type="button"
                onClick={handleEnable}
                disabled={busy || code.length !== 6}
                className="mt-3 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
              >
                {busy ? t('processing') : t('enableButton')}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'enabled' && (
        <div className="glass-card rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-6">
          <h2 className="t-title-4 text-emerald-300">{t('enabledTitle')}</h2>
          <p className="t-footnote mt-2 text-white/50">{t('enabledDesc')}</p>

          {recoveryCodes && (
            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4">
              <p className="t-footnote text-amber-300/90">{t('recoveryCodesTitle')}</p>
              <p className="t-footnote mt-1 text-white/50">{t('recoveryCodesWarning')}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {recoveryCodes.map((c) => (
                  <code
                    key={c}
                    className="rounded-lg bg-black/30 px-3 py-2 text-center font-mono text-sm text-amber-200"
                  >
                    {c}
                  </code>
                ))}
              </div>
            </div>
          )}

          <details className="mt-6">
            <summary className="cursor-pointer text-sm text-white/60 transition-colors hover:text-white">
              {t('disableSectionTitle')}
            </summary>
            <div className="mt-3 max-w-xs">
              <label htmlFor="admin-mfa-disable-code" className="t-footnote block text-white/50">
                {t('disableCodeLabel')}
              </label>
              <input
                id="admin-mfa-disable-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.trim().slice(0, 12))}
                placeholder={t('mfaCodeOrRecovery')}
                className={`${inputClass} mt-1.5`}
              />
              <button
                type="button"
                onClick={handleDisable}
                disabled={busy || code.length < 6}
                className="mt-3 w-full rounded-xl bg-red-600/80 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-50"
              >
                {busy ? t('processing') : t('disableButton')}
              </button>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import SoftwareLicenseList from './SoftwareLicenseList';
import type { SoftwareLicenseCodeView } from '@/lib/software-licenses/types';
import { useAuth } from './AuthProvider';

interface RedeemFormProps {
  /** 弹窗里用：外层已经有标题，表单不再自带 h1，避免一页两个 h1 */
  hideHeading?: boolean;
}

export default function RedeemForm({ hideHeading }: RedeemFormProps = {}) {
  const t = useTranslations('RedeemPage');
  const locale = useLocale() as Locale;
  const { user, loading: authLoading } = useAuth();
  const ownerId = !authLoading && user?.emailVerified ? user.id : undefined;
  const requestController = useRef<AbortController | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    userId: string;
    licenseKey: string;
    productId: string;
    /** 接口回传的双语产品名；老数据或产品已下架时为 null，回落到原始 id */
    productName: { zh: string; en: string } | null;
    planName: string;
    softwareLicenses?: SoftwareLicenseCodeView[];
    softwareDeliveryPending?: boolean;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => () => { requestController.current?.abort(); }, [ownerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerId) {
      setError(locale === 'en' ? 'Sign in and verify your email before redeeming.' : '请登录并验证邮箱后再兑换。');
      return;
    }
    setError('');
    setResult(null);
    setLoading(true);
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    const timeout = setTimeout(() => controller.abort(), 15_000);

    try {
      const res = await fetch('/api/invite/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Software-License-User': ownerId },
        signal: controller.signal,
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (controller.signal.aborted) return;
      if (data.userId !== ownerId) throw new Error(locale === 'en' ? 'Your account changed. Reload this page.' : '账号已变化，请刷新后重试。');
      setResult(data);
      setCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('redeemFailed'));
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  const copyKey = async () => {
    if (!result || result.userId !== ownerId) return;
    try {
      await navigator.clipboard.writeText(result.softwareLicenses?.length
        ? result.softwareLicenses.map(license => `${license.productName}: ${license.code}`).join('\n') : result.licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { setError(locale === 'en' ? 'Copy failed. Select and copy the code manually.' : '复制失败，请选中激活码后手动复制。'); }
  };

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-violet-500/50 font-mono tracking-wider text-center uppercase';

  if (result && result.userId === ownerId) {
    return (
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="text-4xl">&#127881;</div>
        <h2 className="t-title-2">{t('successTitle')}</h2>
        <p className="text-sm text-gray-400">
          {result.productName?.[locale] ?? result.productId} - {result.planName}
        </p>

        {result.softwareLicenses?.length ? <SoftwareLicenseList licenses={result.softwareLicenses} locale={locale} /> : result.softwareDeliveryPending ? (
          <p className="text-sm text-white/70">{locale === 'en' ? 'Your gift was redeemed. Retrieve the software codes from your account.' : '赠送权益已兑换成功，请到账户页领取软件激活码。'}</p>
        ) : <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-4">
          <p className="mb-2 text-xs text-gray-400">{t('yourLicenseKey')}</p>
          <p className="break-all font-mono text-lg font-semibold text-emerald-400">
            {result.licenseKey}
          </p>
        </div>}

        {!result.softwareDeliveryPending && <button
          type="button"
          onClick={copyKey}
          className="rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
        >
          {copied ? t('copied') : t('copyButton')}
        </button>}
        {(result.softwareLicenses?.length || result.softwareDeliveryPending) && <Link href="/account#software-licenses" className="block text-sm text-violet-300 underline">{locale === 'en' ? 'Manage licenses and devices' : '管理授权与设备'}</Link>}
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

        <button
          type="button"
          onClick={() => setResult(null)}
          className="block w-full text-sm text-gray-500 transition-colors hover:text-white"
        >
          {t('continueRedeem')}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      {!hideHeading && (
        <>
          <h1 className="mb-2 text-2xl font-bold">{t('title')}</h1>
          <p className="mb-8 text-sm text-gray-400">
            {t('description')}
          </p>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="invite-code" className="mb-1.5 block text-sm font-medium text-gray-300">
            {t('codeLabel')}
          </label>
          <input
            id="invite-code"
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="INV-XXXX-XXXX-XXXX"
            className={inputClass}
            autoComplete="off"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !code.trim() || !ownerId}
          className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
        >
          {loading ? t('redeeming') : t('redeemButton')}
        </button>
      </form>
    </div>
  );
}

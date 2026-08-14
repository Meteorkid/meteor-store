'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { runCancellableTask } from '@/lib/cancellable-task';
import { BLOG_API_SCOPES, type BlogApiScope, type TokenMetadata } from '@/lib/blog-api-contract';

const inputClass = 'w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-400/20';

function errorMessage(data: unknown, fallback: string, showServerMessage: boolean): string {
  if (!showServerMessage) return fallback;
  if (!data || typeof data !== 'object') return fallback;
  const error = 'error' in data ? data.error : undefined;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return fallback;
}

export default function BlogApiTokenManager() {
  const t = useTranslations('BlogApiTokenManager');
  const locale = useLocale();
  const [tokens, setTokens] = useState<TokenMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [scopes, setScopes] = useState<BlogApiScope[]>([...BLOG_API_SCOPES]);
  const [expiresInDays, setExpiresInDays] = useState(90);
  const [currentPassword, setCurrentPassword] = useState('');
  const [oneTimeToken, setOneTimeToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadTokens = async () => {
    const response = await fetch('/api/blog/tokens', { cache: 'no-store' });
    const data: unknown = await response.json();
    if (!response.ok || !data || typeof data !== 'object' || !('tokens' in data) || !Array.isArray(data.tokens)) {
      throw new Error(errorMessage(data, t('loadFailed'), locale === 'zh'));
    }
    return data.tokens as TokenMetadata[];
  };

  useEffect(() => {
    return runCancellableTask(loadTokens(), {
      onSuccess: (nextTokens) => setTokens(nextTokens),
      onError: (reason) => setError(reason instanceof Error ? reason.message : t('loadFailed')),
      onSettled: () => setLoading(false),
    });
    // 首次加载：翻译函数和请求地址在组件生命周期内稳定。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (value: string | null) => {
    if (!value) return t('neverUsed');
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  };

  const toggleScope = (scope: BlogApiScope) => {
    setScopes((current) => current.includes(scope)
      ? current.filter((item) => item !== scope)
      : [...current, scope]);
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);
    setError('');
    setNotice('');

    try {
      const response = await fetch('/api/blog/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, scopes, expiresInDays, currentPassword }),
      });
      const data: unknown = await response.json();
      if (!response.ok || !data || typeof data !== 'object' || !('token' in data) || typeof data.token !== 'string' || !('metadata' in data)) {
        throw new Error(errorMessage(data, t('createFailed'), locale === 'zh'));
      }

      setOneTimeToken(data.token);
      setTokens((current) => [data.metadata as TokenMetadata, ...current]);
      setName('');
      setCurrentPassword('');
      setNotice(t('created'));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t('createFailed'));
    } finally {
      setCreating(false);
    }
  };

  const copyToken = async () => {
    if (!oneTimeToken) return;
    setError('');
    try {
      await navigator.clipboard.writeText(oneTimeToken);
      setNotice(t('copied'));
    } catch {
      setError(t('copyFailed'));
    }
  };

  const revokeToken = async (id: string) => {
    setRevokingId(id);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/blog/tokens/${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data: unknown = await response.json();
      if (!response.ok) {
        throw new Error(errorMessage(data, t('revokeFailed'), locale === 'zh'));
      }
      setTokens((current) => current.map((token) => token.id === id
        ? { ...token, status: 'revoked', revokedAt: new Date().toISOString() }
        : token));
      setNotice(t('revoked'));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t('revokeFailed'));
    } finally {
      setRevokingId(null);
    }
  };

  const status = (value: TokenMetadata['status']) => {
    const styles = {
      active: 'bg-emerald-500/15 text-emerald-300',
      expired: 'bg-amber-500/15 text-amber-300',
      revoked: 'bg-red-500/15 text-red-300',
      invalidated: 'bg-white/10 text-white/65',
    } as const;
    const labels = {
      active: t('statusActive'),
      expired: t('statusExpired'),
      revoked: t('statusRevoked'),
      invalidated: t('statusInvalidated'),
    } as const;
    return <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${styles[value]}`}>{labels[value]}</span>;
  };

  return (
    <section className="mb-10 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 md:p-9">
      <div className="mb-6">
        <h2 className="t-title-3 text-white/90">{t('title')}</h2>
        <p className="t-footnote mt-1.5 text-white/60">{t('description')}</p>
        <Link
          href="/blog/api-guide"
          className="t-footnote mt-2 inline-block text-violet-300 underline decoration-violet-300/35 underline-offset-4 transition-colors hover:text-violet-200"
        >
          {t('usageGuide')}
        </Link>
      </div>

      {oneTimeToken && (
        <div className="mb-6 rounded-2xl border border-amber-300/25 bg-amber-300/[0.08] p-4" role="status">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-amber-100">{t('oneTimeTitle')}</p>
              <p className="t-footnote mt-1 text-amber-100/75">{t('oneTimeHint')}</p>
            </div>
            <button type="button" onClick={() => setOneTimeToken(null)} className="text-sm text-amber-100/75 underline underline-offset-4 transition-colors hover:text-amber-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200">
              {t('closeToken')}
            </button>
          </div>
          <code className="mt-3 block break-all rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white select-all">{oneTimeToken}</code>
          <button type="button" onClick={copyToken} className="mt-3 rounded-xl border border-amber-100/30 px-3.5 py-2 text-sm font-semibold text-amber-50 transition-colors hover:bg-amber-100/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200">
            {t('copyToken')}
          </button>
          <div className="mt-4 border-t border-amber-100/15 pt-4">
            <p className="text-sm font-semibold text-amber-100/90">{t('howToUse')}</p>
            <div className="mt-3 space-y-3 text-sm text-amber-100/70">
              <div>
                <p className="font-semibold text-amber-100/90">{t('usageCodex')}</p>
                <p className="mt-0.5">{t('usageCodexDesc')}</p>
                <code className="mt-1.5 block break-all rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/80 select-all">{`export MSB_TOKEN="${oneTimeToken}"`}</code>
              </div>
              <div>
                <p className="font-semibold text-amber-100/90">{t('usageClaude')}</p>
                <p className="mt-0.5">{t('usageClaudeDesc')}</p>
                <code className="mt-1.5 block break-all rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/80 select-all">{`/login --api-key ${oneTimeToken}`}</code>
              </div>
              <div>
                <p className="font-semibold text-amber-100/90">{t('usageCurl')}</p>
                <code className="mt-1.5 block break-all rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/80 select-all">{`curl -H "Authorization: Bearer ${oneTimeToken}" https://www.imagentx.top/api/v1/blog/sections`}</code>
              </div>
              <p className="text-xs text-amber-100/50">
                {t('usageGuideLink')}{' '}
                <Link href="/blog/api-guide" className="underline decoration-amber-100/25 underline-offset-4 hover:text-amber-50">{t('usageGuideLabel')}</Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleCreate} className="rounded-2xl border border-white/[0.08] bg-black/15 p-4 sm:p-5">
        <h3 className="t-title-4 text-white/90">{t('createTitle')}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm text-white/75">{t('name')}</span>
            <input value={name} onChange={(event) => setName(event.target.value)} className={inputClass} maxLength={50} required placeholder={t('namePlaceholder')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-white/75">{t('expiresIn')}</span>
            <select value={expiresInDays} onChange={(event) => setExpiresInDays(Number(event.target.value))} className={inputClass}>
              <option value={30}>{t('days', { count: 30 })}</option>
              <option value={90}>{t('days', { count: 90 })}</option>
              <option value={365}>{t('days', { count: 365 })}</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-white/75">{t('currentPassword')}</span>
            <input value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className={inputClass} type="password" autoComplete="current-password" required />
          </label>
        </div>
        <fieldset className="mt-4">
          <legend className="text-sm text-white/75">{t('scopes')}</legend>
          <p className="t-footnote mt-1 text-white/55">{t('scopesHint')}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {BLOG_API_SCOPES.map((scope) => (
              <label key={scope} className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 text-sm text-white/80 transition-colors hover:bg-white/[0.05]">
                <input type="checkbox" checked={scopes.includes(scope)} onChange={() => toggleScope(scope)} className="mt-0.5 h-4 w-4 accent-violet-400" />
                <span><strong className="font-mono text-white/90">{scope}</strong><span className="mt-0.5 block text-xs text-white/55">{t(`scope${scope.slice(5).replace(/^./, (letter) => letter.toUpperCase())}`)}</span></span>
              </label>
            ))}
          </div>
        </fieldset>
        <button type="submit" disabled={creating || scopes.length === 0} className="mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          {creating ? t('creating') : t('create')}
        </button>
      </form>

      {(error || notice) && <p className={`t-footnote mt-4 ${error ? 'text-red-300' : 'text-emerald-300'}`} role={error ? 'alert' : 'status'}>{error || notice}</p>}

      <div className="mt-7">
        <h3 className="t-title-4 text-white/90">{t('listTitle')}</h3>
        {loading ? (
          <p className="t-footnote py-6 text-white/55" role="status">{t('loading')}</p>
        ) : tokens.length === 0 ? (
          <p className="t-footnote py-6 text-white/55">{t('empty')}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {tokens.map((token) => (
              <li key={token.id} className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white/90">{token.name}</p>
                    <p className="mt-1 break-all font-mono text-xs text-white/50">{token.tokenPrefix}…</p>
                  </div>
                  {status(token.status)}
                </div>
                <p className="t-footnote mt-3 break-words text-white/60">{token.scopes.join(' · ')}</p>
                <dl className="t-footnote mt-3 grid gap-x-4 gap-y-1 text-white/55 sm:grid-cols-3">
                  <div><dt className="inline text-white/40">{t('createdAt')}：</dt><dd className="inline">{formatDate(token.createdAt)}</dd></div>
                  <div><dt className="inline text-white/40">{t('expiresAt')}：</dt><dd className="inline">{formatDate(token.expiresAt)}</dd></div>
                  <div><dt className="inline text-white/40">{t('lastUsedAt')}：</dt><dd className="inline">{formatDate(token.lastUsedAt)}</dd></div>
                </dl>
                {token.status !== 'revoked' && (
                  <button type="button" disabled={revokingId === token.id} onClick={() => revokeToken(token.id)} className="mt-4 text-sm font-medium text-red-300 underline decoration-red-300/35 underline-offset-4 transition-colors hover:text-red-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-200 disabled:opacity-50">
                    {revokingId === token.id ? t('revoking') : t('revoke')}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

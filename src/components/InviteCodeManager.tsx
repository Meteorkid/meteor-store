'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { runCancellableTask } from '@/lib/cancellable-task';

interface InviteCode {
  id: string;
  code: string;
  productId: string;
  planId: string;
  planName: string;
  maxUses: number;
  usedCount: number;
  memo: string | null;
  expiresAt: string | null;
  createdBy: string;
  status: string;
  createdAt: string;
}

export default function InviteCodeManager() {
  const t = useTranslations('AdminInviteCodesPage');
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/invite-codes');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCodes(data.codes);
    } catch {
      setError(t('loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  // 首次挂载拉一次邀请码列表：内联 fetch + .then()，setState 都在异步回调里
  useEffect(() => {
    return runCancellableTask(
      fetch('/api/admin/invite-codes').then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      }),
      {
        onSuccess: (data) => setCodes(data.codes),
        onError: () => setError(t('loadFailed')),
        onSettled: () => setLoading(false),
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRevoke = async (id: string) => {
    setError('');
    try {
      const res = await fetch('/api/admin/invite-codes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'revoke' }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      fetchCodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('operationFailed'));
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setSuccess(t('copied', { code }));
    setTimeout(() => setSuccess(''), 2000);
  };

  const statusLabel = (s: string) => {
    if (s === 'active') return <span className="text-emerald-400">{t('statusActive')}</span>;
    if (s === 'exhausted') return <span className="text-amber-400">{t('statusExhausted')}</span>;
    return <span className="text-red-400">{t('statusRevoked')}</span>;
  };

  return (
    <div className="space-y-8">
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {success && <p className="text-sm text-emerald-400">{success}</p>}

      <div>
        <h2 className="t-title-3 mb-4">{t('createdTitle')}</h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
          </div>
        ) : codes.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">{t('empty')}</p>
        ) : (
          <div className="space-y-3">
            {codes.map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => copyCode(c.code)}
                  className="font-mono text-sm text-white transition-colors hover:text-violet-300"
                  title={t('copyHint')}
                >
                  {c.code}
                </button>
                <span className="text-xs text-gray-500">{c.productId} / {c.planName}</span>
                <span className="text-xs text-gray-500">
                  {c.usedCount}/{c.maxUses}
                </span>
                <span className="text-xs">{statusLabel(c.status)}</span>
                {c.memo && <span className="text-xs text-gray-600">{c.memo}</span>}
                {c.expiresAt && (
                  <span className="text-xs text-gray-600">
                    {new Date(c.expiresAt) < new Date() ? t('expired') : t('expiresOn', { date: new Date(c.expiresAt).toLocaleDateString() })}
                  </span>
                )}
                {c.status === 'active' && (
                  <button
                    type="button"
                    onClick={() => handleRevoke(c.id)}
                    className="ml-auto text-xs text-red-400/70 transition-colors hover:text-red-400"
                  >
                    {t('revoke')}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

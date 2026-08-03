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

interface ProductOption {
  id: string;
  name: string;
  plans: { id: string; name: string }[];
}

export default function InviteCodeManager({ products }: { products: ProductOption[] }) {
  const t = useTranslations('AdminInviteCodesPage');
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [productId, setProductId] = useState(products[0]?.id ?? '');
  const [planId, setPlanId] = useState(products[0]?.plans[0]?.id ?? '');
  const [maxUses, setMaxUses] = useState(1);
  const [memo, setMemo] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const selectedProduct = products.find((p) => p.id === productId);

  // 切换产品时重置套餐为该产品的第一个：渲染期调整状态，避免 effect 里同步 setState
  const [prevProductId, setPrevProductId] = useState(productId);
  if (productId !== prevProductId) {
    setPrevProductId(productId);
    if (selectedProduct) {
      setPlanId(selectedProduct.plans[0]?.id ?? '');
    }
  }

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/invite-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          planId,
          maxUses,
          memo: memo || undefined,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(t('createSuccess', { code: data.code }));
      setMemo('');
      fetchCodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('createFailed'));
    } finally {
      setCreating(false);
    }
  };

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

  const inputClass =
    'w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-violet-500/50';

  const statusLabel = (s: string) => {
    if (s === 'active') return <span className="text-emerald-400">{t('statusActive')}</span>;
    if (s === 'exhausted') return <span className="text-amber-400">{t('statusExhausted')}</span>;
    return <span className="text-red-400">{t('statusRevoked')}</span>;
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleCreate} className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="t-title-3 mb-4">{t('createTitle')}</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-gray-400">{t('product')}</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className={inputClass}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">{t('plan')}</label>
            <select
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              className={inputClass}
            >
              {(selectedProduct?.plans ?? []).map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">{t('maxUses')}</label>
            <input
              type="number"
              min={1}
              max={1000}
              value={maxUses}
              onChange={(e) => setMaxUses(parseInt(e.target.value) || 1)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">{t('expiresAt')} <span className="text-gray-600">{t('optional')}</span></label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-400">{t('memo')} <span className="text-gray-600">{t('optional')}</span></label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder={t('memoPlaceholder')}
            className={inputClass}
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {success && <p className="text-sm text-emerald-400">{success}</p>}

        <button
          type="submit"
          disabled={creating}
          className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
        >
          {creating ? t('creating') : t('generate')}
        </button>
      </form>

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

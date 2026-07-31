'use client';

import { useState, useEffect } from 'react';

interface InviteCode {
  id: string;
  code: string;
  productId: string;
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
  plans: string[];
}

export default function InviteCodeManager({ products }: { products: ProductOption[] }) {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [productId, setProductId] = useState(products[0]?.id ?? '');
  const [planName, setPlanName] = useState(products[0]?.plans[0] ?? '');
  const [maxUses, setMaxUses] = useState(1);
  const [memo, setMemo] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const selectedProduct = products.find((p) => p.id === productId);

  useEffect(() => {
    if (selectedProduct) {
      setPlanName(selectedProduct.plans[0] ?? '');
    }
  }, [productId, selectedProduct]);

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/invite-codes');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCodes(data.codes);
    } catch {
      setError('加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
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
          planName,
          maxUses,
          memo: memo || undefined,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(`邀请码已创建：${data.code}`);
      setMemo('');
      fetchCodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建失败');
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
      setError(err instanceof Error ? err.message : '操作失败');
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setSuccess(`已复制：${code}`);
    setTimeout(() => setSuccess(''), 2000);
  };

  const inputClass =
    'w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-violet-500/50';

  const statusLabel = (s: string) => {
    if (s === 'active') return <span className="text-emerald-400">可用</span>;
    if (s === 'exhausted') return <span className="text-amber-400">已用完</span>;
    return <span className="text-red-400">已撤销</span>;
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleCreate} className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="t-title-3 mb-4">创建邀请码</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-gray-400">产品</label>
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
            <label className="mb-1 block text-sm text-gray-400">套餐</label>
            <select
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className={inputClass}
            >
              {(selectedProduct?.plans ?? []).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">可用次数</label>
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
            <label className="mb-1 block text-sm text-gray-400">过期时间 <span className="text-gray-600">(选填)</span></label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-400">备注 <span className="text-gray-600">(选填)</span></label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="给谁用的"
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
          {creating ? '创建中...' : '生成邀请码'}
        </button>
      </form>

      <div>
        <h2 className="t-title-3 mb-4">已创建的邀请码</h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
          </div>
        ) : codes.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">还没有邀请码</p>
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
                  title="点击复制"
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
                    {new Date(c.expiresAt) < new Date() ? '已过期' : `${new Date(c.expiresAt).toLocaleDateString()} 到期`}
                  </span>
                )}
                {c.status === 'active' && (
                  <button
                    type="button"
                    onClick={() => handleRevoke(c.id)}
                    className="ml-auto text-xs text-red-400/70 transition-colors hover:text-red-400"
                  >
                    撤销
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

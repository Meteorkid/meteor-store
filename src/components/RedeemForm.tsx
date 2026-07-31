'use client';

import { useState } from 'react';

export default function RedeemForm() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    licenseKey: string;
    productId: string;
    planName: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch('/api/invite/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      setCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '兑换失败');
    } finally {
      setLoading(false);
    }
  };

  const copyKey = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-violet-500/50 font-mono tracking-wider text-center uppercase';

  if (result) {
    return (
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="text-4xl">&#127881;</div>
        <h2 className="t-title-2">兑换成功</h2>
        <p className="text-sm text-gray-400">
          {result.productId} - {result.planName}
        </p>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-4">
          <p className="mb-2 text-xs text-gray-400">你的授权码</p>
          <p className="break-all font-mono text-lg font-semibold text-emerald-400">
            {result.licenseKey}
          </p>
        </div>

        <button
          type="button"
          onClick={copyKey}
          className="rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
        >
          {copied ? '已复制' : '复制授权码'}
        </button>

        <button
          type="button"
          onClick={() => setResult(null)}
          className="block w-full text-sm text-gray-500 transition-colors hover:text-white"
        >
          继续兑换
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="mb-2 text-2xl font-bold">兑换邀请码</h1>
      <p className="mb-8 text-sm text-gray-400">
        输入邀请码获取软件授权
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="invite-code" className="mb-1.5 block text-sm font-medium text-gray-300">
            邀请码
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
          disabled={loading || !code.trim()}
          className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
        >
          {loading ? '兑换中...' : '兑换'}
        </button>
      </form>
    </div>
  );
}

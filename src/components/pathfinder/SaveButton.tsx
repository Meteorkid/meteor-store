'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

/**
 * 收藏按钮。
 *
 * 状态由父组件在服务端算好后传进来（`initialSaved`），点击时才发请求——
 * 挂载后再 fetch 一次状态会让列表页每张卡片各打一个请求，
 * 而机会库一页有 24 张卡。
 *
 * 未登录时不隐藏按钮：点了才提示要登录，比先藏起来更容易被发现。
 */
export default function SaveButton({
  itemId,
  initialSaved,
  signedIn,
  className = '',
}: {
  itemId: string;
  initialSaved: boolean;
  signedIn: boolean;
  className?: string;
}) {
  const t = useTranslations('PathfinderHub.saves');
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = () => {
    if (pending) return;
    if (!signedIn) {
      setError(t('loginRequired'));
      return;
    }
    setPending(true);
    setError(null);
    // 乐观更新：收藏是可逆的低风险操作，失败时回滚即可
    const next = !saved;
    setSaved(next);

    fetch('/api/pathfinder/saves', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(String(response.status));
        const data = await response.json();
        setSaved(Boolean(data.saved));
      })
      .catch(() => {
        setSaved(!next);
        setError(t('failed'));
      })
      .finally(() => setPending(false));
  };

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={saved}
        disabled={pending}
        className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
          saved
            ? 'border-violet-400/40 bg-violet-500/15 text-violet-100'
            : 'border-white/10 text-white/60 hover:bg-white/[0.05] hover:text-white'
        }`}
      >
        <span aria-hidden="true">{saved ? '★' : '☆'}</span>
        {saved ? t('saved') : t('save')}
      </button>
      {error && <span className="t-footnote text-amber-200">{error}</span>}
    </span>
  );
}

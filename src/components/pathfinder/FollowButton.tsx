'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { PathfinderDirectoryKind } from '@/lib/pathfinder/directory';

/**
 * 关注机构 / 主题。
 *
 * 关注本身不改变页面内容，它只是让用户在周报和收藏之外多一条回来的理由；
 * 所以按钮做得克制，成功后不跳转、不弹窗，只切换自身状态。
 */
export default function FollowButton({
  kind,
  value,
  initialFollowing,
  signedIn,
}: {
  kind: PathfinderDirectoryKind;
  value: string;
  initialFollowing: boolean;
  signedIn: boolean;
}) {
  const t = useTranslations('PathfinderHub.follows');
  const [following, setFollowing] = useState(initialFollowing);
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
    const next = !following;
    setFollowing(next);

    fetch('/api/pathfinder/follows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, value }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(String(response.status));
        const data = await response.json();
        setFollowing(Boolean(data.following));
      })
      .catch(() => {
        setFollowing(!next);
        setError(t('failed'));
      })
      .finally(() => setPending(false));
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={following}
        disabled={pending}
        className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
          following
            ? 'border-violet-400/40 bg-violet-500/15 text-violet-100'
            : 'border-white/10 text-white/80 hover:bg-white/[0.05] hover:text-white'
        }`}
      >
        {following ? t('following') : t('follow')}
      </button>
      {error && <span className="t-footnote text-amber-200">{error}</span>}
    </span>
  );
}

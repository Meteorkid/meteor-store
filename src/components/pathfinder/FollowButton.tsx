'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { buildLoginHref } from '@/lib/login-return';
import type { PathfinderDirectoryKind } from '@/lib/pathfinder/directory';
import { usePathfinderToggle } from './usePathfinderToggle';

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
  initialOwnerId,
}: {
  kind: PathfinderDirectoryKind;
  value: string;
  initialFollowing: boolean;
  initialOwnerId: string | null;
}) {
  const t = useTranslations('PathfinderHub.follows');
  const { value: following, disabled, error, toggle, refreshState } = usePathfinderToggle({
    initialOwnerId, initialValue: initialFollowing, targetKey: `${kind}:${value}`,
    endpoint: 'follows', responseField: 'following', payload: () => ({ kind, value }),
  });

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={following}
        disabled={disabled}
        className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
          following
            ? 'border-violet-400/40 bg-violet-500/15 text-violet-100'
            : 'border-white/10 text-white/80 hover:bg-white/[0.05] hover:text-white'
        }`}
      >
        {following ? t('following') : t('follow')}
      </button>
      {error && <span className="t-footnote text-amber-200" role="status">{error === 'login'
        ? <Link href={buildLoginHref(`/pathfinder/${kind === 'topic' ? 'topics' : 'organizations'}/${encodeURIComponent(value)}`)} className="inline-flex min-h-10 items-center underline underline-offset-4">{t('loginAction')}</Link>
        : error === 'changed' ? <>{t('sessionChanged')} <button type="button" onClick={refreshState} className="inline-flex min-h-10 items-center underline underline-offset-4">{t('refreshAction')}</button></>
          : t('failed')}</span>}
    </span>
  );
}

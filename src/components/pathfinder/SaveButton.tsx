'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { buildLoginHref } from '@/lib/login-return';
import { usePathfinderToggle } from './usePathfinderToggle';

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
  initialOwnerId,
  className = '',
}: {
  itemId: string;
  initialSaved: boolean;
  initialOwnerId: string | null;
  className?: string;
}) {
  const t = useTranslations('PathfinderHub.saves');
  const { value: saved, disabled, error, toggle, refreshState } = usePathfinderToggle({
    initialOwnerId, initialValue: initialSaved, targetKey: itemId,
    endpoint: 'saves', responseField: 'saved', payload: () => ({ itemId }),
  });

  return (
    <span className={`inline-flex flex-wrap items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={saved}
        disabled={disabled}
        className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
          saved
            ? 'border-violet-400/40 bg-violet-500/15 text-violet-100'
            : 'border-white/10 text-white/60 hover:bg-white/[0.05] hover:text-white'
        }`}
      >
        <span aria-hidden="true">{saved ? '★' : '☆'}</span>
        {saved ? t('saved') : t('save')}
      </button>
      {error && <span className="t-footnote text-amber-200" role="status">{error === 'login'
        ? <Link href={buildLoginHref(`/pathfinder/items/${itemId}`)} className="inline-flex min-h-10 items-center underline underline-offset-4">{t('loginAction')}</Link>
        : error === 'changed' ? <>{t('sessionChanged')} <button type="button" onClick={refreshState} className="inline-flex min-h-10 items-center underline underline-offset-4">{t('refreshAction')}</button></>
          : t('failed')}</span>}
    </span>
  );
}

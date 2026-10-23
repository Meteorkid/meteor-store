'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { buildLoginHref } from '@/lib/login-return';
import { usePathfinderToggle } from './usePathfinderToggle';

/**
 * 单条收藏的截止提醒开关。
 *
 * 与收藏分开：收藏是「我以后要看」，提醒是「到点叫我」。绑在一起的话，
 * 用户想关掉一条烦人的提醒就只能取消收藏，等于用丢掉线索换清静。
 */
export default function ReminderToggle({
  itemId,
  initialEnabled,
  initialOwnerId,
}: {
  itemId: string;
  initialEnabled: boolean;
  initialOwnerId: string;
}) {
  const t = useTranslations('PathfinderHub.saves');
  const { value: enabled, disabled, error, toggle, refreshState } = usePathfinderToggle({
    initialOwnerId, initialValue: initialEnabled, targetKey: itemId,
    endpoint: 'saves', responseField: 'remindDeadline', payload: next => ({ itemId, remindDeadline: next }),
  });

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <label className="inline-flex items-center gap-2 t-footnote text-white/60">
        <input
          type="checkbox"
          checked={enabled}
          onChange={toggle}
          disabled={disabled}
          className="h-4 w-4 accent-violet-500"
        />
        {t('remindMe')}
      </label>
      {error && <span className="t-footnote text-amber-200" role="status">{error === 'login'
        ? <Link href={buildLoginHref('/pathfinder/saved')} className="inline-flex min-h-10 items-center underline underline-offset-4">{t('loginAction')}</Link>
        : error === 'changed' ? <>{t('sessionChanged')} <button type="button" onClick={refreshState} className="inline-flex min-h-10 items-center underline underline-offset-4">{t('refreshAction')}</button></>
          : t('failed')}</span>}
    </span>
  );
}

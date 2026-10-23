'use client';

import { usePassStatus } from './usePassStatus';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function PassOwnedBadge() {
  const { status } = usePassStatus();
  const t = useTranslations('PassOwnedBadge');
  if (!status?.hasPass) return null;
  const planName = status.currentPlan ? t(status.currentPlan) : '';

  return (
    <div className="mx-auto mb-8 max-w-5xl rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] px-6 py-4 text-center">
      <p className="text-sm text-emerald-300">
        <span aria-hidden>✨ </span>
        {t('badge', { plan: planName })}
        <span aria-hidden> ✨</span>
      </p>
      <p className="mt-1 text-xs text-white/40">
        {t('hint')}{' '}
        <Link href="/pricing" className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300">
          {t('manageLink')}
        </Link>
      </p>
    </div>
  );
}

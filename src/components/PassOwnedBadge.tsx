'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function PassOwnedBadge() {
  const { user } = useAuth();
  const t = useTranslations('PassOwnedBadge');
  const [hasPass, setHasPass] = useState(false);
  const [planName, setPlanName] = useState('');

  useEffect(() => {
    if (!user) return;
    fetch('/api/pass/status')
      .then((r) => r.json())
      .then((d) => {
        if (d.hasPass) {
          setHasPass(true);
          setPlanName(d.currentPlan === 'monthly' ? t('monthly')
            : d.currentPlan === 'annual' ? t('annual')
            : d.currentPlan === 'lifetime' ? t('lifetime')
            : '');
        }
      })
      .catch(() => {});
  }, [user, t]);

  if (!hasPass) return null;

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

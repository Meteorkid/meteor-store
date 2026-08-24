'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

/**
 * 单条收藏的截止提醒开关。
 *
 * 与收藏分开：收藏是「我以后要看」，提醒是「到点叫我」。绑在一起的话，
 * 用户想关掉一条烦人的提醒就只能取消收藏，等于用丢掉线索换清静。
 */
export default function ReminderToggle({
  itemId,
  initialEnabled,
}: {
  itemId: string;
  initialEnabled: boolean;
}) {
  const t = useTranslations('PathfinderHub.saves');
  const [enabled, setEnabled] = useState(initialEnabled);
  const [pending, setPending] = useState(false);

  const toggle = () => {
    if (pending) return;
    const next = !enabled;
    setEnabled(next);
    setPending(true);

    fetch('/api/pathfinder/saves', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, remindDeadline: next }),
    })
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
      })
      .catch(() => setEnabled(!next))
      .finally(() => setPending(false));
  };

  return (
    <label className="inline-flex items-center gap-2 t-footnote text-white/60">
      <input
        type="checkbox"
        checked={enabled}
        onChange={toggle}
        disabled={pending}
        className="h-4 w-4 accent-violet-500"
      />
      {t('remindMe')}
    </label>
  );
}

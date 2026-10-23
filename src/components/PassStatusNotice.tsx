'use client';

import { useTranslations } from 'next-intl';

export default function PassStatusNotice({ error, onRetry }: {
  error: 'failed' | 'changed' | null;
  onRetry: () => void;
}) {
  const t = useTranslations('PassStatus');
  if (!error) return null;
  return <p role="status" className="my-3 text-sm text-amber-100">
    {t(error)}{' '}
    <button type="button" onClick={onRetry} className="min-h-11 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">
      {t(error === 'changed' ? 'reload' : 'retry')}
    </button>
  </p>;
}

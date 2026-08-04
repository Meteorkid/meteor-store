'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface FeedbackItem {
  id: string;
  email: string | null;
  type: string;
  content: string;
  status: string;
  resolverId: string | null;
  resolvedAt: string | null;
  createdAt: string;
}

export default function FeedbackManager({ initialFeedback }: { initialFeedback: FeedbackItem[] }) {
  const t = useTranslations('AdminFeedbackPage');
  const [items, setItems] = useState(initialFeedback);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const resolve = async (id: string, status: 'resolved' | 'dismissed') => {
    setBusy(id);
    setError('');
    try {
      const response = await fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t('operationFailed'));
      setItems((current) => current.map((item) => (
        item.id === id ? { ...item, status, resolvedAt: new Date().toISOString() } : item
      )));
    } catch (operationError) {
      setError(operationError instanceof Error ? operationError.message : t('operationFailed'));
    } finally {
      setBusy('');
    }
  };

  const statusLabels: Record<string, string> = {
    pending: t('statusPending'),
    resolved: t('statusResolved'),
    dismissed: t('statusDismissed'),
  };
  const typeLabels: Record<string, string> = {
    bug: t('typeBug'),
    feature: t('typeFeature'),
    question: t('typeQuestion'),
    other: t('typeOther'),
    'night-whisper': t('typeNightWhisper'),
  };

  if (items.length === 0) {
    return <p className="py-12 text-center text-sm text-white/45">{t('empty')}</p>;
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}
      {items.map((item) => (
        <article key={item.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/45">
            <span className="rounded-full bg-white/[0.06] px-2.5 py-1">{typeLabels[item.type] ?? item.type}</span>
            <span>{statusLabels[item.status] ?? item.status}</span>
            <span>{new Date(item.createdAt).toLocaleString()}</span>
            {item.email && <a href={`mailto:${item.email}`} className="text-violet-400 hover:text-violet-300">{item.email}</a>}
          </div>
          <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed text-white/75">{item.content}</p>
          {item.status === 'pending' && (
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                disabled={busy === item.id}
                onClick={() => resolve(item.id, 'dismissed')}
                className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/[0.06] disabled:opacity-50"
              >
                {t('dismiss')}
              </button>
              <button
                type="button"
                disabled={busy === item.id}
                onClick={() => resolve(item.id, 'resolved')}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
              >
                {busy === item.id ? t('processing') : t('resolve')}
              </button>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

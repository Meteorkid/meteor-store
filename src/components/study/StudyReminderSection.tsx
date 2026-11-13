'use client';

import { useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';

interface StudySummary {
  dueReviews: number;
  upcomingDeadlines: number;
}

const COPY = {
  zh: {
    title: '学习提醒',
    dueReviews: '{count} 道题今天待复习',
    dueReviewsOne: '1 道题今天待复习',
    upcomingDeadlines: '7 天内 {count} 项课程截止',
    upcomingDeadlinesOne: '7 天内 1 项课程截止',
    clear: '今天没有学习提醒。',
    open: '打开学习工作台',
    failed: '学习提醒读取失败，稍后重试。',
    retry: '重试',
  },
  en: {
    title: 'Study reminders',
    dueReviews: '{count} problems due for review',
    dueReviewsOne: '1 problem due for review',
    upcomingDeadlines: '{count} course deadlines within 7 days',
    upcomingDeadlinesOne: '1 course deadline within 7 days',
    clear: 'Nothing needs your attention today.',
    open: 'Open study workbench',
    failed: 'Study reminders could not be loaded. Try again later.',
    retry: 'Retry',
  },
} as const;

/**
 * 铃铛「提醒」标签里的学习分区。
 *
 * 只读聚合：打开提醒标签时拉一次摘要，不产生未读状态，
 * 不参与红点计数——与管理员监控分区同一约定。
 */
export default function StudyReminderSection({ userId, active, locale }: {
  userId: string | null;
  active: boolean;
  locale: 'zh' | 'en';
}) {
  const copy = COPY[locale];
  const [summary, setSummary] = useState<StudySummary | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const requestedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!active || !userId) return;
    const requestKey = `${userId}:${attempt}`;
    if (requestedRef.current === requestKey) return;
    requestedRef.current = requestKey;
    let cancelled = false;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    fetch('/api/study/summary', { cache: 'no-store', signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('Summary unavailable');
        const data = await response.json() as Partial<StudySummary>;
        if (cancelled) return;
        if (typeof data.dueReviews !== 'number' || typeof data.upcomingDeadlines !== 'number') {
          setFailed(true);
          return;
        }
        setSummary({ dueReviews: data.dueReviews, upcomingDeadlines: data.upcomingDeadlines });
      })
      .catch(() => { if (!cancelled) setFailed(true); })
      .finally(() => window.clearTimeout(timeout));
    return () => { cancelled = true; window.clearTimeout(timeout); controller.abort(); };
  }, [active, userId, attempt]);

  if (!userId) return null;

  return (
    <section className="border-b border-white/10 px-4 py-3" aria-label={copy.title}>
      <p className="t-title-4 text-white">{copy.title}</p>
      {failed ? (
        <p className="mt-1 t-footnote text-amber-200">
          {copy.failed}{' '}
          <button
            type="button"
            onClick={() => { setFailed(false); setAttempt(current => current + 1); }}
            className="inline-flex min-h-10 items-center underline underline-offset-4"
          >
            {copy.retry}
          </button>
        </p>
      ) : summary === null ? (
        <p className="mt-1 t-footnote text-white/60" aria-busy="true">…</p>
      ) : summary.dueReviews === 0 && summary.upcomingDeadlines === 0 ? (
        <p className="mt-1 t-footnote text-white/60">{copy.clear}</p>
      ) : (
        <ul className="mt-1 space-y-1">
          {summary.dueReviews > 0 && <li className="t-footnote text-white/80">{summary.dueReviews === 1
            ? copy.dueReviewsOne : copy.dueReviews.replace('{count}', String(summary.dueReviews))}</li>}
          {summary.upcomingDeadlines > 0 && <li className="t-footnote text-white/80">{summary.upcomingDeadlines === 1
            ? copy.upcomingDeadlinesOne : copy.upcomingDeadlines.replace('{count}', String(summary.upcomingDeadlines))}</li>}
        </ul>
      )}
      <Link href="/study" className="mt-2 inline-flex min-h-10 items-center t-footnote text-violet-200 underline underline-offset-4">
        {copy.open} →
      </Link>
    </section>
  );
}

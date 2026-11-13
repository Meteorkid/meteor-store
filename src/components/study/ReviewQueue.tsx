'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { buildLoginHref } from '@/lib/login-return';
import type { StudyProblem } from '@/lib/study/types';
import { reviewQueueText } from './text';

type RowError = 'login' | 'changed' | 'failed' | null;

const difficultyTone: Record<StudyProblem['difficulty'], string> = {
  easy: 'border-emerald-400/30 text-emerald-200',
  medium: 'border-amber-400/30 text-amber-200',
  hard: 'border-rose-400/30 text-rose-200',
};

/**
 * 今日复习队列。工作台与算法页共用。
 *
 * 记录结果后把该题从本地队列移除（它已不再到期），服务端数据由
 * router.refresh() 在调用方同步。失败分三类处理：未登录给登录入口、
 * 账号变化给刷新提示、其余允许原按钮重试——不能把失败伪装成已记录。
 */
export default function ReviewQueue({
  initialProblems,
  ownerId,
  locale,
  emptyText,
  onReviewed,
}: {
  initialProblems: StudyProblem[];
  ownerId: string;
  locale: 'zh' | 'en';
  emptyText?: string;
  onReviewed?: (problem: StudyProblem) => void;
}) {
  const copy = reviewQueueText[locale];
  const [problems, setProblems] = useState(initialProblems);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, RowError>>({});
  const [lastAttempt, setLastAttempt] = useState<Record<string, 'remembered' | 'forgot'>>({});

  const review = async (problem: StudyProblem, result: 'remembered' | 'forgot') => {
    if (pendingId) return;
    setPendingId(problem.id);
    setLastAttempt(current => ({ ...current, [problem.id]: result }));
    setErrors(current => ({ ...current, [problem.id]: null }));
    try {
      const response = await fetch('/api/study/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Study-User': ownerId },
        body: JSON.stringify({ id: problem.id, result }),
      });
      if (response.status === 401) { setErrors(current => ({ ...current, [problem.id]: 'login' })); return; }
      if (response.status === 409) { setErrors(current => ({ ...current, [problem.id]: 'changed' })); return; }
      if (!response.ok) throw new Error('Review failed');
      const data = await response.json() as { problem?: StudyProblem };
      if (!data.problem) throw new Error('Invalid review response');
      setProblems(current => current.filter(item => item.id !== problem.id));
      onReviewed?.(data.problem);
    } catch {
      setErrors(current => ({ ...current, [problem.id]: 'failed' }));
    } finally {
      setPendingId(null);
    }
  };

  if (problems.length === 0) {
    return <p className="t-footnote text-white/60">{emptyText ?? copy.empty}</p>;
  }

  return (
    <ul className="divide-y divide-white/10">
      {problems.map(problem => {
        const error = errors[problem.id] ?? null;
        const pending = pendingId === problem.id;
        return (
          <li key={problem.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <p className="t-title-4 text-white">
                {problem.url
                  ? <a href={problem.url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">{problem.title}<span aria-hidden="true"> ↗</span></a>
                  : problem.title}
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 t-footnote text-white/60">
                {problem.topic && <span>{problem.topic}</span>}
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 ${difficultyTone[problem.difficulty]}`}>
                  {problem.difficulty === 'easy' ? copy.difficultyEasy : problem.difficulty === 'medium' ? copy.difficultyMedium : copy.difficultyHard}
                </span>
                <span>{copy.interval.replace('{days}', String(problem.reviewIntervalDays))}</span>
              </p>
              {error && <p role="status" className="mt-1 t-footnote text-amber-200">
                {error === 'login'
                  ? <Link href={buildLoginHref('/study/algorithms')} className="inline-flex min-h-10 items-center underline underline-offset-4">{copy.login}</Link>
                  : error === 'changed'
                    ? <>{copy.sessionChanged} <button type="button" onClick={() => window.location.reload()} className="inline-flex min-h-10 items-center underline underline-offset-4">{copy.refresh}</button></>
                    : <>{copy.failed} <button type="button" onClick={() => void review(problem, lastAttempt[problem.id] ?? 'remembered')} className="inline-flex min-h-10 items-center underline underline-offset-4">{copy.retry}</button></>}
              </p>}
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => void review(problem, 'remembered')}
                disabled={pending}
                title={copy.rememberedHint}
                className="inline-flex min-h-11 items-center rounded-xl border border-emerald-400/30 bg-emerald-400/[0.08] px-4 text-sm font-semibold text-emerald-100 transition-colors hover:bg-emerald-400/[0.16] disabled:opacity-50"
              >
                {copy.remembered}
              </button>
              <button
                type="button"
                onClick={() => void review(problem, 'forgot')}
                disabled={pending}
                title={copy.forgotHint}
                className="inline-flex min-h-11 items-center rounded-xl border border-white/15 px-4 text-sm font-semibold text-white/80 transition-colors hover:bg-white/[0.06] disabled:opacity-50"
              >
                {copy.forgot}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

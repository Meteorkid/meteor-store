'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { PathfinderApiResponse, PathfinderPlanPhase } from '@/lib/pathfinder/plan-view';

const PHASE_TONES: Record<PathfinderPlanPhase, string> = {
  prepare: 'border-sky-400/25 bg-sky-500/10 text-sky-200',
  practice: 'border-violet-400/25 bg-violet-500/10 text-violet-200',
  'real-action': 'border-amber-400/25 bg-amber-500/10 text-amber-200',
  deliver: 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200',
  review: 'border-pink-400/25 bg-pink-500/10 text-pink-200',
};

export default function PathfinderPlanView({
  response,
  completedTaskIds,
  onToggleTask,
  onReset,
}: {
  response: PathfinderApiResponse;
  completedTaskIds: readonly string[];
  onToggleTask: (taskId: string) => void;
  onReset: () => void;
}) {
  const t = useTranslations('PathfinderHub.planResult');
  const locale = useLocale();

  if (response.kind === 'safety') {
    return (
      <section className="rounded-3xl border border-amber-300/20 bg-amber-500/10 p-6 sm:p-8" aria-live="polite">
        <p className="t-eyebrow text-amber-200">{t('safetyEyebrow')}</p>
        <h2 className="mt-3 t-title-2 text-white">{t('safetyTitle')}</h2>
        <p className="mt-4 t-body text-white/80">{response.message}</p>
        <ul className="mt-5 space-y-2">
          {response.actions.map((action) => (
            <li key={action} className="flex gap-3 text-sm leading-6 text-white/80">
              <span aria-hidden="true" className="text-amber-300">•</span>
              {action}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  const tasks = response.plan.weeks.flatMap((week) => week.tasks);
  const completed = tasks.filter((task) => completedTaskIds.includes(task.id)).length;
  const percent = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  return (
    <section id="pathfinder-result" className="scroll-mt-36" aria-live="polite">
      <header className="border-b border-white/10 pb-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-200">
            {t('deterministic')}
          </span>
          <span className="t-footnote text-white/60">{t('duration', { weeks: response.plan.durationWeeks })}</span>
        </div>
        <h2 className="mt-4 t-title-1 text-white">{response.plan.title}</h2>
        <p className="mt-4 max-w-3xl t-body text-white/60">{response.plan.summary}</p>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between gap-4 t-footnote text-white/60">
            <span>{t('progress', { completed, total: tasks.length })}</span>
            <span>{percent}%</span>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-label={t('progress', { completed, total: tasks.length })}
            aria-valuemin={0}
            aria-valuemax={tasks.length}
            aria-valuenow={completed}
          >
            <div className="h-full rounded-full bg-violet-400 transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </header>

      {response.plan.warnings.length > 0 && (
        <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/[0.08] p-4">
          <p className="text-sm font-semibold text-amber-100">{t('warnings')}</p>
          <ul className="mt-2 space-y-1.5 text-sm leading-6 text-amber-100/80">
            {response.plan.warnings.map((warning) => <li key={warning}>• {warning}</li>)}
          </ul>
        </div>
      )}

      <div className="mt-2">
        {response.plan.weeks.map((week) => (
          <section key={week.week} className="border-b border-white/10 py-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-white/60">W{String(week.week).padStart(2, '0')}</span>
                  <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${PHASE_TONES[week.phase]}`}>
                    {t(`phases.${week.phase}`)}
                  </span>
                </div>
                <h3 className="mt-3 t-title-2 text-white">{week.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">{week.objective}</p>
              </div>
              <span className="t-footnote text-white/60">{t('minutes', { minutes: week.estimatedMinutes })}</span>
            </div>

            <ol className="mt-6 space-y-3">
              {week.tasks.map((task) => {
                const checked = completedTaskIds.includes(task.id);
                const deadlineValue = task.deadlineAt
                  ? new Date(task.deadlineAt)
                  : task.deadlineDate
                    ? new Date(`${task.deadlineDate}T00:00:00Z`)
                    : null;
                return (
                  <li key={task.id} className={`rounded-2xl border p-4 sm:p-5 ${checked ? 'border-emerald-400/20 bg-emerald-500/[0.06]' : 'border-white/10 bg-white/[0.025]'}`}>
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleTask(task.id)}
                        className="mt-1 h-4 w-4 shrink-0 accent-emerald-500"
                      />
                      <span className="min-w-0 flex-1">
                        <span className={`block text-sm font-semibold leading-6 ${checked ? 'text-white/60 line-through' : 'text-white'}`}>
                          {task.action}
                        </span>
                        <span className="mt-1 block t-footnote text-white/60">
                          {t('minutes', { minutes: task.estimatedMinutes })}
                          {deadlineValue && (
                            <> · <time dateTime={task.deadlineAt ?? task.deadlineDate}>{t('deadline', {
                              date: new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'zh-CN', {
                                year: 'numeric', month: 'short', day: 'numeric',
                                ...(task.deadlineDate && !task.deadlineAt ? { timeZone: 'UTC' } : {}),
                              }).format(deadlineValue),
                            })}</time></>
                          )}
                        </span>
                      </span>
                    </label>

                    <dl className="mt-4 grid grid-cols-1 gap-3 border-t border-white/[0.06] pt-4 sm:grid-cols-2">
                      <div>
                        <dt className="t-eyebrow text-white/60">{t('evidence')}</dt>
                        <dd className="mt-1 text-sm leading-6 text-white/70">{task.evidence}</dd>
                      </div>
                      <div>
                        <dt className="t-eyebrow text-white/60">{t('alternative')}</dt>
                        <dd className="mt-1 text-sm leading-6 text-white/70">{task.alternative}</dd>
                      </div>
                    </dl>
                    <Link href={`/pathfinder/items/${task.itemId}`} className="mt-4 inline-flex text-xs font-semibold text-violet-200 hover:text-violet-100">
                      {t('viewItem')} →
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <p className="t-footnote text-white/60">{t('savedLocally')}</p>
        <button type="button" onClick={onReset} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-white/20 hover:text-white/80">
          {t('reset')}
        </button>
      </div>
    </section>
  );
}

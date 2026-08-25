'use client';

import { useState } from 'react';

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

/**
 * 路径展示与编辑。
 *
 * 排序用上移/下移按钮而不是拖拽：拖拽必须另配一套键盘操作才可用，
 * 而按钮天然可聚焦、可用回车触发，读屏也能播报——这条路径页面的
 * 无障碍基线本来就要求键盘可完成核心流程。
 */
export default function PathfinderPlanView({
  response,
  completedTaskIds,
  pinnedTaskIds = [],
  canRegenerate = false,
  busyWeek = null,
  onToggleTask,
  onTogglePin,
  onMoveTask,
  onRemoveTask,
  onAddCustomTask,
  onRegenerateWeek,
  onReset,
}: {
  response: PathfinderApiResponse;
  completedTaskIds: readonly string[];
  pinnedTaskIds?: readonly string[];
  /** 没有原始画像时无法重跑生成，按钮禁用 */
  canRegenerate?: boolean;
  busyWeek?: number | null;
  onToggleTask: (taskId: string) => void;
  onTogglePin?: (taskId: string) => void;
  onMoveTask?: (taskId: string, direction: 'up' | 'down') => void;
  onRemoveTask?: (taskId: string) => void;
  onAddCustomTask?: (weekNumber: number, input: { action: string; estimatedMinutes: number }) => void;
  onRegenerateWeek?: (weekNumber: number) => void;
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

            {(onRegenerateWeek || onAddCustomTask) && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {onRegenerateWeek && (
                  <button
                    type="button"
                    onClick={() => onRegenerateWeek(week.week)}
                    disabled={!canRegenerate || busyWeek !== null}
                    title={canRegenerate ? undefined : t('regenerateUnavailable')}
                    className="inline-flex min-h-9 items-center rounded-lg border border-violet-400/25 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-100 transition-colors hover:bg-violet-500/20 disabled:opacity-40"
                  >
                    {busyWeek === week.week ? t('regenerating') : t('regenerateWeek')}
                  </button>
                )}
                {onAddCustomTask && (
                  <CustomTaskForm
                    weekNumber={week.week}
                    disabled={week.tasks.length >= 4}
                    onAdd={onAddCustomTask}
                    labels={{
                      open: t('addCustom'),
                      full: t('weekFull'),
                      action: t('customAction'),
                      minutes: t('customMinutes'),
                      submit: t('customSubmit'),
                      cancel: t('customCancel'),
                    }}
                  />
                )}
                {pinnedTaskIds.some((id) => week.tasks.some((task) => task.id === id)) && (
                  <span className="t-footnote text-amber-200/80">{t('pinnedHint')}</span>
                )}
              </div>
            )}

            <ol className="mt-6 space-y-3">
              {week.tasks.map((task, taskIndex) => {
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

                    {onMoveTask && onRemoveTask && onTogglePin && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3">
                        <button
                          type="button"
                          onClick={() => onTogglePin(task.id)}
                          aria-pressed={pinnedTaskIds.includes(task.id)}
                          className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                            pinnedTaskIds.includes(task.id)
                              ? 'border-amber-400/40 bg-amber-500/15 text-amber-100'
                              : 'border-white/10 text-white/60 hover:bg-white/[0.05]'
                          }`}
                        >
                          <span aria-hidden="true">{pinnedTaskIds.includes(task.id) ? '🔒' : '🔓'}</span>
                          {pinnedTaskIds.includes(task.id) ? t('pinned') : t('pin')}
                        </button>
                        <button
                          type="button"
                          onClick={() => onMoveTask(task.id, 'up')}
                          disabled={taskIndex === 0}
                          aria-label={t('moveUp')}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/60 transition-colors hover:bg-white/[0.05] disabled:opacity-30"
                        >
                          <span aria-hidden="true">↑</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onMoveTask(task.id, 'down')}
                          disabled={taskIndex === week.tasks.length - 1}
                          aria-label={t('moveDown')}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/60 transition-colors hover:bg-white/[0.05] disabled:opacity-30"
                        >
                          <span aria-hidden="true">↓</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveTask(task.id)}
                          disabled={week.tasks.length <= 1}
                          title={week.tasks.length <= 1 ? t('lastTaskHint') : undefined}
                          className="ml-auto inline-flex min-h-9 items-center rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-white/60 transition-colors hover:bg-white/[0.05] disabled:opacity-30"
                        >
                          {t('removeTask')}
                        </button>
                      </div>
                    )}

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

/**
 * 添加自定义任务的行内表单。
 *
 * 折叠在按钮后面：绝大多数时候用户只是看路径，一直摊开两个输入框会让
 * 每一周都多出一块与阅读无关的界面。
 */
function CustomTaskForm({
  weekNumber,
  disabled,
  onAdd,
  labels,
}: {
  weekNumber: number;
  disabled: boolean;
  onAdd: (weekNumber: number, input: { action: string; estimatedMinutes: number }) => void;
  labels: Record<'open' | 'full' | 'action' | 'minutes' | 'submit' | 'cancel', string>;
}) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState('');
  const [minutes, setMinutes] = useState(60);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        title={disabled ? labels.full : undefined}
        className="inline-flex min-h-9 items-center rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 transition-colors hover:bg-white/[0.05] disabled:opacity-40"
      >
        {labels.open}
      </button>
    );
  }

  return (
    <form
      className="flex w-full flex-wrap items-end gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (!action.trim()) return;
        onAdd(weekNumber, { action, estimatedMinutes: minutes });
        setAction('');
        setMinutes(60);
        setOpen(false);
      }}
    >
      <label className="min-w-0 flex-1">
        <span className="mb-1 block t-footnote text-white/60">{labels.action}</span>
        <input
          value={action}
          onChange={(event) => setAction(event.target.value)}
          maxLength={500}
          autoFocus
          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-violet-400/60"
        />
      </label>
      <label>
        <span className="mb-1 block t-footnote text-white/60">{labels.minutes}</span>
        <input
          type="number"
          value={minutes}
          min={5}
          max={1800}
          step={5}
          onChange={(event) => setMinutes(Number(event.target.value))}
          className="w-24 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-violet-400/60"
        />
      </label>
      <button type="submit" className="min-h-9 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white">
        {labels.submit}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="min-h-9 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60"
      >
        {labels.cancel}
      </button>
    </form>
  );
}

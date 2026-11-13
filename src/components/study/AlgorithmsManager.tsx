'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Link } from '@/i18n/navigation';
import { buildLoginHref } from '@/lib/login-return';
import { studyReviewDueLabel } from '@/lib/study/format';
import { dueReviewProblems } from '@/lib/study/review';
import type { StudyProblem, StudyProblemDifficulty } from '@/lib/study/types';
import ReviewQueue from './ReviewQueue';
import { algorithmsText } from './algorithms-text';

type Filter = 'all' | 'todo' | 'solved' | 'due';
type EditorTarget = { mode: 'create' } | { mode: 'edit'; id: string };
type ActionError =
  | { kind: 'login' }
  | { kind: 'changed' }
  | { kind: 'missing' }
  | { kind: 'failed'; retry: () => void }
  | null;

interface Draft {
  title: string;
  topic: string;
  difficulty: StudyProblemDifficulty;
  url: string;
  notes: string;
}

const EMPTY_DRAFT: Draft = { title: '', topic: '', difficulty: 'medium', url: '', notes: '' };

const inputClass = 'w-full rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-base text-white outline-none focus:border-violet-400';
const secondaryButton = 'inline-flex min-h-11 items-center rounded-xl border border-white/15 px-4 text-sm font-semibold text-white/85 transition-colors hover:bg-white/[0.06] disabled:opacity-50';
const primaryButton = 'inline-flex min-h-11 items-center rounded-xl border border-violet-400/40 bg-violet-500/[0.12] px-4 text-sm font-semibold text-violet-100 transition-colors hover:bg-violet-500/[0.2] disabled:opacity-50';

const difficultyTone: Record<StudyProblemDifficulty, string> = {
  easy: 'border-emerald-400/30 text-emerald-200',
  medium: 'border-amber-400/30 text-amber-200',
  hard: 'border-rose-400/30 text-rose-200',
};

/**
 * 算法训练管理器。
 *
 * 所有写操作都带 X-Study-User；失败分四类：未登录给登录入口、
 * 账号变化与记录已被删除给刷新提示、其余保留原操作并给重试按钮。
 * 今日复习队列由 dueReviewProblems 从本地列表推导——本地增删改后
 * 队列、统计和筛选自动保持一致，不需要另存一份队列状态。
 */
export default function AlgorithmsManager({
  initialProblems,
  userId,
  locale,
  today,
}: {
  initialProblems: StudyProblem[];
  userId: string;
  locale: 'zh' | 'en';
  today: string;
}) {
  const copy = algorithmsText[locale];
  const [problems, setProblems] = useState(initialProblems);
  const [filter, setFilter] = useState<Filter>('all');
  const [editor, setEditor] = useState<EditorTarget | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [actionError, setActionError] = useState<ActionError>(null);
  // busy 状态更新是异步的：快速双击会带着旧闭包进入两次请求，用 ref 同步挡掉。
  const busyRef = useRef(false);

  const dueProblems = dueReviewProblems(problems, today);
  const dueIds = new Set(dueProblems.map(problem => problem.id));
  const solvedCount = problems.filter(problem => problem.status === 'solved').length;
  const visible = problems.filter(problem => {
    if (filter === 'todo') return problem.status === 'todo';
    if (filter === 'solved') return problem.status === 'solved';
    if (filter === 'due') return dueIds.has(problem.id);
    return true;
  });
  const queueKey = dueProblems.map(problem => `${problem.id}@${problem.updatedAt}`).join('|');

  const replaceProblem = (updated: StudyProblem) => {
    setProblems(current => current.map(problem => problem.id === updated.id ? updated : problem));
  };
  const removeProblem = (id: string) => {
    setProblems(current => current.filter(problem => problem.id !== id));
  };

  async function send(method: 'POST' | 'PATCH' | 'DELETE', body: unknown) {
    try {
      const response = await fetch('/api/study/problems', {
        method,
        headers: { 'Content-Type': 'application/json', 'X-Study-User': userId },
        body: JSON.stringify(body),
      });
      if (!response.ok) return { ok: false as const, status: response.status };
      const data = await response.json() as { problem?: StudyProblem; success?: boolean };
      return { ok: true as const, data };
    } catch {
      return { ok: false as const, status: 0 };
    }
  }

  const handleFailure = (status: number, retry: () => void) => {
    if (status === 401) setActionError({ kind: 'login' });
    else if (status === 409) setActionError({ kind: 'changed' });
    else setActionError({ kind: 'failed', retry });
  };

  const submitDraft = async (target: EditorTarget, value: Draft) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setActionError(null);
    const payload = {
      title: value.title.trim(),
      topic: value.topic.trim(),
      difficulty: value.difficulty,
      url: value.url.trim() || null,
      notes: value.notes.trim() || null,
    };
    const result = target.mode === 'create'
      ? await send('POST', payload)
      : await send('PATCH', { id: target.id, ...payload });
    busyRef.current = false;
    setBusy(false);
    if (!result.ok) {
      if (result.status === 404 && target.mode === 'edit') {
        // 服务端已没有这条记录：本地同步移除，避免继续对着幽灵行重试。
        removeProblem(target.id);
        setEditor(null);
        setActionError({ kind: 'missing' });
        return;
      }
      handleFailure(result.status, () => void submitDraft(target, value));
      return;
    }
    const problem = result.data.problem;
    if (!problem) {
      handleFailure(0, () => void submitDraft(target, value));
      return;
    }
    if (target.mode === 'create') {
      setProblems(current => [problem, ...current]);
    } else {
      replaceProblem(problem);
    }
    setEditor(null);
    setFormError('');
  };

  const toggleStatus = async (problem: StudyProblem) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setActionError(null);
    const nextStatus = problem.status === 'solved' ? 'todo' : 'solved';
    const result = await send('PATCH', { id: problem.id, status: nextStatus });
    busyRef.current = false;
    setBusy(false);
    if (!result.ok) {
      handleFailure(result.status, () => void toggleStatus(problem));
      return;
    }
    const updated = result.data.problem;
    if (!updated) {
      handleFailure(0, () => void toggleStatus(problem));
      return;
    }
    replaceProblem(updated);
  };

  const deleteProblem = async (problem: StudyProblem) => {
    if (busyRef.current) return;
    if (!window.confirm(copy.deleteConfirm)) return;
    busyRef.current = true;
    setBusy(true);
    setActionError(null);
    const result = await send('DELETE', { id: problem.id });
    busyRef.current = false;
    setBusy(false);
    if (!result.ok) {
      handleFailure(result.status, () => void deleteProblem(problem));
      return;
    }
    if (result.data.success !== true) {
      // 服务端已没有这条记录：本地同步移除，避免对着幽灵行重试。
      removeProblem(problem.id);
      setActionError({ kind: 'missing' });
      return;
    }
    removeProblem(problem.id);
  };

  const openCreate = () => {
    setDraft(EMPTY_DRAFT);
    setEditor({ mode: 'create' });
    setFormError('');
    setActionError(null);
  };

  const openEdit = (problem: StudyProblem) => {
    setDraft({
      title: problem.title,
      topic: problem.topic,
      difficulty: problem.difficulty,
      url: problem.url ?? '',
      notes: problem.notes ?? '',
    });
    setEditor({ mode: 'edit', id: problem.id });
    setFormError('');
    setActionError(null);
  };

  const closeEditor = () => {
    setEditor(null);
    setFormError('');
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!editor || busy) return;
    if (!draft.title.trim()) {
      setFormError(copy.titleRequired);
      return;
    }
    const url = draft.url.trim();
    if (url && !/^https:\/\//i.test(url)) {
      setFormError(copy.urlInvalid);
      return;
    }
    setFormError('');
    void submitDraft(editor, draft);
  };

  const filters: Array<{ id: Filter; label: string; count: number }> = [
    { id: 'all', label: copy.filterAll, count: problems.length },
    { id: 'todo', label: copy.filterTodo, count: problems.length - solvedCount },
    { id: 'solved', label: copy.filterSolved, count: solvedCount },
    { id: 'due', label: copy.filterDue, count: dueProblems.length },
  ];

  return (
    <div className="space-y-10">
      <dl className="grid grid-cols-3 gap-3 sm:max-w-xl">
        {[
          { label: copy.statsTotal, value: problems.length },
          { label: copy.statsSolved, value: solvedCount },
          { label: copy.statsDue, value: dueProblems.length },
        ].map(item => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4">
            <dt className="t-footnote text-white/60">{item.label}</dt>
            <dd className="mt-1 t-title-3 tabular-nums text-white">{item.value}</dd>
          </div>
        ))}
      </dl>

      {actionError && (
        <p role="status" className="rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 t-footnote text-amber-100">
          {actionError.kind === 'login' && (
            <Link href={buildLoginHref('/study/algorithms')} className="inline-flex min-h-10 items-center underline underline-offset-4">{copy.login}</Link>
          )}
          {actionError.kind === 'changed' && (
            <>{copy.sessionChanged}{' '}
              <button type="button" onClick={() => window.location.reload()} className="inline-flex min-h-10 items-center underline underline-offset-4">{copy.refresh}</button></>
          )}
          {actionError.kind === 'missing' && (
            <>{copy.notFound}{' '}
              <button type="button" onClick={() => window.location.reload()} className="inline-flex min-h-10 items-center underline underline-offset-4">{copy.refresh}</button></>
          )}
          {actionError.kind === 'failed' && (
            <>{copy.actionFailed}{' '}
              <button type="button" onClick={actionError.retry} className="inline-flex min-h-10 items-center underline underline-offset-4">{copy.retryAction}</button></>
          )}
        </p>
      )}

      <section aria-labelledby="algorithm-review-title" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <h2 id="algorithm-review-title" className="t-title-3 text-white">{copy.queueTitle}</h2>
        <div className="mt-2">
          <ReviewQueue
            key={queueKey}
            initialProblems={dueProblems}
            ownerId={userId}
            locale={locale}
            emptyText={copy.queueEmpty}
            onReviewed={replaceProblem}
          />
        </div>
      </section>

      <section aria-labelledby="algorithm-list-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="algorithm-list-title" className="t-title-3 text-white">{copy.listTitle}</h2>
          <button type="button" onClick={openCreate} disabled={busy} className={primaryButton}>{copy.addProblem}</button>
        </div>

        {editor && (
          <form onSubmit={save} className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
            <h3 className="t-title-4 text-white">{editor.mode === 'create' ? copy.formCreate : copy.formEdit}</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5 text-sm text-white/70 sm:col-span-2">
                <span>{copy.fieldTitle} *</span>
                <input
                  className={inputClass}
                  value={draft.title}
                  maxLength={160}
                  required
                  autoFocus
                  placeholder={copy.titlePlaceholder}
                  onChange={event => setDraft(current => ({ ...current, title: event.target.value }))}
                />
              </label>
              <label className="block space-y-1.5 text-sm text-white/70">
                <span>{copy.fieldTopic}</span>
                <input
                  className={inputClass}
                  value={draft.topic}
                  maxLength={60}
                  placeholder={copy.topicPlaceholder}
                  onChange={event => setDraft(current => ({ ...current, topic: event.target.value }))}
                />
              </label>
              <label className="block space-y-1.5 text-sm text-white/70">
                <span>{copy.fieldDifficulty}</span>
                <select
                  className={inputClass}
                  value={draft.difficulty}
                  onChange={event => setDraft(current => ({ ...current, difficulty: event.target.value as StudyProblemDifficulty }))}
                >
                  <option value="easy">{copy.difficultyEasy}</option>
                  <option value="medium">{copy.difficultyMedium}</option>
                  <option value="hard">{copy.difficultyHard}</option>
                </select>
              </label>
              <label className="block space-y-1.5 text-sm text-white/70 sm:col-span-2">
                <span>{copy.fieldUrl}</span>
                <input
                  className={inputClass}
                  type="url"
                  value={draft.url}
                  maxLength={500}
                  placeholder={copy.urlPlaceholder}
                  onChange={event => setDraft(current => ({ ...current, url: event.target.value }))}
                />
              </label>
              <label className="block space-y-1.5 text-sm text-white/70 sm:col-span-2">
                <span>{copy.fieldNotes}</span>
                <textarea
                  className={inputClass}
                  rows={3}
                  value={draft.notes}
                  maxLength={2000}
                  placeholder={copy.notesPlaceholder}
                  onChange={event => setDraft(current => ({ ...current, notes: event.target.value }))}
                />
              </label>
            </div>
            {formError && <p role="alert" className="mt-3 t-footnote text-amber-200">{formError}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="submit" disabled={busy} className={primaryButton}>{busy ? copy.saving : copy.save}</button>
              <button type="button" onClick={closeEditor} disabled={busy} className={secondaryButton}>{copy.cancel}</button>
            </div>
          </form>
        )}

        <div role="group" aria-label={copy.filtersAria} className="mt-5 flex flex-wrap gap-2">
          {filters.map(item => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm transition-colors ${
                filter === item.id
                  ? 'border-violet-400/50 bg-violet-500/[0.12] font-semibold text-white'
                  : 'border-white/15 text-white/70 hover:bg-white/[0.05]'
              }`}
            >
              {item.label}<span className="tabular-nums text-white/50">{item.count}</span>
            </button>
          ))}
        </div>

        {problems.length === 0 ? (
          <p className="mt-6 t-footnote text-white/60">{copy.emptyAll}</p>
        ) : visible.length === 0 ? (
          <p className="mt-6 t-footnote text-white/60">{copy.emptyFilter}</p>
        ) : (
          <ul className="mt-2 divide-y divide-white/10">
            {visible.map(problem => (
              <li key={problem.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
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
                    <span>{problem.status === 'solved' ? copy.statusSolved : copy.statusTodo}</span>
                  </p>
                  {problem.status === 'solved' && (
                    <p className="mt-1 t-footnote text-white/60">
                      {problem.reviewDueOn
                        ? copy.nextReview.replace('{label}', studyReviewDueLabel(problem.reviewDueOn, locale, today))
                        : copy.notScheduled}
                      <span className="mx-2 text-white/30" aria-hidden="true">·</span>
                      {copy.stage.replace('{stage}', String(problem.reviewStage + 1)).replace('{days}', String(problem.reviewIntervalDays))}
                      {problem.lastReviewedOn && (
                        <>
                          <span className="mx-2 text-white/30" aria-hidden="true">·</span>
                          {copy.lastReviewed.replace('{date}', problem.lastReviewedOn)}
                        </>
                      )}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button type="button" onClick={() => void toggleStatus(problem)} disabled={busy} className={secondaryButton}>
                    {problem.status === 'solved' ? copy.markTodo : copy.markSolved}
                  </button>
                  <button type="button" onClick={() => openEdit(problem)} disabled={busy} className={secondaryButton}>{copy.edit}</button>
                  <button type="button" onClick={() => void deleteProblem(problem)} disabled={busy} className={secondaryButton}>{copy.delete}</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

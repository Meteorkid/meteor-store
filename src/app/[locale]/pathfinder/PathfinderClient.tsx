'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/AuthProvider';
import { assertPlanOwner, parseOwnedPlan, parseRemotePlan, planStorageKey, type OwnedPathfinderPlan } from '@/lib/pathfinder/plan-session';
import PathfinderForm, {
  type PathfinderFormValue,
  type PathfinderProfile,
} from '@/components/pathfinder/PathfinderForm';
import PathfinderPlanView from '@/components/pathfinder/PathfinderPlan';
import {
  PATHFINDER_PLAN_STORAGE_KEY,
  pathfinderScrollBehavior,
  parseStoredPathfinderPlan,
  type PathfinderApiResponse,
  withToggledTask,
} from '@/lib/pathfinder/plan-view';
import {
  addCustomTask,
  moveTask,
  pruneTaskIds,
  removeTask,
  replaceWeekTasks,
  withToggledPin,
  type CustomTaskInput,
} from '@/lib/pathfinder/plan-edit';
import type { PathfinderPlan } from '@/lib/pathfinder/schema';

interface PathfinderClientProps {
  preferredItemId?: string;
  preferredItemTitle?: string;
  initialDirection?: PathfinderProfile['direction'];
  initialGoalType?: PathfinderProfile['goalType'];
  locale: 'zh' | 'en';
}

export default function PathfinderClient(props: PathfinderClientProps) {
  const { user, loading, refresh } = useAuth();
  const t = useTranslations('PathfinderHub.planClient');
  const [checkingIdentity, setCheckingIdentity] = useState(false);
  useEffect(() => {
    let active = true;
    let pending = false;
    const check = () => {
      if (document.visibilityState === 'hidden' || pending) return;
      pending = true;
      setCheckingIdentity(true);
      void refresh().finally(() => { pending = false; if (active) setCheckingIdentity(false); });
    };
    window.addEventListener('focus', check);
    document.addEventListener('visibilitychange', check);
    return () => { active = false; window.removeEventListener('focus', check); document.removeEventListener('visibilitychange', check); };
  }, [refresh]);
  if (loading) return <p role="status" className="text-white/70">{t('loadingSaved')}</p>;
  const userId = user?.id ?? null;
  return <>
    {checkingIdentity && <p role="status" className="text-white/70">{t('loadingSaved')}</p>}
    <div hidden={checkingIdentity}>
      <PathfinderForIdentity key={userId === null ? 'guest' : `user:${userId}`} {...props} userId={userId} />
    </div>
  </>;
}

function PathfinderForIdentity({ preferredItemId, preferredItemTitle, initialDirection, initialGoalType, locale, userId }: PathfinderClientProps & { userId: string | null }) {
  const t = useTranslations('PathfinderHub.planClient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<PathfinderApiResponse | null>(null);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [pinnedTaskIds, setPinnedTaskIds] = useState<string[]>([]);
  const [busyWeek, setBusyWeek] = useState<number | null>(null);
  /*
   * 记住生成时用的画像：重新生成某一周需要原始输入，否则只能整份重来。
   * 用 state 而不是 ref——「能否重新生成」要参与渲染决定按钮禁用与否，
   * 而 React 19 禁止在渲染期读 ref，ref 变化也不会触发重渲染。
   */
  const [profile, setProfile] = useState<PathfinderFormValue | null>(null);
  const lifetime = useRef({ active: true, generation: 0 });
  const queue = useRef<Promise<void>>(Promise.resolve());
  const pendingWrite = useRef<{ method: 'PUT' | 'DELETE'; draft: OwnedPathfinderPlan | null; importOnly: boolean } | null>(null);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const [importDraft, setImportDraft] = useState<OwnedPathfinderPlan | null>(null);
  const [localFailed, setLocalFailed] = useState(false);
  const [planValidation, setPlanValidation] = useState<{
    generatedAt: string;
    stale: boolean;
  } | null>(null);

  useEffect(() => {
    const state = lifetime.current;
    state.active = true;
    return () => { state.active = false; state.generation += 1; };
  }, []);

  const applyDraft = useCallback((draft: OwnedPathfinderPlan | null) => {
    setResponse(draft?.response ?? null);
    setCompletedTaskIds(draft?.completedTaskIds ?? []);
    setPinnedTaskIds(draft?.pinnedTaskIds ?? []);
    setProfile(draft?.profile ?? null);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    const read = (key: string) => { try { return window.localStorage.getItem(key); } catch { return null; } };
    const local = parseOwnedPlan(read(planStorageKey(userId)), userId);
    const guest = userId ? parseOwnedPlan(read(planStorageKey(null)), null) : null;
    const legacy = parseStoredPathfinderPlan(read(PATHFINDER_PLAN_STORAGE_KEY));
    const candidate = guest ?? (legacy ? { ...legacy, version: 3 as const, userId: null, pinnedTaskIds: [], profile: null } : null);
    const initialize = async () => {
      await Promise.resolve();
      try {
        if (userId === null) {
          if (cancelled) return;
          applyDraft(local);
          if (!local) setImportDraft(candidate);
        } else {
          const result = await fetch('/api/pathfinder/plan/saved', { cache: 'no-store', signal: controller.signal });
          if (!result.ok) throw new Error('Saved plan unavailable');
          const remote = parseRemotePlan(await result.json(), userId);
          if (cancelled) return;
          applyDraft(remote);
          // 没有云端计划也不自动认领其他身份的草稿。
          if (!remote) setImportDraft(local ?? candidate);
        }
        setLoadState('ready');
      } catch {
        if (cancelled) return;
        applyDraft(local);
        setLoadState('failed');
      }
    };
    void initialize();
    return () => { cancelled = true; controller.abort(); };
  }, [userId, loadAttempt, applyDraft]);

  useEffect(() => {
    if (response?.kind !== 'plan') return;
    const generatedAt = response.plan.generatedAt;
    const itemIds = [...new Set(response.plan.weeks.flatMap((week) => (
      week.tasks.map((task) => task.itemId)
    )))];
    const controller = new AbortController();
    const params = new URLSearchParams({
      ids: itemIds.join(','),
      learning: 'true',
      limit: String(Math.max(1, itemIds.length)),
    });
    fetch(`/api/pathfinder/items?${params}`, { cache: 'no-store', signal: controller.signal })
      .then(async (result) => result.ok ? result.json() : null)
      .then((payload) => {
        if (controller.signal.aborted || !payload || !Array.isArray(payload.items)) return;
        const currentIds = new Set(payload.items.map((item: { id?: unknown }) => item.id));
        setPlanValidation({
          generatedAt,
          stale: itemIds.some((id) => !currentIds.has(id)),
        });
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [response]);

  const writeCloud = useCallback((operation: NonNullable<typeof pendingWrite.current>) => {
    if (!userId || !lifetime.current.active) return Promise.resolve(false);
    pendingWrite.current = operation;
    setSaveState('saving');
    let success = false;
    const work = queue.current.then(async () => {
      if (!lifetime.current.active) return;
      try {
        const draft = operation.draft;
        const result = await fetch('/api/pathfinder/plan/saved', {
          method: operation.method,
          headers: { 'Content-Type': 'application/json', 'X-Pathfinder-User': userId },
          ...(draft?.response.kind === 'plan' ? { body: JSON.stringify({
            plan: draft.response.plan, completedTaskIds: draft.completedTaskIds,
            pinnedTaskIds: draft.pinnedTaskIds, profile: draft.profile, importOnly: operation.importOnly,
          }) } : {}),
        });
        if (!result.ok) throw new Error('Save failed');
        const data: unknown = await result.json();
        assertPlanOwner(data, userId);
        if (operation.method === 'DELETE' && data.ok !== true) throw new Error('Delete failed');
        if (operation.method === 'PUT') parseRemotePlan(data, userId);
        success = true;
        if (!lifetime.current.active) return;
        if (pendingWrite.current === operation) { pendingWrite.current = null; setSaveState('saved'); }
      } catch {
        if (lifetime.current.active && pendingWrite.current === operation) setSaveState('failed');
      }
    });
    queue.current = work;
    return work.then(() => success);
  }, [userId]);

  const storeLocal = useCallback((draft: OwnedPathfinderPlan) => {
    try { window.localStorage.setItem(planStorageKey(userId), JSON.stringify(draft)); setLocalFailed(false); }
    catch { setLocalFailed(true); }
  }, [userId]);

  const persist = useCallback((
    nextResponse: PathfinderApiResponse,
    nextCompleted: string[],
    nextPinned: string[] = pinnedTaskIds,
    nextProfile = profile,
  ) => {
    if (!lifetime.current.active || loadState !== 'ready') return;
    const draft: OwnedPathfinderPlan = { version: 3, userId, savedAt: new Date().toISOString(),
      response: nextResponse, completedTaskIds: nextCompleted, pinnedTaskIds: nextPinned, profile: nextProfile };
    storeLocal(draft);
    if (userId && nextResponse.kind === 'plan') void writeCloud({ method: 'PUT', draft, importOnly: false });
  }, [userId, pinnedTaskIds, profile, loadState, storeLocal, writeCloud]);

  const importPrevious = async () => {
    if (!importDraft || loadState !== 'ready' || saveState === 'saving' || loading || busyWeek !== null) return;
    const operation = ++lifetime.current.generation;
    const draft = { ...importDraft, userId, savedAt: new Date().toISOString() };
    if (userId && draft.response.kind === 'plan' && !await writeCloud({ method: 'PUT', draft, importOnly: true })) return;
    if (!lifetime.current.active || operation !== lifetime.current.generation) return;
    storeLocal(draft);
    applyDraft(draft);
    setImportDraft(null);
  };

  /** 用编辑后的路径整体替换当前状态，并清掉指向已消失任务的 id。 */
  const applyPlan = useCallback((nextPlan: PathfinderPlan) => {
    if (!lifetime.current.active || loadState !== 'ready') return;
    const nextResponse: PathfinderApiResponse = {
      kind: 'plan', source: 'deterministic', plan: nextPlan,
    };
    const nextCompleted = pruneTaskIds(nextPlan, completedTaskIds);
    const nextPinned = pruneTaskIds(nextPlan, pinnedTaskIds);
    setResponse(nextResponse);
    setCompletedTaskIds(nextCompleted);
    setPinnedTaskIds(nextPinned);
    persist(nextResponse, nextCompleted, nextPinned);
  }, [completedTaskIds, pinnedTaskIds, persist, loadState]);

  const currentPlan = response?.kind === 'plan' ? response.plan : null;

  const editMove = (taskId: string, direction: 'up' | 'down') => {
    if (currentPlan) applyPlan(moveTask(currentPlan, taskId, direction));
  };

  const editRemove = (taskId: string) => {
    if (currentPlan) applyPlan(removeTask(currentPlan, taskId));
  };

  const editAddCustom = (weekNumber: number, input: CustomTaskInput) => {
    if (!currentPlan) return;
    // id 用时间戳后缀，保证同一周内多次添加不会撞 id
    applyPlan(addCustomTask(currentPlan, weekNumber, input, String(Date.now())));
  };

  const editTogglePin = (taskId: string) => {
    if (!response || loadState !== 'ready') return;
    setPinnedTaskIds((current) => {
      const next = withToggledPin(current, taskId);
      persist(response, completedTaskIds, next);
      return next;
    });
  };

  /**
   * 重新生成某一周：拿原始画像重跑一次生成，只取那一周的任务。
   *
   * 锁定的任务由 replaceWeekTasks 原样保留，新任务填补剩余名额。
   * 没有画像时（老数据或未登录且没生成过）无法重跑，按钮会被禁用。
   */
  const regenerateWeek = async (weekNumber: number) => {
    if (!currentPlan || !profile || busyWeek !== null || loading || saveState === 'saving' || loadState !== 'ready') return;
    const operation = ++lifetime.current.generation;
    setBusyWeek(weekNumber);
    setError(null);
    try {
      const result = await fetch('/api/pathfinder/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, locale }),
      });
      const data = await result.json();
      if (!lifetime.current.active || operation !== lifetime.current.generation) return;
      if (!result.ok || data?.kind !== 'plan') {
        setError(data?.error?.message ?? data?.error ?? t('requestError', { status: result.status }));
        return;
      }
      const freshWeek = (data.plan as PathfinderPlan).weeks
        .find((week) => week.week === weekNumber);
      if (!freshWeek) return;
      applyPlan(replaceWeekTasks(currentPlan, weekNumber, freshWeek.tasks, pinnedTaskIds));
    } catch {
      if (lifetime.current.active && operation === lifetime.current.generation) setError(t('networkError'));
    } finally {
      if (lifetime.current.active && operation === lifetime.current.generation) setBusyWeek(null);
    }
  };

  const submit = async (value: PathfinderFormValue) => {
    if (loadState !== 'ready' || loading || busyWeek !== null || saveState === 'saving') return;
    const operation = ++lifetime.current.generation;
    setLoading(true);
    setError(null);
    setResponse(null);
    setCompletedTaskIds([]);
    setPlanValidation(null);
    try {
      const result = await fetch('/api/pathfinder/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...value, locale }),
      });
      const data = await result.json();
      if (!lifetime.current.active || operation !== lifetime.current.generation) return;
      if (!result.ok) {
        setError(data?.error?.message ?? data?.error ?? t('requestError', { status: result.status }));
        return;
      }
      const nextResponse = data as PathfinderApiResponse;
      setProfile(value);
      setResponse(nextResponse);
      setCompletedTaskIds([]);
      setPinnedTaskIds([]);
      persist(nextResponse, [], [], value);
      setImportDraft(null);
      window.setTimeout(() => {
        if (!lifetime.current.active || operation !== lifetime.current.generation) return;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.getElementById('pathfinder-result')?.scrollIntoView({
          behavior: pathfinderScrollBehavior(reducedMotion),
          block: 'start',
        });
      }, 80);
    } catch {
      if (lifetime.current.active && operation === lifetime.current.generation) setError(t('networkError'));
    } finally {
      if (lifetime.current.active && operation === lifetime.current.generation) setLoading(false);
    }
  };

  const toggleTask = (taskId: string) => {
    if (!response || loadState !== 'ready') return;
    setCompletedTaskIds((current) => {
      const next = withToggledTask(current, taskId);
      persist(response, next, pinnedTaskIds);
      return next;
    });
  };

  const reset = () => {
    if (loadState !== 'ready') return;
    lifetime.current.generation += 1;
    setLoading(false);
    setBusyWeek(null);
    try {
      window.localStorage.removeItem(planStorageKey(userId));
    } catch {
      // 当前页面状态仍可正常清空。
    }
    if (userId) void writeCloud({ method: 'DELETE', draft: null, importOnly: false });
    setProfile(null);
    setResponse(null);
    setCompletedTaskIds([]);
    setPinnedTaskIds([]);
    setPlanValidation(null);
    setError(null);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: pathfinderScrollBehavior(reducedMotion) });
  };

  return (
    <div>
      {loadState !== 'ready' && <div role="status" className="mb-5 rounded-xl border border-white/15 p-4 text-white/80">
        {t(loadState === 'loading' ? 'loadingSaved' : 'loadFailed')}
        {loadState === 'failed' && <button type="button" className="ml-3 min-h-11 underline" onClick={() => { setLoadState('loading'); setLoadAttempt(value => value + 1); }}>{t('retry')}</button>}
      </div>}
      {!response && importDraft && loadState === 'ready' && <div className="mb-5 rounded-xl border border-amber-300/20 p-4 text-white/80">
        <p>{t('importHint')}</p><p className="mt-1 text-sm text-white/60">{t(userId ? 'importToAccount' : 'importToGuest')}</p>
        <button type="button" disabled={saveState === 'saving' || loading || busyWeek !== null} onClick={() => void importPrevious()} className="mt-2 min-h-11 rounded-lg border border-white/20 px-4">{t('confirmImport')}</button>
      </div>}
      {saveState !== 'idle' && <p role="status" className="mb-4 text-sm text-white/70">{t(saveState === 'saving' ? 'saving' : saveState === 'saved' ? 'saved' : 'saveFailed')}
        {saveState === 'failed' && <button type="button" className="ml-3 min-h-11 underline" onClick={() => { const operation = pendingWrite.current; if (operation) { if (operation.importOnly) void importPrevious(); else void writeCloud(operation); } }}>{t('retry')}</button>}
      </p>}
      {localFailed && <p role="status" className="mb-4 text-sm text-amber-200">{t('localFailed')}</p>}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <PathfinderForm
          preferredItemId={preferredItemId}
          preferredItemTitle={preferredItemTitle}
          initialDirection={initialDirection}
          initialGoalType={initialGoalType}
          loading={loading || busyWeek !== null || loadState !== 'ready' || saveState === 'saving'}
          onSubmit={submit}
        />
        <aside className="space-y-5">
          <div className="glass rounded-2xl p-5">
            <p className="t-eyebrow text-violet-300">{t('howEyebrow')}</p>
            <h2 className="mt-2 t-title-4 text-white">{t('howTitle')}</h2>
            <ol className="mt-4 space-y-4">
              {[1, 2, 3].map((step) => (
                <li key={step} className="flex gap-3 text-sm leading-6 text-white/60">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/10 text-[11px] text-white/80">{step}</span>
                  {t(`steps.${step}`)}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-white/10 p-5">
            <p className="text-sm font-semibold text-white">{t('trustTitle')}</p>
            <p className="mt-2 text-sm leading-6 text-white/60">{t('trustDescription')}</p>
          </div>
        </aside>
      </div>

      {loading && <p role="status" className="mt-5 text-center text-sm text-white/60">{t('loading')}</p>}
      {error && !loading && (
        <p role="alert" className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200">
          {error}
        </p>
      )}

      {response && (
        <div className="mt-14 sm:mt-20">
          {response.kind === 'plan'
            && planValidation?.generatedAt === response.plan.generatedAt
            && planValidation.stale && (
            <p role="alert" className="mb-5 rounded-2xl border border-amber-400/20 bg-amber-500/[0.08] px-4 py-3 text-sm leading-6 text-amber-100">
              {t('stalePlan')}
            </p>
          )}
          <PathfinderPlanView
            response={response}
            completedTaskIds={completedTaskIds}
            pinnedTaskIds={pinnedTaskIds}
            canRegenerate={profile !== null && loadState === 'ready'}
            busyWeek={busyWeek}
            onToggleTask={toggleTask}
            onTogglePin={editTogglePin}
            onMoveTask={editMove}
            onRemoveTask={editRemove}
            onAddCustomTask={editAddCustom}
            onRegenerateWeek={regenerateWeek}
            onReset={reset}
          />
        </div>
      )}
    </div>
  );
}

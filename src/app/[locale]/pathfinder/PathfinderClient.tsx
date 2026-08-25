'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
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
  type StoredPathfinderPlan,
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

export default function PathfinderClient({
  preferredItemId,
  preferredItemTitle,
  initialDirection,
  initialGoalType,
  locale,
}: {
  preferredItemId?: string;
  preferredItemTitle?: string;
  initialDirection?: PathfinderProfile['direction'];
  initialGoalType?: PathfinderProfile['goalType'];
  locale: 'zh' | 'en';
}) {
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
  // 登录用户以服务端为准；未登录退回浏览器本地存储
  const signedInRef = useRef(false);
  const [planValidation, setPlanValidation] = useState<{
    generatedAt: string;
    stale: boolean;
  } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let localStored: StoredPathfinderPlan | null = null;
    try {
      localStored = parseStoredPathfinderPlan(
        window.localStorage.getItem(PATHFINDER_PLAN_STORAGE_KEY),
      );
    } catch {
      localStored = null;
    }

    /*
     * 路径跟账号走，但未登录用户仍要能用，所以两处存储都保留：
     * 服务端有就以服务端为准；服务端没有而本地有（老用户第一次登录），
     * 把本地那份迁上去——直接丢掉等于让人凭空少一份已经在用的路径。
     */
    fetch('/api/pathfinder/plan/saved', { cache: 'no-store', signal: controller.signal })
      .then((result) => (result.ok ? result.json() : null))
      .then(async (payload) => {
        const remote = payload?.plan ?? null;
        signedInRef.current = payload !== null && payload !== undefined;

        if (remote?.plan) {
          setResponse({ kind: 'plan', source: 'deterministic', plan: remote.plan });
          setCompletedTaskIds(remote.completedTaskIds ?? []);
          setPinnedTaskIds(remote.pinnedTaskIds ?? []);
          if (remote.profile) setProfile(remote.profile as PathfinderFormValue);
          return;
        }

        if (localStored?.response.kind === 'plan') {
          setResponse(localStored.response);
          setCompletedTaskIds(localStored.completedTaskIds);
          // 登录了但云端为空：把本地这份迁上去
          if (signedInRef.current) {
            await fetch('/api/pathfinder/plan/saved', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                plan: localStored.response.plan,
                completedTaskIds: localStored.completedTaskIds,
                pinnedTaskIds: [],
              }),
            }).catch(() => undefined);
          }
        } else if (localStored) {
          setResponse(localStored.response);
          setCompletedTaskIds(localStored.completedTaskIds);
        }
      })
      .catch(() => {
        // 服务端不可用时不该让本地已有的路径也打不开
        if (localStored) {
          setResponse(localStored.response);
          setCompletedTaskIds(localStored.completedTaskIds);
        }
      });

    return () => controller.abort();
  }, []);

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
        if (!payload || !Array.isArray(payload.items)) return;
        const currentIds = new Set(payload.items.map((item: { id?: unknown }) => item.id));
        setPlanValidation({
          generatedAt,
          stale: itemIds.some((id) => !currentIds.has(id)),
        });
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [response]);

  const persist = useCallback((
    nextResponse: PathfinderApiResponse,
    nextCompleted: string[],
    nextPinned: string[] = pinnedTaskIds,
  ) => {
    // 本地始终写一份：未登录用户靠它，登录用户则在服务端不可用时仍能继续用
    const stored: StoredPathfinderPlan = {
      version: 2,
      savedAt: new Date().toISOString(),
      response: nextResponse,
      completedTaskIds: nextCompleted,
    };
    try {
      window.localStorage.setItem(PATHFINDER_PLAN_STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // 隐私模式或存储配额不足时仍可在当前页面使用路径。
    }

    if (!signedInRef.current || nextResponse.kind !== 'plan') return;
    fetch('/api/pathfinder/plan/saved', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan: nextResponse.plan,
        completedTaskIds: nextCompleted,
        pinnedTaskIds: nextPinned,
        // 画像只在有值时带上，服务端据此避免把已存的画像抹掉
        ...(profile ? { profile } : {}),
      }),
    }).catch(() => undefined);
  }, [pinnedTaskIds, profile]);

  /** 用编辑后的路径整体替换当前状态，并清掉指向已消失任务的 id。 */
  const applyPlan = useCallback((nextPlan: PathfinderPlan) => {
    const nextResponse: PathfinderApiResponse = {
      kind: 'plan', source: 'deterministic', plan: nextPlan,
    };
    const nextCompleted = pruneTaskIds(nextPlan, completedTaskIds);
    const nextPinned = pruneTaskIds(nextPlan, pinnedTaskIds);
    setResponse(nextResponse);
    setCompletedTaskIds(nextCompleted);
    setPinnedTaskIds(nextPinned);
    persist(nextResponse, nextCompleted, nextPinned);
  }, [completedTaskIds, pinnedTaskIds, persist]);

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
    if (!response) return;
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
    if (!currentPlan || !profile || busyWeek !== null) return;
    setBusyWeek(weekNumber);
    setError(null);
    try {
      const result = await fetch('/api/pathfinder/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, locale }),
      });
      const data = await result.json();
      if (!result.ok || data?.kind !== 'plan') {
        setError(data?.error?.message ?? data?.error ?? t('requestError', { status: result.status }));
        return;
      }
      const freshWeek = (data.plan as PathfinderPlan).weeks
        .find((week) => week.week === weekNumber);
      if (!freshWeek) return;
      applyPlan(replaceWeekTasks(currentPlan, weekNumber, freshWeek.tasks, pinnedTaskIds));
    } catch {
      setError(t('networkError'));
    } finally {
      setBusyWeek(null);
    }
  };

  const submit = async (value: PathfinderFormValue) => {
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
      if (!result.ok) {
        setError(data?.error?.message ?? data?.error ?? t('requestError', { status: result.status }));
        return;
      }
      const nextResponse = data as PathfinderApiResponse;
      setProfile(value);
      setResponse(nextResponse);
      setCompletedTaskIds([]);
      setPinnedTaskIds([]);
      persist(nextResponse, [], []);
      window.setTimeout(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.getElementById('pathfinder-result')?.scrollIntoView({
          behavior: pathfinderScrollBehavior(reducedMotion),
          block: 'start',
        });
      }, 80);
    } catch {
      setError(t('networkError'));
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (taskId: string) => {
    if (!response) return;
    setCompletedTaskIds((current) => {
      const next = withToggledTask(current, taskId);
      persist(response, next, pinnedTaskIds);
      return next;
    });
  };

  const reset = () => {
    try {
      window.localStorage.removeItem(PATHFINDER_PLAN_STORAGE_KEY);
    } catch {
      // 当前页面状态仍可正常清空。
    }
    if (signedInRef.current) {
      // 本地清了而云端还留着的话，刷新一下路径又回来了
      fetch('/api/pathfinder/plan/saved', { method: 'DELETE' }).catch(() => undefined);
    }
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
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <PathfinderForm
          preferredItemId={preferredItemId}
          preferredItemTitle={preferredItemTitle}
          initialDirection={initialDirection}
          initialGoalType={initialGoalType}
          loading={loading}
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
            canRegenerate={profile !== null}
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

'use client';

import { useEffect, useState } from 'react';
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
  const [planValidation, setPlanValidation] = useState<{
    generatedAt: string;
    stale: boolean;
  } | null>(null);

  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(PATHFINDER_PLAN_STORAGE_KEY);
    } catch {
      return;
    }
    const stored = parseStoredPathfinderPlan(raw);
    if (!stored) return;
    const hydrationTimer = window.setTimeout(() => {
      setResponse(stored.response);
      setCompletedTaskIds(stored.completedTaskIds);
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
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

  const persist = (nextResponse: PathfinderApiResponse, nextCompleted: string[]) => {
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
      setResponse(nextResponse);
      setCompletedTaskIds([]);
      persist(nextResponse, []);
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
      persist(response, next);
      return next;
    });
  };

  const reset = () => {
    try {
      window.localStorage.removeItem(PATHFINDER_PLAN_STORAGE_KEY);
    } catch {
      // 当前页面状态仍可正常清空。
    }
    setResponse(null);
    setCompletedTaskIds([]);
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
          <PathfinderPlanView response={response} completedTaskIds={completedTaskIds} onToggleTask={toggleTask} onReset={reset} />
        </div>
      )}
    </div>
  );
}

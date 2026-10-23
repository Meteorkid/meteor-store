'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useLocale } from 'next-intl';
import { useAuth } from '@/components/AuthProvider';
import { EMPTY_MONITORING_STATE, getMonitoringState, hasUnreadMonitoring, markMonitoringRead, subscribeMonitoring, watchMonitoring } from '@/lib/monitoring-client';
import { monitoringText, type MonitoringSnapshot } from '@/lib/monitoring-types';
import type { RecheckSnapshot } from '@/lib/task-monitoring-types';
import RecheckTaskPanel from './RecheckTaskPanel';

export default function MonitoringPanel({ userId, initialSnapshot, initialTask }: { userId: string; initialSnapshot: MonitoringSnapshot; initialTask: RecheckSnapshot }) {
  const locale = useLocale() === 'en' ? 'en' : 'zh';
  const copy = monitoringText[locale];
  const { user, loading } = useAuth();
  const activeId = loading ? userId : user?.isAdmin ? user.id ?? null : null;
  const state = useSyncExternalStore(subscribeMonitoring, () => getMonitoringState(activeId), () => EMPTY_MONITORING_STATE);
  useEffect(() => activeId ? watchMonitoring(activeId) : undefined, [activeId]);
  const snapshot = state.snapshot ?? (activeId === userId && !state.failed ? initialSnapshot : null);
  const task = state.task ?? (activeId === userId && !state.failed && !state.snapshot ? initialTask : null);
  const formatTime = (value: string | null) => value ? new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'zh-CN', {
    dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Asia/Shanghai',
  }).format(new Date(value)) : '—';

  if (!activeId) return null;
  return <>
    <header className="mb-8">
      <h1 className="t-title-2">{copy.title}</h1>
      <p className="mt-2 t-footnote text-white/70">{copy.description}</p>
    </header>
    <p className="mb-6 max-w-3xl t-footnote text-white/70">{copy.boundary}</p>
    {state.failed && <p role="alert" className="mb-5 rounded-xl border border-amber-300/20 p-4 text-amber-100">{copy.failed}</p>}
    {!snapshot && !state.failed && <p role="status" className="t-body">{copy.loading}</p>}
    {snapshot && <>
      <section aria-label={copy.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <p className={`t-title-3 ${snapshot.status === 'healthy' ? 'text-emerald-200' : 'text-amber-100'}`}>{copy.status[snapshot.status]}</p>
        {snapshot.status === 'stale' && <p className="mt-2 t-footnote text-white/70">{copy.stale}</p>}
        {snapshot.status === 'not-configured' && <p className="mt-2 t-footnote text-white/70">{copy.missing}</p>}
        {snapshot.reason && <p className="mt-2 t-footnote text-white/70">{copy.reason[snapshot.reason]}</p>}
        <dl className="mt-5 grid gap-4 sm:grid-cols-3">
          <div><dt className="t-footnote text-white/60">{copy.checkedAt} · UTC+8</dt><dd className="mt-1 text-sm text-white">{formatTime(snapshot.checkedAt)}</dd></div>
          <div><dt className="t-footnote text-white/60">{copy.latency}</dt><dd className="mt-1 text-sm text-white">{snapshot.latencyMs === null ? '—' : `${Math.round(snapshot.latencyMs)} ms`}</dd></div>
          <div><dt className="t-footnote text-white/60">{copy.failures}</dt><dd className="mt-1 text-sm text-white">{snapshot.consecutiveFailures}</dd></div>
        </dl>
        {snapshot.incidentOpenedAt && <p className="mt-4 t-footnote text-white/70">{copy.incident}：{formatTime(snapshot.incidentOpenedAt)}</p>}
      </section>
      <section className="mt-8" aria-label={copy.history}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="t-title-3">{copy.history}</h2>
          {hasUnreadMonitoring(activeId) && <button type="button" onClick={() => markMonitoringRead(activeId)} className="min-h-11 rounded-xl border border-white/15 px-4 text-sm text-violet-200">{copy.read}</button>}
        </div>
        {snapshot.events.length === 0 ? <p className="mt-4 t-body text-white/70">{copy.empty}</p> : <ol className="mt-4 divide-y divide-white/10">
          {snapshot.events.map(event => <li key={event.id} className="py-4">
            <p className={`t-title-4 ${event.kind === 'recovery' ? 'text-emerald-200' : 'text-amber-100'}`}>{copy[event.kind]}</p>
            <p className="mt-1 t-footnote text-white/70">{formatTime(event.at)} · UTC+8{event.reason ? ` · ${copy.reason[event.reason]}` : ''}</p>
          </li>)}
        </ol>}
      </section>
    </>}
    {task && <RecheckTaskPanel task={task} locale={locale} />}
  </>;
}

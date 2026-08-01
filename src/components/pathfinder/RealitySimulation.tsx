'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { RealityConstraints } from '@/lib/pathfinder/contract';
import type { PathfinderTask } from '@/lib/pathfinder/schema';
import {
  createTimeShortageEvent,
  getAvailableRealityEvents,
  simulateRealityChange,
  type RealityEvent,
} from '@/lib/pathfinder/simulation';

interface Props {
  originalPlan: PathfinderTask[];
  realityConstraints: RealityConstraints;
}

type ActionStatus = 'idle' | 'completed' | 'deferred';

const EVENT_ICONS = {
  time: '⏱️',
  device: '📱',
  network: '📶',
  budget: '🪙',
} as const;

/**
 * 将 Reality Contract 的裁决过程变成可点击、可解释的评审体验。
 * 全部状态仅保存在当前 React 会话，不上传、不持久化。
 */
export default function RealitySimulation({ originalPlan, realityConstraints }: Props) {
  const t = useTranslations('RealitySimulation');
  const availableEvents = getAvailableRealityEvents(realityConstraints);
  const initialTimeLimit = realityConstraints.dailyMinutes > 10 ? 10 : 5;
  const [selectedEventId, setSelectedEventId] = useState<RealityEvent['id']>(availableEvents[0].id);
  const [remainingMinutes, setRemainingMinutes] = useState(initialTimeLimit);
  const [evidence, setEvidence] = useState('');
  const [actionStatus, setActionStatus] = useState<ActionStatus>('idle');
  const [copied, setCopied] = useState(false);

  const selectedEvent = availableEvents.find((event) => event.id === selectedEventId) ?? availableEvents[0];
  const activeEvent = selectedEvent.kind === 'time'
    ? createTimeShortageEvent(remainingMinutes)
    : selectedEvent;
  const simulation = simulateRealityChange(originalPlan, realityConstraints, activeEvent);
  const displayedDecisions = [...simulation.decisions].sort(
    (left, right) => Number(right.status === 'kept') - Number(left.status === 'kept'),
  );
  const nextTask = simulation.kept[0];
  const actionTarget = nextTask?.title ?? simulation.minimumAction;

  const handleEventChange = (eventId: RealityEvent['id']) => {
    setSelectedEventId(eventId);
    setActionStatus('idle');
    setCopied(false);
  };

  const handleCopyRecord = async () => {
    if (!actionTarget) return;

    const statusText = actionStatus === 'completed' ? t('completedStatus') : t('deferredStatus');
    const record = [
      t('recordHeader'),
      t('recordReality', { label: activeEvent.label }),
      t('recordAction', { action: actionTarget }),
      t('recordStatus', { status: statusText }),
      evidence.trim() ? t('recordEvidence', { evidence: evidence.trim() }) : t('recordEvidenceEmpty'),
    ].join('\n');

    try {
      await navigator.clipboard.writeText(record);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      id="plan-b"
      aria-label={t('sectionAriaLabel')}
      className="scroll-mt-24 rounded-2xl border border-purple-5/30 bg-purple-6/10 p-4 sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium text-purple-200">{t('badge')}</p>
          <h3 className="mt-1 text-lg font-semibold text-foreground">{t('title')}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {t('description')}
          </p>
        </div>
        <span className="w-fit rounded-md border border-white/10 bg-black/20 px-2 py-1 text-xs text-muted-foreground">
          {t('staticRule')}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {availableEvents.map((event) => {
          const selected = event.id === selectedEventId;
          return (
            <button
              key={event.id}
              type="button"
              onClick={() => handleEventChange(event.id)}
              aria-pressed={selected}
              className={`rounded-xl border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-purple-5 ${
                selected
                  ? 'border-purple-4/70 bg-purple-6/20'
                  : 'border-white/10 bg-black/15 hover:border-purple-5/40 hover:bg-purple-6/10'
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <span aria-hidden="true">{EVENT_ICONS[event.kind]}</span>
                {event.kind === 'time' ? t('timeEventLabel', { minutes: remainingMinutes }) : event.label}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{event.description}</span>
            </button>
          );
        })}
      </div>

      {selectedEvent.kind === 'time' && (
        <div className="mt-4 rounded-xl border border-white/10 bg-black/15 px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="remaining-minutes" className="text-xs text-muted-foreground">{t('adjustTimeLabel')}</label>
            <span className="text-sm font-medium text-purple-200">{t('minutes', { minutes: remainingMinutes })}</span>
          </div>
          <input
            id="remaining-minutes"
            type="range"
            min={5}
            max={Math.max(5, realityConstraints.dailyMinutes)}
            step={5}
            value={remainingMinutes}
            onChange={(event) => {
              setRemainingMinutes(Number(event.target.value));
              setActionStatus('idle');
              setCopied(false);
            }}
            className="mt-3 w-full accent-purple-5"
          />
        </div>
      )}

      <div className="mt-4 rounded-xl border border-white/10 bg-black/15 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-foreground">{simulation.summary}</p>
          <span className="rounded-md bg-green-500/15 px-2 py-1 text-xs text-green-300">
            {t('keptCount', { count: simulation.kept.length })}
          </span>
        </div>

        <ul className="mt-3 space-y-2" aria-label={t('decisionsAriaLabel')}>
          {displayedDecisions.map((decision) => (
            <li
              key={`${decision.task.day}-${decision.task.title}`}
              className={`rounded-lg border px-3 py-2 ${
                decision.status === 'kept'
                  ? 'border-green-500/20 bg-green-500/5'
                  : 'border-white/10 bg-black/15'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm text-foreground">D{decision.task.day} · {decision.task.title}</span>
                <span className={`text-xs ${decision.status === 'kept' ? 'text-green-300' : 'text-muted-foreground'}`}>
                  {decision.status === 'kept' ? t('keptLabel') : t('deferredLabel')}
                </span>
              </div>
              {decision.status === 'kept' ? (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <ContractTag>{t('minutes', { minutes: decision.task.minutes })}</ContractTag>
                  <ContractTag>{decision.task.cost === 0 ? t('free') : t('cost', { cost: decision.task.cost })}</ContractTag>
                  <ContractTag>{decision.task.device}</ContractTag>
                  <ContractTag>{decision.task.network}</ContractTag>
                </div>
              ) : (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {decision.reasons.map((reason) => (
                    <span
                      key={reason.rule}
                      className="rounded-md border border-orange-400/20 bg-orange-400/10 px-1.5 py-1 text-[11px] text-orange-200"
                    >
                      {reason.message}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-xl border border-purple-5/20 bg-black/15 p-4">
        <h4 className="text-sm font-semibold text-foreground">{t('evidenceTitle')}</h4>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {actionTarget ? t('actionAvailable', { action: actionTarget }) : t('actionUnavailable')}
        </p>
        <textarea
          value={evidence}
          onChange={(event) => setEvidence(event.target.value.slice(0, 160))}
          placeholder={t('evidencePlaceholder')}
          aria-label={t('evidenceAriaLabel')}
          rows={2}
          className="mt-3 w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-5/60"
        />
        <p className="mt-1 text-[11px] text-muted-foreground">{t('evidenceHint')}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActionStatus('completed')}
            className="rounded-lg bg-green-500/15 px-3 py-2 text-xs font-medium text-green-200 transition hover:bg-green-500/25"
          >
            {t('completedButton')}
          </button>
          <button
            type="button"
            onClick={() => setActionStatus('deferred')}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-foreground transition hover:bg-white/10"
          >
            {t('deferButton')}
          </button>
          {actionStatus !== 'idle' && (
            <button
              type="button"
              onClick={handleCopyRecord}
              className="rounded-lg border border-purple-5/30 bg-purple-6/15 px-3 py-2 text-xs font-medium text-purple-100 transition hover:bg-purple-6/25"
            >
              {copied ? t('copyButtonCopied') : t('copyButton')}
            </button>
          )}
        </div>
        {actionStatus !== 'idle' && (
          <p role="status" className="mt-3 text-xs text-purple-100">
            {actionStatus === 'completed' ? t('completedHint') : t('deferredHint')}
          </p>
        )}
      </div>
    </section>
  );
}

function ContractTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-black/20 px-1.5 py-1 text-[10px] text-muted-foreground">
      {children}
    </span>
  );
}

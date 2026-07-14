'use client';

import { useState } from 'react';
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

    const statusText = actionStatus === 'completed' ? '已完成' : '暂缓';
    const record = [
      'Meteor Pathfinder 行动记录',
      `现实变化：${activeEvent.label}`,
      `行动：${actionTarget}`,
      `状态：${statusText}`,
      evidence.trim() ? `证据：${evidence.trim()}` : '证据：未填写',
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
      aria-label="现实变化推演"
      className="scroll-mt-24 rounded-2xl border border-purple-5/30 bg-purple-6/10 p-4 sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium text-purple-200">Reality Contract · 可解释裁决</p>
          <h3 className="mt-1 text-lg font-semibold text-foreground">现实变化推演</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            条件突然变差时，不重新生成一份理想计划，只保住仍然走得通的一步。
          </p>
        </div>
        <span className="w-fit rounded-md border border-white/10 bg-black/20 px-2 py-1 text-xs text-muted-foreground">
          静态规则 · 不调用模型
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
                {event.kind === 'time' ? `本周只剩 ${remainingMinutes} 分钟` : event.label}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{event.description}</span>
            </button>
          );
        })}
      </div>

      {selectedEvent.kind === 'time' && (
        <div className="mt-4 rounded-xl border border-white/10 bg-black/15 px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="remaining-minutes" className="text-xs text-muted-foreground">调整本周剩余时间</label>
            <span className="text-sm font-medium text-purple-200">{remainingMinutes} 分钟</span>
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
            保留 {simulation.kept.length} 项
          </span>
        </div>

        <ul className="mt-3 space-y-2" aria-label="任务裁决结果">
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
                  {decision.status === 'kept' ? '仍可完成' : '先暂缓'}
                </span>
              </div>
              {decision.status === 'kept' ? (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <ContractTag>{decision.task.minutes} 分钟</ContractTag>
                  <ContractTag>{decision.task.cost === 0 ? '免费' : `${decision.task.cost} 元`}</ContractTag>
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
        <h4 className="text-sm font-semibold text-foreground">留下这一刻的行动证据</h4>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {actionTarget ? `此刻还能做的一步：${actionTarget}` : '先承认这次无法保留原任务，也是在保护下一次行动。'}
        </p>
        <textarea
          value={evidence}
          onChange={(event) => setEvidence(event.target.value.slice(0, 160))}
          placeholder="例如：已在备忘录写下两个岗位关键词"
          aria-label="行动证据"
          rows={2}
          className="mt-3 w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-purple-5/60"
        />
        <p className="mt-1 text-[11px] text-muted-foreground">仅保留在本次浏览中，不上传、不保存；刷新页面即清除。</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActionStatus('completed')}
            className="rounded-lg bg-green-500/15 px-3 py-2 text-xs font-medium text-green-200 transition hover:bg-green-500/25"
          >
            我完成了这一步
          </button>
          <button
            type="button"
            onClick={() => setActionStatus('deferred')}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-foreground transition hover:bg-white/10"
          >
            今天先暂缓
          </button>
          {actionStatus !== 'idle' && (
            <button
              type="button"
              onClick={handleCopyRecord}
              className="rounded-lg border border-purple-5/30 bg-purple-6/15 px-3 py-2 text-xs font-medium text-purple-100 transition hover:bg-purple-6/25"
            >
              {copied ? '已复制记录' : '复制本次记录'}
            </button>
          )}
        </div>
        {actionStatus !== 'idle' && (
          <p role="status" className="mt-3 text-xs text-purple-100">
            {actionStatus === 'completed'
              ? '已记录完成状态。保住一个小行动，就保住了继续向前的可能。'
              : '已记录暂缓状态。等条件恢复时，从这一步继续，不必从头来过。'}
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

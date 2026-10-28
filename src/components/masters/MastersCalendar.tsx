'use client';

import { useMemo, useState } from 'react';
import type { MastersRound } from '@/lib/masters/types';
import {
  MASTERS_CALENDAR_WEEKDAYS, buildMastersCalendarMonth, clampMonth, collectMastersCalendarNodes,
  collectMastersCalendarPending, formatMastersCalendarDate, formatMastersMonth,
  initialMastersCalendarMonth, mastersCalendarBounds, shiftMonth,
  type MastersCalendarCell, type MastersCalendarNode,
} from '@/lib/masters/calendar';
import { mastersStateLabel } from './state';
import type { MastersCopy } from './text';

interface MastersCalendarProps {
  year: number;
  rounds: MastersRound[];
  now: Date;
  locale: 'zh' | 'en';
  copy: MastersCopy;
  /** 从日历跳回列表并定位到具体轮次。 */
  onLocate: (roundId: string) => void;
}

const TONE_CLASS: Record<MastersCalendarNode['tone'], string> = {
  closing: 'border-amber-300/40 bg-amber-400/10 text-amber-100',
  deadline: 'border-violet-300/30 bg-violet-400/10 text-violet-100',
  opens: 'border-emerald-300/25 bg-emerald-400/10 text-emerald-100',
  past: 'border-white/10 bg-white/[0.03] text-white/60',
};

const DOT_CLASS: Record<MastersCalendarNode['tone'], string> = {
  closing: 'bg-amber-300',
  deadline: 'bg-violet-300',
  opens: 'bg-emerald-300',
  past: 'bg-white/30',
};

/** 单格最多直接铺 2 条，其余折叠成「另有 N 个」，避免高密度月份把行高撑爆。 */
const CELL_VISIBLE = 2;

function nodeLabel(node: MastersCalendarNode, copy: MastersCopy): string {
  return node.kind === 'opens' ? copy.calendarOpens : copy.calendarDeadline;
}

function CalendarCell({ cell, copy, openDate, onToggle }: {
  cell: MastersCalendarCell;
  copy: MastersCopy;
  openDate: string | null;
  onToggle: (date: string) => void;
}) {
  if (!cell.inMonth) return <div role="gridcell" aria-hidden className="min-h-20 border-r border-white/10 bg-white/[0.02] p-1.5 last:border-r-0" />;
  const hidden = Math.max(0, cell.nodes.length - CELL_VISIBLE);
  const expanded = cell.date === openDate;
  return (
    <div role="gridcell" className="min-h-20 border-r border-white/10 p-1.5 last:border-r-0">
      <p className={`flex items-center justify-end gap-1 t-footnote tabular-nums ${cell.isToday ? 'font-semibold text-violet-200' : 'text-white/60'}`}>
        {cell.isToday && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-violet-300" />}{cell.day}
      </p>
      {/* 移动端只留色点：小格里塞进标题会换行破碎，且无法触达 */}
      <div className="mt-1 flex flex-wrap gap-1 sm:hidden" aria-hidden>
        {cell.nodes.slice(0, 4).map((node, index) => <span key={`${node.round.id}-${node.kind}-${index}`} className={`h-1.5 w-1.5 rounded-full ${DOT_CLASS[node.tone]}`} />)}
      </div>
      <div className="mt-1 hidden space-y-1 sm:block">
        {cell.nodes.slice(0, CELL_VISIBLE).map((node, index) => <p key={`${node.round.id}-${node.kind}-${index}`} className={`flex items-center gap-1 rounded-md border px-1.5 py-0.5 t-footnote ${TONE_CLASS[node.tone]}`}>
          {/* 标记排在文字之前并禁止收缩：放在文字之后会被 truncate 直接截掉，
              而长校名恰恰是最常见的情况，等于标记永远看不见 */}
          {node.changed && <span className="h-2 w-2 shrink-0 rounded-full border border-amber-300/80" aria-label={copy.calendarChanged} />}
          <span className="truncate">{nodeLabel(node, copy)} · {node.round.details.university}</span>
        </p>)}
        {hidden > 0 && <p className="px-1.5 t-footnote text-white/60">{copy.calendarMore.replace('{count}', String(hidden))}</p>}
      </div>
      {cell.nodes.length > 0 && <button type="button" onClick={() => onToggle(cell.date)} aria-expanded={expanded}
        aria-label={copy.calendarNodeCount.replace('{count}', String(cell.nodes.length))}
        className="mt-1 w-full min-h-8 rounded-md px-1 text-left t-footnote text-violet-200">
        {/* 移动端只显示数字：完整句子在窄格里会折成三行，把行高撑得参差不齐 */}
        <span className="sm:hidden" aria-hidden>{cell.nodes.length}</span>
        <span className="hidden sm:inline" aria-hidden>{expanded ? copy.calendarCollapse : copy.calendarNodeCount.replace('{count}', String(cell.nodes.length))}</span>
      </button>}
    </div>
  );
}

export default function MastersCalendar({ year, rounds, now, locale, copy, onLocate }: MastersCalendarProps) {
  const today = now.toISOString().slice(0, 10);
  const nodes = useMemo(() => collectMastersCalendarNodes(rounds, now), [rounds, now]);
  const pending = useMemo(() => collectMastersCalendarPending(rounds), [rounds]);
  const bounds = useMemo(() => mastersCalendarBounds(rounds, year), [rounds, year]);
  const [month, setMonth] = useState(() => initialMastersCalendarMonth(bounds, today));
  const [openDate, setOpenDate] = useState<string | null>(null);

  const current = clampMonth(month, bounds);
  const view = useMemo(() => buildMastersCalendarMonth(current, nodes, today), [current, nodes, today]);
  const weekdays = MASTERS_CALENDAR_WEEKDAYS[locale];
  const canPrev = current > bounds.min;
  const canNext = current < bounds.max;
  const openCell = view.weeks.flat().find(cell => cell.date === openDate && cell.inMonth) ?? null;

  const go = (delta: number) => {
    setOpenDate(null);
    setMonth(value => clampMonth(shiftMonth(value, delta), bounds));
  };

  const buttonClass = 'inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white disabled:opacity-40';

  return (
    <section className="space-y-5" aria-labelledby="masters-calendar-title">
      <div className="flex flex-wrap items-center gap-3">
        <h2 id="masters-calendar-title" className="t-title-3 text-white">{copy.calendarTitle}</h2>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={() => go(-1)} disabled={!canPrev} className={buttonClass} aria-label={copy.calendarPrev}>←</button>
          <p className="min-w-32 text-center t-title-4 text-white" aria-live="polite">{formatMastersMonth(current, locale)}</p>
          <button type="button" onClick={() => go(1)} disabled={!canNext} className={buttonClass} aria-label={copy.calendarNext}>→</button>
        </div>
      </div>

      <p className="t-footnote text-white/60">{copy.calendarMonthSummary.replace('{opens}', String(view.opensCount)).replace('{deadlines}', String(view.deadlineCount))}</p>

      {view.weeks.length === 0 ? <div className="rounded-xl border border-white/10 px-6 py-10 text-center">
        <p className="t-title-4 text-white">{copy.calendarEmptyMonth}</p>
        <p className="mt-3 t-footnote text-white/60">{copy.calendarEmptyMonthHint}</p>
      </div> : <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-7 border-b border-white/10 bg-white/[0.03]" role="row">
          {weekdays.map(day => <div key={day} role="columnheader" className="px-2 py-2 text-center t-footnote text-white/60">{day}</div>)}
        </div>
        {view.weeks.map(week => <div key={week[0].date} className="grid grid-cols-7 border-b border-white/10 last:border-b-0" role="row">
          {week.map(cell => <CalendarCell key={cell.date} cell={cell} copy={copy} openDate={openDate} onToggle={setOpenDate} />)}
        </div>)}
      </div>}

      {openCell && <div className="rounded-2xl border border-white/10 p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="t-title-4 text-white">{formatMastersCalendarDate(openCell.date, locale)}</h3>
          <button type="button" onClick={() => setOpenDate(null)} className="min-h-10 px-2 t-footnote text-white/70 underline underline-offset-4">{copy.calendarCollapse}</button>
        </div>
        {openCell.nodes.length === 0 ? <p className="mt-3 t-footnote text-white/60">{copy.calendarNoNodes}</p>
          : <ul className="mt-4 divide-y divide-white/10">
            {openCell.nodes.map((node, index) => <li key={`${node.round.id}-${node.kind}-${index}`} className="flex flex-wrap items-start justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="t-footnote text-white/60">{nodeLabel(node, copy)} · {node.round.details.roundName}</p>
                <p className="mt-1 t-title-4 text-white">{node.round.details.university}</p>
                <p className="mt-1 t-footnote text-white/70">{node.round.details.programme}</p>
                <p className="mt-1 t-footnote text-white/60">{node.round.intakeYear} · {node.round.details.intakeLabel} · {mastersStateLabel(node.round, now, locale)}</p>
              </div>
              <button type="button" onClick={() => onLocate(node.round.id)} className={buttonClass}>{copy.calendarJump}</button>
            </li>)}
          </ul>}
      </div>}

      <div className="space-y-2 border-t border-white/10 pt-4">
        <p className="t-footnote font-semibold text-white/80">{copy.calendarLegend}</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 t-footnote text-white/70">
          {(['opens', 'deadline', 'closing', 'past'] as const).map(tone => <li key={tone} className="inline-flex items-center gap-2">
            <span aria-hidden className={`h-2 w-2 rounded-full ${DOT_CLASS[tone]}`} />
            {tone === 'opens' ? copy.calendarOpens : tone === 'deadline' ? copy.calendarDeadline : tone === 'closing' ? copy.calendarClosing : copy.calendarPast}
          </li>)}
          {/* 空心环表示日期变更：实心点已被四种状态占用，同形不同义会读错 */}
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-2 w-2 rounded-full border border-amber-200" />{copy.calendarChanged}</li>
        </ul>
        <p className="t-footnote text-white/60">{copy.calendarHint}</p>
        <p className="t-footnote text-white/60">{copy.calendarBoundsHint}</p>
      </div>

      {pending.length > 0 && <details className="rounded-xl border border-white/10 px-4">
        <summary className="min-h-11 cursor-pointer py-3 t-footnote text-white/70">{copy.calendarPending} ({pending.length})</summary>
        <p className="pb-3 t-footnote text-white/60">{copy.calendarPendingHint}</p>
        <ul className="divide-y divide-white/10 pb-2">{pending.map(({ round, reason }) => <li key={round.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="t-title-4 text-white">{round.details.university}</p>
            <p className="mt-1 t-footnote text-white/70">{round.details.programme} · {round.details.roundName}</p>
            <p className="mt-1 t-footnote text-amber-200">{reason === 'unannounced' ? copy.calendarUnannounced : copy.calendarUnverified}</p>
          </div>
          <button type="button" onClick={() => onLocate(round.id)} className={buttonClass}>{copy.calendarJump}</button>
        </li>)}</ul>
      </details>}
    </section>
  );
}

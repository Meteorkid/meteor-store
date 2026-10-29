'use client';

import { useMemo, useState } from 'react';
import { dailyDate } from '@/lib/daily/types';
import type { MastersRound } from '@/lib/masters/types';
import {
  MASTERS_CALENDAR_WEEKDAYS, assignMastersCalendarLanes, buildMastersCalendarMonth, clampMonth,
  collectMastersCalendarNodes, collectMastersCalendarPending, collectMastersCalendarSpans,
  formatMastersCalendarDate, formatMastersMonth, initialMastersCalendarMonth, mastersCalendarBounds,
  mastersCalendarHue, shiftMonth,
  type MastersCalendarCell, type MastersCalendarNode, type MastersCalendarSpan,
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

/** 色带最多铺几条车道，超出说明重叠过多，靠展开面板查看。 */
const LANE_LIMIT = 6;

function nodeLabel(node: MastersCalendarNode, copy: MastersCopy): string {
  return node.kind === 'opens' ? copy.calendarOpens : copy.calendarDeadline;
}

/**
 * 申请期色带：同校同色，跨格用固定车道对齐成一条直线。
 * 只在真实起点/终点收口，中间格两端是直角并出血到格边，相邻格才连成一条；
 * 这是「一眼看出这天还在不在申请期」的关键。
 */
function SpanBar({ span, date, copy }: {
  span: MastersCalendarSpan;
  date: string;
  copy: MastersCopy;
}) {
  const hue = mastersCalendarHue(span);
  const isStart = date === span.start;
  const isEnd = date === span.end;
  const knownStart = isStart && span.startKnown;
  const openStart = isStart && !span.startKnown;
  const label = `${span.university} · ${span.programme} · ${span.rounds[0].details.roundName} · ${span.rounds[0].details.intakeLabel}`;
  return (
    <span
      data-span-lane
      aria-label={`${label}${openStart ? `（${copy.calendarSpanOpenEnded}）` : ''}`}
      title={label}
      style={{
        background: `hsl(${hue} 70% 52% / ${span.past ? 0.3 : 0.6})`,
        // 起点未知时左端不收口：今天只是当前可申请区间的显示起点。
        borderTopLeftRadius: knownStart ? '3px' : '0',
        borderBottomLeftRadius: knownStart ? '3px' : '0',
        borderTopRightRadius: isEnd ? '3px' : '0',
        borderBottomRightRadius: isEnd ? '3px' : '0',
        // 起点未知：斜纹淡出，表示「这天已经开着，更早也可能开」
        ...(openStart ? {
          maskImage: 'repeating-linear-gradient(115deg, #000 0 3px, transparent 3px 6px)',
          WebkitMaskImage: 'repeating-linear-gradient(115deg, #000 0 3px, transparent 3px 6px)',
        } : {}),
      }}
      className="relative block h-2.5"
    >
      {/* 末日刻度：白色竖线压在长条末端，一眼看出这段申请期到此为止 */}
      {isEnd && <span aria-hidden className="absolute inset-y-0 right-0 w-[3px] rounded-sm bg-white/90" />}
    </span>
  );
}

function CalendarCell({ cell, copy, openDate, onToggle, lanes }: {
  cell: MastersCalendarCell;
  copy: MastersCopy;
  openDate: string | null;
  onToggle: (date: string) => void;
  lanes: Map<string, number>;
}) {
  const hidden = Math.max(0, cell.nodes.length - CELL_VISIBLE);
  const hiddenSpans = cell.spans.filter(span => (lanes.get(span.key) ?? 0) >= LANE_LIMIT).length;
  const expanded = cell.date === openDate;
  const laneCount = Math.min(LANE_LIMIT, Math.max(0, ...cell.spans.map(span => (lanes.get(span.key) ?? 0) + 1)));
  const bars = laneCount > 0 && <div className="-mx-px mt-1 space-y-0.5">
    {Array.from({ length: laneCount }, (_, lane) => {
      const span = cell.spans.find(item => (lanes.get(item.key) ?? 0) === lane);
      return <div key={lane} className="h-2.5">{span && <SpanBar span={span} date={cell.date} copy={copy} />}</div>;
    })}
  </div>;
  // 相邻月的补位格也要画条：否则申请期在月界处被硬切断，会被读成「窗口到此结束」。
  if (!cell.inMonth) return (
    <div role="gridcell" aria-hidden className="min-h-24 border-r border-white/10 bg-white/[0.02] pb-1.5 last:border-r-0">
      <p className="px-1.5 pt-1.5 t-footnote tabular-nums text-white/30">{cell.day}</p>
      {bars}
    </div>
  );
  return (
    <div role="gridcell" className="min-h-24 border-r border-white/10 pb-1.5 last:border-r-0">
      <p aria-current={cell.isToday ? 'date' : undefined} className={`flex items-center justify-end gap-1 px-1.5 pt-1.5 t-footnote tabular-nums ${cell.isToday ? 'font-semibold text-violet-200' : 'text-white/60'}`}>
        {cell.isToday && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-violet-300" />}{cell.day}
      </p>

      {/* 申请期色带：负边距让长条出血到格边，相邻格才连成一条直线。
          没有色带时不占高度，否则每个格子都会被凭空撑高。 */}
      {bars}

      <div className="px-1.5">
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
        {hiddenSpans > 0 && <button type="button" onClick={() => onToggle(cell.date)} aria-expanded={expanded}
          aria-label={`${cell.date} · ${copy.calendarMoreSpans.replace('{count}', String(hiddenSpans))}`}
          className="mt-1 min-h-11 w-full rounded-md px-1 text-left t-footnote text-violet-200">
          <span aria-hidden>+{hiddenSpans}</span>
        </button>}
      </div>
    </div>
  );
}

export default function MastersCalendar({ year, rounds, now, locale, copy, onLocate }: MastersCalendarProps) {
  const today = dailyDate(now);
  const nodes = useMemo(() => collectMastersCalendarNodes(rounds, now), [rounds, now]);
  const spans = useMemo(() => collectMastersCalendarSpans(rounds, now), [rounds, now]);
  const pending = useMemo(() => collectMastersCalendarPending(rounds), [rounds]);
  const bounds = useMemo(() => mastersCalendarBounds(rounds, year, spans), [rounds, year, spans]);
  const [month, setMonth] = useState(() => initialMastersCalendarMonth(bounds, today));
  const [openDate, setOpenDate] = useState<string | null>(null);

  const current = clampMonth(month, bounds);
  const view = useMemo(() => buildMastersCalendarMonth(current, nodes, today, spans), [current, nodes, today, spans]);
  // 车道按「本视图实际要画的条」分配，含首尾补位格——否则补位格里的条拿不到车道会被漏画。
  const viewSpans = useMemo(
    () => [...new Map(view.weeks.flat().flatMap(cell => cell.spans).map(span => [span.key, span])).values()],
    [view],
  );
  const lanes = useMemo(() => assignMastersCalendarLanes(viewSpans), [viewSpans]);
  // 图例按车道从上到下排，和格子里色带的叠放顺序一致，对照时不用来回找。
  const spanRows = useMemo(
    () => [...viewSpans].sort((a, b) => (lanes.get(a.key) ?? 0) - (lanes.get(b.key) ?? 0)),
    [viewSpans, lanes],
  );
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

      <div className="space-y-1">
        <p className="t-footnote text-white/60">{copy.calendarMonthSummary.replace('{opens}', String(view.opensCount)).replace('{deadlines}', String(view.deadlineCount))}</p>
        {view.spanCount > 0 && <p className="t-footnote text-white/60">{copy.calendarSpanCount.replace('{count}', String(view.spanCount))}</p>}
      </div>

      {/* 颜色对照表：格子里只有裸色带，没有这张表就只能靠悬停才知道是哪所学校。 */}
      {spanRows.length > 0 && <div className="rounded-2xl border border-white/10 p-3 sm:p-4">
        <p className="t-footnote font-semibold text-white/80">{copy.calendarSpanMap}</p>
        {/* 每项独立成卡：挤成一行时项目名必然被 truncate，长校名恰恰是最常见的情况。 */}
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {spanRows.map(span => <li key={span.key} data-calendar-round-id={span.rounds[0].id} className="flex items-start gap-2 rounded-lg border border-white/10 px-2.5 py-2 t-footnote">
            <span aria-hidden className="mt-1 h-2.5 w-6 shrink-0 rounded-sm" style={{
              background: `hsl(${mastersCalendarHue(span)} 70% 52% / ${span.past ? 0.4 : 0.75})`,
              ...(span.startKnown ? {} : {
                maskImage: 'repeating-linear-gradient(115deg, #000 0 3px, transparent 3px 6px)',
                WebkitMaskImage: 'repeating-linear-gradient(115deg, #000 0 3px, transparent 3px 6px)',
              }),
            }} />
            <span className="min-w-0 flex-1">
              <span className="block text-white/85">{span.university}</span>
              <span className="block text-white/70">{span.programme}</span>
              <span className="mt-1 block font-semibold text-violet-200">{span.rounds[0].details.roundName} · {span.rounds[0].details.intakeLabel}</span>
              <span className="mt-0.5 block tabular-nums text-white/60">
                {!span.startKnown && <>{copy.calendarSpanOngoing} · </>}{`${span.start} → ${span.end}`} · {mastersStateLabel(span.rounds[0], now, locale)}
              </span>
            </span>
          </li>)}
        </ul>
      </div>}

      {view.weeks.length === 0 ? <div className="rounded-xl border border-white/10 px-6 py-10 text-center">
        <p className="t-title-4 text-white">{copy.calendarEmptyMonth}</p>
        <p className="mt-3 t-footnote text-white/60">{copy.calendarEmptyMonthHint}</p>
      </div> : <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-7 border-b border-white/10 bg-white/[0.03]" role="row">
          {weekdays.map(day => <div key={day} role="columnheader" className="px-2 py-2 text-center t-footnote text-white/60">{day}</div>)}
        </div>
        {view.weeks.map(week => <div key={week[0].date} className="grid grid-cols-7 border-b border-white/10 last:border-b-0" role="row">
          {week.map(cell => <CalendarCell key={cell.date} cell={cell} copy={copy} openDate={openDate} onToggle={setOpenDate} lanes={lanes} />)}
        </div>)}
      </div>}

      {openCell && <div className="rounded-2xl border border-white/10 p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="t-title-4 text-white">{formatMastersCalendarDate(openCell.date, locale)}</h3>
          <button type="button" onClick={() => setOpenDate(null)} className="min-h-10 px-2 t-footnote text-white/70 underline underline-offset-4">{copy.calendarCollapse}</button>
        </div>
        {openCell.spans.length > 0 && <ul className="mt-3 flex flex-wrap gap-2">
          {openCell.spans.map(span => <li key={span.key} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-2.5 py-1 t-footnote text-white/80">
            <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: `hsl(${mastersCalendarHue(span)} 70% 52% / ${span.past ? 0.4 : 0.75})` }} />
            {span.university} · {span.programme} · {span.rounds[0].details.roundName} · {span.rounds[0].details.intakeLabel}
            <span className="text-white/60">{!span.startKnown && <>{copy.calendarSpanOngoing} · </>}{`${span.start} → ${span.end}`}</span>
          </li>)}
        </ul>}
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
        <ul className="flex flex-wrap gap-x-4 gap-y-2 t-footnote text-white/70">
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-2.5 w-6 rounded-sm" style={{ background: 'hsl(265 70% 52% / 0.62)' }} />{copy.calendarSpanKnown}</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-2.5 w-6 rounded-sm" style={{
            background: 'hsl(190 70% 52% / 0.62)',
            maskImage: 'repeating-linear-gradient(115deg, #000 0 3px, transparent 3px 6px)',
            WebkitMaskImage: 'repeating-linear-gradient(115deg, #000 0 3px, transparent 3px 6px)',
          }} />{copy.calendarSpanOpenEnded}</li>
        </ul>
        <p className="t-footnote text-white/60">{copy.calendarSpanHint}</p>
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

'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { MastersRound } from '@/lib/masters/types';
import { buildMastersTimeline, type MastersTimelineRow, type MastersTimelineSort } from '@/lib/masters/timeline';
import { mastersDeadlineLabel, mastersStateLabel } from './state';
import type { MastersCopy } from './text';

interface MastersTimelineProps {
  rounds: MastersRound[];
  now: Date;
  locale: 'zh' | 'en';
  copy: MastersCopy;
  onLocate: (roundId: string) => void;
}

/** 表头、数据行和覆盖层共用同一列宽，保持日期坐标一致。 */
const LABEL_COL = 'w-40 sm:w-60';
const AXIS_OFFSET = 'left-40 sm:left-60';
const focusClass = 'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-violet-300';

function barFill(hue: number, past: boolean, startKnown: boolean): string {
  const alpha = past ? 0.28 : 0.55;
  if (startKnown) return `hsl(${hue} 70% 52% / ${alpha})`;
  return `linear-gradient(to right, hsl(${hue} 70% 52% / 0) 0%, hsl(${hue} 70% 52% / ${alpha}) 14%)`;
}

function TimelineRow({ row, copy, expanded, labelId, detailsId, onOpen, onLocate }: {
  row: MastersTimelineRow;
  copy: MastersCopy;
  expanded: boolean;
  labelId: string;
  detailsId: string;
  onOpen: () => void;
  onLocate: (roundId: string) => void;
}) {
  const markers = [...row.milestones, ...row.outsideMarkers].sort((first, second) => first.pct - second.pct || first.roundId.localeCompare(second.roundId));
  const dates = [...new Set(markers.map(marker => marker.date))];
  const largestGroup = Math.max(1, ...dates.map(date => markers.filter(marker => marker.date === date).length));
  const name = `${row.university} · ${row.programme}`;

  return <div className="flex items-stretch border-b border-white/10 last:border-b-0" data-timeline-row={row.key}>
    <button type="button" id={labelId} onClick={onOpen} aria-expanded={expanded} aria-controls={detailsId}
      aria-label={`${name} · ${copy.timelineShowRounds}`}
      className={`${LABEL_COL} ${focusClass} sticky left-0 z-30 shrink-0 border-r border-white/10 bg-zinc-950 px-3 py-3 text-left`}>
      <span className="flex items-start gap-1.5 t-footnote font-semibold text-white/90">
        {row.changed && <span aria-hidden className="mt-1 h-2 w-2 shrink-0 rounded-full border border-amber-300/80" />}
        <span className="line-clamp-2 break-words">{row.university}</span>
      </span>
      <span className="mt-1 line-clamp-2 t-footnote text-white/70">{row.programme}</span>
      <span className="mt-2 block t-footnote text-white/80">
        {row.recentDeadline
          ? <><span className="block text-white/60">{copy.timelineNextDeadline}</span><span className="whitespace-nowrap tabular-nums">{row.recentDeadline}</span></>
          : copy.timelineNoUpcoming}
      </span>
      <span className="mt-2 flex flex-wrap gap-x-2 t-footnote text-violet-200">
        <span>{copy.timelineRoundsChip.replace('{count}', String(row.rounds.length))}</span>
        <span>{expanded ? copy.calendarCollapse : copy.timelineShowRounds}<span aria-hidden> {expanded ? '−' : '+'}</span></span>
      </span>
    </button>
    <div className="relative min-w-0 flex-1 overflow-hidden" style={{ minHeight: `${Math.max(112, largestGroup * 44 + 24)}px` }}>
      {row.kind === 'span' && <button type="button" onClick={onOpen} aria-expanded={expanded} aria-controls={detailsId}
        aria-label={`${name} · ${copy.timelineShowRounds}`}
        style={{ left: `${row.left}%`, width: `${row.width}%` }}
        className={`absolute top-1/2 z-10 h-11 -translate-y-1/2 rounded-md ${focusClass}`}>
        <span aria-hidden className="absolute inset-x-0 top-1/2 h-7 -translate-y-1/2 rounded-md" style={{ background: barFill(row.hue, row.past, row.startKnown) }} />
      </button>}
      {markers.map(marker => {
        const round = row.rounds.find(item => item.id === marker.roundId)!;
        const sameDate = markers.filter(item => item.date === marker.date);
        // 同日多轮垂直错开；不同日期的命中区止于中点，避免后一个按钮盖住前一个。
        const offset = (sameDate.findIndex(item => item.roundId === marker.roundId) - (sameDate.length - 1) / 2) * 44;
        const previous = markers.findLast(item => item.pct < marker.pct);
        const next = markers.find(item => item.pct > marker.pct);
        const leftBound = previous ? (previous.pct + marker.pct) / 2 : 0;
        const rightBound = next ? (next.pct + marker.pct) / 2 : 100;
        const label = `${name} · ${round.details.intakeLabel} · ${round.details.roundName} · ${marker.date} · ${copy.calendarJump}`;
        return <span key={marker.roundId}>
          <button type="button" data-round-id={marker.roundId} aria-label={label} title={label}
            onClick={() => onLocate(marker.roundId)}
            style={{ left: `max(${leftBound}%, calc(${marker.pct}% - 22px))`, right: `max(${100 - rightBound}%, calc(${100 - marker.pct}% - 22px))`, top: `calc(50% + ${offset}px - 22px)` }}
            className={`absolute z-20 h-11 rounded-md ${focusClass}`} />
          <span aria-hidden style={{ left: `${marker.pct}%`, top: `calc(50% + ${offset}px)`, background: `hsl(${row.hue} 70% 52% / ${marker.past ? 0.5 : 0.95})` }}
            className="pointer-events-none absolute z-20 h-5 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-white/40" />
        </span>;
      })}
    </div>
  </div>;
}

export default function MastersTimeline({ rounds, now, locale, copy, onLocate }: MastersTimelineProps) {
  const [sort, setSort] = useState<MastersTimelineSort>('school');
  const [zoomed, setZoomed] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const timeline = useMemo(() => buildMastersTimeline(rounds, now, locale, sort), [rounds, now, locale, sort]);
  const detailsRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const detailsId = `${id}-details`;
  const expandedRow = timeline.rows.find(row => row.key === expandedKey);
  const labelId = (key: string) => `${id}-row-${encodeURIComponent(key)}`;
  const pillClass = `min-h-11 rounded-lg px-3 py-2 t-footnote ${focusClass}`;

  useEffect(() => {
    if (!expandedKey) return;
    const frame = requestAnimationFrame(() => {
      const panel = detailsRef.current;
      panel?.focus({ preventScroll: true });
      panel?.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
    return () => cancelAnimationFrame(frame);
  }, [expandedKey]);

  const closeDetails = () => {
    setExpandedKey(null);
    if (expandedKey) document.getElementById(labelId(expandedKey))?.focus();
  };
  const years = timeline.months.reduce<Array<{ year: string; left: number; width: number }>>((groups, month) => {
    const year = month.key.slice(0, 4);
    const last = groups[groups.length - 1];
    if (last?.year === year) last.width += month.width;
    else groups.push({ year, left: month.left, width: month.width });
    return groups;
  }, []);
  const todayShift = timeline.todayPct === null ? '-50%' : timeline.todayPct <= 3 ? '0%' : timeline.todayPct >= 97 ? '-100%' : '-50%';

  if (timeline.rows.length === 0) return (
    <section className="space-y-3" aria-labelledby="masters-timeline-title">
      <h2 id="masters-timeline-title" className="t-title-3 text-white">{copy.timelineTitle}</h2>
      <div className="rounded-2xl border border-white/10 px-6 py-10 text-center">
        <p className="t-title-4 text-white">{copy.timelineEmpty}</p>
        <p className="mt-2 t-footnote text-white/60">{copy.timelineEmptyHint}</p>
        {timeline.undatedCount > 0 && <p className="mt-2 t-footnote text-white/60">{copy.timelineUndatedNote.replace('{count}', String(timeline.undatedCount))}</p>}
      </div>
    </section>
  );

  return (
    <section className="min-w-0 space-y-4" aria-labelledby="masters-timeline-title">
      <div className="flex flex-wrap items-center gap-3">
        <h2 id="masters-timeline-title" className="t-title-3 text-white">{copy.timelineTitle}</h2>
        <div className="ml-auto inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1" role="group" aria-label={copy.timelineSort}>
          {(['school', 'deadline'] as const).map(value => <button key={value} type="button" onClick={() => setSort(value)} aria-pressed={sort === value} className={`${pillClass} ${sort === value ? 'bg-white/10 text-white' : 'text-white/60'}`}>{value === 'school' ? copy.timelineSortSchool : copy.timelineSortDeadline}</button>)}
        </div>
      </div>
      <div className="space-y-1 t-footnote text-white/70">
        <p>{copy.timelineRange.replace('{count}', String(timeline.rows.length)).replace('{rounds}', String(timeline.roundCount)).replace('{start}', timeline.start).replace('{end}', timeline.end)}</p>
        {timeline.deadlineOnlyCount > 0 && <p>{copy.timelineMilestoneNote.replace('{count}', String(timeline.deadlineOnlyCount))}</p>}
        {timeline.overlapDays > 0 && <p>{copy.timelineOverlapNote.replace('{count}', String(timeline.overlapDays))}</p>}
        {timeline.undatedCount > 0 && <p>{copy.timelineUndatedNote.replace('{count}', String(timeline.undatedCount))}</p>}
        <p>{copy.timelineHint}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-xl border border-white/10 p-1" role="group" aria-label={copy.timelineScale}>
          {[false, true].map(value => <button key={String(value)} type="button" onClick={() => setZoomed(value)} aria-pressed={zoomed === value} className={`${pillClass} ${zoomed === value ? 'bg-white/10 text-white' : 'text-white/70'}`}>{value ? copy.timelineZoom : copy.timelineOverview}</button>)}
        </div>
        {zoomed && <p className="max-w-lg t-footnote text-white/70">{copy.timelineZoomHint}</p>}
      </div>

      <div role="region" aria-label={copy.timelineChart} tabIndex={0} className={`max-w-full overflow-x-auto overscroll-x-contain rounded-2xl border border-white/15 ${focusClass}`}>
        <div style={zoomed ? { minWidth: `${Math.max(760, timeline.months.length * 88 + 240)}px` } : undefined}>
          <div className="flex items-stretch border-b border-white/10 bg-white/[0.03]">
            <div className={`${LABEL_COL} sticky left-0 z-30 flex shrink-0 items-end border-r border-white/10 bg-zinc-950 px-3 py-2 t-footnote text-white/70`}>{copy.school}</div>
            <div className="relative min-w-0 flex-1">
              <div className="relative h-7 border-b border-white/10">
                {years.map(year => <span key={year.year} data-timeline-year={year.year} style={{ left: `${year.left}%`, width: `${year.width}%` }} className="absolute inset-y-0 flex items-center justify-center border-r border-white/10 t-footnote font-semibold tabular-nums text-white/85 last:border-r-0">{year.year}</span>)}
              </div>
              {timeline.todayPct !== null && <div className="relative h-6">
                <span style={{ left: `${timeline.todayPct}%`, transform: `translateX(${todayShift})` }} className="absolute bottom-0.5 whitespace-nowrap rounded-full bg-violet-400/20 px-1.5 t-footnote text-violet-100">{copy.timelineToday}</span>
              </div>}
              <div className="relative h-7">
                {timeline.months.map(month => <span key={month.key} aria-hidden style={{ left: `${month.left}%`, width: `${month.width}%` }} className="absolute inset-y-0 flex items-center justify-center whitespace-nowrap t-footnote tabular-nums text-white/70">
                  <span className={zoomed ? 'hidden' : 'sm:hidden'}>{month.short}</span>
                  <span className={zoomed ? '' : 'hidden sm:inline'}>{month.label}</span>
                </span>)}
              </div>
            </div>
          </div>
          <div className="relative">
            <div aria-hidden className={`pointer-events-none absolute inset-y-0 right-0 ${AXIS_OFFSET}`}>
              {timeline.overlaps.map((overlap, index) => <span key={`${overlap.start}-${index}`} style={{ left: `${overlap.left}%`, width: `${overlap.width}%` }} className="absolute inset-y-0 bg-white/[0.09]" />)}
              {timeline.months.slice(1).map(month => <span key={month.key} style={{ left: `${month.left}%` }} className="absolute inset-y-0 w-px bg-white/[0.08]" />)}
              {timeline.todayPct !== null && <span style={{ left: `${timeline.todayPct}%` }} className="absolute inset-y-0 w-px bg-violet-300/70" />}
            </div>
            {timeline.rows.map(row => <TimelineRow key={row.key} row={row} copy={copy} expanded={expandedKey === row.key} labelId={labelId(row.key)} detailsId={detailsId}
              onOpen={() => expandedKey === row.key ? closeDetails() : setExpandedKey(row.key)} onLocate={onLocate} />)}
          </div>
        </div>
      </div>

      {expandedRow && <div id={detailsId} ref={detailsRef} tabIndex={-1} role="region" aria-label={copy.timelineDetails} className="scroll-mt-24 rounded-2xl border border-violet-300/30 bg-zinc-950 p-4 outline-none sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="t-footnote font-semibold text-violet-200">{expandedRow.university}</p>
            <h3 className="mt-1 break-words t-title-4 text-white">{expandedRow.programme}</h3>
          </div>
          <button type="button" onClick={closeDetails} className={`min-h-11 shrink-0 rounded-lg px-3 t-footnote text-white/80 ${focusClass}`}>{copy.calendarCollapse}</button>
        </div>
        {expandedRow.start && <p className="mt-3 t-footnote text-white/70">{copy.timelineVerifiedWindow}: {expandedRow.start} → {expandedRow.end}{!expandedRow.startKnown && <> · {copy.unknownOpening}</>}</p>}
        <ul className="mt-4 divide-y divide-white/10">
          {[...expandedRow.rounds].sort((first, second) => (first.details.deadlineOn ?? '').localeCompare(second.details.deadlineOn ?? '')).map(round => <li key={round.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div className="min-w-0 flex-1 basis-48">
              <p className="t-footnote font-semibold text-white/90">{round.details.roundName} · {round.details.intakeLabel}</p>
              <p className="mt-1 t-footnote text-white/80">{copy.deadline}: {mastersDeadlineLabel(round, locale)}</p>
              <p className="mt-1 t-footnote text-white/60">{mastersStateLabel(round, now, locale)}</p>
            </div>
            <button type="button" onClick={() => onLocate(round.id)} aria-label={`${round.details.roundName} · ${round.details.deadlineOn} · ${copy.calendarJump}`}
              className={`min-h-11 rounded-xl border border-white/15 px-3 py-2 t-footnote text-violet-200 ${focusClass}`}>{copy.calendarJump}</button>
          </li>)}
        </ul>
      </div>}

      <div className="space-y-2 border-t border-white/10 pt-4">
        <p className="t-footnote font-semibold text-white/80">{copy.calendarLegend}</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 t-footnote text-white/70">
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-2.5 w-6 rounded-sm" style={{ background: 'hsl(265 70% 52% / 0.55)' }} />{copy.timelineLegendKnown}</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-2.5 w-6 rounded-sm" style={{ background: 'linear-gradient(to right, hsl(190 70% 52% / 0) 0%, hsl(190 70% 52% / 0.55) 45%)' }} />{copy.timelineLegendFaded}</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-3 w-[3px] rounded-full bg-white/70" />{copy.timelineLegendMilestone}</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-2.5 w-6 rounded-sm bg-white/[0.09]" />{copy.timelineLegendOverlap}</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-2 w-2 rounded-full border border-amber-200" />{copy.calendarChanged}</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-3 w-px bg-violet-300" />{copy.timelineToday}</li>
        </ul>
        <p className="t-footnote text-white/70">{copy.timelineTickHint}</p>
        <p className="t-footnote text-white/60">{copy.timelineMilestoneHint}</p>
      </div>
    </section>
  );
}

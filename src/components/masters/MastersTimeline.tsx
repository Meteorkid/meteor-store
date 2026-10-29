'use client';

import { useMemo, useState } from 'react';
import type { MastersRound } from '@/lib/masters/types';
import { buildMastersTimeline, type MastersTimelineRow, type MastersTimelineSort } from '@/lib/masters/timeline';
import { mastersStateLabel } from './state';
import type { MastersCopy } from './text';

interface MastersTimelineProps {
  rounds: MastersRound[];
  now: Date;
  locale: 'zh' | 'en';
  copy: MastersCopy;
  onSelectRound: (roundId: string, trigger?: HTMLElement) => void;
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

function TimelineRow({ row, now, locale, copy, onSelectRound }: {
  row: MastersTimelineRow;
  now: Date;
  locale: 'zh' | 'en';
  copy: MastersCopy;
  onSelectRound: (roundId: string, trigger?: HTMLElement) => void;
}) {
  const round = row.rounds[0];
  const markers = [...row.milestones, ...row.outsideMarkers];
  const name = `${row.university} · ${row.programme} · ${round.details.roundName} · ${round.details.intakeLabel}`;
  const unknownStart = row.kind === 'span' && !row.startKnown;
  const status = row.past
    ? mastersStateLabel(round, now, locale)
    : row.kind === 'deadline' ? copy.timelineUnverifiedOpening
      : unknownStart ? copy.timelineUnknownStart : mastersStateLabel(round, now, locale);

  return <div className="flex items-stretch border-b border-white/10 last:border-b-0" data-timeline-row={row.key}>
    <button type="button" onClick={event => onSelectRound(round.id, event.currentTarget)} aria-haspopup="dialog"
      aria-label={`${name} · ${copy.timelineShowRounds}`}
      className={`${LABEL_COL} ${focusClass} sticky left-0 z-30 shrink-0 border-r border-white/10 bg-zinc-950 px-3 py-2.5 text-left`}>
      <span className="flex items-start gap-1.5 t-footnote font-semibold text-white/90">
        {row.changed && <span aria-hidden className="mt-1 h-2 w-2 shrink-0 rounded-full border border-amber-300/80" />}
        <span className="line-clamp-2 break-words">{row.university}</span>
      </span>
      <span className="mt-0.5 line-clamp-1 t-footnote text-white/70">{row.programme}</span>
      <span className="mt-1.5 block t-footnote font-semibold text-violet-200">{round.details.roundName}</span>
      <span className="block t-footnote text-white/75">{round.details.intakeLabel}</span>
      <span className="mt-1.5 block t-footnote text-white/70">{copy.timelineShowRounds}<span aria-hidden> →</span></span>
    </button>
    <div className="min-w-0 flex-1 overflow-hidden">
      <div className="min-h-14 px-2 pt-2 t-footnote text-white/80">
        <span className="block text-white/65">{row.start ? unknownStart ? `${copy.timelineAvailableNow} · ${copy.timelineFromToday}` : copy.timelinePeriod : copy.deadline}</span>
        <span className="block tabular-nums">
          {row.start && <><span className="whitespace-nowrap">{row.start}</span>{' '}<span aria-hidden>→</span>{' '}</>}
          <span className="whitespace-nowrap">{row.end}</span>
        </span>
      </div>
      <div className="relative h-11">
        {row.kind === 'span' && <button type="button" onClick={event => onSelectRound(round.id, event.currentTarget)} aria-haspopup="dialog"
          aria-label={`${name} · ${copy.timelineShowRounds}`}
          style={{ left: `${row.left}%`, width: `${row.width}%` }}
          className={`absolute top-0 z-10 h-11 rounded-md ${focusClass}`}>
          <span aria-hidden className="absolute inset-x-0 top-1/2 h-7 -translate-y-1/2 rounded-md" style={{ background: barFill(row.hue, row.past, row.startKnown) }} />
        </button>}
        {markers.map(marker => {
          const label = `${name} · ${marker.date} · ${copy.timelineShowRounds}`;
          return <span key={marker.roundId}>
            <button type="button" data-round-id={marker.roundId} aria-label={label} title={label} aria-haspopup="dialog"
              onClick={event => onSelectRound(marker.roundId, event.currentTarget)}
              style={{ left: `clamp(0px, calc(${marker.pct}% - 22px), calc(100% - 44px))`, width: '44px' }}
              className={`absolute top-0 z-20 h-11 rounded-md ${focusClass}`} />
            <span aria-hidden style={{ left: `${marker.pct}%`, background: `hsl(${row.hue} 70% 52% / ${marker.past ? 0.5 : 0.95})` }}
              className="pointer-events-none absolute top-1/2 z-20 h-5 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-white/40" />
          </span>;
        })}
      </div>
      <p className={`min-h-8 px-2 pb-2 t-footnote ${row.past ? 'text-white/60' : 'text-white/75'}`}>{status}</p>
    </div>
  </div>;
}

export default function MastersTimeline({ rounds, now, locale, copy, onSelectRound }: MastersTimelineProps) {
  const [sort, setSort] = useState<MastersTimelineSort>('school');
  const [zoomed, setZoomed] = useState(false);
  const timeline = useMemo(() => buildMastersTimeline(rounds, now, locale, sort), [rounds, now, locale, sort]);
  const pillClass = `min-h-11 rounded-lg px-3 py-2 t-footnote ${focusClass}`;

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
            {timeline.rows.map(row => <TimelineRow key={row.key} row={row} now={now} locale={locale} copy={copy} onSelectRound={onSelectRound} />)}
          </div>
        </div>
      </div>

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

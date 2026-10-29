'use client';

import { useMemo, useState } from 'react';
import type { MastersRound } from '@/lib/masters/types';
import { buildMastersTimeline, type MastersTimelineRow, type MastersTimelineSort } from '@/lib/masters/timeline';
import type { MastersCopy } from './text';

interface MastersTimelineProps {
  rounds: MastersRound[];
  now: Date;
  locale: 'zh' | 'en';
  copy: MastersCopy;
  /** 从总览跳回列表并定位到具体轮次。 */
  onLocate: (roundId: string) => void;
}

/** 左侧学校列宽度；网格线与今天线覆盖层必须用同一组类，否则百分比基准不一致。 */
const LABEL_COL = 'w-44 sm:w-60';
/** 只给绝对定位的网格线覆盖层用：absolutely positioned 时 left/right 同时生效，宽度才等于条形区。 */
const AXIS_OFFSET = 'left-44 sm:left-60';

/**
 * 起点未知时左端淡出而不是铺斜纹：月历里斜纹只占一格，甘特里整根条铺斜纹
 * 会被读成「这段不重要」，而实际只是起点不确定。
 */
function barFill(hue: number, past: boolean, startKnown: boolean): string {
  const alpha = past ? 0.28 : 0.55;
  if (startKnown) return `hsl(${hue} 70% 52% / ${alpha})`;
  return `linear-gradient(to right, hsl(${hue} 70% 52% / 0) 0%, hsl(${hue} 70% 52% / ${alpha}) 14%)`;
}

/** 左列学校 / 项目 / 起止，两种行共用。 */
function RowLabel({ row, copy }: { row: MastersTimelineRow; copy: MastersCopy }) {
  return <div className={`${LABEL_COL} shrink-0 border-r border-white/10 px-3 py-2.5`}>
    <p className="flex items-center gap-1.5 t-footnote font-semibold text-white/85">
      {/* 变更标记排在文字之前并禁止收缩：放后面会被 truncate 吞掉。 */}
      {row.changed && <span aria-hidden className="h-2 w-2 shrink-0 rounded-full border border-amber-300/80" />}
      <span className="truncate" title={row.university}>{row.university}</span>
      {/* 页头写的是轮次数，这里标出每行合并了几轮，数字才对得上。
          窄屏左列只有 151px，这个标签会让学校名过早截断，所以只在 sm 以上出现。 */}
      {row.rounds.length > 1 && <span className="ml-auto hidden shrink-0 tabular-nums t-footnote font-normal text-white/40 sm:inline">{copy.timelineRoundsChip.replace('{count}', String(row.rounds.length))}</span>}
    </p>
    <p className="mt-0.5 truncate t-footnote text-white/55" title={row.programme}>{row.programme}</p>
    {/* 手机左列只有 151px，完整区间要 176px。不换行会从日期中间断开（2027- / 01-31），
        所以让箭头带着截止日整体换行：两行仍是「起点 / 截止」两个完整日期。 */}
    <p className="mt-0.5 t-footnote tabular-nums text-white/45">
      {row.start
        ? <>
          <span className="whitespace-nowrap">{row.startKnown ? row.start : copy.calendarSpanOngoing}</span>{' '}
          <span className="whitespace-nowrap"><span aria-hidden>→</span> {row.end}</span>
        </>
        : <span className="whitespace-nowrap">{copy.timelineDeadlineOnlyShort} {row.end}</span>}
    </p>
  </div>;
}

function TimelineRow({ row, copy, onLocate }: {
  row: MastersTimelineRow;
  copy: MastersCopy;
  onLocate: (roundId: string) => void;
}) {
  const range = row.start
    ? `${row.startKnown ? row.start : copy.calendarSpanOngoing} → ${row.end}`
    : `${copy.timelineDeadlineOnlyShort} ${row.end}`;
  const label = `${row.university} · ${row.programme} · ${range}`;
  const common = {
    type: 'button' as const,
    onClick: () => onLocate(row.rounds[0].id),
    title: label,
    'aria-label': `${label} · ${copy.calendarJump}`,
  };

  return <div className="flex items-stretch border-b border-white/10 last:border-b-0">
    <RowLabel row={row} copy={copy} />
    <div className="relative flex-1">
      {row.kind === 'span'
        ? <button
          {...common}
          style={{ left: `${row.left}%`, width: `${row.width}%`, background: barFill(row.hue, row.past, row.startKnown) }}
          className="absolute top-1/2 h-7 -translate-y-1/2 overflow-hidden rounded-md"
        >
          {/* 每轮截止打一个刻度，末轮加粗——它就是这根条的右端。 */}
          {row.deadlineTicks.map((tick, index) => <span key={`${tick}-${index}`} aria-hidden style={{ left: `${tick}%` }} className={`absolute inset-y-0 ${index === row.deadlineTicks.length - 1 ? 'w-[3px] bg-white/90' : 'w-px bg-white/45'}`} />)}
        </button>
        /* 只有截止日：不画时长（会被读成「这段一直在开放」），整行做点击区，截止处标一个点。 */
        : <button {...common} className="absolute inset-0">
          {row.milestones.map(milestone => <span
            key={milestone.date}
            aria-hidden
            style={{ left: `${milestone.pct}%`, background: `hsl(${row.hue} 70% 52% / ${milestone.past ? 0.4 : 0.8})` }}
            className="absolute top-1/2 h-4 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          />)}
        </button>}
      {/* 条外的截止点（窗口开始前就已截止的轮次）单独标出来，不能塞进条内。 */}
      {row.outsideMarkers.map(marker => <span
        key={`outside-${marker.date}`}
        aria-hidden
        style={{ left: `${marker.pct}%`, background: `hsl(${row.hue} 70% 52% / ${marker.past ? 0.4 : 0.8})` }}
        className="pointer-events-none absolute top-1/2 h-4 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      />)}
    </div>
  </div>;
}

export default function MastersTimeline({ rounds, now, locale, copy, onLocate }: MastersTimelineProps) {
  const [sort, setSort] = useState<MastersTimelineSort>('school');
  const timeline = useMemo(() => buildMastersTimeline(rounds, now, locale, sort), [rounds, now, locale, sort]);
  const pillClass = 'min-h-9 rounded-lg px-3 py-1.5 t-footnote';
  /** 「今天」徽标宽约 39px，轴首尾各留半个徽标：否则今天正好落在窗口首日/末日时会被卡片裁掉一半。 */
  const todayShift = timeline.todayPct === null ? '-50%'
    : timeline.todayPct <= 3 ? '0%'
      : timeline.todayPct >= 97 ? '-100%' : '-50%';

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
    <section className="space-y-4" aria-labelledby="masters-timeline-title">
      <div className="flex flex-wrap items-center gap-3">
        <h2 id="masters-timeline-title" className="t-title-3 text-white">{copy.timelineTitle}</h2>
        <div className="ml-auto inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1" role="group" aria-label={copy.timelineSort}>
          {(['school', 'deadline'] as const).map(value => <button key={value} type="button" onClick={() => setSort(value)} aria-pressed={sort === value} className={`${pillClass} ${sort === value ? 'bg-white/10 text-white' : 'text-white/60'}`}>{value === 'school' ? copy.timelineSortSchool : copy.timelineSortDeadline}</button>)}
        </div>
      </div>

      <div className="space-y-1">
        <p className="t-footnote text-white/60">{copy.timelineRange
          .replace('{count}', String(timeline.rows.length))
          .replace('{rounds}', String(timeline.roundCount))
          .replace('{start}', timeline.start)
          .replace('{end}', timeline.end)}</p>
        {/* 只有截止日的项目不画时长条，必须说明白，否则会被当成漏画。 */}
        {timeline.deadlineOnlyCount > 0 && <p className="t-footnote text-white/60">{copy.timelineMilestoneNote.replace('{count}', String(timeline.deadlineOnlyCount))}</p>}
        {timeline.overlapDays > 0 && <p className="t-footnote text-white/60">{copy.timelineOverlapNote.replace('{count}', String(timeline.overlapDays))}</p>}
        {timeline.undatedCount > 0 && <p className="t-footnote text-white/60">{copy.timelineUndatedNote.replace('{count}', String(timeline.undatedCount))}</p>}
        <p className="t-footnote text-white/60">{copy.timelineHint}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        {/* 表头与数据行用同一套 flex 结构：relative + left-* 定位下 right:0 会被忽略，
            表头宽度仍是整行，百分比基准就和条形错开一整个左列的宽度。 */}
        <div className="flex items-stretch border-b border-white/10 bg-white/[0.03]">
          <div className={`${LABEL_COL} shrink-0 border-r border-white/10`} />
          <div className="relative flex-1">
            {/* 「今天」单独占一行：与月份同处一条垂直带时，390px 下 10 月/11 月标签会被它压住
                （实测重叠 23px / 15px），桌面也有 35px。 */}
            {timeline.todayPct !== null && <div className="relative h-6">
              <span style={{ left: `${timeline.todayPct}%`, transform: `translateX(${todayShift})` }} className="absolute bottom-0.5 whitespace-nowrap rounded-full bg-violet-400/20 px-1.5 t-footnote text-violet-100">{copy.timelineToday}</span>
            </div>}
            <div className="relative h-7">
              {timeline.months.map(month => <span key={month.key} aria-hidden style={{ left: `${month.left}%`, width: `${month.width}%` }} className="absolute inset-y-0 flex items-center justify-center t-footnote tabular-nums text-white/50">
                {/* 8 个月 × 21px 时「10月」会换行堆叠，窄屏只给数字。 */}
                <span className="sm:hidden">{month.short}</span>
                <span className="hidden sm:inline">{month.label}</span>
              </span>)}
            </div>
          </div>
        </div>

        <div className="relative">
          {/* 网格线、重叠带与今天线画在覆盖层里：逐行画会在每行首尾出现断口。 */}
          <div aria-hidden className={`pointer-events-none absolute inset-y-0 right-0 ${AXIS_OFFSET}`}>
            {/* 两个及以上项目同时开放的时间带，垫在网格线下面。 */}
            {timeline.overlaps.map((overlap, index) => <span key={`${overlap.start}-${index}`} style={{ left: `${overlap.left}%`, width: `${overlap.width}%` }} className="absolute inset-y-0 bg-white/[0.09]" />)}
            {timeline.months.slice(1).map(month => <span key={month.key} style={{ left: `${month.left}%` }} className="absolute inset-y-0 w-px bg-white/[0.08]" />)}
            {timeline.todayPct !== null && <span style={{ left: `${timeline.todayPct}%` }} className="absolute inset-y-0 w-px bg-violet-300/70" />}
          </div>
          {timeline.rows.map(row => <TimelineRow key={row.key} row={row} copy={copy} onLocate={onLocate} />)}
        </div>
      </div>

      <div className="space-y-2 border-t border-white/10 pt-4">
        <p className="t-footnote font-semibold text-white/80">{copy.calendarLegend}</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 t-footnote text-white/70">
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-2.5 w-6 rounded-sm" style={{ background: 'hsl(265 70% 52% / 0.55)' }} />{copy.timelineLegendKnown}</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-2.5 w-6 rounded-sm" style={{ background: 'linear-gradient(to right, hsl(190 70% 52% / 0) 0%, hsl(190 70% 52% / 0.55) 45%)' }} />{copy.timelineLegendFaded}</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-3 w-[3px] rounded-full bg-white/45" />{copy.timelineLegendMilestone}</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-2.5 w-6 rounded-sm bg-white/[0.09]" />{copy.timelineLegendOverlap}</li>
          {/* 实心点已被状态色占用，变更沿用月历的空心环，同形不同义会读错。 */}
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-2 w-2 rounded-full border border-amber-200" />{copy.calendarChanged}</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-3 w-px bg-violet-300" />{copy.timelineToday}</li>
        </ul>
        <p className="t-footnote text-white/60">{copy.timelineTickHint}</p>
        <p className="t-footnote text-white/60">{copy.timelineMilestoneHint}</p>
        <p className="t-footnote text-white/60">{copy.calendarSpanHint}</p>
        <p className="t-footnote text-white/60">{copy.calendarHint}</p>
      </div>
    </section>
  );
}

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

function TimelineRow({ row, copy, onLocate }: {
  row: MastersTimelineRow;
  copy: MastersCopy;
  onLocate: (roundId: string) => void;
}) {
  const { span } = row;
  const range = span.startKnown ? `${span.start} → ${span.end}` : `${copy.calendarSpanOngoing} → ${span.end}`;
  const label = `${span.university} · ${span.programme} · ${range}`;
  return <div className="flex items-stretch border-b border-white/10 last:border-b-0">
    <div className={`${LABEL_COL} shrink-0 border-r border-white/10 px-3 py-2.5`}>
      <p className="flex items-center gap-1.5 t-footnote font-semibold text-white/85">
        {/* 变更标记排在文字之前并禁止收缩：放后面会被 truncate 吞掉。 */}
        {span.changed && <span aria-hidden className="h-2 w-2 shrink-0 rounded-full border border-amber-300/80" />}
        <span className="truncate" title={span.university}>{span.university}</span>
      </p>
      <p className="mt-0.5 truncate t-footnote text-white/55" title={span.programme}>{span.programme}</p>
      {/* 手机左列只有 151px，完整区间要 176px。不换行会从日期中间断开（2027- / 01-31），
          所以让箭头带着截止日整体换行：两行仍是「起点 / 截止」两个完整日期。 */}
      <p className="mt-0.5 t-footnote tabular-nums text-white/45">
        <span className="whitespace-nowrap">{span.startKnown ? span.start : copy.calendarSpanOngoing}</span>{' '}
        <span className="whitespace-nowrap"><span aria-hidden>→</span> {span.end}</span>
      </p>
    </div>
    <div className="relative flex-1">
      <button
        type="button"
        onClick={() => onLocate(span.rounds[0].id)}
        title={label}
        aria-label={`${label} · ${copy.calendarJump}`}
        style={{ left: `${row.left}%`, width: `${row.width}%`, background: barFill(row.hue, span.past, span.startKnown) }}
        className="absolute top-1/2 h-7 -translate-y-1/2 overflow-hidden rounded-md"
      >
        {/* 每轮截止打一个刻度，末轮加粗——它就是这根条的右端。 */}
        {row.deadlineTicks.map((tick, index) => <span key={`${tick}-${index}`} aria-hidden style={{ left: `${tick}%` }} className={`absolute inset-y-0 ${index === row.deadlineTicks.length - 1 ? 'w-[3px] bg-white/90' : 'w-px bg-white/45'}`} />)}
      </button>
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
          .replace('{start}', timeline.start)
          .replace('{end}', timeline.end)}</p>
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
              {timeline.months.map(month => <span key={month.key} aria-hidden style={{ left: `${month.left}%`, width: `${month.width}%` }} className="absolute inset-y-0 flex items-center justify-center t-footnote tabular-nums text-white/50">{month.label}</span>)}
            </div>
          </div>
        </div>

        <div className="relative">
          {/* 网格线与今天线画在覆盖层里：逐行画会在每行首尾出现断口。 */}
          <div aria-hidden className={`pointer-events-none absolute inset-y-0 right-0 ${AXIS_OFFSET}`}>
            {timeline.months.slice(1).map(month => <span key={month.key} style={{ left: `${month.left}%` }} className="absolute inset-y-0 w-px bg-white/[0.08]" />)}
            {timeline.todayPct !== null && <span style={{ left: `${timeline.todayPct}%` }} className="absolute inset-y-0 w-px bg-violet-300/70" />}
          </div>
          {timeline.rows.map(row => <TimelineRow key={row.span.key} row={row} copy={copy} onLocate={onLocate} />)}
        </div>
      </div>

      <div className="space-y-2 border-t border-white/10 pt-4">
        <p className="t-footnote font-semibold text-white/80">{copy.calendarLegend}</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 t-footnote text-white/70">
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-2.5 w-6 rounded-sm" style={{ background: 'hsl(265 70% 52% / 0.55)' }} />{copy.timelineLegendKnown}</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-2.5 w-6 rounded-sm" style={{ background: 'linear-gradient(to right, hsl(190 70% 52% / 0) 0%, hsl(190 70% 52% / 0.55) 45%)' }} />{copy.timelineLegendFaded}</li>
          {/* 实心点已被状态色占用，变更沿用月历的空心环，同形不同义会读错。 */}
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-2 w-2 rounded-full border border-amber-200" />{copy.calendarChanged}</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-3 w-px bg-violet-300" />{copy.timelineToday}</li>
        </ul>
        <p className="t-footnote text-white/60">{copy.timelineTickHint}</p>
        <p className="t-footnote text-white/60">{copy.calendarSpanHint}</p>
        <p className="t-footnote text-white/60">{copy.calendarHint}</p>
      </div>
    </section>
  );
}

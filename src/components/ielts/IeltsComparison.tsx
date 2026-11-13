'use client';

import { useMemo, useState } from 'react';
import { IELTS_FOCUS_LABELS, type IeltsFocus, type IeltsSegment } from '@/lib/ielts/types';
import { ieltsCopy, type IeltsLocale } from './ielts-text';

/**
 * 左右对照的主体。
 *
 * 逐句模式：一行一对句子，左 5 分档、右 8 分档；点开看这一句改了什么。
 * 全文模式：两栏各成一篇完整文章，先自己读一遍再回到逐句模式。
 *
 * 移动端不并排（并排会让每句都折成好几行），改成同一行上下堆叠，
 * 每句前面带小标签，顺序与桌面一致。
 */

const FOCUS_ORDER: IeltsFocus[] = ['task', 'cohesion', 'lexis', 'grammar', 'accuracy'];

interface Props {
  locale: IeltsLocale;
  segments: IeltsSegment[];
}

export default function IeltsComparison({ locale, segments }: Props) {
  const copy = ieltsCopy(locale);
  const [view, setView] = useState<'segments' | 'full'>('segments');
  const [focus, setFocus] = useState<'all' | IeltsFocus>('all');
  const [showNotes, setShowNotes] = useState(false);
  const [openRows, setOpenRows] = useState<number[]>([]);

  const paragraphStarts = useMemo(() => {
    const starts = new Set<number>();
    segments.forEach((segment, index) => {
      if (index === 0 || segment.paragraph !== segments[index - 1].paragraph) starts.add(index);
    });
    return starts;
  }, [segments]);

  const fullText = useMemo(() => {
    const build = (side: 'low' | 'high') => {
      const paragraphs: string[][] = [];
      for (const segment of segments) {
        const index = segment.paragraph - 1;
        while (paragraphs.length <= index) paragraphs.push([]);
        paragraphs[index].push(segment[side]);
      }
      return paragraphs.map(paragraph => paragraph.join(' '));
    };
    return { low: build('low'), high: build('high') };
  }, [segments]);

  const toggleRow = (index: number) => {
    setOpenRows(current => (current.includes(index) ? current.filter(item => item !== index) : [...current, index]));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-4">
        <div role="group" aria-label={copy.viewSegments} className="flex rounded-full border border-white/12 bg-white/5 p-0.5">
          {(['segments', 'full'] as const).map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => setView(mode)}
              aria-pressed={view === mode}
              className={`min-h-9 rounded-full px-3 text-sm transition-colors ${view === mode ? 'bg-white/15 font-semibold text-white' : 'text-white/65 hover:text-white'}`}
            >
              {mode === 'segments' ? copy.viewSegments : copy.viewFull}
            </button>
          ))}
        </div>

        {view === 'segments' && (
          <>
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={copy.focusAll}>
              <button
                type="button"
                onClick={() => setFocus('all')}
                aria-pressed={focus === 'all'}
                className={`min-h-8 rounded-full border px-3 text-xs transition-colors ${focus === 'all' ? 'border-violet-400/60 bg-violet-400/15 text-white' : 'border-white/12 text-white/60 hover:text-white/85'}`}
              >
                {copy.focusAll}
              </button>
              {FOCUS_ORDER.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFocus(current => (current === item ? 'all' : item))}
                  aria-pressed={focus === item}
                  className={`min-h-8 rounded-full border px-3 text-xs transition-colors ${focus === item ? 'border-violet-400/60 bg-violet-400/15 text-white' : 'border-white/12 text-white/60 hover:text-white/85'}`}
                >
                  {IELTS_FOCUS_LABELS[item][locale]}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowNotes(current => !current)}
              aria-pressed={showNotes}
              className="ml-auto min-h-8 rounded-full border border-white/12 px-3 text-xs text-white/70 transition-colors hover:text-white"
            >
              {showNotes ? copy.hideNotes : copy.showNotes}
            </button>
          </>
        )}
      </div>

      <p className="mt-3 t-footnote text-white/50">{view === 'segments' ? copy.clickHint : copy.viewHint}</p>

      {view === 'full' ? (
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          {(['low', 'high'] as const).map(side => (
            <section key={side} aria-label={side === 'low' ? copy.bandLowFull : copy.bandHighFull}>
              <h3 className={`t-title-4 ${side === 'low' ? 'text-white/60' : 'text-violet-200'}`}>
                {side === 'low' ? copy.bandLowFull : copy.bandHighFull}
              </h3>
              <div className="mt-3 space-y-4">
                {fullText[side].map((paragraph, index) => (
                  <p key={index} className="t-body text-white/85">{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <ol className="mt-6 space-y-3">
          {segments.map((segment, index) => {
            const dimmed = focus !== 'all' && !segment.focus.includes(focus);
            const open = showNotes || openRows.includes(index);
            const noteId = `ielts-note-${index}`;
            return (
              <li key={index}>
                {paragraphStarts.has(index) && (
                  <p className="mb-2 t-eyebrow text-white/35">¶ {segment.paragraph}</p>
                )}
                <button
                  type="button"
                  onClick={() => toggleRow(index)}
                  aria-expanded={open}
                  aria-controls={noteId}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition-all md:grid md:grid-cols-2 md:gap-5 ${
                    open ? 'border-violet-400/40 bg-white/8' : 'border-white/10 hover:border-white/25 hover:bg-white/5'
                  } ${dimmed ? 'opacity-35' : ''}`}
                >
                  <span className="block">
                    <span className="mb-1 block text-[11px] font-semibold tracking-wide text-white/40 md:hidden">{copy.lowLabel}</span>
                    <span className="t-body text-white/70">{segment.low}</span>
                  </span>
                  <span className="mt-3 block md:mt-0">
                    <span className="mb-1 block text-[11px] font-semibold tracking-wide text-violet-300/70 md:hidden">{copy.highLabel}</span>
                    <span className="t-body text-white">{segment.high}</span>
                  </span>
                </button>
                <div id={noteId} hidden={!open} className="mt-2 rounded-xl border border-white/10 bg-black/40 px-3 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {segment.focus.map(item => (
                      <span key={item} className="rounded-full border border-violet-400/30 bg-violet-400/10 px-2 py-0.5 text-[11px] text-violet-200">
                        {IELTS_FOCUS_LABELS[item][locale]}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 t-footnote text-white/75">{segment.note[locale]}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

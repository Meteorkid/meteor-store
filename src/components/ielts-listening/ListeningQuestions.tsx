'use client';

import { useMemo, type ReactNode } from 'react';
import {
  listeningQuestionLocations,
  type ListeningGrade, type ListeningLesson, type ListeningQuestionResult,
  type ListeningSection,
} from '@/lib/ielts-listening/types';
import { listeningText, type ListeningLocale } from './listening-text';
import { toggleMultipleAnswer } from './listening-answers';

/**
 * 答题区。四种题型共用同一套题号与答案记录：answers[题号] = 字符串。
 * 多选题把勾选的字母按勾选顺序落到该组的连续题号上，与判分口径一致。
 */

interface Props {
  lesson: Pick<ListeningLesson, 'sections' | 'part' | 'answers'>;
  answers: Record<string, string>;
  onChange(next: Record<string, string>): void;
  /** 本次计分的题号；null 表示整篇。 */
  scope: number[] | null;
  graded: boolean;
  grade: ListeningGrade | null;
  locale: ListeningLocale;
  disabled?: boolean;
}

function resultOf(grade: ListeningGrade | null, number: number): ListeningQuestionResult | undefined {
  return grade?.results.find(item => item.number === number);
}

function fieldTone(result: ListeningQuestionResult | undefined): string {
  if (!result) return 'border-white/25 bg-black/40 focus:border-violet-300/70';
  return result.correct
    ? 'border-emerald-400/60 bg-emerald-400/10'
    : 'border-rose-400/60 bg-rose-400/10';
}

function optionTone(state: 'idle' | 'selected' | 'correct' | 'wrong'): string {
  if (state === 'correct') return 'border-emerald-400/60 bg-emerald-400/10';
  if (state === 'wrong') return 'border-rose-400/60 bg-rose-400/10';
  if (state === 'selected') return 'border-violet-300/60 bg-violet-400/15';
  return 'border-white/15 bg-white/[0.03] hover:border-white/35';
}


export default function ListeningQuestions({ lesson, answers, onChange, scope, graded, grade, locale, disabled = false }: Props) {
  const copy = listeningText[locale].practice;
  const locations = useMemo(() => listeningQuestionLocations(lesson), [lesson]);
  const sectionNumbers = useMemo(() => {
    const map = new Map<number, number[]>();
    locations.forEach(location => {
      const bucket = map.get(location.sectionIndex) ?? [];
      bucket.push(location.number);
      map.set(location.sectionIndex, bucket);
    });
    return map;
  }, [locations]);
  const inScope = (number: number) => !scope || scope.includes(number);

  function setValue(number: number, value: string) {
    const next = { ...answers };
    if (value) next[String(number)] = value; else delete next[String(number)];
    onChange(next);
  }

  function selectedLetters(numbers: number[]): string[] {
    return numbers.map(number => answers[String(number)] ?? '').filter(Boolean);
  }

  function blank(number: number, inline: boolean) {
    if (!inScope(number)) {
      return <span className="inline-flex min-h-8 items-center rounded border border-dashed border-white/15 px-2 text-xs text-white/35">{number}</span>;
    }
    const value = answers[String(number)] ?? '';
    const result = graded ? resultOf(grade, number) : undefined;
    return <span className={`inline-flex items-center gap-1 ${inline ? 'align-baseline' : ''}`}>
      <span aria-hidden="true" className="text-[11px] font-semibold tabular-nums text-white/45">{number}</span>
      <input
        type="text" value={value} disabled={disabled} autoComplete="off" spellCheck={false}
        aria-label={copy.wrongBadge(number)}
        onChange={event => setValue(number, event.target.value)}
        style={{ width: `${Math.min(22, Math.max(7, value.length + 2))}ch` }}
        className={`min-h-9 max-w-full rounded-md border px-2 py-1 text-base leading-6 text-white outline-none transition-colors ${fieldTone(result)} ${graded ? '' : 'focus:outline-1 focus:outline-violet-300/40'}`}
      />
      {result && !result.correct && <span className="text-xs text-emerald-200">→ {result.accepted}</span>}
    </span>;
  }

  function segments(cell: Array<{ text: string } | { blank: number }>): ReactNode {
    return cell.map((segment, index) => 'text' in segment
      ? <span key={index} className="whitespace-pre-wrap">{segment.text}</span>
      : <span key={index}>{blank(segment.blank, true)}</span>);
  }

  function lead(rowLead: string | { blank: number } | undefined) {
    if (rowLead === undefined) return null;
    return typeof rowLead === 'string' ? <span className="text-white/80">{rowLead}</span> : blank(rowLead.blank, false);
  }

  function sectionHeader(section: ListeningSection, index: number) {
    const numbers = sectionNumbers.get(index) ?? [];
    const wordLimit = section.kind === 'completion' ? section.wordLimit : null;
    return <div className="mb-3 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-white/70">
          {numbers[0]}–{numbers.at(-1)}
        </span>
        {wordLimit && <span className="rounded border border-white/15 px-2 py-0.5 text-[11px] tracking-wide text-white/60">{wordLimit}</span>}
        {section.kind === 'choice-multiple' && <span className="text-[11px] text-white/60">{copy.selectCount(section.select)}</span>}
      </div>
      <p className="text-[13px] leading-6 text-white/60">{section.instruction}</p>
    </div>;
  }

  return <div className="space-y-4">
    {lesson.sections.map((section, sectionIndex) => {
      const numbers = sectionNumbers.get(sectionIndex) ?? [];
      const visible = numbers.some(inScope);
      if (!visible) return null;
      const columns = section.kind === 'completion' ? section.columns : undefined;
      return <section key={sectionIndex} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
        {sectionHeader(section, sectionIndex)}
        {section.kind === 'completion' && (columns
          ? <div className="-mx-1 overflow-x-auto px-1">
            <table className="w-full min-w-[34rem] border-collapse text-[15px]">
              <thead><tr>{columns.map(column => <th key={column} scope="col" className="border-b border-white/15 px-3 py-2 text-left text-xs font-semibold tracking-wide text-white/60">{column}</th>)}</tr></thead>
              <tbody>
                {section.rows.map((row, rowIndex) => <tr key={rowIndex} className="border-b border-white/[0.06] last:border-0">
                  <td className="px-3 py-2 align-top text-white/80" style={{ width: `${100 / columns.length}%` }}>{lead(row.lead)}</td>
                  {row.cells.map((cell, cellIndex) => <td key={cellIndex} className="px-3 py-2 align-top leading-8">{segments(cell)}</td>)}
                </tr>)}
              </tbody>
            </table>
          </div>
          : <dl className="space-y-2">
            {section.rows.map((row, rowIndex) => <div key={rowIndex} className="grid gap-x-3 gap-y-1 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:items-baseline">
              <dt className="text-[15px] leading-7 text-white/75">{lead(row.lead)}</dt>
              <dd className="space-y-1 text-[15px] leading-8">{row.cells.map((cell, cellIndex) => <div key={cellIndex}>{segments(cell)}</div>)}</dd>
            </div>)}
          </dl>)}
        {section.kind === 'choice-single' && <div className="space-y-4">
          {section.questions.map(question => {
            const result = graded ? resultOf(grade, question.number) : undefined;
            const chosen = answers[String(question.number)] ?? '';
            return <fieldset key={question.number} disabled={disabled || !inScope(question.number)} className={inScope(question.number) ? '' : 'opacity-50'}>
              <legend className="mb-2 text-[15px] font-medium leading-7 text-white/90">
                <span className="mr-2 inline-flex min-w-6 justify-center rounded bg-white/10 px-1 text-xs font-semibold tabular-nums text-white/70">{question.number}</span>
                {question.stem}
              </legend>
              <div className="space-y-1.5">
                {question.options.map(option => {
                  const state = result ? (option.key === result.accepted ? 'correct' : option.key === chosen ? 'wrong' : 'idle') : option.key === chosen ? 'selected' : 'idle';
                  return <label key={option.key} className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-[14px] leading-6 transition-colors ${optionTone(state)}`}>
                    <input type="radio" name={`listening-q-${question.number}`} value={option.key} checked={chosen === option.key}
                      onChange={() => setValue(question.number, option.key)} className="sr-only" />
                    <span className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${state === 'selected' ? 'border-violet-200 text-violet-100' : state === 'correct' ? 'border-emerald-300 text-emerald-100' : 'border-white/30 text-white/60'}`}>{option.key}</span>
                    <span className="min-w-0">{option.text}</span>
                  </label>;
                })}
              </div>
              {result && !result.correct && <p className="mt-1.5 text-xs text-emerald-200">{copy.correctAnswer}: {result.accepted}</p>}
            </fieldset>;
          })}
        </div>}
        {section.kind === 'choice-multiple' && (() => {
          const picked = selectedLetters(numbers);
          return <fieldset disabled={disabled}>
            <legend className="mb-2 text-[15px] font-medium leading-7 text-white/90">{section.stem}</legend>
            <div className="mb-2 flex items-center gap-2 text-[11px] text-white/55">
              <span>{copy.selectCount(section.select)}</span>
              <span className="tabular-nums">{copy.selectedCount(picked.length, section.select)}</span>
              <span className="flex flex-wrap gap-1">{numbers.map(number => {
                const result = graded ? resultOf(grade, number) : undefined;
                return <span key={number} className={`rounded px-1.5 py-0.5 font-semibold tabular-nums ${result ? (result.correct ? 'bg-emerald-400/20 text-emerald-100' : 'bg-rose-400/20 text-rose-100') : 'bg-white/10 text-white/60'}`}>
                  {number}{answers[String(number)] ? ` ${answers[String(number)]}` : ' —'}
                </span>;
              })}</span>
            </div>
            <div className="space-y-1.5">
              {section.options.map(option => {
                const chosen = picked.includes(option.key);
                const result = graded ? resultOf(grade, numbers[0]) : undefined;
                const expected = graded ? numbers.map(number => resultOf(grade, number)?.accepted) : [];
                const state = result ? (expected.includes(option.key) ? 'correct' : chosen ? 'wrong' : 'idle') : chosen ? 'selected' : 'idle';
                return <label key={option.key} className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-[14px] leading-6 transition-colors ${optionTone(state)}`}>
                  <input type="checkbox" checked={chosen} className="sr-only"
                    onChange={() => onChange(toggleMultipleAnswer(answers, numbers, section.select, option.key))} />
                  <span className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded border text-[11px] font-bold ${state === 'selected' ? 'border-violet-200 text-violet-100' : state === 'correct' ? 'border-emerald-300 text-emerald-100' : 'border-white/30 text-white/60'}`}>{chosen ? '✓' : option.key}</span>
                  <span className="min-w-0"><span className="mr-1.5 font-semibold text-white/70">{option.key}</span>{option.text}</span>
                </label>;
              })}
            </div>
            {graded && <p className="mt-1.5 text-xs text-emerald-200">{copy.correctAnswer}: {numbers.map(number => resultOf(grade, number)?.accepted).filter(Boolean).join(', ')}</p>}
          </fieldset>;
        })()}
        {section.kind === 'matching' && <div className="space-y-3">
          <ul className="grid gap-1 rounded-xl border border-white/10 bg-black/25 p-3 text-[13px] leading-6 text-white/70 sm:grid-cols-2">
            {section.options.map(option => <li key={option.key}><span className="mr-1.5 font-semibold text-white/85">{option.key}</span>{option.text}</li>)}
          </ul>
          <div className="space-y-2">
            {section.items.map(item => {
              const result = graded ? resultOf(grade, item.number) : undefined;
              return <div key={item.number} className="flex flex-col gap-1.5 rounded-lg border border-white/10 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="min-w-0 text-[14px] leading-6 text-white/85">
                  <span className="mr-2 inline-flex min-w-6 justify-center rounded bg-white/10 px-1 text-xs font-semibold tabular-nums text-white/70">{item.number}</span>
                  {item.text}
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <select
                    value={answers[String(item.number)] ?? ''} disabled={disabled || !inScope(item.number)}
                    onChange={event => setValue(item.number, event.target.value)}
                    aria-label={`${copy.wrongBadge(item.number)}`}
                    className={`min-h-10 rounded-lg border px-2 text-base text-white ${fieldTone(result)}`}>
                    <option value="">—</option>
                    {section.options.map(option => <option key={option.key} value={option.key}>{option.key}</option>)}
                  </select>
                  {result && !result.correct && <span className="text-xs text-emerald-200">→ {result.accepted}</span>}
                </span>
              </div>;
            })}
          </div>
        </div>}
      </section>;
    })}
    <p className="t-footnote text-white/45">
      {scope ? copy.scopeHint : copy.transcriptClosed}
    </p>
  </div>;
}

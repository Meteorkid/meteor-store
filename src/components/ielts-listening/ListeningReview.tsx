'use client';

import {
  listeningQuestionLocations,
  type ListeningGrade, type ListeningLesson, type ListeningSection,
} from '@/lib/ielts-listening/types';
import { listeningText, type ListeningLocale } from './listening-text';

/**
 * 提交后的解析：逐题给出作答、正确答案、解析与原文定位。
 * 解析文字来自内容里的 explanation，不在这里另写判分说明；题型只影响题目标题的还原方式。
 */

interface Props {
  lesson: Pick<ListeningLesson, 'sections' | 'answers' | 'part'>;
  locale: ListeningLocale;
  grade: ListeningGrade;
  answers: Record<string, string>;
  onPlaySentence(index: number): void;
  onLocateSentence(index: number): void;
}

/** 填空题的题目还原：把含该题空位的那一行拼回来，填空用 ___ 表示。 */
function completionPrompt(section: ListeningSection, number: number): string {
  if (section.kind !== 'completion') return '';
  for (const row of section.rows) {
    const parts: string[] = [];
    if (typeof row.lead === 'string') parts.push(row.lead);
    else if (row.lead?.blank === number) parts.push('___');
    for (const cell of row.cells) {
      for (const segment of cell) {
        if ('text' in segment) parts.push(segment.text);
        else parts.push(segment.blank === number ? '___' : `(${segment.blank})`);
      }
    }
    const contains = (typeof row.lead !== 'string' && row.lead?.blank === number)
      || row.cells.some(cell => cell.some(segment => 'blank' in segment && segment.blank === number));
    if (contains) return parts.join(' ').replace(/\s+/g, ' ').trim();
  }
  return '';
}

function questionPrompt(lesson: Pick<ListeningLesson, 'sections' | 'part'>, number: number): string {
  const location = listeningQuestionLocations(lesson).find(item => item.number === number);
  if (!location) return '';
  const section = lesson.sections[location.sectionIndex];
  switch (section.kind) {
    case 'completion': return completionPrompt(section, number);
    case 'choice-single': return section.questions.find(question => question.number === number)?.stem ?? '';
    case 'choice-multiple': return section.stem;
    case 'matching': return section.items.find(item => item.number === number)?.text ?? '';
  }
}

export default function ListeningReview({ lesson, locale, grade, answers, onPlaySentence, onLocateSentence }: Props) {
  const copy = listeningText[locale];
  const labels = listeningText[locale].kinds;
  const locations = listeningQuestionLocations(lesson);
  const kindsAt = new Map(locations.map(location => [location.number, lesson.sections[location.sectionIndex].kind] as const));

  return <section aria-label={copy.practice.reviewTitle} className="rounded-2xl border border-white/12 bg-white/[0.04] p-4 sm:p-5">
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="t-eyebrow text-white/50">{copy.practice.reviewTitle}</p>
        <p className="mt-1 text-3xl font-bold tabular-nums text-white">{grade.score}<span className="text-lg font-medium text-white/50"> / {grade.total}</span></p>
      </div>
      <p className="t-footnote text-white/60">{copy.practice.correctCount(grade.score, grade.total)}</p>
    </div>
    <ol className="space-y-2">
      {grade.results.map(result => {
        const answer = lesson.answers.find(item => item.number === result.number);
        const kind = kindsAt.get(result.number) ?? 'completion';
        const given = answers[String(result.number)] ?? '';
        return <li key={result.number} className={`rounded-xl border p-3 ${result.correct ? 'border-emerald-400/25 bg-emerald-400/[0.05]' : 'border-rose-400/30 bg-rose-400/[0.06]'}`}>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="inline-flex min-w-6 justify-center rounded bg-white/10 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white/75">{result.number}</span>
            <span className="text-[11px] text-white/45">{labels[kind]}</span>
            <span className={`text-xs font-semibold ${result.correct ? 'text-emerald-200' : 'text-rose-200'}`}>{result.correct ? '✓' : '✕'}</span>
          </div>
          {answer && <p className="mt-1.5 text-[13px] leading-6 text-white/60">{questionPrompt(lesson, result.number)}</p>}
          <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[13px]">
            <div className="flex items-baseline gap-1.5"><dt className="text-white/45">{copy.practice.yourAnswer}</dt>
              <dd className={given ? 'font-medium text-white/85' : 'text-white/40'}>{given || copy.practice.unanswered}</dd></div>
            <div className="flex items-baseline gap-1.5"><dt className="text-white/45">{copy.practice.correctAnswer}</dt>
              <dd className="font-medium text-emerald-200">{answer?.accepted.join(' / ')}</dd></div>
          </dl>
          {answer && <p className="mt-2 text-[13px] leading-7 text-white/75">{answer.explanation[locale]}</p>}
          {answer && <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="t-footnote text-white/40">{copy.practice.evidence} · {copy.practice.sentenceNo(answer.evidence + 1)}</span>
            <button type="button" onClick={() => onPlaySentence(answer.evidence)}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/20 px-2.5 text-xs text-white/80 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-violet-300">
              <span aria-hidden="true">▶</span>{copy.practice.replay}
            </button>
            <button type="button" onClick={() => onLocateSentence(answer.evidence)}
              className="inline-flex min-h-9 items-center rounded-lg border border-white/20 px-2.5 text-xs text-white/80 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-violet-300">
              {copy.practice.locate}
            </button>
          </div>}
        </li>;
      })}
    </ol>
  </section>;
}

'use client';

import { useId, useState } from 'react';
import { inferDailyRoleType, type DailyContent, type DailyLinkItem, type EnglishContent } from '@/lib/daily/types';
import { gradeAnswers } from './state';
import type { DailyCopy } from './text';

const roleLabels = { internship: 'internshipRole', graduate: 'graduateRole', unknown: 'unknownRole' } as const;
const workModeLabels = { remote: 'remote', hybrid: 'hybrid', onsite: 'onsite', unknown: 'unknownWorkMode' } as const;

const announcementLabels = { new: 'newPaper', cross: 'crossListed', replace: 'revised', 'replace-cross': 'revisedCross' } as const;

export default function EditionContent({ content, copy, locale }: { content: DailyContent; copy: DailyCopy; locale: string }) {
  if (content.kind === 'english') return <EnglishReading content={content} copy={copy} />;

  return (
    <ol className="divide-y divide-white/10">
      {content.items.map((item, index) => (
        <li key={item.id} className="py-7 first:pt-0 last:pb-0">
          <div className="mb-3 flex flex-wrap items-center gap-2 t-footnote text-white/60">
            <span className="font-mono text-violet-200">{String(index + 1).padStart(2, '0')}</span>
            {content.kind === 'internships' && <span className="rounded-full border border-violet-300/20 px-2.5 py-0.5 text-violet-200">
              {copy.roleType}: {copy[roleLabels[item.roleType ?? inferDailyRoleType(item.title)]]}
            </span>}
            {item.category && <span>{item.category}</span>}
            {item.difficulty && <span>· {copy[item.difficulty]}</span>}
            {item.version && <span>· {item.version}</span>}
            {content.kind === 'papers' && item.announcementType && <span>· {copy[announcementLabels[item.announcementType]]}</span>}
            {content.kind === 'events' && item.phase && <span className="rounded-full border border-violet-300/20 px-2.5 py-0.5 text-violet-200">{copy[item.phase]}</span>}
          </div>
          <h3 className="t-title-3 text-white">{item.title}</h3>
          {item.preprint && <p className="mt-2 t-footnote text-amber-200">{copy.preprint}</p>}
          {item.authors && item.authors.length > 0 && <p className="mt-2 t-footnote text-white/60">{copy.authors}: {item.authors.join(', ')}</p>}
          {content.kind === 'events' && <p className="mt-3 t-footnote text-violet-200">{copy.eventTime}: {formatEventTime(item, locale) ?? copy.timePending}</p>}
          {content.kind === 'competitions' && <p className="mt-3 t-footnote text-violet-200">{copy.contestStart}: {formatEventTime(item, locale) ?? copy.timePending}</p>}
          <p className="mt-4 whitespace-pre-wrap break-words t-body text-white/80">{item.summary}</p>
          {(content.kind === 'internships' || item.organization || item.location || item.eligibility) && <dl className="mt-4 space-y-2 text-sm leading-7 text-white/70">
            {item.organization && <div><dt className="inline text-white/60">{copy.organization}: </dt><dd className="inline">{item.organization}</dd></div>}
            {item.location && <div><dt className="inline text-white/60">{copy.location}: </dt><dd className="inline">{item.location}</dd></div>}
            {content.kind === 'internships' && <div><dt className="inline text-white/60">{copy.workMode}: </dt><dd className="inline">{copy[workModeLabels[item.remoteStatus ?? 'unknown']]}</dd></div>}
            {item.eligibility && <div><dt className="inline text-white/60">{copy.eligibility}: </dt><dd className="inline">{item.eligibility}</dd></div>}
          </dl>}
          {content.kind === 'papers' && item.originalAbstract && <details className="mt-4 border-l-2 border-violet-400/40 pl-4">
            <summary className="cursor-pointer t-footnote text-violet-200">{copy.originalAbstract}</summary>
            <p className="mt-3 whitespace-pre-wrap break-words t-body text-white/70">{item.originalAbstract}</p>
          </details>}
          <p className="mt-4 t-footnote text-white/60">
            {copy.source}: {item.sourceName} · {item.sourceType === 'official' ? copy.official : copy.aggregator}
            {item.sourcePublishedAt && <> · {copy.sourceDate}: {formatSourceDate(item.sourcePublishedAt, locale)}</>}
            {item.verifiedAt && <> · {copy.verifiedAt}: {formatEventTime({ ...item, startAt: item.verifiedAt, timeZone: 'Asia/Shanghai' }, locale)}</>}
          </p>
          <div className="mt-4 flex flex-wrap gap-5 t-footnote font-semibold text-violet-200">
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center underline decoration-violet-300/40 underline-offset-4">{copy.original} <span aria-hidden className="ml-1">↗</span></a>
            {item.codeUrl && <a href={item.codeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center underline decoration-violet-300/40 underline-offset-4">{copy.code} <span aria-hidden className="ml-1">↗</span></a>}
          </div>
        </li>
      ))}
    </ol>
  );
}

function formatSourceDate(value: string, locale: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'zh-CN', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: 'short', day: 'numeric',
  }).format(date);
}

function formatEventTime(item: DailyLinkItem, locale: string): string | null {
  if (!item.startAt) return null;
  const date = new Date(item.startAt);
  if (Number.isNaN(date.getTime())) return null;
  const timeZone = item.timeZone || 'UTC';
  try {
    return `${new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'zh-CN', {
      timeZone, year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(date)} (${timeZone})`;
  } catch {
    // 不将未知时区当作用户本地时区；保留来源给出的绝对时刻。
    return date.toISOString();
  }
}

function EnglishReading({ content: latestContent, copy }: { content: EnglishContent; copy: DailyCopy }) {
  const [startedContent, setStartedContent] = useState<EnglishContent | null>(null);
  // 作答后保留同一套课文和题目，后台补刊不能改写正在作答的题意或答案。
  const content = startedContent ?? latestContent;
  return (
    <div className="space-y-9">
      <p className="t-footnote text-white/60">{copy.englishProvenance}</p>
      <section>
        <h3 className="mb-4 t-title-4 text-white">{copy.vocabulary}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {content.vocabulary.map((word, index) => (
            <details key={`${word.term}-${index}`} className="rounded-xl border border-white/10 p-4">
              <summary className="cursor-pointer text-base font-semibold text-white">
                <span lang="en">{word.term}</span><span className="ml-3 t-footnote font-normal text-white/60">{copy.meaning}</span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-violet-200">{word.meaning}</p>
              <p lang="en" className="mt-2 text-sm leading-7 text-white/80">{word.example}</p>
              <p className="mt-1 t-footnote text-white/60">{word.translation}</p>
            </details>
          ))}
        </div>
      </section>
      <section>
        <h3 className="mb-4 t-title-4 text-white">{copy.passage}</h3>
        <p lang="en" className="whitespace-pre-wrap t-body text-white/80">{content.passage}</p>
        {content.passageTranslation && <details className="mt-4 border-l-2 border-violet-400/40 pl-4">
          <summary className="cursor-pointer t-footnote text-violet-200">{copy.translation}</summary>
          <p className="mt-3 whitespace-pre-wrap t-body text-white/70">{content.passageTranslation}</p>
        </details>}
      </section>
      <EnglishPractice questions={content.questions} copy={copy} onStart={() => setStartedContent(content)} />
    </div>
  );
}

function EnglishPractice({ questions, copy, onStart }: { questions: EnglishContent['questions']; copy: DailyCopy; onStart: () => void }) {
  const formId = useId();
  const [answers, setAnswers] = useState<Array<number | undefined>>([]);
  const [submitted, setSubmitted] = useState<Array<number | undefined> | null>(null);
  const complete = questions.every((_, index) => answers[index] !== undefined);
  const score = submitted ? gradeAnswers(submitted, questions.map(question => question.answerIndex)) : 0;

  return (
    <section className="border-t border-white/10 pt-7">
      <h3 className="t-title-4 text-white">{copy.practice}</h3>
      <p className="mt-2 t-footnote text-white/60">{copy.practiceHint}</p>
      <form className="mt-5 space-y-6" onSubmit={event => { event.preventDefault(); if (complete) setSubmitted([...answers]); }}>
        {questions.map((question, questionIndex) => (
          <fieldset key={questionIndex} disabled={submitted !== null} className="min-w-0">
            <legend className="mb-3 text-sm font-semibold leading-7 text-white">{questionIndex + 1}. {question.question}</legend>
            <div className="grid gap-2">
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm leading-6 text-white/80 has-checked:border-violet-400/60 has-checked:bg-violet-400/10">
                  <input type="radio" name={`${formId}-${questionIndex}`} value={optionIndex} checked={answers[questionIndex] === optionIndex}
                    className="mt-1 shrink-0 accent-violet-400" onChange={() => { onStart(); setAnswers(previous => { const next = [...previous]; next[questionIndex] = optionIndex; return next; }); }} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {submitted && <div className="mt-3 border-l-2 border-violet-400/50 pl-4">
              <p className={`t-footnote font-semibold ${submitted[questionIndex] === question.answerIndex ? 'text-emerald-200' : 'text-amber-200'}`}>
                {submitted[questionIndex] === question.answerIndex ? copy.correct : copy.incorrect}
              </p>
              <p className="mt-1 text-sm leading-7 text-white/80">{copy.answer}: {question.options[question.answerIndex]}</p>
              <p className="mt-1 text-sm leading-7 text-white/70">{copy.explanation}: {question.explanation}</p>
            </div>}
          </fieldset>
        ))}
        <div className="flex flex-wrap items-center gap-4">
          {submitted ? <>
            <p role="status" className="text-sm text-white/80">{copy.score} {score} {copy.of} {questions.length} {copy.questions}</p>
            <button type="button" className="min-h-11 rounded-xl border border-white/15 px-5 py-2 text-sm text-white" onClick={() => { setAnswers([]); setSubmitted(null); }}>{copy.reset}</button>
          </> : <>
            <button type="submit" disabled={!complete} className="min-h-11 rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{copy.submit}</button>
            {!complete && <p className="t-footnote text-white/60">{copy.selectAll}</p>}
          </>}
        </div>
      </form>
    </section>
  );
}

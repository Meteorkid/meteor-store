'use client';

import type { ListeningExpression, ListeningVocabulary } from '@/lib/ielts-listening/types';
import { listeningText, type ListeningLocale } from './listening-text';

/**
 * 生词与词组面板。每张卡都带着它在原文里的句索引，可以直接重听那一句、跳回原文，
 * 也可以点词查词（原文面板里）。
 */

interface Props {
  kind: 'vocabulary' | 'expressions';
  vocabulary: ListeningVocabulary[];
  expressions: ListeningExpression[];
  locale: ListeningLocale;
  activeSentence: number | null;
  onLocate(sentenceIndex: number): void;
  onPlay(sentenceIndex: number): void;
}

function SentenceActions({ index, locale, active, onLocate, onPlay }: {
  index: number; locale: ListeningLocale; active: boolean; onLocate(index: number): void; onPlay(index: number): void;
}) {
  const copy = listeningText[locale].practice;
  return <div className="mt-2 flex flex-wrap items-center gap-2">
    <button type="button" onClick={() => onLocate(index)}
      className={`inline-flex min-h-9 items-center rounded-lg border px-2.5 text-xs transition-colors ${active ? 'border-violet-300/50 bg-violet-400/15 text-violet-100' : 'border-white/18 text-white/70 hover:bg-white/10'}`}>
      {copy.sentenceNo(index + 1)}{locale === 'zh' && ` · S${index + 1}`}
    </button>
    <button type="button" onClick={() => onPlay(index)} aria-label={copy.replay}
      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/18 px-2.5 text-xs text-white/70 hover:bg-white/10">
      <span aria-hidden="true">▶</span>{copy.replay}
    </button>
  </div>;
}

export default function ListeningNotes({ kind, vocabulary, expressions, locale, activeSentence, onLocate, onPlay }: Props) {
  const copy = listeningText[locale];
  const practice = copy.practice;

  if (kind === 'vocabulary') {
    if (!vocabulary.length) return <p className="t-footnote text-white/50">{copy.records.none}</p>;
    return <div className="grid gap-2 lg:grid-cols-2">
      {vocabulary.map(item => <article key={item.term} className="flex min-w-0 flex-col rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h3 className="text-[15px] font-semibold text-white">{item.term}</h3>
          {item.phonetic && <span className="text-xs text-white/45">{item.phonetic}</span>}
          <span className="ml-auto rounded bg-white/8 px-1.5 py-0.5 text-[11px] text-white/55">{item.partOfSpeech}</span>
        </div>
        <p className="mt-1.5 text-[13px] leading-6 text-white/85">{item.meaning[locale]}</p>
        <p className="mt-1.5 text-[12px] leading-6 text-white/60">{item.usage[locale]}</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">{item.collocations.map(collocation =>
          <li key={collocation} className="rounded-full border border-white/12 bg-white/5 px-2 py-0.5 text-[11px] text-white/65">{collocation}</li>)}</ul>
        <p className="mt-2 text-[12px] leading-5 text-white/60"><span className="mr-1 text-white/35">{practice.example}</span>{item.example.en}</p>
        <p className="text-[12px] leading-5 text-white/40">{item.example.zh}</p>
        {item.listening && <p className="mt-2 rounded-lg bg-violet-400/10 px-2.5 py-1.5 text-[12px] leading-5 text-violet-100/85">
          <span className="mr-1 font-semibold">{practice.listeningHint}</span>{item.listening[locale]}
        </p>}
        <SentenceActions index={item.sentenceIndex} locale={locale} active={activeSentence === item.sentenceIndex} onLocate={onLocate} onPlay={onPlay} />
      </article>)}
    </div>;
  }

  if (!expressions.length) return <p className="t-footnote text-white/50">{copy.records.none}</p>;
  return <div className="grid gap-2 lg:grid-cols-2">
    {expressions.map(item => <article key={item.phrase} className="flex min-w-0 flex-col rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
      <h3 className="text-[15px] font-semibold text-white">{item.phrase}</h3>
      <p className="mt-1.5 text-[13px] leading-6 text-white/85">{item.meaning[locale]}</p>
      <p className="mt-1.5 text-[12px] leading-6 text-white/60">{item.usage[locale]}</p>
      <p className="mt-2 text-[12px] leading-5 text-white/60"><span className="mr-1 text-white/35">{practice.example}</span>{item.example.en}</p>
      <p className="text-[12px] leading-5 text-white/40">{item.example.zh}</p>
      <SentenceActions index={item.sentenceIndex} locale={locale} active={activeSentence === item.sentenceIndex} onLocate={onLocate} onPlay={onPlay} />
    </article>)}
  </div>;
}

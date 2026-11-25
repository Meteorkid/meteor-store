'use client';

import { Fragment, useMemo, useRef, type KeyboardEvent, type MouseEvent } from 'react';
import { lookupWordTokens, normalizeLookupWord } from '@/lib/ielts/word-lookup';
import type { ListeningAnswer, ListeningCast, ListeningUtterance } from '@/lib/ielts-listening/types';
import styles from './ListeningTranscript.module.css';
import { listeningText, type ListeningLocale } from './listening-text';

/**
 * 听力原文。句索引是全篇唯一锚点：滚动定位（#sentence-N）、单句重听、答案回标、生词与词组
 * 的出处都指着它。词级交互与雅思写作的原文一致——点按距离判定，键盘可 Tab 到单词。
 */

interface Props {
  transcript: ListeningUtterance[];
  cast: ListeningCast[];
  answers: ListeningAnswer[];
  locale: ListeningLocale;
  /** 本次计分的题号；错题重练外没有题号的句子不显示题号标记。 */
  scope: number[] | null;
  graded: boolean;
  wrongNumbers: number[];
  activeIndex: number | null;
  view?: 'lines' | 'full';
  onPlaySentence(index: number): void;
  onLookup(anchor: HTMLElement, word: string, sentenceIndex: number): void;
  onDismissLookup(): void;
}

const SPEAKER_TONES = ['text-sky-200', 'text-amber-200', 'text-violet-200', 'text-emerald-200', 'text-rose-200'];

export default function ListeningTranscript({
  transcript, cast, answers, locale, scope, graded, wrongNumbers, activeIndex, view = 'lines', onPlaySentence, onLookup, onDismissLookup,
}: Props) {
  const copy = listeningText[locale];
  const pointerStart = useRef<{ x: number; y: number; element: HTMLElement } | null>(null);
  const speakerIndex = useMemo(() => new Map(cast.map((member, index) => [member.id, index])), [cast]);
  const speakerLabel = useMemo(() => new Map(cast.map(member => [member.id, member.label])), [cast]);
  const badgesAt = useMemo(() => {
    const map = new Map<number, ListeningAnswer[]>();
    for (const answer of answers) {
      if (scope && !scope.includes(answer.number)) continue;
      const bucket = map.get(answer.evidence) ?? [];
      bucket.push(answer);
      map.set(answer.evidence, bucket);
    }
    return map;
  }, [answers, scope]);

  function chooseWord(anchor: HTMLElement, word: string, sentenceIndex: number) {
    onLookup(anchor, normalizeLookupWord(word), sentenceIndex);
  }

  function wordClick(event: MouseEvent<HTMLSpanElement>, word: string, sentenceIndex: number) {
    if (event.detail > 1 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    const start = pointerStart.current;
    pointerStart.current = null;
    if (start && (start.element !== event.currentTarget || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6)) return;
    if (window.getSelection()?.toString().trim()) return;
    chooseWord(event.currentTarget, word, sentenceIndex);
  }

  function wordKeyDown(event: KeyboardEvent<HTMLSpanElement>, word: string, sentenceIndex: number) {
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      chooseWord(event.currentTarget, word, sentenceIndex);
      return;
    }
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const container = event.currentTarget.closest(`[data-word-sentence="${sentenceIndex}"]`);
    const words = Array.from(container?.querySelectorAll<HTMLElement>('[data-lookup-word]') ?? []);
    const current = words.indexOf(event.currentTarget);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? words.length - 1 : current + (event.key === 'ArrowLeft' ? -1 : 1);
    if (words[next]) { event.preventDefault(); words[next].focus(); }
  }

  function renderWords(utterance: ListeningUtterance, sentenceIndex: number) {
    return lookupWordTokens(utterance.displayText ?? utterance.text).map((token, tokenIndex) => {
      if (!token.word) return <Fragment key={tokenIndex}>{token.text}</Fragment>;
      return <span key={tokenIndex} role="button" tabIndex={0} data-lookup-word={normalizeLookupWord(token.text)}
        aria-label={token.text} className={styles.word}
        onPointerDown={event => { pointerStart.current = { x: event.clientX, y: event.clientY, element: event.currentTarget }; }}
        onClick={event => wordClick(event, token.text, sentenceIndex)}
        onDoubleClick={() => onDismissLookup()}
        onKeyDown={event => wordKeyDown(event, token.text, sentenceIndex)}>{token.text}</span>;
    });
  }

  if (view === 'full') return <p lang="en" className="text-[15px] leading-8 text-white/85">
    {transcript.map((utterance, index) => {
      const startsTurn = index === 0 || transcript[index - 1].speaker !== utterance.speaker;
      const tone = SPEAKER_TONES[(speakerIndex.get(utterance.speaker) ?? 0) % SPEAKER_TONES.length];
      return <Fragment key={index}>
        {startsTurn && <span data-speaker-label className={`mr-2 inline-block align-baseline text-[10px] font-semibold uppercase tracking-[0.16em] ${tone}`}>
          {speakerLabel.get(utterance.speaker) ?? utterance.speaker}
        </span>}
        <span id={`sentence-${index + 1}`} data-sentence={index + 1} data-word-sentence={index}
          className={`scroll-mt-28 ${activeIndex === index ? 'rounded bg-violet-400/15' : ''}`}>
          {renderWords(utterance, index)}
        </span>{' '}
      </Fragment>;
    })}
  </p>;

  return <ol className="space-y-1">
    {transcript.map((utterance, sentenceIndex) => {
      const badges = badgesAt.get(sentenceIndex) ?? [];
      const active = activeIndex === sentenceIndex;
      const tone = SPEAKER_TONES[(speakerIndex.get(utterance.speaker) ?? 0) % SPEAKER_TONES.length];
      return <li key={sentenceIndex} id={`sentence-${sentenceIndex + 1}`} data-sentence={sentenceIndex + 1}
        className={`scroll-mt-28 rounded-xl border-l-2 px-2 py-2 transition-colors sm:px-3 ${active ? 'border-violet-300/70 bg-violet-400/10' : 'border-transparent'}`}>
        <div className="flex items-start gap-2">
          <button type="button" onClick={() => onPlaySentence(sentenceIndex)} aria-label={`${copy.practice.replay} · ${copy.practice.sentenceNo(sentenceIndex + 1)}`}
            className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs text-white/70 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-violet-300">
            <span aria-hidden="true">▶</span>
          </button>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex flex-wrap items-center gap-2">
              <span className={`t-eyebrow ${tone}`}>{speakerLabel.get(utterance.speaker) ?? utterance.speaker}</span>
              {badges.map(answer => <span key={answer.number}
                className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${graded ? (wrongNumbers.includes(answer.number) ? 'bg-rose-400/20 text-rose-100' : 'bg-emerald-400/20 text-emerald-100') : 'bg-white/10 text-white/60'}`}>
                {copy.practice.wrongBadge(answer.number)}
              </span>)}
            </div>
            <p lang="en" data-word-sentence={sentenceIndex} className="text-[15px] leading-7 text-white/85">
              {renderWords(utterance, sentenceIndex)}
            </p>
          </div>
        </div>
      </li>;
    })}
  </ol>;
}

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import {
  gradeListening, normalizeListeningScope, listeningQuestionLocations,
  type ListeningGrade,
} from '@/lib/ielts-listening/types';
import type { ListeningLessonRecord } from '@/lib/ielts-listening/catalog';
import type { ListeningLocale } from './listening-text';
import { listeningText } from './listening-text';
import ListeningPlayer, { type ListeningPlayerApi, type ListeningAudioTrack } from './ListeningPlayer';
import ListeningQuestions from './ListeningQuestions';
import ListeningTranscript from './ListeningTranscript';
import ListeningNotes from './ListeningNotes';
import ListeningReview from './ListeningReview';
import IeltsWordLookupPanel, { type IeltsLookupTarget } from '../ielts/IeltsWordLookupPanel';

/**
 * 一个 Part 的练习总装。
 *
 * 流程：开始（计时并播放）→ 作答 → 提交（本地按同一套规则判分，登录时把作答交给接口重算入库）
 * → 展开原文与解析。错题重练通过 ?q= 传入题号，页面在服务端收窄后传进来；
 * 客户端用同一个 normalizeListeningScope 收窄题目，保证和服务端算的是同一批题。
 */

interface Props {
  lesson: ListeningLessonRecord;
  locale: ListeningLocale;
  /** 错题重练的题号；null 表示整篇练习。 */
  requestedScope: number[] | null;
  /** 已登录时是当前账号 id，用来带 x-study-user；未登录为 null。 */
  ownerId: string | null;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'failed' | 'login' | 'changed';
type Tab = 'transcript' | 'vocabulary' | 'expressions';

function formatDuration(seconds: number): string {
  const value = Math.max(0, Math.min(3 * 60 * 60, Math.round(seconds)));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}

export default function IeltsListeningPractice({ lesson, locale, requestedScope, ownerId }: Props) {
  const copy = listeningText[locale];
  const practice = copy.practice;
  const scope = useMemo(
    () => requestedScope && requestedScope.length ? normalizeListeningScope(lesson, requestedScope) : null,
    [lesson, requestedScope],
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [grade, setGrade] = useState<ListeningGrade | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>(ownerId ? 'idle' : 'login');
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('transcript');
  const [lookup, setLookup] = useState<{ word: string; sentenceIndex: number; anchor: HTMLElement } | null>(null);
  const [activeSentence, setActiveSentence] = useState<number | null>(null);
  const playerRef = useRef<ListeningPlayerApi | null>(null);
  const submitting = useRef(false);

  const evidenceAt = useMemo(() => new Map(lesson.answers.map(answer => [answer.number, answer.evidence] as const)), [lesson.answers]);
  const startSentence = useMemo(() => {
    if (!scope) return 0;
    return Math.min(...scope.map(number => evidenceAt.get(number) ?? 0));
  }, [scope, evidenceAt]);
  const statements = useMemo(() => lesson.transcript.map(utterance => ({
    text: utterance.text,
    voice: lesson.cast.find(member => member.id === utterance.speaker)?.voice ?? null,
  })), [lesson.cast, lesson.transcript]);
  const audio = useMemo<ListeningAudioTrack | null>(() => lesson.audio && lesson.audioUrl
    ? { url: lesson.audioUrl, cues: lesson.audio.cues, durationSec: lesson.audio.durationSec }
    : null, [lesson.audio, lesson.audioUrl]);
  const wrongNumbers = useMemo(() => grade?.results.filter(item => !item.correct).map(item => item.number) ?? [], [grade]);
  const retryHref = wrongNumbers.length
    ? `/study/ielts/listening/${lesson.slug}?q=${wrongNumbers.join(',')}`
    : null;

  useEffect(() => {
    const match = window.location.hash.match(/^#sentence-(\d+)$/);
    if (!match) return;
    const index = Number(match[1]) - 1;
    if (index < 0 || index >= lesson.transcript.length) return;
    // 从生词本跳回来时原文是收起的：先展开，等这一帧渲染出句子再定位。
    const frame = window.requestAnimationFrame(() => {
      setTranscriptOpen(true);
      window.requestAnimationFrame(() => {
        document.getElementById(`sentence-${index + 1}`)?.scrollIntoView({
          block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        });
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [lesson.transcript.length]);

  useEffect(() => {
    if (!startedAt || grade) return;
    const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [startedAt, grade]);

  const onReady = useCallback((api: ListeningPlayerApi) => { playerRef.current = api; }, []);
  const onActive = useCallback((index: number | null) => setActiveSentence(index), []);

  function start() {
    if (startedAt) return;
    setStartedAt(Date.now());
    setElapsed(0);
    playerRef.current?.playFrom(startSentence);
  }

  const locateSentence = useCallback((index: number) => {
    setTranscriptOpen(true);
    setTab('transcript');
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      document.getElementById(`sentence-${index + 1}`)?.scrollIntoView({
        block: 'start',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    }));
  }, []);

  async function submit() {
    // 连点两次不能落两条记录：grade 是状态，等它变已经晚了一帧。
    if (grade || submitting.current) return;
    submitting.current = true;
    const result = gradeListening(lesson, answers, scope ?? undefined);
    setGrade(result);
    setTranscriptOpen(true);
    setTab('transcript');
    playerRef.current?.stop();
    setActiveSentence(null);
    if (!ownerId) { setSaveState('login'); return; }
    const payload: Record<string, string> = {};
    const allowed = new Set(scope ?? listeningQuestionLocations(lesson).map(item => item.number));
    Object.entries(answers).forEach(([number, value]) => {
      if (allowed.has(Number(number)) && value) payload[number] = value;
    });
    const durationSec = startedAt ? Math.min(10800, Math.max(0, Math.round((Date.now() - startedAt) / 1000))) : 0;
    setSaveState('saving');
    try {
      const response = await fetch('/api/ielts/listening/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-study-user': ownerId },
        body: JSON.stringify({ slug: lesson.slug, answers: payload, durationSec, ...(scope ? { scope } : {}) }),
      });
      if (response.status === 409) { setSaveState('changed'); return; }
      if (!response.ok) { setSaveState('failed'); return; }
      setSaveState('saved');
    } catch {
      setSaveState('failed');
    }
  }

  function reset() {
    playerRef.current?.stop();
    submitting.current = false;
    setAnswers({});
    setGrade(null);
    setStartedAt(null);
    setElapsed(0);
    setTranscriptOpen(false);
    setTab('transcript');
    setLookup(null);
    setActiveSentence(null);
    setSaveState(ownerId ? 'idle' : 'login');
  }

  function chooseWord(anchor: HTMLElement, word: string, sentenceIndex: number) {
    setLookup({ word, sentenceIndex, anchor });
  }

  const lookupTarget: IeltsLookupTarget | null = lookup
    ? { kind: 'listening', slug: lesson.slug, sentenceIndex: lookup.sentenceIndex }
    : null;
  const saveMessage: Record<SaveState, string | null> = {
    idle: null,
    saving: practice.saving,
    saved: practice.saved,
    failed: practice.saveFailed,
    login: practice.loginToSave,
    changed: practice.changedAccount,
  };
  const numbersText = (scope ?? []).join(locale === 'zh' ? '、' : ', ');

  return <div className="space-y-5">
    {scope && <div className="rounded-2xl border border-amber-300/25 bg-amber-300/[0.07] px-4 py-3">
      <p className="text-sm font-semibold text-amber-100">{practice.scopeBanner(numbersText)}</p>
      <p className="mt-1 t-footnote text-amber-100/70">{practice.scopeHint}</p>
    </div>}

    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-3">
        {!grade && <button type="button" onClick={start}
          className="inline-flex min-h-11 items-center rounded-xl border border-violet-300/40 bg-violet-400/15 px-5 text-sm font-semibold text-white">
          {practice.start}
        </button>}
        <span className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-3 text-sm text-white/80">
          <span className="text-white/45">{practice.timer}</span>
          <span className="font-mono tabular-nums text-white">{startedAt ? formatDuration(elapsed) : '0:00'}</span>
        </span>
        {!startedAt && !grade && <span className="t-footnote text-white/45">{practice.startHint}</span>}
      </div>
    </div>

    <ListeningPlayer audio={audio} sentences={statements} locale={locale} startIndex={startSentence}
      onReady={onReady} onActive={onActive} />

    <ListeningQuestions lesson={lesson} answers={answers} onChange={setAnswers} scope={scope}
      graded={Boolean(grade)} grade={grade} locale={locale} disabled={Boolean(grade)} />

    {!grade ? <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={submit} className="inline-flex min-h-11 items-center rounded-xl border border-violet-300/50 bg-violet-400/20 px-5 text-sm font-semibold text-white">
        {practice.submit}
      </button>
      <p className="t-footnote text-white/50">{practice.transcriptClosed}</p>
      {!ownerId && <p className="t-footnote text-white/45">{practice.loginToSave}</p>}
    </div> : <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={reset} className="inline-flex min-h-11 items-center rounded-xl border border-white/20 px-4 text-sm text-white/85">{practice.again}</button>
      {retryHref && <Link href={retryHref} className="inline-flex min-h-11 items-center rounded-xl border border-amber-300/40 bg-amber-300/10 px-4 text-sm font-semibold text-amber-100">
        {practice.reviewWrong}
      </Link>}
      <span role="status" className={`t-footnote ${saveState === 'failed' ? 'text-amber-200' : saveState === 'saved' ? 'text-emerald-200' : 'text-white/55'}`}>
        {saveMessage[saveState]}
      </span>
    </div>}

    {grade && <ListeningReview lesson={lesson} locale={locale} grade={grade} answers={answers}
      onPlaySentence={index => playerRef.current?.playFrom(index)} onLocateSentence={locateSentence} />}

    <div className="rounded-2xl border border-white/12 bg-white/[0.04]">
      <div role="tablist" aria-label={practice.transcript} className="flex flex-wrap gap-1 border-b border-white/10 p-2">
        {(['transcript', 'vocabulary', 'expressions'] as const).map(item => {
          const locked = item !== 'transcript' && !grade;
          return <button key={item} type="button" role="tab"
            aria-selected={tab === item} aria-controls={`listening-panel-${item}`} id={`listening-tab-${item}`}
            disabled={locked} title={locked ? practice.notesLocked : undefined}
            onClick={() => { setLookup(null); setTab(item); }}
            className={`min-h-11 rounded-lg px-3.5 text-sm transition-colors ${tab === item ? 'bg-violet-400/20 font-semibold text-white' : locked ? 'cursor-not-allowed text-white/30' : 'text-white/65 hover:bg-white/10'}`}>
            {item === 'transcript' ? practice.transcript : item === 'vocabulary' ? practice.vocabulary : practice.expressions}
          </button>;
        })}
      </div>
      {!grade && <p className="border-b border-white/10 px-4 py-2 t-footnote text-white/45">{practice.notesLocked}</p>}
      <div className="p-4 sm:p-5">
        <div role="tabpanel" id="listening-panel-transcript" aria-labelledby="listening-tab-transcript" hidden={tab !== 'transcript'}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="t-footnote text-white/50">{practice.transcriptHint}</p>
            <button type="button" onClick={() => { setLookup(null); setTranscriptOpen(value => !value); }}
              className="min-h-9 rounded-lg border border-white/18 px-2.5 text-xs text-white/70 hover:bg-white/10">
              {transcriptOpen ? practice.hideTranscript : practice.showTranscript}
            </button>
          </div>
          {transcriptOpen
            ? <ListeningTranscript transcript={lesson.transcript} cast={lesson.cast} answers={lesson.answers}
              locale={locale} scope={scope} graded={Boolean(grade)} wrongNumbers={wrongNumbers}
              activeIndex={activeSentence} onPlaySentence={index => playerRef.current?.playFrom(index)}
              onLookup={chooseWord} onDismissLookup={() => setLookup(null)} />
            : <p className="t-footnote text-white/45">{practice.transcriptClosed}</p>}
        </div>
        <div role="tabpanel" id="listening-panel-vocabulary" aria-labelledby="listening-tab-vocabulary" hidden={tab !== 'vocabulary'}>
          {tab === 'vocabulary' && grade
            ? <ListeningNotes kind="vocabulary" vocabulary={lesson.vocabulary} expressions={lesson.expressions} locale={locale}
              activeSentence={activeSentence} onLocate={locateSentence} onPlay={index => playerRef.current?.playFrom(index)} />
            : null}
        </div>
        <div role="tabpanel" id="listening-panel-expressions" aria-labelledby="listening-tab-expressions" hidden={tab !== 'expressions'}>
          {tab === 'expressions' && grade
            ? <ListeningNotes kind="expressions" vocabulary={lesson.vocabulary} expressions={lesson.expressions} locale={locale}
              activeSentence={activeSentence} onLocate={locateSentence} onPlay={index => playerRef.current?.playFrom(index)} />
            : null}
        </div>
      </div>
    </div>

    {lookup && lookupTarget && <IeltsWordLookupPanel target={lookupTarget} word={lookup.word} locale={locale} anchor={lookup.anchor} onClose={() => setLookup(null)} />}
  </div>;
}

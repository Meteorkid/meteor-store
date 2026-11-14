'use client';

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { WordLookupResultSchema, type WordLookupRequest, type WordLookupResult } from '@/lib/ielts/word-lookup';
import styles from './IeltsWordLookupPanel.module.css';

interface Props {
  request: WordLookupRequest;
  locale: 'zh' | 'en';
  anchor: HTMLElement;
  onClose: () => void;
}

type LookupError = 'invalid' | 'not_found' | 'rate_limited' | 'unavailable' | 'timeout';
type LookupState = { key: string } & ({ status: 'success'; result: WordLookupResult } | { status: 'error'; error: LookupError });
type SpeechStatus = 'speaking' | 'done' | 'unsupported' | 'no_voice' | 'error';
const REQUEST_TIMEOUT_MS = 12_500;
const copy = {
  zh: {
    title: '词语释义', close: '关闭词语释义', loading: '正在查询当前句中的意思…', retry: '重试',
    lemma: '原形', partOfSpeech: '词性', meaning: '中文释义', usage: '用法',
    lesson: '本文词汇', ai: 'AI 语境释义', speak: '朗读',
    errors: {
      invalid: '这个词暂时无法查询，请重新点选正文中的英文词。',
      not_found: '当前内容暂不可查词，仍可阅读已有的学习笔记。',
      rate_limited: '查询较频繁，请稍后重试。',
      unavailable: '释义暂时不可用，请稍后重试。',
      timeout: '查询超时，请重试。',
    },
    speech: {
      speaking: '正在朗读…', done: '朗读结束', unsupported: '当前浏览器不支持朗读。',
      no_voice: '暂未找到可用的英语语音，请稍后重试或检查设备语音设置。',
      error: '朗读失败，请重试或检查设备语音设置。',
    },
  },
  en: {
    title: 'Word meaning', close: 'Close word meaning', loading: 'Looking up the meaning in this sentence…', retry: 'Retry',
    lemma: 'Base form', partOfSpeech: 'Part of speech', meaning: 'Chinese meaning', usage: 'Usage',
    lesson: 'Lesson vocabulary', ai: 'AI contextual meaning', speak: 'Read aloud',
    errors: {
      invalid: 'This word cannot be looked up. Select an English word in the text again.',
      not_found: 'Word lookup is unavailable for this content. Existing study notes remain readable.',
      rate_limited: 'Too many lookups. Please try again shortly.',
      unavailable: 'Word meanings are temporarily unavailable. Please try again.',
      timeout: 'The lookup timed out. Please try again.',
    },
    speech: {
      speaking: 'Reading aloud…', done: 'Finished reading', unsupported: 'This browser does not support speech playback.',
      no_voice: 'No English voice is available yet. Try again shortly or check your device speech settings.',
      error: 'Speech playback failed. Try again or check your device speech settings.',
    },
  },
};

function responseError(body: unknown, status: number): LookupError {
  const code = body && typeof body === 'object' && 'error' in body ? body.error : undefined;
  if (code === 'invalid' || code === 'not_found' || code === 'rate_limited' || code === 'unavailable' || code === 'timeout') return code;
  if (status === 400 || status === 403) return 'invalid';
  if (status === 404) return 'not_found';
  if (status === 429) return 'rate_limited';
  if (status === 408 || status === 504) return 'timeout';
  return 'unavailable';
}

/** 非模态浮层：正文仍能点选其它词，不锁滚动、不截留 Tab。 */
export default function IeltsWordLookupPanel({ request, locale, anchor, onClose }: Props) {
  const text = copy[locale];
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closedRef = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [lookup, setLookup] = useState<LookupState | null>(null);
  const [speech, setSpeech] = useState<{ key: string; status: SpeechStatus } | null>(null);
  const { slug, segmentIndex, side, word } = request;
  const requestKey = `${slug}/${segmentIndex}/${side}/${word}`;
  const state = lookup?.key === requestKey ? lookup : null;
  const result = state?.status === 'success' ? state.result : null;

  const stopSpeech = useCallback(() => {
    const utterance = utteranceRef.current;
    if (!utterance) return;
    utterance.onend = null;
    utterance.onerror = null;
    utteranceRef.current = null;
    window.speechSynthesis.cancel();
  }, []);

  const closePanel = useCallback((restoreFocus = true) => {
    if (closedRef.current) return;
    closedRef.current = true;
    controllerRef.current?.abort();
    stopSpeech();
    onClose();
    if (restoreFocus && anchor.isConnected) anchor.focus({ preventScroll: true });
  }, [anchor, onClose, stopSpeech]);

  useEffect(() => {
    let active = true;
    let timedOut = false;
    closedRef.current = false;
    const controller = new AbortController();
    controllerRef.current = controller;
    const timer = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
      if (active && !closedRef.current) setLookup({ key: requestKey, status: 'error', error: 'timeout' });
    }, REQUEST_TIMEOUT_MS);

    void fetch('/api/ielts/word-lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, segmentIndex, side, word }),
      signal: controller.signal,
      cache: 'no-store',
    }).then(async response => {
      const body: unknown = await response.json();
      if (!active || closedRef.current || controller.signal.aborted) return;
      if (!response.ok) {
        setLookup({ key: requestKey, status: 'error', error: responseError(body, response.status) });
        return;
      }
      const parsed = WordLookupResultSchema.safeParse(body);
      setLookup(parsed.success
        ? { key: requestKey, status: 'success', result: parsed.data }
        : { key: requestKey, status: 'error', error: 'unavailable' });
    }).catch(() => {
      if (active && !closedRef.current) setLookup({ key: requestKey, status: 'error', error: timedOut ? 'timeout' : 'unavailable' });
    }).finally(() => window.clearTimeout(timer));

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timer);
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, [slug, segmentIndex, side, word, requestKey, attempt]);

  const positionPanel = useCallback(() => {
    const panel = panelRef.current;
    if (!panel || window.innerWidth <= 640) return;
    const margin = 12;
    const gap = 8;
    const rect = anchor.getBoundingClientRect();
    const below = Math.max(0, window.innerHeight - rect.bottom - gap - margin);
    const above = Math.max(0, rect.top - gap - margin);
    const placeBelow = below >= panel.offsetHeight || below >= above;
    const room = Math.max(160, placeBelow ? below : above);
    const maxHeight = Math.min(480, room, window.innerHeight - margin * 2);
    panel.style.setProperty('--lookup-max-height', `${maxHeight}px`);
    const height = Math.min(panel.offsetHeight, maxHeight);
    const top = placeBelow ? rect.bottom + gap : rect.top - height - gap;
    panel.style.setProperty('--lookup-top', `${Math.max(margin, Math.min(top, window.innerHeight - height - margin))}px`);
    panel.style.setProperty('--lookup-left', `${Math.max(margin, Math.min(rect.left, window.innerWidth - panel.offsetWidth - margin))}px`);
  }, [anchor]);

  useLayoutEffect(() => {
    positionPanel();
  }, [positionPanel, requestKey, state, speech]);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    return stopSpeech;
  }, [anchor, requestKey, stopSpeech]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || panelRef.current?.contains(target)) return;
      // 让正文自己的 click 接管切词，不能在 pointerdown 抢回旧词焦点。
      if (target instanceof Element && target.closest('[data-lookup-word]')) return;
      closePanel();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      closePanel();
    };
    const onScroll = (event: Event) => {
      if (event.target instanceof Node && panelRef.current?.contains(event.target)) return;
      // 点词前的自动定位也会延后派发 scroll；跟随锚点即可，不能误关刚打开的释义。
      positionPanel();
    };
    const onResize = () => positionPanel();
    const onSearchOpen = () => closePanel(false);
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    window.addEventListener('spotlight:open', onSearchOpen, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('spotlight:open', onSearchOpen, true);
    };
  }, [closePanel, positionPanel]);

  function readAloud() {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setSpeech({ key: requestKey, status: 'unsupported' });
      return;
    }
    stopSpeech();
    try {
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(item => /^en[-_]US$/i.test(item.lang)) ?? voices.find(item => /^en(?:[-_]|$)/i.test(item.lang));
      if (!voice) {
        setSpeech({ key: requestKey, status: 'no_voice' });
        return;
      }
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.voice = voice;
      utterance.onend = () => {
        if (utteranceRef.current !== utterance || closedRef.current) return;
        utteranceRef.current = null;
        setSpeech({ key: requestKey, status: 'done' });
      };
      utterance.onerror = () => {
        if (utteranceRef.current !== utterance || closedRef.current) return;
        utteranceRef.current = null;
        setSpeech({ key: requestKey, status: 'error' });
      };
      utteranceRef.current = utterance;
      setSpeech({ key: requestKey, status: 'speaking' });
      window.speechSynthesis.speak(utterance);
    } catch {
      stopSpeech();
      setSpeech({ key: requestKey, status: 'error' });
    }
  }

  const panel = <div ref={panelRef} role="dialog" aria-modal="false" aria-labelledby={titleId} className={`${styles.panel} glass-lg`} data-word-lookup-panel>
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>{text.title}</p>
        <h3 id={titleId} className={styles.word} lang="en">{word}</h3>
      </div>
      <button ref={closeRef} type="button" onClick={() => closePanel()} aria-label={text.close} className={styles.closeButton}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
      </button>
    </header>
    <div className={styles.content} aria-busy={!state}>
      {!state && <p role="status" className={styles.status}>{text.loading}</p>}
      {state?.status === 'error' && <div>
        <p role="alert" className={styles.status}>{text.errors[state.error]}</p>
        <button type="button" className={styles.actionButton} onClick={() => { setLookup(null); setAttempt(value => value + 1); }}>{text.retry}</button>
      </div>}
      {result && <>
        <span className={styles.source}>{text[result.source]}</span>
        <dl className={styles.meaning}>
          {result.entry.lemma.toLowerCase() !== word.toLowerCase() && <div><dt>{text.lemma}</dt><dd lang="en">{result.entry.lemma}</dd></div>}
          <div><dt>{text.partOfSpeech}</dt><dd>{result.entry.partOfSpeech}</dd></div>
          <div><dt>{text.meaning}</dt><dd lang="zh">{result.entry.meaningZh}</dd></div>
          {result.entry.usageZh && <div><dt>{text.usage}</dt><dd lang="zh">{result.entry.usageZh}</dd></div>}
        </dl>
      </>}
    </div>
    <footer className={styles.footer}>
      <button type="button" className={styles.actionButton} onClick={readAloud}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5ZM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" /></svg>
        {text.speak}
      </button>
      <p role="status" className={styles.speechStatus}>{speech?.key === requestKey ? text.speech[speech.status] : ''}</p>
    </footer>
  </div>;

  return typeof document === 'undefined' ? panel : createPortal(panel, document.body);
}

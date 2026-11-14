'use client';

import { Fragment, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent, type MouseEvent } from 'react';
import { IELTS_FOCUS_LABELS, type IeltsFocus, type IeltsSegment } from '@/lib/ielts/types';
import { ieltsCopy, type IeltsLocale } from './ielts-text';
import { diffIeltsSentence, type IeltsDiffPart } from '@/lib/ielts/diff';
import styles from './IeltsComparison.module.css';
import { lookupWordTokens, normalizeLookupWord, type WordLookupRequest } from '@/lib/ielts/word-lookup';
import IeltsWordLookupPanel from './IeltsWordLookupPanel';
import { expressionEditsForParagraph } from '@/lib/ielts/expression-edits';
import IeltsExpressionBlocks from './IeltsExpressionBlocks';

const FOCUS_ORDER: IeltsFocus[] = ['task', 'cohesion', 'lexis', 'grammar', 'accuracy'];
const PALETTES = ['amber-mint', 'rose-sky', 'violet-gold', 'yellow-cyan'] as const;
type HighlightPalette = typeof PALETTES[number];
const PALETTE_KEY = 'ielts:highlight-palette';
const PALETTE_EVENT = 'ielts:highlight-palette-changed';
const defaultPalette = () => PALETTES[0];

function isPalette(value: string | null): value is HighlightPalette {
  return PALETTES.some(palette => palette === value);
}

function readPalette(): HighlightPalette {
  try {
    const value = window.localStorage.getItem(PALETTE_KEY);
    return isPalette(value) ? value : defaultPalette();
  } catch { return defaultPalette(); }
}

function subscribePalette(listener: () => void) {
  window.addEventListener('storage', listener);
  window.addEventListener(PALETTE_EVENT, listener);
  return () => {
    window.removeEventListener('storage', listener);
    window.removeEventListener(PALETTE_EVENT, listener);
  };
}

interface Props { slug: string; locale: IeltsLocale; segments: IeltsSegment[] }

/** 阅读设置相互独立；译文随句子存储，开关只改变呈现，不请求外部翻译服务。 */
export default function IeltsComparison({ slug, locale, segments }: Props) {
  const copy = ieltsCopy(locale);
  const [view, setView] = useState<'segments' | 'full'>('segments');
  const [focus, setFocus] = useState<'all' | IeltsFocus>('all');
  const [showChanges, setShowChanges] = useState(true);
  const savedPalette = useSyncExternalStore(subscribePalette, readPalette, defaultPalette);
  const [temporaryPalette, setTemporaryPalette] = useState<HighlightPalette | null>(null);
  const palette = temporaryPalette ?? savedPalette;
  const noteButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const [wordLookupEnabled, setWordLookupEnabled] = useState(true);
  const [lookup, setLookup] = useState<{ request: WordLookupRequest; anchor: HTMLElement } | null>(null);
  const pointerStart = useRef<{ x: number; y: number; element: HTMLElement } | null>(null);
  const [showTranslations, setShowTranslations] = useState(false);
  const [openRows, setOpenRows] = useState<number[]>([]);
  const allNotesOpen = segments.length > 0 && segments.every((_, index) => openRows.includes(index));
  const hasTranslations = segments.some(segment => Boolean(segment.translationZh));
  const differences = useMemo(() => segments.map(segment => diffIeltsSentence(segment.low, segment.high)), [segments]);
  const paragraphs = useMemo(() => {
    const grouped: number[][] = [];
    segments.forEach((segment, index) => { (grouped[segment.paragraph - 1] ??= []).push(index); });
    return grouped;
  }, [segments]);

  function locateExpression(index: number) {
    setLookup(null);
    setOpenRows(current => current.includes(index) ? current : [...current, index]);
    requestAnimationFrame(() => {
      const button = noteButtons.current[index];
      button?.focus({ preventScroll: true });
      button?.closest('[data-sentence-index]')?.scrollIntoView({
        block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    });
  }

  function changePalette(value: string) {
    if (!isPalette(value)) return;
    try {
      window.localStorage.setItem(PALETTE_KEY, value);
      setTemporaryPalette(null);
      window.dispatchEvent(new Event(PALETTE_EVENT));
    } catch {
      // 浏览器禁止写入偏好时，当前阅读页仍可即时换色。
      setTemporaryPalette(value);
    }
  }

  function chooseWord(anchor: HTMLElement, word: string, segmentIndex: number, side: 'low' | 'high') {
    setLookup({ request: { slug, segmentIndex, side, word: normalizeLookupWord(word) }, anchor });
  }

  function wordClick(event: MouseEvent<HTMLSpanElement>, word: string, segmentIndex: number, side: 'low' | 'high') {
    if (event.detail > 1 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    const start = pointerStart.current;
    pointerStart.current = null;
    if (start && (start.element !== event.currentTarget || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6)) return;
    if (window.getSelection()?.toString().trim()) return;
    chooseWord(event.currentTarget, word, segmentIndex, side);
  }

  function wordKeyDown(event: KeyboardEvent<HTMLSpanElement>, word: string, segmentIndex: number, side: 'low' | 'high') {
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      chooseWord(event.currentTarget, word, segmentIndex, side);
    } else if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      const words = Array.from(event.currentTarget.closest('[data-word-sentence]')?.querySelectorAll<HTMLElement>('[data-lookup-word]') ?? []);
      const current = words.indexOf(event.currentTarget);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? words.length - 1 : current + (event.key === 'ArrowLeft' ? -1 : 1);
      if (words[next]) { event.preventDefault(); words[next].focus(); }
    }
  }

  function renderSentence(parts: IeltsDiffPart[], side: 'low' | 'high', segmentIndex: number) {
    let ordinal = 0;
    return <span data-word-sentence={`${side}-${segmentIndex}`}>{parts.map((part, index) => {
      const text = wordLookupEnabled ? lookupWordTokens(part.text).map((token, tokenIndex) => {
        if (!token.word) return <Fragment key={tokenIndex}>{token.text}</Fragment>;
        const first = ordinal++ === 0;
        return <span key={tokenIndex} role="button" tabIndex={first ? 0 : -1}
          data-lookup-word={normalizeLookupWord(token.text)} className={styles.lookupWord}
          aria-label={`${copy.lookupWordLabel} ${token.text}`}
          onPointerDown={event => { pointerStart.current = { x: event.clientX, y: event.clientY, element: event.currentTarget }; }}
          onClick={event => wordClick(event, token.text, segmentIndex, side)}
          onDoubleClick={() => setLookup(null)}
          onKeyDown={event => wordKeyDown(event, token.text, segmentIndex, side)}>{token.text}</span>;
      }) : part.text;
      return part.changed && showChanges
        ? <mark key={index} data-change={side === 'low' ? 'removed' : 'added'} className={side === 'low' ? styles.removed : styles.added}>{text}</mark>
        : <Fragment key={index}>{text}</Fragment>;
    })}</span>;
  }

  function translation(index: number, side: 'low' | 'high') {
    return <p lang="zh" data-translation-side={side} data-translation-index={index} className={styles.translation}>
      <span className="sr-only">{copy.chineseTranslation}：</span>
      {segments[index].translationZh?.[side] ?? copy.translationMissing}
    </p>;
  }

  return (
    <div className={styles.reader} data-highlight-palette={palette}>
      <div className={styles.toolbar}>
        <div className={styles.primaryControls}>
          <div role="group" aria-label={copy.readingMode} className={styles.modeGroup}>
            {(['segments', 'full'] as const).map(mode => <button key={mode} type="button" onClick={() => { setLookup(null); setView(mode); }} aria-pressed={view === mode} className={styles.modeButton}>
              {mode === 'segments' ? copy.viewSegments : copy.viewFull}
            </button>)}
          </div>
          <button type="button" role="switch" aria-checked={showTranslations} onClick={() => { setLookup(null); setShowTranslations(value => !value); }} className={styles.translationSwitch}>
            <span aria-hidden="true" className={styles.switchTrack}><span /></span>
            {copy.chineseTranslation}
          </button>
        </div>
        <div className={styles.secondaryControls}>
          <button type="button" role="switch" aria-checked={wordLookupEnabled}
            onClick={() => { setLookup(null); setWordLookupEnabled(value => !value); }} className={styles.translationSwitch}>
            <span aria-hidden="true" className={styles.switchTrack}><span /></span>{copy.wordLookup}
          </button>
          <button type="button" aria-pressed={showChanges} onClick={() => { setLookup(null); setShowChanges(value => !value); }} className={styles.controlButton}>
            {showChanges ? copy.hideChanges : copy.showChanges}
          </button>
          <label className={styles.focusLabel}>
            <span aria-hidden="true" className={styles.palettePreview}><span /><span /></span>
            {copy.highlightPalette}
            <select value={palette} onChange={event => changePalette(event.target.value)} className={styles.focusSelect}>
              {PALETTES.map(id => <option key={id} value={id}>{copy.highlightPalettes[id]}</option>)}
            </select>
          </label>
          {view === 'segments' && <>
            <label className={styles.focusLabel}>{copy.focusLabel}
              <select value={focus} onChange={event => setFocus(event.target.value as 'all' | IeltsFocus)} className={styles.focusSelect}>
                <option value="all">{copy.focusAll}</option>
                {FOCUS_ORDER.map(item => <option key={item} value={item}>{IELTS_FOCUS_LABELS[item][locale]}</option>)}
              </select>
            </label>
            <button type="button" aria-pressed={allNotesOpen} className={styles.controlButton} onClick={() => setOpenRows(allNotesOpen ? [] : segments.map((_, index) => index))}>
              {allNotesOpen ? copy.hideNotes : copy.showNotes}
            </button>
          </>}
        </div>
      </div>
      <div className={styles.legend}>
        {showChanges && <>
          <span><span aria-hidden="true" className={styles.removed}>Aa</span> {copy.removedLegend}</span>
          <span><span aria-hidden="true" className={styles.added}>Aa</span> {copy.addedLegend}</span>
        </>}
        <span>{wordLookupEnabled ? copy.wordLookupHint : copy.translationHint}</span>
      </div>
      {showTranslations && !hasTranslations && <p role="status" className={styles.unavailable}>{copy.translationsUnavailable}</p>}

      {view === 'full' ? (
        <div className={styles.fullEssays}>
          {(['low', 'high'] as const).map(side => <section key={side} aria-label={side === 'low' ? copy.bandLowFull : copy.bandHighFull} className={styles.fullColumn}>
            <h3 className={styles.columnTitle} data-side={side}>{side === 'low' ? copy.bandLowFull : copy.bandHighFull}</h3>
            {paragraphs.map((indices, paragraphIndex) => <div key={paragraphIndex} className={styles.fullParagraph}>
              {showTranslations && hasTranslations ? indices.map(index => <div key={index} className={styles.bilingualSentence}>
                <p lang="en" className={side === 'low' ? styles.original : styles.revised} data-essay-side={side} data-sentence-index={index}>
                  {renderSentence(differences[index][side], side, index)}
                </p>
                {translation(index, side)}
              </div>) : <p lang="en" className={side === 'low' ? styles.original : styles.revised} data-essay-side={side}>
                {indices.map((index, position) => <Fragment key={index}>{position > 0 ? ' ' : ''}{renderSentence(differences[index][side], side, index)}</Fragment>)}
              </p>}
            </div>)}
          </section>)}
        </div>
      ) : (
        <ol className={styles.paragraphList}>
          {paragraphs.map((indices, paragraphIndex) => <li key={paragraphIndex} className={styles.paragraph}>
            <header className={styles.paragraphHeader}>
              <h3>{copy.paragraphLabel(paragraphIndex + 1)}</h3>
              <span>{copy.sentenceCount(indices.length)}</span>
            </header>
            <IeltsExpressionBlocks edits={expressionEditsForParagraph(segments, paragraphIndex + 1)}
              paragraph={paragraphIndex + 1} locale={locale} focus={focus} onLocate={locateExpression} />
            <div className={styles.columnHeadings} aria-hidden="true">
              <span data-side="low">{copy.bandLowFull}</span><span data-side="high">{copy.bandHighFull}</span>
            </div>
            {indices.map(index => {
              const segment = segments[index];
              const open = openRows.includes(index);
              const focused = focus !== 'all' && segment.focus.includes(focus);
              const noteId = `ielts-note-${index}`;
              return <div key={index} id={`ielts-sentence-${index}`} className={styles.sentenceCard} data-focused={focused} data-note-open={open} data-sentence-index={index}>
                <div className={styles.sentencePair}>
                  <div className={`${styles.englishCell} ${styles.lowCell}`}>
                    <p className={styles.mobileLabel}>{copy.lowLabel}</p>
                    <p lang="en" className={styles.original} data-essay-side="low">{renderSentence(differences[index].low, 'low', index)}</p>
                  </div>
                  {showTranslations && hasTranslations && <div className={`${styles.translationCell} ${styles.lowTranslation}`}>{translation(index, 'low')}</div>}
                  <div className={`${styles.englishCell} ${styles.highCell}`}>
                    <p className={styles.mobileLabel} data-side="high">{copy.highLabel}</p>
                    <p lang="en" className={styles.revised} data-essay-side="high">{renderSentence(differences[index].high, 'high', index)}</p>
                  </div>
                  {showTranslations && hasTranslations && <div className={`${styles.translationCell} ${styles.highTranslation}`}>{translation(index, 'high')}</div>}
                </div>
                <div className={styles.rowFooter}>
                  <span>{copy.sentenceLabel(index + 1)}</span>
                  <button type="button" ref={element => { noteButtons.current[index] = element; }} className={styles.noteButton} aria-expanded={open} aria-controls={noteId}
                    aria-label={`${copy.sentenceLabel(index + 1)} · ${copy.noteLabel}`}
                    onClick={() => setOpenRows(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index])}>
                    {copy.noteLabel}<span aria-hidden="true">{open ? '−' : '+'}</span>
                  </button>
                </div>
                <div id={noteId} hidden={!open} className={styles.note}>
                  <div className={styles.focusTags}>{segment.focus.map(item => <span key={item}>{IELTS_FOCUS_LABELS[item][locale]}</span>)}</div>
                  <p>{segment.note[locale]}</p>
                </div>
              </div>;
            })}
          </li>)}
        </ol>
      )}
      {lookup && <IeltsWordLookupPanel key={`${lookup.request.slug}/${lookup.request.segmentIndex}/${lookup.request.side}/${lookup.request.word}`}
        request={lookup.request} locale={locale} anchor={lookup.anchor} onClose={() => setLookup(null)} />}
    </div>
  );
}

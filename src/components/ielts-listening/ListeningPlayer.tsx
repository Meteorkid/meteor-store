'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { listeningText, type ListeningLocale } from './listening-text';

/**
 * 听力练习的播放器。
 *
 * 有合成录音时用音频文件（可拖进度、可按句定位）；没有录音时退回浏览器语音逐句朗读，
 * 按每个说话人的目标音色就近匹配系统语音（先按 en-GB / en-AU 这类地区，再退到任意英语）。
 * 两种模式对上层是同一个接口：playFrom(句索引) / stop()。
 */

export interface ListeningPlayerApi {
  playFrom(index: number): void;
  stop(): void;
}

export interface ListeningAudioTrack {
  url: string;
  cues: [number, number][];
  durationSec: number;
}

interface Props {
  audio: ListeningAudioTrack | null;
  /** 每句原文与它应该匹配的音色（edge-tts 音色名，例如 en-GB-SoniaNeural）。 */
  sentences: { text: string; voice: string | null }[];
  locale: ListeningLocale;
  /** 错题重练时从某一句开始，播放键默认按这条起点。 */
  startIndex: number;
  onReady(api: ListeningPlayerApi): void;
  onActive(index: number | null): void;
}

const RATES = [0.9, 1, 1.1] as const;
type Notice = 'noSpeech' | 'noVoice' | null;

function voiceRegion(voice: string | null): string | null {
  const match = voice?.match(/^en-(GB|US|AU|CA|IN|IE|NZ|ZA)/i);
  return match ? `en-${match[1].toLowerCase()}` : null;
}

function pickVoice(voices: SpeechSynthesisVoice[], preferred: string | null): SpeechSynthesisVoice | null {
  const region = voiceRegion(preferred);
  const normalized = (lang: string) => lang.replace('_', '-').toLowerCase();
  if (region) {
    const exact = voices.find(item => normalized(item.lang) === region);
    if (exact) return exact;
    const loose = voices.find(item => normalized(item.lang).startsWith(`${region.slice(0, 5)}`));
    if (loose) return loose;
  }
  return voices.find(item => /^en/i.test(item.lang)) ?? null;
}

function formatSeconds(value: number): string {
  const seconds = Math.max(0, Math.round(value));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export default function ListeningPlayer({ audio, sentences, locale, startIndex, onReady, onActive }: Props) {
  const copy = listeningText[locale].practice;
  const playerLabel = listeningText[locale].practice.playerLabel;
  const audioRef = useRef<HTMLAudioElement>(null);
  const generation = useRef(0);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const rateRef = useRef(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [rate, setRate] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [position, setPosition] = useState(0);

  useEffect(() => { voicesRef.current = voices; }, [voices]);
  useEffect(() => { rateRef.current = rate; const el = audioRef.current; if (el) el.playbackRate = rate; }, [rate]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, []);

  const stop = useCallback(() => {
    generation.current += 1;
    setSpeaking(false);
    onActive(null);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
      setPosition(0);
    }
  }, [onActive]);

  const speakFrom = useCallback((start: number) => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setNotice('noSpeech');
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const run = ++generation.current;
    let cursor = Math.max(0, Math.min(start, sentences.length - 1));
    setNotice(null);
    setSpeaking(true);

    const finish = () => {
      if (run !== generation.current) return;
      setSpeaking(false);
      onActive(null);
    };
    const speakOne = () => {
      if (run !== generation.current) return;
      if (cursor >= sentences.length) { finish(); return; }
      const sentence = sentences[cursor];
      const utterance = new SpeechSynthesisUtterance(sentence.text);
      const voice = pickVoice(voicesRef.current, sentence.voice);
      if (voicesRef.current.length > 0 && !voice) {
        setNotice('noVoice');
        finish();
        return;
      }
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang ?? 'en-GB';
      utterance.rate = rateRef.current;
      const index = cursor;
      utterance.onend = () => { cursor = index + 1; speakOne(); };
      utterance.onerror = event => {
        if (run !== generation.current) return;
        if (event.error !== 'interrupted' && event.error !== 'canceled') setNotice('noVoice');
        finish();
      };
      onActive(index);
      synth.speak(utterance);
    };
    speakOne();
  }, [onActive, sentences]);

  const playFrom = useCallback((index: number) => {
    setNotice(null);
    if (!audio) { speakFrom(index); return; }
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = Math.max(0, (audio.cues[index]?.[0] ?? 0) - 0.2);
    el.playbackRate = rateRef.current;
    void el.play().catch(() => undefined);
  }, [audio, speakFrom]);

  const api = useMemo<ListeningPlayerApi>(() => ({ playFrom, stop }), [playFrom, stop]);
  useEffect(() => { onReady(api); }, [api, onReady]);
  useEffect(() => () => {
    generation.current += 1;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    audioRef.current?.pause();
  }, []);

  const toggle = () => {
    if (!audio) {
      if (speaking) stop(); else playFrom(startIndex);
      return;
    }
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      if (el.currentTime === 0 || el.ended) { playFrom(startIndex); return; }
      void el.play().catch(() => undefined);
    } else {
      el.pause();
    }
  };

  const total = audio?.durationSec ?? 0;

  return <section aria-label={playerLabel} className="rounded-2xl border border-white/12 bg-white/[0.04] p-4 sm:p-5">
    {audio ? <audio
      ref={audioRef}
      src={audio.url}
      preload="metadata"
      onPlay={() => setSpeaking(true)}
      onPause={() => setSpeaking(false)}
      onEnded={() => { setSpeaking(false); onActive(null); }}
      onTimeUpdate={event => {
        const time = event.currentTarget.currentTime;
        setPosition(time);
        const index = audio.cues.findIndex(([start, end]) => time >= start - 0.05 && time <= end + 0.05);
        onActive(index >= 0 ? index : null);
      }}
      onLoadedMetadata={() => { const el = audioRef.current; if (el) el.playbackRate = rateRef.current; }}
    /> : null}
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={toggle} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-violet-300/40 bg-violet-400/15 px-4 text-sm font-semibold text-white">
        {speaking ? copy.pause : copy.play}
      </button>
      <button type="button" onClick={stop} className="inline-flex min-h-11 items-center rounded-xl border border-white/20 px-4 text-sm text-white/85">{copy.stop}</button>
      <label className="inline-flex items-center gap-2 text-sm text-white/70">{copy.speed}
        <select value={rate} onChange={event => setRate(Number(event.target.value))} className="min-h-11 rounded-lg border border-white/20 bg-black/50 px-2 text-base text-white">
          {RATES.map(value => <option key={value} value={value}>{value}×</option>)}
        </select>
      </label>
      {startIndex > 0 && <button type="button" onClick={() => playFrom(startIndex)} className="inline-flex min-h-11 items-center rounded-xl border border-white/20 px-3 text-sm text-white/80">
        {copy.startFrom(startIndex + 1)}
      </button>}
    </div>
    {audio ? <div className="mt-3 flex items-center gap-3">
      <input
        type="range" min={0} max={Math.max(1, Math.round(total))} step={1} value={Math.min(Math.round(position), Math.max(1, Math.round(total)))}
        onChange={event => { const el = audioRef.current; if (!el) return; el.currentTime = Number(event.target.value); setPosition(Number(event.target.value)); }}
        aria-label={playerLabel} className="h-11 flex-1 accent-violet-300"
      />
      <span className="t-footnote tabular-nums text-white/60">{formatSeconds(position)} / {formatSeconds(total)}</span>
    </div> : null}
    <p className="mt-2 t-footnote leading-5 text-white/50">{audio ? copy.audioSynthetic : copy.readAloudNotice}</p>
    {notice && <p role="alert" className="mt-1 t-footnote text-amber-200">{notice === 'noSpeech' ? copy.noSpeech : copy.noVoice}</p>}
  </section>;
}

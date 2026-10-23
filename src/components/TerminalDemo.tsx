'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useReducedMotion } from '@/lib/motion';

interface TerminalLine {
  type: 'command' | 'output' | 'comment';
  text: string;
  delay?: number;
}

interface TerminalDemoProps {
  title: string;
  lines: TerminalLine[];
  prompt?: string;
}

export default function TerminalDemo({ title, lines, prompt = '~$' }: TerminalDemoProps) {
  const t = useTranslations('TerminalDemo');
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [typing, setTyping] = useState('');
  const [started, setStarted] = useState(false);
  const [run, setRun] = useState(0);
  const [staticRun, setStaticRun] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // 本次播放一旦切为静态，偏好恢复后也不自动重播；用户可主动点 Replay。
  if (started && reducedMotion && !staticRun) setStaticRun(true);

  const start = () => {
    setVisibleLines(0);
    setTyping('');
    setStaticRun(reducedMotion);
    setStarted(true);
    setRun((current) => current + 1);
  };

  useEffect(() => {
    if (!started || staticRun) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const pause = (ms: number) => new Promise<void>((resolve) => { timer = setTimeout(resolve, ms); });

    async function animate() {
      for (let lineIdx = 0; lineIdx < lines.length && !cancelled; lineIdx++) {
        const line = lines[lineIdx];
        const delay = line.delay ?? (line.type === 'command' ? 40 : 10);

        if (line.type === 'command') {
          for (let ci = 0; ci <= line.text.length && !cancelled; ci++) {
            setTyping(line.text.slice(0, ci));
            await pause(delay);
          }
          if (cancelled) return;
          setTyping('');
        }

        setVisibleLines(lineIdx + 1);

        if (line.type === 'command') {
          await pause(300);
        } else {
          await pause(Math.max(delay, 20));
        }
      }
    }

    void animate();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [started, lines, run, staticRun]);

  const displayedLines = started && staticRun ? lines.length : visibleLines;

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedLines, typing]);

  const currentLine = lines[displayedLines];
  const isTypingCommand = started && !staticRun && currentLine?.type === 'command' && typing !== '';

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90 shadow-2xl">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex items-center gap-2" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="font-mono text-xs text-white/40">{title}</span>
        <button
          type="button"
          onClick={start}
          className="text-xs text-white/30 transition-colors hover:text-white/60"
          aria-label={t('replayAria')}
        >
          ↺
        </button>
      </div>

      {/* Terminal body */}
      <div ref={containerRef} className="max-h-80 overflow-y-auto p-5 font-mono text-sm leading-relaxed">
        {!started ? (
          <button
            type="button"
            onClick={start}
            className="flex w-full items-center justify-center gap-2 py-8 text-white/40 transition-colors hover:text-white/70"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5">
              <span className="ml-0.5 text-lg">▶</span>
            </span>
            <span>{t('runDemo')}</span>
          </button>
        ) : (
          <>
            {lines.slice(0, displayedLines).map((line, i) => (
              <div key={i} className="whitespace-pre-wrap">
                {line.type === 'command' && (
                  <span className="text-emerald-400/70">{prompt} </span>
                )}
                {line.type === 'comment' ? (
                  <span className="text-white/25">{line.text}</span>
                ) : line.type === 'command' ? (
                  <span className="text-white">{line.text}</span>
                ) : (
                  <span className="text-gray-400">{line.text}</span>
                )}
              </div>
            ))}
            {isTypingCommand && (
              <div className="whitespace-pre-wrap">
                <span className="text-emerald-400/70">{prompt} </span>
                <span className="text-white">{typing}</span>
                <span className="animate-pulse text-emerald-400">▌</span>
              </div>
            )}
            {!isTypingCommand && displayedLines < lines.length && (
              <div>
                <span className="text-emerald-400/70">{prompt} </span>
                <span className="animate-pulse text-emerald-400">▌</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

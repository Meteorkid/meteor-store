'use client';

import { useState, useEffect, useRef } from 'react';

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
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [typing, setTyping] = useState('');
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!started) return;

    let cancelled = false;
    let lineIdx = 0;

    async function animate() {
      for (lineIdx = 0; lineIdx < lines.length && !cancelled; lineIdx++) {
        const line = lines[lineIdx];
        const delay = line.delay ?? (line.type === 'command' ? 40 : 10);

        if (line.type === 'command') {
          for (let ci = 0; ci <= line.text.length && !cancelled; ci++) {
            setTyping(line.text.slice(0, ci));
            await sleep(delay);
          }
          setTyping('');
        }

        setVisibleLines(lineIdx + 1);

        if (line.type === 'command') {
          await sleep(300);
        } else {
          await sleep(Math.max(delay, 20));
        }
      }
    }

    animate();
    return () => { cancelled = true; };
  }, [started, lines]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleLines, typing]);

  const currentLine = lines[visibleLines];
  const isTypingCommand = started && currentLine?.type === 'command' && typing !== '';

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
          onClick={() => { setStarted(false); setVisibleLines(0); setTyping(''); setTimeout(() => setStarted(true), 100); }}
          className="text-xs text-white/30 transition-colors hover:text-white/60"
          aria-label="重新播放"
        >
          ↺
        </button>
      </div>

      {/* Terminal body */}
      <div ref={containerRef} className="max-h-80 overflow-y-auto p-5 font-mono text-sm leading-relaxed">
        {!started ? (
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="flex w-full items-center justify-center gap-2 py-8 text-white/40 transition-colors hover:text-white/70"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5">
              <span className="ml-0.5 text-lg">▶</span>
            </span>
            <span>点击运行演示</span>
          </button>
        ) : (
          <>
            {lines.slice(0, visibleLines).map((line, i) => (
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
            {!isTypingCommand && visibleLines < lines.length && (
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

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

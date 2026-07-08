'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { runCommand, QUICK_COMMANDS } from '@/lib/terminal-commands';
import { triggerMeteorBurst } from './EasterEggs';
import { useReducedMotion } from '@/lib/motion';

interface HistoryEntry {
  input: string;
  output: string[];
}

const PROMPT = 'meteor@store:~$';

/**
 * 店主的终端：首页的可交互彩蛋区，也是作者小序（story 命令）的特别入口。
 * 未交互时自动演示；点击/聚焦后进入真实交互；移动端提供快捷命令按钮。
 */
export default function TerminalSection() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState('');
  const [interactive, setInteractive] = useState(false);
  const [demoTyped, setDemoTyped] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const navigateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 自动演示模式：打字 help → 显示输出 → 循环（进入交互后停止）
  useEffect(() => {
    if (interactive) return;
    if (reducedMotion) {
      // 安静模式：直接显示一条静态演示
      setHistory([{ input: 'help', output: runCommand('help').lines }]);
      return;
    }
    let cancelled = false;
    const demo = 'help';
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    const typeNext = () => {
      if (cancelled) return;
      if (i <= demo.length) {
        setDemoTyped(demo.slice(0, i));
        i++;
        timer = setTimeout(typeNext, 110 + Math.random() * 80);
      } else {
        setHistory([{ input: demo, output: runCommand(demo).lines }]);
        setDemoTyped('');
        timer = setTimeout(() => {
          if (cancelled) return;
          setHistory([]);
          i = 0;
          typeNext();
        }, 6000);
      }
    };
    timer = setTimeout(typeNext, 800);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [interactive, reducedMotion]);

  // 输出滚动到底
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [history, demoTyped]);

  useEffect(() => () => {
    if (navigateTimer.current) clearTimeout(navigateTimer.current);
  }, []);

  const execute = (raw: string) => {
    const result = runCommand(raw);
    if (result.action === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }
    setHistory(h => [...h, { input: raw, output: result.lines }]);
    setInput('');
    if (result.action === 'burst') triggerMeteorBurst();
    if (result.action === 'navigate-story') {
      navigateTimer.current = setTimeout(() => router.push('/story'), 1400);
    }
  };

  const activate = () => {
    if (!interactive) {
      setInteractive(true);
      setHistory([]);
    }
    inputRef.current?.focus();
  };

  return (
    <section id="terminal" className="py-24 relative" aria-labelledby="terminal-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 id="terminal-heading" className="text-3xl md:text-4xl font-bold mb-3">
            <span className="gradient-text">店主的终端</span>
          </h2>
          <p className="text-white/50 text-sm md:text-base">
            这是一个真的能用的终端。会用的人自然会用，不会用的可以先敲一句 help。
          </p>
        </div>

        <div
          className="glass max-w-2xl mx-auto rounded-xl overflow-hidden !bg-[rgba(10,10,18,0.72)] shadow-2xl shadow-purple-950/30 cursor-text"
          onClick={activate}
        >
          {/* macOS 风格标题栏 */}
          <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
            <span className="w-3 h-3 rounded-full bg-red-500/80" aria-hidden="true" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" aria-hidden="true" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" aria-hidden="true" />
            <span className="ml-3 text-xs text-white/40 font-mono">meteor@store — zsh</span>
          </div>

          {/* 终端主体 */}
          <div
            ref={bodyRef}
            className="p-4 h-72 overflow-y-auto font-mono text-sm leading-relaxed"
            role="log"
            aria-live="polite"
            aria-label="终端输出"
          >
            {history.map((entry, i) => (
              <div key={i} className="mb-2">
                <div className="text-white/40">
                  <span className="text-purple-400">{PROMPT}</span>{' '}
                  <span className="text-white/80">{entry.input}</span>
                </div>
                {entry.output.map((line, j) => (
                  <div key={j} className="text-purple-200/80 whitespace-pre-wrap">{line}</div>
                ))}
              </div>
            ))}

            {/* 当前输入行 */}
            <div className="flex items-center text-white/40">
              <span className="text-purple-400 shrink-0">{PROMPT}</span>
              {interactive ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') execute(input);
                  }}
                  className="flex-1 ml-2 bg-transparent outline-none text-white/90 caret-purple-400"
                  aria-label="输入终端命令"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  maxLength={80}
                />
              ) : (
                <span className="ml-2 text-white/80">
                  {demoTyped}
                  <span className="inline-block w-2 h-4 bg-purple-400/80 align-middle animate-pulse ml-0.5" aria-hidden="true" />
                </span>
              )}
            </div>
          </div>

          {/* 移动端快捷命令 */}
          <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-white/10 md:hidden">
            {QUICK_COMMANDS.map(cmd => (
              <button
                key={cmd}
                onClick={e => {
                  e.stopPropagation();
                  if (!interactive) { setInteractive(true); setHistory([]); }
                  execute(cmd);
                }}
                className="px-3 py-1.5 text-xs font-mono rounded-full border border-purple-500/30 text-purple-300 bg-purple-500/10 active:bg-purple-500/25 transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-white/25 text-xs mt-6 font-mono">
          hint: 有些命令没写在 help 里，比如那句经典的十键秘技。
        </p>
      </div>
    </section>
  );
}

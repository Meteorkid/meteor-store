'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { runCommand, QUICK_COMMANDS, ALL_COMMANDS } from '@/lib/terminal-commands';
import { triggerMeteorBurst } from './EasterEggs';
import { useReducedMotion } from '@/lib/motion';

interface HistoryEntry {
  input: string;
  output: string[];
}

const PROMPT = 'meteor@store:~$';

const BANNER = [
  '    ✦       ☄        ✦',
  '  ✦    ✦  Meteor Store  ✦    ✦',
  '    ✦   店主终端 v2.0   ✦',
  '        ─────────────',
  '  help   查看命令    easter   发现彩蛋',
  '',
];

/**
 * 店主的终端：可交互彩蛋区 + 作者小序入口。
 * 特性：历史命令 ↑↓ · ASCII banner · neofetch · 打字动画 · Tab 补全
 */
export default function TerminalSection() {
  const router = useRouter();
  const t = useTranslations('TerminalSection');
  const reducedMotion = useReducedMotion();

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState('');
  const [interactive, setInteractive] = useState(false);
  const [demoTyped, setDemoTyped] = useState('');
  const [typingLine, setTypingLine] = useState<{ entryIdx: number; lineIdx: number; text: string } | null>(null);
  const [bannerVisible, setBannerVisible] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const navigateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cmdHistory = useRef<string[]>([]);
  const historyIdx = useRef(-1);

  // 安静模式
  const [prevReduced, setPrevReduced] = useState(reducedMotion);
  if (reducedMotion !== prevReduced) {
    setPrevReduced(reducedMotion);
    if (reducedMotion && !interactive) {
      setHistory([{ input: 'help', output: runCommand('help').lines }]);
      setDemoTyped('');
      setBannerVisible(false);
    }
  }

  // 自动演示模式
  useEffect(() => {
    if (interactive || reducedMotion) return;
    let cancelled = false;
    const demo = 'help';
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    const typeNext = () => {
      if (cancelled) return;
      if (i <= demo.length) {
        setDemoTyped(demo.slice(0, i));
        i++;
        timer = setTimeout(typeNext, 100 + Math.random() * 70);
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

  // 滚动到底
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [history, demoTyped, typingLine, bannerVisible]);

  useEffect(() => () => {
    if (navigateTimer.current) clearTimeout(navigateTimer.current);
  }, []);

  // 打字动画：逐字显示最新输出行
  const typeOutput = useCallback((entryIdx: number, lines: string[]) => {
    if (reducedMotion) return; // 安静模式跳过动画
    let lineIdx = 0;
    let charIdx = 0;
    const type = () => {
      if (lineIdx >= lines.length) {
        setTypingLine(null);
        return;
      }
      const line = lines[lineIdx];
      if (charIdx <= line.length) {
        setTypingLine({ entryIdx, lineIdx, text: line.slice(0, charIdx) });
        charIdx++;
        setTimeout(type, 6 + Math.random() * 8);
      } else {
        lineIdx++;
        charIdx = 0;
        setTimeout(type, 30);
      }
    };
    type();
  }, [reducedMotion]);

  const execute = useCallback((raw: string) => {
    if (!raw.trim()) return;
    cmdHistory.current.push(raw);
    historyIdx.current = cmdHistory.current.length;
    const result = runCommand(raw);
    if (result.action === 'clear') {
      setHistory([]);
      setInput('');
      setBannerVisible(false);
      return;
    }
    const entryIdx = history.length;
    setHistory(h => [...h, { input: raw, output: result.lines }]);
    setInput('');
    setBannerVisible(false);
    typeOutput(entryIdx, result.lines);
    if (result.action === 'burst') triggerMeteorBurst();
    if (result.action === 'navigate-story') {
      navigateTimer.current = setTimeout(() => router.push('/story'), 1400);
    }
  }, [history.length, typeOutput, router]);

  const activate = () => {
    if (!interactive) {
      setInteractive(true);
      setHistory([]);
      setBannerVisible(true);
    }
    inputRef.current?.focus();
  };

  // Tab 补全
  const handleTabComplete = useCallback(() => {
    const partial = input.trim().toLowerCase();
    if (!partial) return;
    const matches = ALL_COMMANDS.filter(c => c.startsWith(partial));
    if (matches.length === 1) {
      setInput(matches[0] + ' ');
    } else if (matches.length > 1) {
      setHistory(h => [...h, { input: '', output: [matches.join('  ')] }]);
      setBannerVisible(false);
    }
  }, [input]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      execute(input);
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      handleTabComplete();
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.current.length === 0) return;
      if (historyIdx.current === cmdHistory.current.length) {
        // 保存当前输入以便恢复
        (window as any).__termSavedInput = input;
      }
      historyIdx.current = Math.max(0, historyIdx.current - 1);
      setInput(cmdHistory.current[historyIdx.current]);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx.current >= cmdHistory.current.length - 1) {
        historyIdx.current = cmdHistory.current.length;
        setInput((window as any).__termSavedInput || '');
        return;
      }
      historyIdx.current = Math.min(cmdHistory.current.length, historyIdx.current + 1);
      if (historyIdx.current === cmdHistory.current.length) {
        setInput((window as any).__termSavedInput || '');
      } else {
        setInput(cmdHistory.current[historyIdx.current]);
      }
      return;
    }
    // 重置历史索引（用户开始编辑）
    historyIdx.current = cmdHistory.current.length;
  }, [input, execute, handleTabComplete]);

  return (
    <section id="terminal" className="py-24 relative" aria-labelledby="terminal-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 id="terminal-heading" className="t-title-1 mb-3">
            <span className="gradient-text">{t('title')}</span>
          </h2>
          <p className="text-white/50 text-sm md:text-base">
            {t('description')}
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
            className="p-4 h-80 overflow-y-auto font-mono text-sm leading-relaxed"
            role="log"
            aria-live="polite"
            aria-label={t('outputLabel')}
          >
            {/* ASCII Banner */}
            {bannerVisible && interactive && history.length === 0 && (
              <div className="text-purple-300/60 whitespace-pre-wrap mb-2">
                {BANNER.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}

            {history.map((entry, i) => {
              const isTyping = typingLine && typingLine.entryIdx === i;
              return (
                <div key={i} className="mb-2">
                  <div className="text-white/40">
                    <span className="text-purple-400">{PROMPT}</span>{' '}
                    <span className="text-white/80">{entry.input}</span>
                  </div>
                  {entry.output.map((line, j) => {
                    // 打字动画中：已完成的直接显示，当前的逐字显示，未到的隐藏
                    if (isTyping) {
                      if (j < typingLine!.lineIdx) {
                        return <div key={j} className="text-purple-200/80 whitespace-pre-wrap">{line}</div>;
                      }
                      if (j === typingLine!.lineIdx) {
                        return (
                          <div key={j} className="text-purple-200/80 whitespace-pre-wrap">
                            {typingLine!.text}
                            <span className="inline-block w-1.5 h-4 bg-purple-400/60 align-middle animate-pulse ml-0.5" aria-hidden="true" />
                          </div>
                        );
                      }
                      return null;
                    }
                    return <div key={j} className="text-purple-200/80 whitespace-pre-wrap">{line}</div>;
                  })}
                </div>
              );
            })}

            {/* 当前输入行 */}
            <div className="flex items-center text-white/40">
              <span className="text-purple-400 shrink-0">{PROMPT}</span>
              {interactive ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 ml-2 bg-transparent outline-none text-white/90 caret-purple-400"
                  aria-label={t('inputLabel')}
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
                  if (!interactive) { setInteractive(true); setHistory([]); setBannerVisible(false); }
                  execute(cmd);
                }}
                className="px-3 py-1.5 text-xs font-mono rounded-full border border-purple-500/30 text-purple-300 bg-purple-500/10 active:bg-purple-500/25 transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-white/25 text-xs mt-6 font-mono space-x-3">
          <span>{t('hint')}</span>
          <span className="text-purple-400/30">↑↓ 历史</span>
          <span className="text-purple-400/30">Tab 补全</span>
        </p>
      </div>
    </section>
  );
}

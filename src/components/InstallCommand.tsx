'use client';

import { useRef, useState } from 'react';
import type { Product } from '@/data/products';

/**
 * 产品详情页「快速上手」条：终端风格安装命令 + 一键复制。
 * macOS 应用类产品（只有 download 没有 command）显示下载按钮。
 */
export default function InstallCommand({ product }: { product: Product }) {
  const quickstart = product.quickstart;
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const cmdRef = useRef<HTMLElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!quickstart) return null;

  const handleCopy = async () => {
    if (!quickstart.command) return;
    if (resetTimer.current) clearTimeout(resetTimer.current);
    try {
      await navigator.clipboard.writeText(quickstart.command);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      // 剪贴板不可用（非 HTTPS 等）：选中命令文本方便手动复制
      if (cmdRef.current) {
        window.getSelection()?.selectAllChildren(cmdRef.current);
      }
      setCopyFailed(true);
    }
    resetTimer.current = setTimeout(() => {
      setCopied(false);
      setCopyFailed(false);
    }, 2000);
  };

  return (
    <section className="mb-20">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Quick start</p>
      <h2 className="mb-6 text-2xl font-bold text-white md:text-3xl">30 秒跑起来</h2>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.4)]">
        {/* 终端标题栏 */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="font-mono text-xs text-white/40">meteor@store:~$</span>
        </div>

        {/* 命令区 / 下载区 */}
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          {quickstart.command ? (
            <>
              <div className="min-w-0 flex-1 overflow-x-auto">
                <code ref={cmdRef} className="whitespace-nowrap font-mono text-sm text-emerald-300/90">
                  <span className="select-none text-white/30">$ </span>
                  {quickstart.command}
                </code>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                aria-live="polite"
                className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  copied
                    ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300'
                    : 'border-white/15 text-white/80 hover:bg-white/10'
                }`}
              >
                {copied ? '已复制 ✓' : copyFailed ? '请手动复制' : '复制命令'}
              </button>
            </>
          ) : (
            quickstart.download && (
              <>
                <p className="text-sm text-gray-400">这是一款 macOS 应用，下载后即装即用。</p>
                <a
                  href={quickstart.download}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
                >
                  ⬇ 前往下载
                </a>
              </>
            )
          )}
        </div>

        {quickstart.note && (
          <p className="border-t border-white/[0.06] px-5 py-3 text-xs text-white/40">{quickstart.note}</p>
        )}
      </div>
    </section>
  );
}

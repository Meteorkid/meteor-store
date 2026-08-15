'use client';

import { useEffect, useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'glass-alpha';
const DEFAULT = 1;
const MIN = 0.3;
const MAX = 2.0;
const STEP = 0.05;

const PRESETS = [
  { value: 0.5, label: '通透' },
  { value: 1.0, label: '默认' },
  { value: 1.5, label: '厚实' },
];

function readAlpha(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) return DEFAULT;
    const v = parseFloat(raw);
    return Number.isFinite(v) ? Math.min(MAX, Math.max(MIN, v)) : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

function writeAlpha(v: number) {
  try { localStorage.setItem(STORAGE_KEY, String(v)); } catch { /* noop */ }
}

function applyAlpha(v: number) {
  document.documentElement.style.setProperty('--glass-alpha', String(v));
}

/**
 * 透明度偏好存在 localStorage，是组件外部的状态——按全站约定用 useSyncExternalStore 读，
 * 不在 effect 里 setState。（曾经包一层 `Promise.resolve().then()` 来绕开
 * react-hooks/set-state-in-effect：规则看不见了，模式没变，代价是首帧闪一下默认值。）
 */
const listeners = new Set<() => void>();
let cachedAlpha: number | null = null;

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getAlpha(): number {
  cachedAlpha ??= readAlpha();
  return cachedAlpha;
}

/** SSR 阶段没有 localStorage，先按默认值渲染，hydrate 后由 getAlpha 纠正 */
function getServerAlpha(): number {
  return DEFAULT;
}

function setAlpha(v: number) {
  cachedAlpha = v;
  writeAlpha(v);
  applyAlpha(v);
  listeners.forEach((cb) => cb());
}

export default function GlassPreference() {
  const alpha = useSyncExternalStore(subscribe, getAlpha, getServerAlpha);

  // 把已保存的偏好写进 CSS 变量。纯副作用，不 setState。
  useEffect(() => {
    applyAlpha(getAlpha());
  }, []);

  const handleChange = useCallback((v: number) => setAlpha(v), []);

  const pct = ((alpha - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 md:p-9">
      <h2 className="t-title-3 mb-1.5 text-white/90">外观偏好</h2>
      <p className="t-footnote mb-6 text-white/60">
        调节全站液态玻璃的透明度。拖动滑块即时生效，偏好保存在本地浏览器。
      </p>

      <div className="space-y-3">
        {/* 预设按钮 */}
        <div className="flex gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => handleChange(p.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                alpha === p.value
                  ? 'bg-violet-500/25 text-violet-200'
                  : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/70'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* 滑块 */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-white/30 w-7 text-right tabular-nums">{alpha.toFixed(2)}</span>
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={STEP}
            value={alpha}
            onChange={(e) => handleChange(parseFloat(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgb(139 92 246 / 0.3) 0%, rgb(139 92 246 / 0.7) ${pct}%, rgb(255 255 255 / 0.08) ${pct}%, rgb(255 255 255 / 0.08) 100%)`,
              accentColor: 'rgb(139 92 246)',
            }}
          />
          <div className="flex gap-0.5">
            {/* 透明图标 */}
            <svg className="w-4 h-4 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" strokeDasharray="4 2" />
            </svg>
            <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

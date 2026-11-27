'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  getFocusModeScope,
  LEARNING_FOCUS_STORAGE_KEY,
  type FocusModeScope,
} from '@/lib/learning-focus';

const COPY = {
  zh: {
    learning: { enter: '专注模式', hint: '隐藏粒子与装饰，放大正文' },
    reading: { enter: '专注阅读', hint: '收起站点导航与装饰，放大正文' },
    writing: { enter: '写作专注', hint: '收起站点外壳与氛围层，保留编辑器' },
    exit: '退出专注',
    exitShort: '退出',
    exitHint: '恢复站点导航与氛围',
  },
  en: {
    learning: { enter: 'Focus mode', hint: 'Hide ambient effects, enlarge text' },
    reading: { enter: 'Focus reading', hint: 'Hide site chrome and ambient effects, enlarge text' },
    writing: { enter: 'Writing focus', hint: 'Hide site chrome and ambience, keep the editor' },
    exit: 'Exit focus',
    exitShort: 'Exit',
    exitHint: 'Restore site navigation and ambience',
  },
} as const;

function FocusButton({
  active,
  toggle,
  locale,
  scope,
}: {
  active: boolean;
  toggle: () => void;
  locale: 'zh' | 'en';
  scope: FocusModeScope;
}) {
  const copy = COPY[locale];
  const mode = copy[scope];

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      aria-label={active ? copy.exit : mode.enter}
      title={active ? copy.exitHint : mode.hint}
      data-focus-control
      data-active={active ? 'true' : 'false'}
      className="learning-focus-control"
      style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))', left: 'max(1rem, env(safe-area-inset-left))' }}
    >
      <svg className="learning-focus-control__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
        {active ? (
          <path d="M6 6l12 12M18 6 6 18" />
        ) : (
          <>
            <path d="M9 4H5a1 1 0 0 0-1 1v4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4" />
            <circle cx="12" cy="12" r="2.8" />
          </>
        )}
      </svg>
      <span className="learning-focus-control__label">{active ? copy.exitShort : mode.enter}</span>
    </button>
  );
}

function applyFocusMode(on: boolean, scope?: FocusModeScope | null) {
  try {
    if (on) {
      document.documentElement.dataset.focusMode = 'on';
      if (scope) document.documentElement.dataset.focusScope = scope;
    } else {
      delete document.documentElement.dataset.focusMode;
      delete document.documentElement.dataset.focusScope;
    }
  } catch {
    // 浏览器禁用脚本存储或 DOM 时，按钮本身仍能工作；不要让它把页面带崩。
  }
  try {
    // 让 ExperienceAwareChrome 直接卸载粒子画布，而不只是用 CSS 隐藏。
    // display:none 不会停掉 requestAnimationFrame，隐藏的画布仍会空转。
    window.dispatchEvent(new CustomEvent('meteor:focus-mode-change', { detail: { on } }));
  } catch {
    // 自定义事件失败只影响性能优化，视觉遮挡仍由 data-focus-mode 的 CSS 兜底。
  }
}

function readFocusMode(): boolean {
  try {
    return localStorage.getItem(LEARNING_FOCUS_STORAGE_KEY) === 'on';
  } catch {
    return false;
  }
}

/**
 * 内容页专用的专注入口。
 *
 * 学习区之外还覆盖博客正文、每日一新、帮助文章、API 指南和投稿编辑器。
 * 挂在 ExperienceAwareChrome 上而不是各页 layout：这些页面没有统一的布局，
 * 逐个页面插按钮会漏；固定在左下角也只占一个浮层，不挤压正文。
 *
 * 首屏恢复由根布局的内联脚本完成，避免先闪一下粒子再进入专注。
 * 三种作用域的差异交给 CSS 的 data-focus-scope 处理：
 * 学习/阅读放大正文，写作只收外壳与氛围层，不碰编辑器和字数/保存状态。
 */
export default function LearningFocusMode() {
  const pathname = usePathname();
  const scope = getFocusModeScope(pathname);
  const locale = pathname.startsWith('/en') ? 'en' : 'zh';
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!scope) {
      applyFocusMode(false);
      return;
    }
    // 首屏由根布局内联脚本先恢复视觉；这里只同步按钮状态。
    // 放到下一帧再 setState，避免在 effect 内同步触发级联渲染。
    const frame = window.requestAnimationFrame(() => {
      const stored = readFocusMode();
      setActive(stored);
      applyFocusMode(stored, scope);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [scope]);

  if (!scope) return null;

  function toggle() {
    setActive(current => {
      const next = !current;
      try {
        if (next) localStorage.setItem(LEARNING_FOCUS_STORAGE_KEY, 'on');
        else localStorage.removeItem(LEARNING_FOCUS_STORAGE_KEY);
      } catch {
        // 隐私模式可能拒绝 localStorage；本次会话仍然生效，只是不持久化。
      }
      applyFocusMode(next, scope);
      return next;
    });
  }

  return <FocusButton active={active} toggle={toggle} locale={locale} scope={scope} />;
}

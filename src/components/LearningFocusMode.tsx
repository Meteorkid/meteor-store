'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  isLearningFocusPath,
  LEARNING_FOCUS_STORAGE_KEY,
} from '@/lib/learning-focus';

const COPY = {
  zh: {
    enter: '专注模式',
    exit: '退出专注',
    hint: '隐藏粒子与装饰，放大正文',
    exitHint: '恢复站点导航与氛围',
  },
  en: {
    enter: 'Focus mode',
    exit: 'Exit focus',
    hint: 'Hide ambient effects, enlarge text',
    exitHint: 'Restore site chrome and ambience',
  },
} as const;

function FocusButton({ active, toggle, locale }: { active: boolean; toggle: () => void; locale: 'zh' | 'en' }) {
  const copy = COPY[locale];

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      aria-label={active ? copy.exit : copy.enter}
      title={active ? copy.exitHint : copy.hint}
      data-focus-control
      data-active={active ? 'true' : 'false'}
      className="learning-focus-control"
      style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))', left: 'max(1rem, env(safe-area-inset-left))' }}
    >
      <svg className="learning-focus-control__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
        {active ? (
          <path d="m5 12 4 4 10-10" />
        ) : (
          <>
            <path d="M9 4H5a1 1 0 0 0-1 1v4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4" />
            <circle cx="12" cy="12" r="2.8" />
          </>
        )}
      </svg>
      <span className="learning-focus-control__label">{active ? copy.exit : copy.enter}</span>
    </button>
  );
}

function applyFocusMode(on: boolean) {
  try {
    if (on) document.documentElement.dataset.focusMode = 'on';
    else delete document.documentElement.dataset.focusMode;
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
 * 学习区专用专注模式。
 *
 * 挂在 ExperienceAwareChrome 上而不是各个 layout 里：竞赛、硕士、博士没有独立
 * layout，逐个页面插按钮会漏；固定在左下角也只占一个浮层，不挤压正文。
 * 首屏恢复由根布局的内联脚本完成，避免先闪一下粒子再进入专注。
 */
export default function LearningFocusMode() {
  const pathname = usePathname();
  const learning = isLearningFocusPath(pathname);
  const locale = pathname.startsWith('/en') ? 'en' : 'zh';
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!learning) {
      applyFocusMode(false);
      setActive(false);
      return;
    }
    const stored = readFocusMode();
    setActive(stored);
    applyFocusMode(stored);
  }, [learning]);

  if (!learning) return null;

  function toggle() {
    setActive(current => {
      const next = !current;
      try {
        if (next) localStorage.setItem(LEARNING_FOCUS_STORAGE_KEY, 'on');
        else localStorage.removeItem(LEARNING_FOCUS_STORAGE_KEY);
      } catch {
        // 隐私模式可能拒绝 localStorage；本次会话仍然生效，只是不持久化。
      }
      applyFocusMode(next);
      return next;
    });
  }

  return <FocusButton active={active} toggle={toggle} locale={locale} />;
}

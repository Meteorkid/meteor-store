'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from './AuthProvider';
import RedeemForm from './RedeemForm';

interface RedeemDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 可聚焦元素选择器。**必须排除 [disabled]**：弹窗刚打开时兑换按钮是禁用的，
 * 且正好排在最后，把它当作 last 去 focus() 是空操作，Shift+Tab 会当场卡死。
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * 邀请码兑换弹窗 —— 定价区就地兑换，不用跳去 /redeem 打断购买路径。
 * 表单逻辑完全复用 RedeemForm；独立页 /redeem 保留（邮件里发的链接指向它）。
 */
export default function RedeemDialog({ isOpen, onClose }: RedeemDialogProps) {
  const t = useTranslations('RedeemDialog');
  const { user, loading } = useAuth();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  // Escape 关闭 + Tab 焦点循环
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCloseRef.current();
      return;
    }
    if (e.key !== 'Tab' || !dialogRef.current) return;

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    );
    if (focusable.length === 0) return;

    // 焦点可能停在弹窗容器本身（打开时的落点），此时 indexOf 是 -1，
    // 要主动把它拉回首/末元素，否则 Tab 会直接跑到弹窗背后的页面
    const current = focusable.indexOf(document.activeElement as HTMLElement);
    if (e.shiftKey) {
      if (current <= 0) {
        e.preventDefault();
        focusable[focusable.length - 1].focus();
      }
    } else if (current === -1 || current === focusable.length - 1) {
      e.preventDefault();
      focusable[0].focus();
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // 打开时把焦点移进弹窗，关闭时还给触发它的元素。
  // 不移进去的话 aria-modal 不会被屏幕阅读器宣读，焦点陷阱也全程失效。
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const timer = setTimeout(() => dialogRef.current?.focus(), 0);
    return () => {
      clearTimeout(timer);
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="redeem-dialog-title"
        tabIndex={-1}
        className="glass-lg relative mx-4 w-full max-w-md rounded-2xl bg-[rgba(20,16,34,0.8)] p-6 animate-spotlight-in outline-none"
      >
        <button
          onClick={onClose}
          aria-label={t('closeAriaLabel')}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-white"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 id="redeem-dialog-title" className="mb-2 pr-8 text-xl font-bold text-white">
          {t('title')}
        </h2>
        <p className="mb-6 text-sm text-white/60">{t('description')}</p>

        {loading ? (
          <p className="py-6 text-center text-sm text-white/40">{t('checking')}</p>
        ) : user ? (
          <RedeemForm hideHeading />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-white/60">{t('loginHint')}</p>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
            >
              {t('loginToContinue')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

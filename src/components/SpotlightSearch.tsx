'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

const SpotlightSearchPanel = dynamic(() => import('./SpotlightSearchPanel'), {
  ssr: false,
});

/** 只保留轻量快捷键监听；完整搜索索引与拼音库在首次打开时按需加载。 */
export default function SpotlightSearch() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) {
      requestAnimationFrame(() => {
        const original = triggerRef.current;
        // 导航交接会卸载菜单内链接；取消搜索时回到常驻入口，不能把焦点留在 body。
        const target = original?.isConnected && original !== document.body && original.getClientRects().length > 0
          ? original : document.querySelector<HTMLElement>('[data-spotlight-trigger]');
        target?.focus({ preventScroll: true });
      });
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (open) close();
        else window.dispatchEvent(new CustomEvent('spotlight:open'));
        return;
      }
      if (event.key !== '/' || open) return;
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) return;
      event.preventDefault();
      window.dispatchEvent(new CustomEvent('spotlight:open'));
    };
    // 在导航交接前记住触发器，但仍等导航释放滚动锁后再挂载搜索。
    const rememberTrigger = () => {
      if (!open) triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('spotlight:open', rememberTrigger, true);
    window.addEventListener('spotlight:open', onOpenEvent);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('spotlight:open', rememberTrigger, true);
      window.removeEventListener('spotlight:open', onOpenEvent);
    };
  }, [open, close]);

  return open ? <SpotlightSearchPanel onClose={close} /> : null;
}

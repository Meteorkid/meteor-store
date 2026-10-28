'use client';

import { useEffect, useRef } from 'react';
import { isDailyEntryAnchor } from '@/lib/daily/navigation';
import type { DailyEdition } from '@/lib/daily/types';

/** 定位到具体条目；词汇同时展开释义，内容后台刷新不抢回阅读焦点。 */
export function useDailyEntryNavigation(date: string, editions: readonly DailyEdition[]) {
  const handled = useRef('');
  const pending = useRef<string | null>(null);
  useEffect(() => {
    let frame = 0;
    let deadline = Date.now() + 2000;
    const reveal = () => {
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return false; }
      if (!isDailyEntryAnchor(id) || (pending.current && pending.current !== id)) return false;
      if (handled.current === id && !pending.current) return true;
      const target = document.getElementById(id);
      if (!target) return false;
      if (target instanceof HTMLDetailsElement) target.open = true;
      handled.current = id;
      pending.current = null;
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'auto' });
      return true;
    };
    const followNavigation = () => {
      if (!pending.current || reveal()) return;
      if (Date.now() < deadline) frame = requestAnimationFrame(followNavigation);
      else pending.current = null;
    };
    const hashChanged = () => { pending.current = null; handled.current = ''; reveal(); };
    const clicked = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === '_blank') return;
      let url: URL;
      try { url = new URL(anchor.href); } catch { return; }
      if (url.origin !== location.origin || url.pathname !== location.pathname
        || url.searchParams.get('date') !== date || !isDailyEntryAnchor(url.hash.slice(1))) return;
      pending.current = url.hash.slice(1);
      deadline = Date.now() + 2000;
      cancelAnimationFrame(frame);
      // Next Link 的pushState不触发hashchange，且可能晚于首帧；有界等待导航提交。
      frame = requestAnimationFrame(followNavigation);
    };
    reveal();
    if (pending.current) frame = requestAnimationFrame(followNavigation);
    window.addEventListener('hashchange', hashChanged);
    document.addEventListener('click', clicked);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', hashChanged); document.removeEventListener('click', clicked); };
  }, [date, editions]);
}

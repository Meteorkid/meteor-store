'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';

const SpotlightSearchPanel = dynamic(() => import('./SpotlightSearchPanel'), {
  ssr: false,
});

/** 只保留轻量快捷键监听；完整搜索索引与拼音库在首次打开时按需加载。 */
export default function SpotlightSearch() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
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
      setOpen(true);
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('spotlight:open', onOpenEvent);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('spotlight:open', onOpenEvent);
    };
  }, [open]);

  return open ? <SpotlightSearchPanel onClose={close} /> : null;
}

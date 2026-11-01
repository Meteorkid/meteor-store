'use client';

import { useEffect, useRef } from 'react';

/** 表单可能远离被点击的列表项；只在打开/切换记录或关闭时定位，不干扰输入。 */
export function useAdminEditorFocus<T extends HTMLElement>(open: boolean, identity?: string) {
  const editorRef = useRef<HTMLFormElement>(null);
  const listRef = useRef<T>(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    const target = open ? editorRef.current : wasOpen.current ? listRef.current : null;
    if (target) {
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
      target.focus({ preventScroll: true });
    }
    wasOpen.current = open;
  }, [open, identity]);
  return { editorRef, listRef };
}

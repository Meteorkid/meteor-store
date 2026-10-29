'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import styles from './MastersRoundDrawer.module.css';

interface MastersRoundDrawerProps {
  open: boolean;
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
  trigger?: HTMLElement;
}

const LOCK_PROPERTIES = ['overflow', 'position', 'top', 'left', 'width', 'padding-right'] as const;
const FOCUSABLE = 'a[href], button:not(:disabled), input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), summary, [tabindex]:not([tabindex="-1"])';

export default function MastersRoundDrawer({ open, title, closeLabel, onClose, children, trigger }: MastersRoundDrawerProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const backdropPress = useRef(false);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const previousFocus = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    const scroll = { left: window.scrollX, top: window.scrollY };
    const bodyStyle = document.body.style;
    const previousStyles = LOCK_PROPERTIES.map(property => ({
      property, value: bodyStyle.getPropertyValue(property), priority: bodyStyle.getPropertyPriority(property),
    }));
    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    const paddingRight = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
    let released = false;
    let restoreFocus = true;

    dialog.showModal();
    if (contentRef.current) contentRef.current.scrollTop = 0;
    bodyStyle.setProperty('overflow', 'hidden');
    bodyStyle.setProperty('position', 'fixed');
    bodyStyle.setProperty('top', `${-scroll.top}px`);
    bodyStyle.setProperty('left', `${-scroll.left}px`);
    bodyStyle.setProperty('width', '100%');
    if (scrollbarWidth > 0) bodyStyle.setProperty('padding-right', `${paddingRight + scrollbarWidth}px`);
    closeRef.current?.focus({ preventScroll: true });

    const release = () => {
      if (released) return;
      released = true;
      window.removeEventListener('spotlight:open', handOffToSearch, true);
      if (dialog.open) dialog.close();
      for (const { property, value, priority } of previousStyles) {
        if (value) bodyStyle.setProperty(property, value, priority);
        else bodyStyle.removeProperty(property);
      }
      window.scrollTo({ ...scroll, behavior: 'instant' });
      if (restoreFocus) {
        const focusTarget = previousFocus?.isConnected && previousFocus.getClientRects().length > 0
          ? previousFocus : document.querySelector<HTMLElement>('[data-masters-detail-fallback="true"]');
        focusTarget?.focus({ preventScroll: true });
      }
    };
    const handOffToSearch = () => {
      restoreFocus = false;
      // 搜索的捕获/冒泡监听仍在同一事件中，必须先同步释放原生模态和滚动锁。
      release();
      flushSync(() => onCloseRef.current());
    };
    window.addEventListener('spotlight:open', handOffToSearch, true);
    return release;
  }, [open, trigger]);

  const focusLast = () => {
    const targets = [...(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])]
      .filter(target => !target.hasAttribute('data-drawer-focus-guard') && target.getClientRects().length > 0);
    (targets[targets.length - 1] ?? closeRef.current)?.focus({ preventScroll: true });
  };

  return <dialog ref={dialogRef} className={styles.dialog} aria-modal="true" aria-labelledby={titleId}
    onPointerDown={event => { backdropPress.current = event.target === event.currentTarget; }}
    onClick={event => { if (event.target === event.currentTarget && backdropPress.current) onCloseRef.current(); }}
    onKeyDown={event => { if (event.key === 'Escape') event.stopPropagation(); }}
    onCancel={event => { event.preventDefault(); event.stopPropagation(); onCloseRef.current(); }}>
    <div className={styles.panel}>
      <span className="sr-only" tabIndex={0} aria-hidden="true" data-drawer-focus-guard onFocus={focusLast} />
      <div className={styles.header}>
        <h2 id={titleId} className="t-title-3 text-white">{title}</h2>
        <button ref={closeRef} type="button" autoFocus onClick={() => onCloseRef.current()} className={styles.close} aria-label={closeLabel}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
        </button>
      </div>
      <div ref={contentRef} className={styles.content}>{children}</div>
      <span className="sr-only" tabIndex={0} aria-hidden="true" data-drawer-focus-guard onFocus={() => closeRef.current?.focus({ preventScroll: true })} />
    </div>
  </dialog>;
}

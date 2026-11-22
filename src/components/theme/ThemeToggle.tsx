'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { useOptionalSiteTheme } from './ThemeProvider';
import ThemeSwitcher from './ThemeSwitcher';
import styles from './ThemeSwitcher.module.css';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const english = useLocale() === 'en';
  const context = useOptionalSiteTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOutside = (target: EventTarget | null) => {
      if (!(target instanceof Node) || !rootRef.current?.contains(target)) setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => closeOutside(event.target);
    const onHeaderClose = (event: Event) => closeOutside((event as CustomEvent<EventTarget | null>).detail);
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onEscape);
    window.addEventListener('header:close-popovers', onHeaderClose);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onEscape);
      window.removeEventListener('header:close-popovers', onHeaderClose);
    };
  }, [open]);

  if (!context) return null;
  const label = english ? 'Choose a website theme' : '选择网站主题';
  return (
    <div ref={rootRef} className={styles.toggleRoot} data-header-popover-open={open ? '' : undefined}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <button
        ref={triggerRef}
        type="button"
        className={className}
        aria-label={label}
        aria-expanded={open}
        aria-controls="header-theme-panel"
        title={label}
        data-site-theme-toggle
        onClick={() => setOpen(value => !value)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <circle cx="12" cy="12" r="6.2" />
          <ellipse cx="12" cy="12" rx="10.5" ry="3.3" transform="rotate(-30 12 12)" />
        </svg>
      </button>
      <div className={styles.popover} id="header-theme-panel" hidden={!open} data-transparency-surface="panel">
        {open && <ThemeSwitcher compact headingId="header-theme-heading" />}
      </div>
    </div>
  );
}

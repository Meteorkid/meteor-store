'use client';

import { useLocale } from 'next-intl';
import { useOptionalSiteTheme } from './ThemeProvider';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const english = useLocale() === 'en';
  const context = useOptionalSiteTheme();
  if (!context) return null;
  const { theme, setTheme } = context;
  const next = theme === 'nebula' ? 'classic' : 'nebula';
  const label = english
    ? `Switch to ${next === 'classic' ? 'Classic Violet' : 'Nebula Sky'} theme`
    : `切换到${next === 'classic' ? '经典紫夜' : '星云星海'}主题`;
  return (
    <button type="button" className={className} aria-label={label} title={label} data-site-theme-toggle onClick={() => setTheme(next)}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        {theme === 'nebula'
          ? <><path d="M12 3.5v17M3.8 9h16.4M5.2 16.4h13.6" opacity=".55" /><circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" /><circle cx="16" cy="15" r="1.2" fill="currentColor" stroke="none" /></>
          : <path d="M12 4a8 8 0 1 0 0 16 6 6 0 0 1 0-16Z" fill="currentColor" stroke="none" />}
      </svg>
    </button>
  );
}

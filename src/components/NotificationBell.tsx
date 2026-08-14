'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { pickAnnouncementText } from '@/lib/announcements';
import type { Announcement } from '@/lib/announcements';

const STORAGE_KEY = 'ms_read_announcements';

function loadReadIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<string>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // localStorage 不可用（隐私模式等）时静默降级：红点无法持久化，不影响展示
  }
}

function formatDate(value: string, locale: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export default function NotificationBell() {
  const t = useTranslations('NotificationBell');
  const locale = useLocale();
  const [items, setItems] = useState<Announcement[] | null>(null);
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(() => loadReadIds());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/announcements')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('failed'))))
      .then((data: { announcements?: Announcement[] }) => {
        if (!cancelled) setItems(data.announcements ?? []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unread =
    items !== null && items.some((a) => !readIds.has(a.id));

  const openPanel = () => {
    const next = setOpen(!open);
    // 打开即视为已读
    if (items && !open) {
      const merged = new Set(readIds);
      items.forEach((a) => merged.add(a.id));
      setReadIds(merged);
      saveReadIds(merged);
    }
    return next;
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={openPanel}
        aria-label={t('ariaLabel')}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unread && (
          <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 md:w-96 overflow-hidden rounded-xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/[0.06] px-4 py-3">
            <p className="text-sm font-medium text-white">{t('title')}</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items === null ? (
              <p className="px-4 py-6 text-center text-sm text-gray-500">{t('loading')}</p>
            ) : items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-gray-500">{t('empty')}</p>
            ) : (
              <ul className="divide-y divide-white/[0.06]">
                {items.map((a) => {
                  const title = pickAnnouncementText(a.titleZh, a.titleEn, locale);
                  const body = pickAnnouncementText(a.bodyZh, a.bodyEn, locale);
                  const date = formatDate(a.publishedAt ?? a.createdAt, locale);
                  return (
                    <li key={a.id} className="px-4 py-3">
                      {title && (
                        <p className="text-sm font-medium text-white">
                          {title}
                          {date && <span className="ml-2 text-xs font-normal text-white/40">{date}</span>}
                        </p>
                      )}
                      {body && <p className="mt-1 text-sm leading-relaxed text-white/70 whitespace-pre-wrap">{body}</p>}
                      {!title && date && <p className="text-xs text-white/40">{date}</p>}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

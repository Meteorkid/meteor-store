'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { pickAnnouncementText, type Announcement } from '@/lib/announcement-text';

/**
 * 上次打开铃铛的时间（ISO 字符串）。存一个分界点而不是已读 id 数组——
 * 公告只增不删，数组会一直涨且每次挂载都要全量 JSON.parse，
 * 而"有没有未读"只需要拿最新公告的时间和它比一下。
 */
const STORAGE_KEY = 'ms_announcements_read_at';

/**
 * Header 在桌面导航和移动导航各挂一个铃铛，两个实例必须共用同一份数据：
 * 各自持有状态的话，每次页面加载会打两次 /api/announcements，
 * 而且在移动端点开标记已读后，桌面那份的红点还在，要刷新才同步。
 */
const store = {
  items: null as Announcement[] | null,
  /** null = 还没读过 localStorage（SSR 阶段没有 window） */
  readAt: null as string | null,
  pending: null as Promise<void> | null,
  listeners: new Set<() => void>(),
};

function emit() {
  store.listeners.forEach((cb) => cb());
}

function subscribe(cb: () => void) {
  store.listeners.add(cb);
  return () => {
    store.listeners.delete(cb);
  };
}

/** 无论挂载几个铃铛，公告只拉一次 */
function ensureAnnouncements() {
  store.pending ??= fetch('/api/announcements')
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('failed'))))
    .then((data: { announcements?: Announcement[] }) => {
      store.items = data.announcements ?? [];
      emit();
    })
    .catch(() => {
      store.items = [];
      emit();
    });
}

function getItems() {
  return store.items;
}

function getReadAt() {
  if (store.readAt === null) {
    try {
      store.readAt = window.localStorage.getItem(STORAGE_KEY) ?? '';
    } catch {
      // localStorage 不可用（隐私模式等）时静默降级：红点不持久化，不影响展示
      store.readAt = '';
    }
  }
  return store.readAt;
}

const SERVER_ITEMS = null;
const SERVER_READ_AT = '';

function markAllRead() {
  store.readAt = new Date().toISOString();
  try {
    window.localStorage.setItem(STORAGE_KEY, store.readAt);
  } catch {
    // 同上，静默降级
  }
  emit();
}

function announcedAt(a: Announcement) {
  return a.publishedAt ?? a.createdAt;
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
  const items = useSyncExternalStore(subscribe, getItems, () => SERVER_ITEMS);
  const readAt = useSyncExternalStore(subscribe, getReadAt, () => SERVER_READ_AT);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureAnnouncements();
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ISO 时间戳按字典序比较即等于按时间比较；readAt 为空串时全部算未读
  const unread = items !== null && items.some((a) => announcedAt(a) > readAt);

  const togglePanel = () => {
    if (!open && items) markAllRead();
    setOpen(!open);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={togglePanel}
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
              <p className="t-footnote px-4 py-6 text-center text-white/60">{t('loading')}</p>
            ) : items.length === 0 ? (
              <p className="t-footnote px-4 py-6 text-center text-white/60">{t('empty')}</p>
            ) : (
              <ul className="divide-y divide-white/[0.06]">
                {items.map((a) => {
                  const title = pickAnnouncementText(a.titleZh, a.titleEn, locale);
                  const body = pickAnnouncementText(a.bodyZh, a.bodyEn, locale);
                  const date = formatDate(announcedAt(a), locale);
                  return (
                    <li key={a.id} className="px-4 py-3">
                      {title && (
                        <p className="text-sm font-medium text-white">
                          {title}
                          {date && <span className="t-footnote ml-2 font-normal text-white/60">{date}</span>}
                        </p>
                      )}
                      {body && <p className="mt-1 text-sm leading-relaxed text-white/70 whitespace-pre-wrap">{body}</p>}
                      {!title && date && <p className="t-footnote text-white/60">{date}</p>}
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

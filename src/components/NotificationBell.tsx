'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations, useLocale } from 'next-intl';
import { pickAnnouncementText, type Announcement } from '@/lib/announcement-text';
import { useAuth } from '@/components/AuthProvider';
import { Link } from '@/i18n/navigation';
import { EMPTY_REMINDER_STATE, ensureDailyReminder, getReminderState, markDailyReminderRead, subscribeDailyReminder, syncDailyReminderRead } from '@/lib/daily/reminder-client';
import { EMPTY_MASTERS_NOTICES, ensureMastersNotices, getMastersNoticeState, markMastersRead, subscribeMastersNotices } from '@/lib/masters/notice-client';
import { EMPTY_MONITORING_STATE, getMonitoringState, hasUnreadMonitoring, markMonitoringRead, subscribeMonitoring, watchMonitoring } from '@/lib/monitoring-client';
import { monitoringText } from '@/lib/monitoring-types';

const DailyNotificationPanel = dynamic(() => import('@/components/daily/DailyNotificationPanel'), {
  loading: () => <div className="px-4 py-6" aria-busy="true"><span className="block h-3 w-32 rounded bg-white/10" /></div>,
});

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
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const adminUserId = user?.isAdmin ? userId : null;
  const monitoring = useSyncExternalStore(subscribeMonitoring, () => getMonitoringState(adminUserId), () => EMPTY_MONITORING_STATE);
  const monitoringCopy = monitoringText[locale === 'en' ? 'en' : 'zh'];
  const daily = useSyncExternalStore(subscribeDailyReminder, () => getReminderState(userId), () => EMPTY_REMINDER_STATE);
  const masters = useSyncExternalStore(subscribeMastersNotices, () => getMastersNoticeState(userId), () => EMPTY_MASTERS_NOTICES);
  const items = useSyncExternalStore(subscribe, getItems, () => SERVER_ITEMS);
  const readAt = useSyncExternalStore(subscribe, getReadAt, () => SERVER_READ_AT);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureAnnouncements();
  }, []);

  useEffect(() => adminUserId ? watchMonitoring(adminUserId) : undefined, [adminUserId]);

  useEffect(() => {
    if (!userId) return;
    ensureDailyReminder(userId);
    ensureMastersNotices(userId);
    const refresh = () => { ensureDailyReminder(userId); ensureMastersNotices(userId); };
    const preferencesChanged = () => ensureDailyReminder(userId, true);
    const applicationsChanged = () => ensureMastersNotices(userId, true);
    const syncRead = () => syncDailyReminderRead(userId);
    const timer = window.setInterval(refresh, 60_000);
    window.addEventListener('focus', refresh);
    window.addEventListener('daily-preferences-changed', preferencesChanged);
    window.addEventListener('masters-watches-changed', applicationsChanged);
    window.addEventListener('storage', syncRead);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('daily-preferences-changed', preferencesChanged);
      window.removeEventListener('masters-watches-changed', applicationsChanged);
      window.removeEventListener('storage', syncRead);
    };
  }, [userId]);

  useEffect(() => {
    const handleClick = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const closeFromHeader = (event: Event) => {
      const except = (event as CustomEvent).detail;
      if (!(except instanceof Node) || !ref.current?.contains(except)) setOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented || !ref.current?.hasAttribute('data-header-popover-open')) return;
      event.preventDefault();
      setOpen(false);
      ref.current.querySelector('button')?.focus();
    };
    document.addEventListener('pointerdown', handleClick);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('header:close-popovers', closeFromHeader);
    return () => {
      document.removeEventListener('pointerdown', handleClick);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('header:close-popovers', closeFromHeader);
    };
  }, []);

  useEffect(() => {
    if (open && userId && daily.reminder && daily.reminder.date > daily.readDate) {
      markDailyReminderRead(userId);
    }
  }, [open, userId, daily.reminder, daily.readDate]);

  // ISO 时间戳按字典序比较即等于按时间比较；readAt 为空串时全部算未读
  const unread = (items !== null && items.some((a) => announcedAt(a) > readAt)) || Boolean(daily.reminder && daily.reminder.date > daily.readDate) || masters.notices.some(notice => !notice.readAt) || hasUnreadMonitoring(adminUserId);

  const togglePanel = () => {
    if (!open && items) markAllRead();
    if (!open && userId) markDailyReminderRead(userId);
    setOpen(!open);
  };

  return (
    <div ref={ref} className="relative" data-header-popover-open={open ? '' : undefined}
      onBlur={event => {
        // 点击正文或浏览器暂时移走焦点时 relatedTarget 为 null；外点由 pointerdown 关闭。
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}>
      <button
        type="button"
        onClick={togglePanel}
        aria-label={t('ariaLabel')}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
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
        <div id={panelId} role="region" aria-label={t('title')} className="absolute right-0 top-full mt-2 w-[27rem] max-w-[calc(100vw-28px)] overflow-hidden rounded-xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/[0.06] px-4 py-3">
            <p className="text-sm font-medium text-white">{t('title')}</p>
          </div>
          <div className="max-h-[min(36rem,calc(100dvh-136px))] overflow-y-auto overscroll-contain">
            {adminUserId && <section className="border-b border-white/10 px-4 py-3" aria-label={monitoringCopy.title}>
              <Link href="/admin/monitoring" onClick={() => markMonitoringRead(adminUserId)} className="inline-flex min-h-10 items-center t-title-4 text-violet-200 underline-offset-4 hover:underline">{monitoringCopy.detail} →</Link>
              {monitoring.failed && <p className="mt-1 t-footnote text-amber-200">{monitoringCopy.failed}</p>}
              {monitoring.snapshot && <>
                <p className="mt-1 t-footnote text-white/70">{monitoringCopy.status[monitoring.snapshot.status]}</p>
                {monitoring.snapshot.events.slice(0, 3).map(event => <p key={event.id} className="mt-2 t-footnote text-white/70">
                  {monitoringCopy[event.kind]} · {formatDate(event.at, locale)}
                </p>)}
              </>}
            </section>}
            {(masters.notices.length > 0 || masters.failed) && <section className="border-b border-white/10 px-4 py-3" aria-label={locale === 'en' ? 'Application reminders' : '硕士申请提醒'}>
              <p className="t-title-4 text-white">{locale === 'en' ? 'Application reminders' : '硕士申请提醒'}</p>
              {masters.failed && <p className="mt-2 t-footnote text-amber-200">{locale === 'en' ? 'Could not refresh application reminders.' : '申请提醒暂时读取失败，请稍后重试。'}</p>}
              <ul className="divide-y divide-white/10">
                {masters.notices.map(notice => <li key={notice.id} className="py-3">
                  <p className="t-footnote text-amber-200">{notice.kind === 'changed'
                    ? (locale === 'en' ? 'Application dates updated' : '申请日期或开放状态有变更')
                    : (locale === 'en' ? `Deadline within ${notice.leadDays} days` : `${notice.leadDays} 天内截止`)}{!notice.readAt ? (locale === 'en' ? ' · Unread' : ' · 未读') : ''}</p>
                  {/* 完整导航重置日历筛选，确保跨地区的提醒目标不会被当前筛选藏住。 */}
                  <a href={`/${locale}/masters?year=${notice.round.intakeYear}#round-${notice.roundId}`} className="mt-1 block text-sm font-semibold text-violet-200 underline-offset-4 hover:underline">
                    {notice.round.details.university} · {notice.round.details.programme}
                  </a>
                  <p className="mt-1 t-footnote text-white/70">{notice.round.details.intakeLabel} · {notice.round.details.roundName} · {notice.round.details.deadlineText || notice.round.details.deadlineOn || (locale === 'en' ? 'Check official dates' : '请查看官方日期')}</p>
                </li>)}
              </ul>
              {userId && masters.notices.some(notice => !notice.readAt) && <button type="button" disabled={masters.marking}
                onClick={() => markMastersRead(userId, masters.notices.filter(notice => !notice.readAt).map(notice => notice.id))}
                className="min-h-10 t-footnote font-semibold text-violet-200 underline underline-offset-4 disabled:opacity-50">
                {locale === 'en' ? 'Mark these reminders as read' : '将这些申请提醒标为已读'}
              </button>}
            </section>}
            <DailyNotificationPanel key={userId ?? 'guest'} userId={userId} locale={locale === 'en' ? 'en' : 'zh'} />
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
                      {body && (
                        <p className="mt-1 text-sm leading-relaxed text-white/70 whitespace-pre-wrap">
                          <AnnouncementBody text={body} />
                        </p>
                      )}
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

/** 正文里的站内链接。只认自己的域名，外站地址仍按纯文本显示。 */
const INTERNAL_LINK = /(https?:\/\/[^\s]+)/g;

/**
 * 把正文里的站内链接渲染成可点的。
 *
 * 公告正文是纯文本，此前 URL 只能显示成一串不能点的字——自动发的日报通知
 * 正好要带一个「读全文」的地址，不可点等于让人手动复制。
 *
 * **只放行本站地址**：公告由管理员和定时任务写入，但把任意外链变成可点
 * 是另一回事——将来若开放更多写入路径，这里就是钓鱼链接的入口。
 * 外站地址保持纯文本，看得见、点不了。
 *
 * 用 React 元素拼接而不是 dangerouslySetInnerHTML：文本经 React 转义，
 * 天然没有注入面。
 */
function AnnouncementBody({ text }: { text: string }) {
  const siteOrigin = typeof window === 'undefined' ? '' : window.location.origin;
  return (
    <>
      {text.split(INTERNAL_LINK).map((part, index) => {
        const isInternal = siteOrigin && part.startsWith(`${siteOrigin}/`);
        if (!isInternal) return <span key={index}>{part}</span>;
        return (
          <a
            key={index}
            href={part}
            className="text-violet-200 underline decoration-violet-300/40 underline-offset-4 hover:decoration-violet-200"
          >
            {part.slice(siteOrigin.length)}
          </a>
        );
      })}
    </>
  );
}

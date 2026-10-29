'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations, useLocale } from 'next-intl';
import { pickAnnouncementText } from '@/lib/announcement-text';
import { EMPTY_ANNOUNCEMENT_STATE, announcementTimestamp, ensureAnnouncements, getAnnouncementState, hasUnreadAnnouncements, markAnnouncementsRead, subscribeAnnouncements, watchAnnouncements } from '@/lib/announcement-client';
import { useAuth } from '@/components/AuthProvider';
import { Link } from '@/i18n/navigation';
import { EMPTY_REMINDER_STATE, ensureDailyReminder, getReminderState, markDailyReminderRead, subscribeDailyReminder, syncDailyReminderRead } from '@/lib/daily/reminder-client';
import { EMPTY_MASTERS_NOTICES, ensureMastersNotices, getMastersNoticeState, markMastersRead, subscribeMastersNotices } from '@/lib/masters/notice-client';
import { EMPTY_PHD_NOTICES, ensurePhdNotices, getPhdNoticeState, markPhdRead, subscribePhdNotices } from '@/lib/phd/notice-client';
import { EMPTY_MONITORING_STATE, getMonitoringState, hasUnreadMonitoring, markMonitoringRead, subscribeMonitoring, watchMonitoring } from '@/lib/monitoring-client';
import { monitoringText } from '@/lib/monitoring-types';
import styles from './NotificationBell.module.css';

const TAB_IDS = ['daily', 'announcements', 'reminders'] as const;
type NotificationTab = typeof TAB_IDS[number];

const DailyNotificationPanel = dynamic(() => import('@/components/daily/DailyNotificationPanel'), {
  loading: () => <div className="px-4 py-6" aria-busy="true"><span className="block h-3 w-32 rounded bg-white/10" /></div>,
});

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
  const phd = useSyncExternalStore(subscribePhdNotices, () => getPhdNoticeState(userId), () => EMPTY_PHD_NOTICES);
  const announcements = useSyncExternalStore(subscribeAnnouncements, getAnnouncementState, () => EMPTY_ANNOUNCEMENT_STATE);
  const items = announcements.items;
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [activeTab, setActiveTab] = useState<NotificationTab>('daily');
  const panelId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<NotificationTab, HTMLButtonElement | null>>>({});

  useEffect(watchAnnouncements, []);

  useEffect(() => { if (open) void ensureAnnouncements(); }, [open]);

  useEffect(() => adminUserId ? watchMonitoring(adminUserId) : undefined, [adminUserId]);

  useEffect(() => {
    if (!userId) return;
    ensureDailyReminder(userId);
    ensureMastersNotices(userId);
    ensurePhdNotices(userId);
    const refresh = () => { ensureDailyReminder(userId); ensureMastersNotices(userId); ensurePhdNotices(userId); };
    const preferencesChanged = () => ensureDailyReminder(userId, true);
    const applicationsChanged = () => ensureMastersNotices(userId, true);
    const doctoralApplicationsChanged = () => ensurePhdNotices(userId, true);
    const syncRead = () => syncDailyReminderRead(userId);
    const timer = window.setInterval(refresh, 60_000);
    window.addEventListener('focus', refresh);
    window.addEventListener('daily-preferences-changed', preferencesChanged);
    window.addEventListener('masters-watches-changed', applicationsChanged);
    window.addEventListener('phd-watches-changed', doctoralApplicationsChanged);
    window.addEventListener('storage', syncRead);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('daily-preferences-changed', preferencesChanged);
      window.removeEventListener('masters-watches-changed', applicationsChanged);
      window.removeEventListener('phd-watches-changed', doctoralApplicationsChanged);
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
    if (open && activeTab === 'daily' && userId && daily.reminder && daily.reminder.date > daily.readDate) {
      markDailyReminderRead(userId);
    }
  }, [open, activeTab, userId, daily.reminder, daily.readDate]);

  const unreadAnnouncements = hasUnreadAnnouncements();
  const unread = unreadAnnouncements || Boolean(daily.reminder && daily.reminder.date > daily.readDate) || masters.notices.some(notice => !notice.readAt) || phd.notices.some(notice => !notice.readAt) || hasUnreadMonitoring(adminUserId);
  const tabLabels = locale === 'en'
    ? { daily: 'Daily content', announcements: 'Announcements', reminders: 'Reminders' }
    : { daily: '每日内容', announcements: '系统公告', reminders: '提醒' };
  const unreadCounts = {
    daily: daily.reminder && daily.reminder.date > daily.readDate ? 1 : 0,
    announcements: items?.filter(item => announcementTimestamp(item) > announcements.readAt).length ?? 0,
    reminders: masters.notices.filter(notice => !notice.readAt).length + phd.notices.filter(notice => !notice.readAt).length + (hasUnreadMonitoring(adminUserId) ? 1 : 0),
  };
  const applicationGroups = [
    { kind: 'masters', state: masters, title: locale === 'en' ? 'Master’s application reminders' : '硕士申请提醒', markRead: markMastersRead },
    { kind: 'phd', state: phd, title: locale === 'en' ? 'PhD application reminders' : '博士申请提醒', markRead: markPhdRead },
  ];

  const togglePanel = () => {
    if (!open) setHasOpened(true);
    setOpen(!open);
  };
  const navigateTabs = (event: ReactKeyboardEvent<HTMLButtonElement>, tab: NotificationTab) => {
    const index = TAB_IDS.indexOf(tab);
    const next = event.key === 'ArrowRight' ? TAB_IDS[(index + 1) % TAB_IDS.length]
      : event.key === 'ArrowLeft' ? TAB_IDS[(index + TAB_IDS.length - 1) % TAB_IDS.length]
      : event.key === 'Home' ? TAB_IDS[0] : event.key === 'End' ? TAB_IDS[TAB_IDS.length - 1] : null;
    if (!next) return;
    event.preventDefault();
    setActiveTab(next);
    tabRefs.current[next]?.focus();
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

      {hasOpened && (
        <div id={panelId} role="region" aria-label={t('title')} hidden={!open} className={styles.popup}>
          <div className={styles.heading}>
            <p className="text-sm font-medium text-white">{t('title')}</p>
            <button type="button" className={styles.close} aria-label={locale === 'en' ? 'Close notifications' : '关闭公告面板'} onClick={() => { setOpen(false); ref.current?.querySelector('button')?.focus(); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
          <div role="tablist" aria-label={locale === 'en' ? 'Notification sections' : '公告分区'} className={styles.tabs}>
            {TAB_IDS.map(tab => <button key={tab} ref={element => { tabRefs.current[tab] = element; }} id={`${panelId}-${tab}-tab`}
              type="button" role="tab" aria-selected={activeTab === tab} aria-controls={`${panelId}-${tab}`} tabIndex={activeTab === tab ? 0 : -1}
              aria-label={tabLabels[tab]} aria-describedby={unreadCounts[tab] ? `${panelId}-${tab}-unread` : undefined}
              onClick={() => setActiveTab(tab)} onKeyDown={event => navigateTabs(event, tab)} className={styles.tab}>
              {tabLabels[tab]}{unreadCounts[tab] > 0 && <><span className={styles.badge} aria-hidden="true">{unreadCounts[tab]}</span>
                <span id={`${panelId}-${tab}-unread`} className="sr-only">{locale === 'en' ? `${unreadCounts[tab]} unread` : `${unreadCounts[tab]} 条未读`}</span></>}
            </button>)}
          </div>
          <div id={`${panelId}-daily`} role="tabpanel" aria-labelledby={`${panelId}-daily-tab`} hidden={activeTab !== 'daily'} className={styles.tabPanel}>
            {userId && daily.failed && <section className={styles.status} aria-label={locale === 'en' ? 'Daily reminder status' : '日刊提醒状态'}>
              <p role="status" className="t-footnote text-amber-200">{locale === 'en' ? 'The daily reminder status could not be loaded. Daily content is still available.' : '日刊提醒状态读取失败，每日内容仍可正常阅读。'}</p>
              <button type="button" onClick={() => ensureDailyReminder(userId, true)} className="mt-1 min-h-11 t-footnote text-violet-200 underline underline-offset-4">{locale === 'en' ? 'Retry reminder' : '重试提醒'}</button>
            </section>}
            <DailyNotificationPanel key={userId ?? 'guest'} userId={userId} locale={locale === 'en' ? 'en' : 'zh'} active={open && activeTab === 'daily'} />
          </div>
          <div id={`${panelId}-reminders`} role="tabpanel" aria-labelledby={`${panelId}-reminders-tab`} hidden={activeTab !== 'reminders'} className={styles.tabPanel}>
          <div className={styles.scroll}>
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
            {applicationGroups.map(group => (group.state.notices.length > 0 || group.state.failed) && <section key={group.kind} className="border-b border-white/10 px-4 py-3" aria-label={group.title}>
              <p className="t-title-4 text-white">{group.title}</p>
              {group.state.failed && <p className="mt-2 t-footnote text-amber-200">{locale === 'en' ? 'Could not refresh application reminders.' : '申请提醒暂时读取失败，请稍后重试。'}</p>}
              <ul className="divide-y divide-white/10">
                {group.state.notices.map(notice => <li key={notice.id} className="py-3">
                  <p className="t-footnote text-amber-200">{notice.kind === 'changed'
                    ? (locale === 'en' ? 'Application dates updated' : '申请日期或开放状态有变更')
                    : (locale === 'en' ? `Deadline within ${notice.leadDays} days` : `${notice.leadDays} 天内截止`)}{!notice.readAt ? (locale === 'en' ? ' · Unread' : ' · 未读') : ''}</p>
                  {/* 完整导航重置日历筛选，确保跨地区的提醒目标不会被当前筛选藏住。 */}
                  <a href={`/${locale}/${group.kind}?year=${notice.round.intakeYear}#round-${notice.roundId}`} className="mt-1 block text-sm font-semibold text-violet-200 underline-offset-4 hover:underline">
                    {notice.round.details.university} · {notice.round.details.programme}
                  </a>
                  <p className="mt-1 t-footnote text-white/70">{notice.round.details.intakeLabel} · {notice.round.details.roundName} · {notice.round.details.deadlineText || notice.round.details.deadlineOn || (locale === 'en' ? 'Check official dates' : '请查看官方日期')}</p>
                </li>)}
              </ul>
              {userId && group.state.notices.some(notice => !notice.readAt) && <button type="button" disabled={group.state.marking}
                onClick={() => group.markRead(userId, group.state.notices.filter(notice => !notice.readAt).map(notice => notice.id))}
                className="min-h-10 t-footnote font-semibold text-violet-200 underline underline-offset-4 disabled:opacity-50">
                {locale === 'en' ? 'Mark these reminders as read' : '将这些申请提醒标为已读'}
              </button>}
            </section>)}
            {applicationGroups.every(group => group.state.notices.length === 0 && !group.state.failed) && <p className="px-4 pt-4 t-footnote text-white/65">{userId
              ? (locale === 'en' ? 'No application reminders right now.' : '当前没有申请提醒。')
              : (locale === 'en' ? 'Sign in to view your application reminders.' : '登录后可查看你的申请提醒。')}</p>}
            <div className="flex flex-wrap gap-x-5 px-4 py-3">
              <Link href="/masters" className="inline-flex min-h-11 items-center t-footnote text-violet-200 underline underline-offset-4">{locale === 'en' ? 'Master’s calendar' : '硕士申请日历'} →</Link>
              <Link href="/phd" className="inline-flex min-h-11 items-center t-footnote text-violet-200 underline underline-offset-4">{locale === 'en' ? 'PhD calendar' : '博士申请日历'} →</Link>
            </div>
          </div>
          </div>
          <div id={`${panelId}-announcements`} role="tabpanel" aria-labelledby={`${panelId}-announcements-tab`} hidden={activeTab !== 'announcements'} className={styles.tabPanel}>
          <div className={styles.scroll}>
            <section aria-label={locale === 'en' ? 'System announcements' : '系统公告'}>
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-3">
                <h2 className="t-title-4 text-white">{locale === 'en' ? 'System announcements' : '系统公告'}</h2>
                {items && items.length > 0 && unreadAnnouncements && <button type="button" onClick={() => markAnnouncementsRead(items)}
                  className="min-h-10 t-footnote text-violet-200 underline underline-offset-4">{locale === 'en' ? 'Mark these announcements as read' : '将这些公告标为已读'}</button>}
              </div>
              {announcements.failed && <div className="px-4 py-3">
                <p role="alert" className="t-footnote text-amber-200">{locale === 'en' ? 'System announcements could not be refreshed. Please retry.' : '系统公告读取失败，请重试。'}</p>
                <button type="button" aria-disabled={announcements.loading} onClick={() => { if (!announcements.loading) void ensureAnnouncements(true); }}
                  className="mt-1 min-h-10 t-footnote text-violet-200 underline underline-offset-4">{locale === 'en' ? 'Retry announcements' : '重试公告'}</button>
              </div>}
            {items === null && !announcements.failed ? (
              <p className="t-footnote px-4 py-6 text-center text-white/60">{t('loading')}</p>
            ) : items?.length === 0 && !announcements.failed ? (
              <p className="t-footnote px-4 py-6 text-center text-white/60">{t('empty')}</p>
            ) : items && items.length > 0 ? (
              <ul className="divide-y divide-white/[0.06]">
                {items.map((a) => {
                  const title = pickAnnouncementText(a.titleZh, a.titleEn, locale);
                  const body = pickAnnouncementText(a.bodyZh, a.bodyEn, locale);
                  const date = formatDate(announcementTimestamp(a), locale);
                  return (
                    <li key={a.id} className="min-w-0 px-4 py-3 [overflow-wrap:anywhere]">
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
            ) : null}
            </section>
          </div>
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
            className="text-violet-200 underline decoration-violet-300/40 underline-offset-4 hover:decoration-violet-200 [overflow-wrap:anywhere]"
          >
            {part.slice(siteOrigin.length)}
          </a>
        );
      })}
    </>
  );
}

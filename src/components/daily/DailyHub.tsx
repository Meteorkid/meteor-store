'use client';

import SourceLanguageNote from '@/components/SourceLanguageNote';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useAuth } from '@/components/AuthProvider';
import { buildLoginHref } from '@/lib/login-return';
import { dailyReadingReturn } from '@/lib/daily/navigation';
import MastersSummaryCard from '@/components/masters/MastersSummaryCard';
import { defaultMastersYear, type MastersSummary } from '@/lib/masters/types';
import { dailyChannels, DAILY_CHANNEL_IDS, isDailyHistoryDate, shiftDailyDate, type DailyEdition, type DailyPreferences, type DailyPreferencesState, type PreviousPublishedDailyDates } from '@/lib/daily/types';
import EditionContent from './EditionContent';
import DailyOverview from './DailyOverview';
import DailyChannelNav from './DailyChannelNav';
import { DAILY_PREFERENCES_EVENT, DAILY_STORAGE_EVENT, GUEST_PREFERENCES_KEY, DailyPreferencesOwnerChangedError, dailyReadStorageKey, getDailyEditionEntries, latestDailyUpdate, orderDailyChannels, parseAccountPreferences, parseGuestPreferences, parseReadKeys, pickPreferences, toggleReadKey, visibleChannels } from './state';
import { fetchDailyEditions, subscribeDailyDate, subscribeDailyRefresh } from './refresh';
import { dailyText } from './text';
import { useDailyEntryNavigation } from './entry-navigation';

export interface DailyHubProps {
  date: string;
  today: string;
  editions: DailyEdition[];
  userId: string | null;
  initialPreferences: DailyPreferences | null;
  initialPreferencesRevision: string | null;
  viewAll?: boolean;
  loadFailed?: boolean;
  preferencesFailed?: boolean;
  mastersSummary?: MastersSummary | null;
  mastersSummaryFailed?: boolean;
  previousPublishedDates?: PreviousPublishedDailyDates;
  previousPublishedDatesFailed?: boolean;
}

function readStorage(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}

function subscribeStorage(listener: () => void) {
  window.addEventListener('storage', listener);
  window.addEventListener(DAILY_STORAGE_EVENT, listener);
  return () => {
    window.removeEventListener('storage', listener);
    window.removeEventListener(DAILY_STORAGE_EVENT, listener);
  };
}

const serverStorage = () => null;
const guestStorage = () => readStorage(GUEST_PREFERENCES_KEY);

function saveStorage(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(DAILY_STORAGE_EVENT));
}

function defaultPreferences(): DailyPreferences {
  return { channels: [...DAILY_CHANNEL_IDS], reminders: false };
}

/** 只在已关注栏目的顺序里移动；全年申请日历固定在最后，不参与交换。 */
function moveDraftChannel(channels: DailyPreferences['channels'], id: Exclude<DailyPreferences['channels'][number], 'masters'>, direction: -1 | 1) {
  const editionChannels = channels.filter(channel => channel !== 'masters');
  const index = editionChannels.indexOf(id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= editionChannels.length) return channels;
  [editionChannels[index], editionChannels[target]] = [editionChannels[target], editionChannels[index]];
  return orderDailyChannels(channels.includes('masters') ? [...editionChannels, 'masters'] : editionChannels);
}

async function fetchPreferences(userId: string): Promise<DailyPreferencesState> {
  const response = await fetch('/api/daily/preferences', { cache: 'no-store' });
  if (response.status === 401) throw new DailyPreferencesOwnerChangedError('preferences session changed');
  if (!response.ok) throw new Error('preferences unavailable');
  return parseAccountPreferences(await response.json(), userId);
}

export default function DailyHub(props: DailyHubProps) {
  const { user, loading } = useAuth();
  const identity = loading ? props.userId : user?.id ?? null;
  // 身份改变时重建草稿和读取状态，旧账号的数据不留在新账号面板中。
  return <DailyHubForIdentity key={`${identity ?? 'guest'}:${props.date}`} {...props} activeUserId={identity} />;
}

function DailyHubForIdentity({ date, today: initialToday, editions: initialEditions, userId, activeUserId, initialPreferences, initialPreferencesRevision, viewAll = false, loadFailed: initialLoadFailed = false, preferencesFailed = false, mastersSummary = null, mastersSummaryFailed = false, previousPublishedDates = {}, previousPublishedDatesFailed = false }: DailyHubProps & { activeUserId: string | null }) {
  const locale = useLocale() === 'en' ? 'en' : 'zh';
  const copy = dailyText[locale];
  const router = useRouter();
  const [today, setToday] = useState(initialToday);
  useEffect(() => subscribeDailyDate(setToday), []);
  const [editions, setEditions] = useState(initialEditions);
  const [loadFailed, setLoadFailed] = useState(initialLoadFailed);
  const [refreshFailed, setRefreshFailed] = useState(false);
  const [previousInitialEditions, setPreviousInitialEditions] = useState(initialEditions);
  if (previousInitialEditions !== initialEditions) {
    setPreviousInitialEditions(initialEditions);
    setEditions(initialEditions);
    setLoadFailed(initialLoadFailed);
    setRefreshFailed(false);
  }
  useDailyEntryNavigation(date, editions);
  const latestUpdate = latestDailyUpdate(editions);
  const needsFetch = activeUserId !== null && activeUserId !== userId;
  const [accountPreferences, setAccountPreferences] = useState<DailyPreferences | null>(needsFetch ? null : initialPreferences);
  const [accountRevision, setAccountRevision] = useState<string | null>(needsFetch ? null : initialPreferencesRevision);
  const [preferenceStatus, setPreferenceStatus] = useState<'ready' | 'loading' | 'failed'>(needsFetch ? 'loading' : activeUserId && preferencesFailed ? 'failed' : 'ready');
  const guestSnapshot = useSyncExternalStore(subscribeStorage, guestStorage, serverStorage);
  const readKey = dailyReadStorageKey(activeUserId);
  const readSnapshot = useSyncExternalStore(subscribeStorage, useCallback(() => readStorage(readKey), [readKey]), serverStorage);
  const readKeys = parseReadKeys(readSnapshot, today);
  const preferences = pickPreferences(activeUserId, accountPreferences, parseGuestPreferences(guestSnapshot));
  const [chosenView, setChosenView] = useState<'all' | 'following' | null>(null);
  const view = viewAll ? 'all' : chosenView ?? (preferences === null ? 'all' : 'following');
  const selectedChannels = visibleChannels(view, preferences);
  const editionEntries = getDailyEditionEntries(date, selectedChannels, editions, readKeys);
  const recentDate = selectedChannels.flatMap(channel => channel === 'masters' ? [] : [previousPublishedDates[channel]])
    .filter((value): value is string => Boolean(value && value < date && isDailyHistoryDate(value, today))).sort().at(-1);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<DailyPreferences>(defaultPreferences);
  const [draftRevision, setDraftRevision] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveIssue, setSaveIssue] = useState<'conflict' | 'changed' | null>(null);
  const [notice, setNotice] = useState('');
  const [localError, setLocalError] = useState('');
  const [returnHash, setReturnHash] = useState('');
  const active = useRef(true);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);

  const acceptEditions = useCallback((next: DailyEdition[]) => {
    setEditions(next);
    setLoadFailed(false);
    setRefreshFailed(false);
  }, []);
  useEffect(() => subscribeDailyRefresh(date, acceptEditions, () => setRefreshFailed(true)), [date, acceptEditions]);

  const reloadContent = async () => {
    try { acceptEditions(await fetchDailyEditions(date)); }
    catch { setRefreshFailed(true); }
  };

  useEffect(() => {
    if (!needsFetch || !activeUserId) return;
    let cancelled = false;
    fetchPreferences(activeUserId).then(value => {
      if (cancelled) return;
      setAccountPreferences(value.preferences);
      setAccountRevision(value.revision);
      setPreferenceStatus('ready');
    }).catch(error => {
      if (cancelled) return;
      if (error instanceof DailyPreferencesOwnerChangedError) setSaveIssue('changed');
      setPreferenceStatus('failed');
    });
    return () => { cancelled = true; };
  }, [needsFetch, activeUserId]);

  const reloadPreferences = async () => {
    if (!activeUserId) return;
    if (saveIssue === 'changed') { window.location.reload(); return; }
    setPreferenceStatus('loading');
    try {
      const value = await fetchPreferences(activeUserId);
      if (!active.current) return;
      setAccountPreferences(value.preferences);
      setAccountRevision(value.revision);
      const loaded = value.preferences ?? defaultPreferences();
      setDraft({ ...loaded, channels: orderDailyChannels(loaded.channels) });
      setDraftRevision(value.revision);
      setSaveError('');
      setSaveIssue(null);
      setPreferenceStatus('ready');
    } catch (error) {
      if (!active.current) return;
      if (error instanceof DailyPreferencesOwnerChangedError) {
        setSaveIssue('changed'); setSaveError(copy.preferencesAccountChanged);
      }
      setPreferenceStatus('failed');
    }
  };

  const openSettings = () => {
    setReturnHash(window.location.hash);
    const value = preferences ?? defaultPreferences();
    setDraft({ channels: orderDailyChannels(value.channels), reminders: activeUserId ? value.reminders : false });
    setDraftRevision(accountRevision);
    setSaveError(saveIssue === 'conflict' ? copy.preferencesConflict : saveIssue === 'changed' ? copy.preferencesAccountChanged : '');
    setNotice('');
    setEditing(true);
  };

  const changeView = (value: 'all' | 'following') => {
    setChosenView(value);
    if (value === 'following' && viewAll) {
      const query = new URLSearchParams(window.location.search);
      query.delete('view');
      router.replace(`/daily${query.size ? `?${query}` : ''}`, { scroll: false });
    }
  };

  const savePreferences = async () => {
    if (saving || saveIssue || preferenceStatus !== 'ready') return;
    setSaving(true);
    setSaveError('');
    try {
      if (activeUserId) {
        const response = await fetch('/api/daily/preferences', {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Daily-User': activeUserId }, body: JSON.stringify({ ...draft, expectedRevision: draftRevision }),
        });
        if (!active.current) return;
        if (response.status === 401 || response.status === 409) {
          const body = response.status === 409 ? await response.json() : null;
          if (!active.current) return;
          const changed = response.status === 401 || body?.code === 'account_changed';
          setSaveIssue(changed ? 'changed' : 'conflict');
          setSaveError(changed ? copy.preferencesAccountChanged : copy.preferencesConflict);
          return;
        }
        if (!response.ok) throw new Error('save failed');
        const saved = parseAccountPreferences(await response.json(), activeUserId);
        if (!active.current) return;
        if (saved.preferences === null) throw new Error('preferences were not saved');
        setAccountPreferences(saved.preferences);
        setAccountRevision(saved.revision);
      } else {
        saveStorage(GUEST_PREFERENCES_KEY, { ...draft, reminders: false });
      }
      window.dispatchEvent(new Event(DAILY_PREFERENCES_EVENT));
      changeView('following');
      setEditing(false);
      setNotice(copy.saved);
    } catch (error) {
      if (!active.current) return;
      if (error instanceof DailyPreferencesOwnerChangedError) {
        setSaveIssue('changed'); setSaveError(copy.preferencesAccountChanged);
      } else setSaveError(activeUserId ? copy.saveFailed : copy.localFailed);
    } finally { if (active.current) setSaving(false); }
  };

  const toggleRead = (key: string) => {
    try {
      saveStorage(readKey, toggleReadKey(readKeys, key));
      setLocalError('');
    } catch { setLocalError(copy.localFailed); }
  };

  const previousDate = shiftDailyDate(date, -1);
  const nextDate = shiftDailyDate(date, 1);
  const changeDate = (value: string) => {
    if (isDailyHistoryDate(value, today)) router.push(`/daily?date=${value}${viewAll ? '&view=all' : ''}`);
  };
  const buttonClass = 'inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white disabled:opacity-40';
  const readingLinkClass = 'inline-flex min-h-11 items-center text-sm font-medium daily-accent-soft underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 daily-accent-focus';
  const backToOverview = date === today ? copy.backToTodayOverview : copy.backToEditionOverview;
  const nextCalendar = selectedChannels.includes('masters') ? dailyChannels.find(channel => channel.id === 'masters') : undefined;
  const draftOrderChannels = draft.channels.filter(channel => channel !== 'masters');
  const sectionIds = [...editionEntries.map(entry => entry.channel.id), ...(selectedChannels.includes('masters') ? ['masters'] : [])];
  const sectionKey = sectionIds.join('|');
  const [activeSection, setActiveSection] = useState('daily-overview');

  useEffect(() => {
    const ids = sectionKey ? sectionKey.split('|') : [];
    if (ids.length === 0) return;
    // 单测的最小 window 桩没有计时器；没有计时器时保留初始高亮即可。
    if (typeof window.setTimeout !== 'function') return;
    const update = () => {
      const offset = 128;
      let current = 'daily-overview';
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= offset) current = id;
      }
      setActiveSection(current);
    };
    let frame = 0;
    const schedule = (callback: () => void) => {
      if (frame) return;
      frame = window.setTimeout(() => { frame = 0; callback(); }, 0);
    };
    const syncHash = () => {
      const hash = window.location.hash.slice(1);
      if (ids.includes(hash)) setActiveSection(hash);
      else update();
    };
    schedule(syncHash);
    // 深链的浏览器滚动可能发生在 hydration 之后；等首轮滚动结束再对齐一次。
    const verifyTimer = window.setTimeout(syncHash, 600);
    const onScroll = () => schedule(update);
    const onScrollEnd = () => schedule(update);
    const onHash = () => {
      const hash = window.location.hash.slice(1);
      if (ids.includes(hash)) setActiveSection(hash);
      else schedule(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scrollend', onScrollEnd);
    window.addEventListener('hashchange', onHash);
    return () => {
      window.clearTimeout(verifyTimer);
      if (frame) window.clearTimeout(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scrollend', onScrollEnd);
      window.removeEventListener('hashchange', onHash);
    };
  }, [sectionKey]);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="border-b border-white/10 pb-6">
        <p className="t-eyebrow daily-accent-text">DAILY FRESH</p>
        <h1 className="mt-3 t-title-1 text-white">{copy.title}</h1>
        <p className="mt-2 max-w-2xl t-footnote text-white/70">{copy.description}</p>
        <SourceLanguageNote locale={locale} />
        {today !== initialToday && date < today && <p className="mt-3 t-footnote daily-accent-soft" role="status">
          {copy.newDay} <Link href={view === 'all' ? '/daily?view=all' : '/daily'} className="underline underline-offset-4">{copy.openToday} {today} →</Link>
        </p>}
        {date === today && !loadFailed && recentDate && !editionEntries.some(entry => entry.status === 'published') && <p className="mt-3 t-footnote daily-accent-soft">
          {copy.recentEditionNotice} <Link href={`/daily?date=${recentDate}&view=all`} className="underline underline-offset-4">{copy.latestPublished} · {recentDate} →</Link>
        </p>}
        <p className="mt-3 t-footnote text-white/60">{latestUpdate ? <>{copy.updated} <time dateTime={latestUpdate}>{new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-GB', { timeZone: 'Asia/Shanghai', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(latestUpdate))}</time> · {copy.beijingTime}</> : copy.firstEdition}</p>
        {date === today && <p className="mt-2 t-footnote text-white/60">{latestUpdate && <>{copy.firstEdition} · </>}<Link href={`/daily?date=${previousDate}${viewAll ? '&view=all' : ''}`} className="daily-accent-soft underline underline-offset-4">{copy.previousEdition}</Link></p>}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button type="button" disabled={!isDailyHistoryDate(previousDate, today)} onClick={() => changeDate(previousDate)} aria-label={copy.previous} className={buttonClass}>←</button>
          <label className="sr-only" htmlFor="daily-date">{copy.dateLabel}</label>
          <input id="daily-date" type="date" value={date} min={shiftDailyDate(today, -29)} max={today} onChange={event => changeDate(event.target.value)}
            className="min-h-11 min-w-0 rounded-xl border border-white/15 bg-background px-3 py-2 text-sm text-white" />
          <button type="button" disabled={date === today} onClick={() => changeDate(nextDate)} aria-label={copy.next} className={buttonClass}>→</button>
          {date !== today && <Link href={viewAll ? '/daily?view=all' : '/daily'} className={buttonClass}>{copy.today}</Link>}
        </div>
        <p className="mt-3 t-footnote text-white/60">{copy.history}</p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3 py-5">
        <div role="group" aria-label={locale === 'zh' ? '栏目视图' : 'Channel view'} className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
          {(['all', 'following'] as const).map(value => <button key={value} type="button" aria-pressed={view === value} onClick={() => changeView(value)}
            className={`min-h-10 rounded-lg px-4 py-2 text-sm font-medium ${view === value ? 'bg-white/10 text-white' : 'text-white/60'}`}>{copy[value]}</button>)}
        </div>
        <button type="button" className={buttonClass} onClick={() => editing ? setEditing(false) : openSettings()} disabled={preferenceStatus !== 'ready' || saving} aria-expanded={editing} aria-controls="daily-settings">{copy.manage}</button>
      </div>

      {preferenceStatus !== 'ready' && <div className="mb-5 rounded-xl border border-amber-300/20 px-4 py-3" role="status">
        <p className="t-footnote text-amber-200">{preferenceStatus === 'failed' ? saveIssue === 'changed' ? copy.preferencesAccountChanged : copy.preferencesFailed : copy.preferencesLoading}</p>
        {preferenceStatus === 'failed' && <button type="button" onClick={reloadPreferences} className="mt-2 min-h-10 text-sm font-semibold text-white underline underline-offset-4">{copy.retry}</button>}
      </div>}

      {editing && <section id="daily-settings" className="mb-7 rounded-2xl border daily-accent-border daily-accent-surface-faint p-5 sm:p-7" aria-labelledby="daily-settings-title">
        <h2 id="daily-settings-title" className="t-title-3 text-white">{copy.settingsTitle}</h2>
        <p className="mt-2 t-footnote text-white/60">{copy.settingsDescription}</p>
        <p className="mt-2 t-footnote text-white/60">{copy.mastersSelectionHint}</p>
        <fieldset disabled={saving} className="mt-5">
          <legend className="sr-only">{copy.manage}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {dailyChannels.map(channel => <label key={channel.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 p-4 daily-accent-choice">
              <input type="checkbox" checked={draft.channels.includes(channel.id)} className="mt-1 h-4 w-4 shrink-0 daily-accent-checkbox"
                onChange={event => setDraft(previous => ({
                  ...previous,
                  channels: orderDailyChannels(event.target.checked
                    ? [...previous.channels, channel.id]
                    : previous.channels.filter(id => id !== channel.id)),
                }))} />
              <span><span className="block text-sm font-semibold text-white">{channel[locale]}</span><span className="mt-1 block t-footnote text-white/60">{locale === 'zh' ? channel.descriptionZh : channel.descriptionEn}</span></span>
            </label>)}
          </div>
          <div className="mt-3 flex gap-5">
            <button type="button" className="min-h-10 t-footnote daily-accent-soft underline underline-offset-4" onClick={() => setDraft(previous => ({ ...previous, channels: [...DAILY_CHANNEL_IDS] }))}>{copy.allSelected}</button>
            <button type="button" className="min-h-10 t-footnote text-white/70 underline underline-offset-4" onClick={() => setDraft(previous => ({ ...previous, channels: [] }))}>{copy.clear}</button>
          </div>
          <div className="mt-5 border-t border-white/10 pt-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-sm font-semibold text-white">{copy.channelOrder}</h3>
              <p className="t-footnote text-white/50">{copy.channelOrderHint}</p>
            </div>
            {draftOrderChannels.length === 0
              ? <p className="mt-3 t-footnote text-white/55">{copy.channelOrderEmpty}</p>
              : <ol className="mt-3 grid gap-2 sm:grid-cols-2">
                {draftOrderChannels.map((id, index) => {
                  const channel = dailyChannels.find(item => item.id === id);
                  if (!channel) return null;
                  return <li key={id} className="flex min-h-12 items-center gap-2 rounded-xl border border-white/10 px-3 py-1.5">
                    <span aria-hidden="true" className="w-5 shrink-0 font-mono text-[11px] daily-accent-soft">{String(index + 1).padStart(2, '0')}</span>
                    <span className="min-w-0 flex-1 text-sm text-white/85">{channel[locale]}</span>
                    <button type="button" disabled={index === 0}
                      aria-label={`${copy.moveUp} ${channel[locale]}`}
                      onClick={() => setDraft(previous => ({ ...previous, channels: moveDraftChannel(previous.channels, id, -1) }))}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/10 text-base text-white/75 disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-offset-2 daily-accent-focus">↑</button>
                    <button type="button" disabled={index === draftOrderChannels.length - 1}
                      aria-label={`${copy.moveDown} ${channel[locale]}`}
                      onClick={() => setDraft(previous => ({ ...previous, channels: moveDraftChannel(previous.channels, id, 1) }))}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/10 text-base text-white/75 disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-offset-2 daily-accent-focus">↓</button>
                  </li>;
                })}
              </ol>}
            {draft.channels.includes('masters') && <p className="mt-2 t-footnote text-white/50">{copy.mastersOrderHint}</p>}
          </div>
          <label className="mt-5 flex items-start gap-3">
            <input type="checkbox" disabled={!activeUserId} checked={draft.reminders} onChange={event => setDraft(previous => ({ ...previous, reminders: event.target.checked }))} className="mt-1 h-4 w-4 daily-accent-checkbox" />
            <span><span className="block text-sm font-semibold text-white">{copy.reminders}</span><span className="mt-1 block t-footnote text-white/60">{activeUserId ? copy.remindersHint : copy.reminderLogin}</span></span>
          </label>
        </fieldset>
        <p className="mt-5 t-footnote text-white/60">{activeUserId ? copy.accountHint : copy.guestHint}</p>
        {saveError && <p className="mt-3 text-sm text-amber-200" role="alert">{saveError}</p>}
        {activeUserId && saveError && <button type="button" disabled={saving || preferenceStatus === 'loading'} onClick={reloadPreferences} className="mt-2 min-h-10 t-footnote daily-accent-soft underline underline-offset-4">{copy.reloadPreferences}</button>}
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" disabled={saving || Boolean(saveIssue) || preferenceStatus !== 'ready'} onClick={savePreferences} className="min-h-11 rounded-xl daily-accent-button px-5 py-2 text-sm font-semibold disabled:opacity-50">{saving ? copy.saving : copy.save}</button>
          <button type="button" disabled={saving} onClick={() => setEditing(false)} className={buttonClass}>{copy.cancel}</button>
          {!activeUserId && <Link href={buildLoginHref(dailyReadingReturn(date, view === 'all', returnHash))} className="inline-flex min-h-11 items-center px-2 text-sm daily-accent-soft underline underline-offset-4">{copy.login}</Link>}
        </div>
      </section>}
      {notice && <p className="mb-5 t-footnote text-emerald-200" role="status">{notice}</p>}
      {localError && <p className="mb-5 t-footnote text-amber-200" role="alert">{localError}</p>}
      {refreshFailed && <p className="mb-5 t-footnote text-amber-200" role="status">{copy.refreshFailed} <button type="button" onClick={reloadContent} className="min-h-10 underline underline-offset-4">{copy.retry}</button></p>}

      {loadFailed && selectedChannels.some(channel => channel !== 'masters') ? <section className="my-6 rounded-2xl border border-amber-300/20 p-7" role="alert">
        <h2 className="t-title-3 text-white">{copy.loadFailed}</h2><p className="mt-3 t-body text-white/70">{copy.loadFailedHint}</p>
        <button type="button" onClick={reloadContent} className={`${buttonClass} mt-5`}>{copy.retry}</button>
      </section> : selectedChannels.length === 0 ? <section className="my-6 rounded-2xl border border-white/10 px-6 py-12 text-center">
        <h2 className="t-title-3 text-white">{copy.noChannels}</h2><p className="mt-3 t-body text-white/70">{copy.noChannelsHint}</p>
        <button type="button" onClick={openSettings} className={`${buttonClass} mt-6`}>{copy.manage}</button>
      </section> : <>
        <DailyChannelNav variant="mobile" entries={editionEntries} showMasters={selectedChannels.includes('masters')}
          activeId={activeSection} onNavigate={id => setActiveSection(id)} locale={locale} copy={copy}
          overviewLabel={date === today ? copy.overviewToday : copy.overviewEdition} />
        <div className="mt-2 grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)]">
          <DailyChannelNav variant="desktop" entries={editionEntries} showMasters={selectedChannels.includes('masters')}
            activeId={activeSection} onNavigate={id => setActiveSection(id)} locale={locale} copy={copy}
            overviewLabel={date === today ? copy.overviewToday : copy.overviewEdition} />
          <div className="min-w-0">
            {!loadFailed && <DailyOverview entries={editionEntries} isToday={date === today} showMasters={selectedChannels.includes('masters')} locale={locale} copy={copy} />}
            <div className="space-y-5 sm:space-y-6">
            {editionEntries.map(({ channel, edition, status, isRead }, index) => {
              const published = status === 'published';
              const previousPublished = previousPublishedDates[channel.id];
              // AI 栏目的历史期次仍存着旧标题，统一按频道名展示，避免旧库记录覆盖新名称。
              const useChannelTitle = channel.id === 'ai' || (channel.id === 'internships' && ['每日实习机会', '实习与应届机会'].includes(edition?.title ?? ''));
              const title = published && edition && !useChannelTitle ? edition.title : channel[locale];
              const coverage = channel.id === 'events' ? copy.eventsCoverage : channel.id === 'competitions' ? copy.competitionsCoverage
                : channel.id === 'internships' ? copy.internshipsCoverage : null;
              const editionReadKey = `${date}:${channel.id}`;
              const nextChannel = editionEntries.slice(index + 1).find(entry => entry.status === 'published')?.channel ?? nextCalendar;
              const statusLabel = status === 'published' ? copy.statusPublished : status === 'empty' ? copy.statusEmpty : status === 'failed' ? copy.statusFailed : copy.statusUnpublished;
              const statusTone = status === 'failed' ? 'border-amber-300/25 text-amber-200' : status === 'published' ? 'border-emerald-300/25 text-emerald-200' : 'border-white/15 text-white/55';
              return <article key={channel.id} id={channel.id} tabIndex={-1} className="scroll-mt-28 overflow-hidden rounded-2xl border border-white/12 bg-white/[0.025]" aria-labelledby={`daily-${channel.id}-title`}>
                <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-white/12 bg-white/[0.035] px-5 py-4 sm:px-8">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border daily-accent-border daily-accent-surface font-mono text-[11px] font-semibold daily-accent-soft">{String(index + 1).padStart(2, '0')}</span>
                  <div className="min-w-0">
                    <p className="t-eyebrow daily-accent-text">{channel[locale]}</p>
                    <p className="mt-1 t-footnote text-white/50">{copy.issue} {date}</p>
                  </div>
                  <div className="ml-auto flex shrink-0 items-center gap-2">
                    {published && isRead && <span className="t-footnote text-emerald-200">✓ {copy.read}</span>}
                    <span className={`rounded-full border px-2.5 py-1 t-footnote ${statusTone}`}>{statusLabel}</span>
                  </div>
                </header>
                <div className="p-5 sm:p-8">
                  <h2 id={`daily-${channel.id}-title`} className="t-title-2 text-white">{title}</h2>
                  {coverage && <p className="mt-3 t-footnote text-white/60">{copy.sourceCoverage}: {coverage}</p>}
                  {published && edition?.summary && <p className="mt-3 t-body text-white/70">{edition.summary}</p>}
                  {published && edition?.content ? <>
                    <div className="mt-7"><EditionContent key={edition.id} content={edition.content} copy={copy} locale={locale} /></div>
                    <button type="button" onClick={() => toggleRead(editionReadKey)} aria-pressed={isRead} className={`${buttonClass} mt-7`}>
                      {isRead ? `✓ ${copy.read} · ${copy.markUnread}` : copy.markRead}
                    </button>
                  </> : <div className="mt-5 border-l-2 border-white/15 pl-4">
                    <p className="text-sm font-semibold text-white/80">{status === 'empty' && channel.id === 'events' ? copy.emptyEvents : copy[status]}</p>
                    <p className="mt-2 t-footnote text-white/60">{status === 'empty' ? copy.emptyHint : status === 'failed' ? copy.failedHint : copy.unpublishedHint}</p>
                    {previousPublished && previousPublished < date && isDailyHistoryDate(previousPublished, today) ? <Link
                      href={`/daily?date=${previousPublished}&view=all#${channel.id}`}
                      className="mt-3 inline-flex min-h-11 items-center t-footnote daily-accent-soft underline underline-offset-4">
                      {copy.latestPublished} · {previousPublished}
                    </Link> : <p className="mt-3 t-footnote text-white/60">{previousPublishedDatesFailed ? copy.previousPublishedFailed : copy.noPreviousPublished}</p>}
                  </div>}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-x-5 border-t border-white/10 pt-3">
                    <a href="#daily-overview" className={readingLinkClass}>{backToOverview}</a>
                    {nextChannel && <a href={`#${nextChannel.id}`} className={readingLinkClass}>{copy.nextChannel} · {nextChannel[locale]} →</a>}
                  </div>
                </div>
              </article>;
            })}
              {selectedChannels.includes('masters') && <div className="mt-1"><MastersSummaryCard summary={mastersSummary} year={defaultMastersYear(new Date(`${today}T00:00:00+08:00`))} issueDate={date} today={today} locale={locale} failed={mastersSummaryFailed} /></div>}
            </div>
          </div>
        </div>
      </>}
      {nextCalendar && !loadFailed && editionEntries.length > 0 && <a href="#daily-overview" className={readingLinkClass}>{backToOverview}</a>}
      <p className="border-t border-white/10 pt-6 t-footnote text-white/60">{copy.readHint} {copy.readScope}</p>
    </div>
  );
}

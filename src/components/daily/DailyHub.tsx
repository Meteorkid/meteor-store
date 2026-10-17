'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useAuth } from '@/components/AuthProvider';
import MastersSummaryCard from '@/components/masters/MastersSummaryCard';
import { defaultMastersYear, type MastersSummary } from '@/lib/masters/types';
import { dailyChannels, DAILY_CHANNEL_IDS, isDailyHistoryDate, shiftDailyDate, type DailyEdition, type DailyPreferences } from '@/lib/daily/types';
import EditionContent from './EditionContent';
import DailyOverview from './DailyOverview';
import { DAILY_PREFERENCES_EVENT, DAILY_STORAGE_EVENT, GUEST_PREFERENCES_KEY, dailyReadStorageKey, getDailyEditionEntries, parseAccountPreferences, parseGuestPreferences, parseReadKeys, pickPreferences, toggleReadKey, visibleChannels } from './state';
import { dailyText } from './text';

export interface DailyHubProps {
  date: string;
  today: string;
  editions: DailyEdition[];
  userId: string | null;
  initialPreferences: DailyPreferences | null;
  viewAll?: boolean;
  loadFailed?: boolean;
  preferencesFailed?: boolean;
  mastersSummary?: MastersSummary | null;
  mastersSummaryFailed?: boolean;
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

async function fetchPreferences(userId: string): Promise<DailyPreferences | null> {
  const response = await fetch('/api/daily/preferences', { cache: 'no-store' });
  if (!response.ok) throw new Error('preferences unavailable');
  return parseAccountPreferences(await response.json(), userId);
}

export default function DailyHub(props: DailyHubProps) {
  const { user, loading } = useAuth();
  const identity = loading ? props.userId : user?.id ?? null;
  // 身份改变时重建草稿和读取状态，旧账号的数据不留在新账号面板中。
  return <DailyHubForIdentity key={`${identity ?? 'guest'}:${props.date}`} {...props} activeUserId={identity} />;
}

function DailyHubForIdentity({ date, today, editions, userId, activeUserId, initialPreferences, viewAll = false, loadFailed = false, preferencesFailed = false, mastersSummary = null, mastersSummaryFailed = false }: DailyHubProps & { activeUserId: string | null }) {
  const locale = useLocale() === 'en' ? 'en' : 'zh';
  const copy = dailyText[locale];
  const router = useRouter();
  const needsFetch = activeUserId !== null && activeUserId !== userId;
  const [accountPreferences, setAccountPreferences] = useState<DailyPreferences | null>(needsFetch ? null : initialPreferences);
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
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<DailyPreferences>(defaultPreferences);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [notice, setNotice] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!needsFetch || !activeUserId) return;
    let cancelled = false;
    fetchPreferences(activeUserId).then(value => {
      if (cancelled) return;
      setAccountPreferences(value);
      setPreferenceStatus('ready');
    }).catch(() => { if (!cancelled) setPreferenceStatus('failed'); });
    return () => { cancelled = true; };
  }, [needsFetch, activeUserId]);

  const reloadPreferences = async () => {
    if (!activeUserId) return;
    setPreferenceStatus('loading');
    try {
      setAccountPreferences(await fetchPreferences(activeUserId));
      setPreferenceStatus('ready');
    } catch { setPreferenceStatus('failed'); }
  };

  const openSettings = () => {
    const value = preferences ?? defaultPreferences();
    setDraft({ channels: [...value.channels], reminders: activeUserId ? value.reminders : false });
    setSaveError('');
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
    setSaving(true);
    setSaveError('');
    try {
      if (activeUserId) {
        const response = await fetch('/api/daily/preferences', {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Daily-User': activeUserId }, body: JSON.stringify(draft),
        });
        if (!response.ok) throw new Error('save failed');
        const saved = parseAccountPreferences(await response.json(), activeUserId);
        if (saved === null) throw new Error('preferences were not saved');
        setAccountPreferences(saved);
      } else {
        saveStorage(GUEST_PREFERENCES_KEY, { ...draft, reminders: false });
      }
      window.dispatchEvent(new Event(DAILY_PREFERENCES_EVENT));
      changeView('following');
      setEditing(false);
      setNotice(copy.saved);
    } catch {
      setSaveError(activeUserId ? copy.saveFailed : copy.localFailed);
    } finally { setSaving(false); }
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

  return (
    <div className="mx-auto max-w-4xl">
      <header className="border-b border-white/10 pb-6">
        <p className="t-eyebrow text-violet-300">DAILY FRESH</p>
        <h1 className="mt-3 t-title-1 text-white">{copy.title}</h1>
        <p className="mt-3 max-w-2xl t-body text-white/70">{copy.description}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button type="button" disabled={!isDailyHistoryDate(previousDate, today)} onClick={() => changeDate(previousDate)} aria-label={copy.previous} className={buttonClass}>←</button>
          <label className="sr-only" htmlFor="daily-date">{copy.dateLabel}</label>
          <input id="daily-date" type="date" value={date} min={shiftDailyDate(today, -29)} max={today} onChange={event => changeDate(event.target.value)}
            className="min-h-11 min-w-0 rounded-xl border border-white/15 bg-black px-3 py-2 text-sm text-white" />
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
        <p className="t-footnote text-amber-200">{preferenceStatus === 'failed' ? copy.preferencesFailed : copy.preferencesLoading}</p>
        {preferenceStatus === 'failed' && <button type="button" onClick={reloadPreferences} className="mt-2 min-h-10 text-sm font-semibold text-white underline underline-offset-4">{copy.retry}</button>}
      </div>}

      {editing && <section id="daily-settings" className="mb-7 rounded-2xl border border-violet-400/30 bg-violet-400/[0.04] p-5 sm:p-7" aria-labelledby="daily-settings-title">
        <h2 id="daily-settings-title" className="t-title-3 text-white">{copy.settingsTitle}</h2>
        <p className="mt-2 t-footnote text-white/60">{copy.settingsDescription}</p>
        <p className="mt-2 t-footnote text-white/60">{copy.mastersSelectionHint}</p>
        <fieldset disabled={saving} className="mt-5">
          <legend className="sr-only">{copy.manage}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {dailyChannels.map(channel => <label key={channel.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 p-4 has-checked:border-violet-400/50">
              <input type="checkbox" checked={draft.channels.includes(channel.id)} className="mt-1 h-4 w-4 shrink-0 accent-violet-400"
                onChange={event => setDraft(previous => ({ ...previous, channels: DAILY_CHANNEL_IDS.filter(id => id === channel.id ? event.target.checked : previous.channels.includes(id)) }))} />
              <span><span className="block text-sm font-semibold text-white">{channel[locale]}</span><span className="mt-1 block t-footnote text-white/60">{locale === 'zh' ? channel.descriptionZh : channel.descriptionEn}</span></span>
            </label>)}
          </div>
          <div className="mt-3 flex gap-5">
            <button type="button" className="min-h-10 t-footnote text-violet-200 underline underline-offset-4" onClick={() => setDraft(previous => ({ ...previous, channels: [...DAILY_CHANNEL_IDS] }))}>{copy.allSelected}</button>
            <button type="button" className="min-h-10 t-footnote text-white/70 underline underline-offset-4" onClick={() => setDraft(previous => ({ ...previous, channels: [] }))}>{copy.clear}</button>
          </div>
          <label className="mt-3 flex items-start gap-3 border-t border-white/10 pt-5">
            <input type="checkbox" disabled={!activeUserId} checked={draft.reminders} onChange={event => setDraft(previous => ({ ...previous, reminders: event.target.checked }))} className="mt-1 h-4 w-4 accent-violet-400" />
            <span><span className="block text-sm font-semibold text-white">{copy.reminders}</span><span className="mt-1 block t-footnote text-white/60">{activeUserId ? copy.remindersHint : copy.reminderLogin}</span></span>
          </label>
        </fieldset>
        <p className="mt-5 t-footnote text-white/60">{activeUserId ? copy.accountHint : copy.guestHint}</p>
        {saveError && <p className="mt-3 text-sm text-amber-200" role="alert">{saveError}</p>}
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" disabled={saving} onClick={savePreferences} className="min-h-11 rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? copy.saving : copy.save}</button>
          <button type="button" disabled={saving} onClick={() => setEditing(false)} className={buttonClass}>{copy.cancel}</button>
          {!activeUserId && <Link href={`/login?next=${encodeURIComponent('/daily')}`} className="inline-flex min-h-11 items-center px-2 text-sm text-violet-200 underline underline-offset-4">{copy.login}</Link>}
        </div>
      </section>}
      {notice && <p className="mb-5 t-footnote text-emerald-200" role="status">{notice}</p>}
      {localError && <p className="mb-5 t-footnote text-amber-200" role="alert">{localError}</p>}

      {!loadFailed && <DailyOverview entries={editionEntries} isToday={date === today} showMasters={selectedChannels.includes('masters')} locale={locale} copy={copy} />}

      {loadFailed && selectedChannels.some(channel => channel !== 'masters') ? <section className="my-6 rounded-2xl border border-amber-300/20 p-7" role="alert">
        <h2 className="t-title-3 text-white">{copy.loadFailed}</h2><p className="mt-3 t-body text-white/70">{copy.loadFailedHint}</p>
        <button type="button" onClick={() => router.refresh()} className={`${buttonClass} mt-5`}>{copy.retry}</button>
      </section> : selectedChannels.length === 0 ? <section className="my-6 rounded-2xl border border-white/10 px-6 py-12 text-center">
        <h2 className="t-title-3 text-white">{copy.noChannels}</h2><p className="mt-3 t-body text-white/70">{copy.noChannelsHint}</p>
        <button type="button" onClick={openSettings} className={`${buttonClass} mt-6`}>{copy.manage}</button>
      </section> : <div className="divide-y divide-white/10">
        {editionEntries.map(({ channel, edition, status, isRead }, index) => {
          const published = status === 'published';
          const editionReadKey = `${date}:${channel.id}`;
          return <article key={channel.id} id={channel.id} className="scroll-mt-24 py-9 sm:py-12" aria-labelledby={`daily-${channel.id}-title`}>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs text-violet-200">{String(index + 1).padStart(2, '0')}</span>
              <p className="t-eyebrow text-violet-300">{channel[locale]}</p>
              <span className="ml-auto t-footnote text-white/60">{copy.issue} {date}{isRead ? ` · ${copy.read}` : ''}</span>
            </div>
            <h2 id={`daily-${channel.id}-title`} className="t-title-2 text-white">{published && edition ? edition.title : channel[locale]}</h2>
            {published && edition?.summary && <p className="mt-3 t-body text-white/70">{edition.summary}</p>}
            {published && edition?.content ? <>
              <div className="mt-7"><EditionContent key={`${edition.id}:${edition.updatedAt}`} content={edition.content} copy={copy} locale={locale} /></div>
              <button type="button" onClick={() => toggleRead(editionReadKey)} aria-pressed={isRead} className={`${buttonClass} mt-7`}>
                {isRead ? `✓ ${copy.read} · ${copy.markUnread}` : copy.markRead}
              </button>
            </> : <div className="mt-5 border-l-2 border-white/15 pl-4">
              <p className="text-sm font-semibold text-white/80">{status === 'empty' && channel.id === 'events' ? copy.emptyEvents : copy[status]}</p>
              <p className="mt-2 t-footnote text-white/60">{status === 'empty' ? copy.emptyHint : status === 'failed' ? copy.failedHint : copy.unpublishedHint}</p>
            </div>}
          </article>;
        })}
      </div>}
      {selectedChannels.includes('masters') && <MastersSummaryCard summary={mastersSummary} year={defaultMastersYear(new Date(`${today}T00:00:00+08:00`))} issueDate={date} today={today} locale={locale} failed={mastersSummaryFailed} />}
      <p className="border-t border-white/10 pt-6 t-footnote text-white/60">{copy.readHint} {copy.readScope}</p>
    </div>
  );
}

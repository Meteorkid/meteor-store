'use client';

import SourceLanguageNote from '@/components/SourceLanguageNote';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useAuth } from '@/components/AuthProvider';
import { buildLoginHref } from '@/lib/login-return';
import { mastersRegions, type MastersRound, type MastersWatch, type MastersWatchInput } from '@/lib/masters/types';
import RoundCard, { type MastersRoundDraft } from './RoundCard';
import MastersCalendar from './MastersCalendar';
import MastersTimeline from './MastersTimeline';
import MastersRoundDrawer from './MastersRoundDrawer';
import { assertMastersOwner, canExportMastersRound, filterMastersRounds, organizeMastersRounds, parseMastersWatch, parseMastersWatches, unavailableWatches, type MastersFilters } from './state';
import { mastersText } from './text';

export interface MastersHubProps {
  year: number;
  nowIso: string;
  rounds: MastersRound[];
  userId: string | null;
  initialWatches: MastersWatch[];
  watchedRounds: MastersRound[];
  loadFailed?: boolean;
  watchesFailed?: boolean;
  /** 上方图表初始显示方式；申请列表始终保留。 */
  initialCalendarMode?: 'calendar' | 'timeline';
}

function subscribeClock(listener: () => void) {
  const timer = window.setInterval(listener, 60_000);
  window.addEventListener('focus', listener);
  return () => { window.clearInterval(timer); window.removeEventListener('focus', listener); };
}
const minuteNow = () => Math.floor(Date.now() / 60_000) * 60_000;

async function fetchWatches(userId: string) {
  const response = await fetch('/api/masters/watches', { cache: 'no-store' });
  if (!response.ok) throw new Error('Watches unavailable');
  return parseMastersWatches(await response.json(), userId);
}

export default function MastersHub(props: MastersHubProps) {
  const { user, loading } = useAuth();
  const identity = loading ? props.userId : user?.id ?? null;
  return <MastersHubForIdentity key={`${identity === null ? 'guest' : `user:${identity}`}:${props.year}`} {...props} activeUserId={identity} />;
}

function MastersHubForIdentity({ year, nowIso, rounds, userId, activeUserId, initialWatches, watchedRounds, loadFailed = false, watchesFailed = false, initialCalendarMode = 'calendar' }: MastersHubProps & { activeUserId: string | null }) {
  const locale = useLocale() === 'en' ? 'en' : 'zh';
  const copy = mastersText[locale];
  const router = useRouter();
  const sameIdentity = activeUserId !== null && activeUserId === userId;
  const needsFetch = activeUserId !== null && !sameIdentity;
  const [watches, setWatches] = useState(sameIdentity ? initialWatches : []);
  const [ownRounds, setOwnRounds] = useState(sameIdentity ? watchedRounds : []);
  const [watchStatus, setWatchStatus] = useState<'ready' | 'loading' | 'failed'>(needsFetch ? 'loading' : sameIdentity && watchesFailed ? 'failed' : 'ready');
  const [view, setView] = useState<'all' | 'mine'>('all');
  const [calendarMode, setCalendarMode] = useState<'calendar' | 'timeline'>(initialCalendarMode);
  const [detailSelection, setDetailSelection] = useState<{ roundId: string; trigger?: HTMLElement } | null>(null);
  const [drafts, setDrafts] = useState<Record<string, MastersRoundDraft>>({});
  const [yearInput, setYearInput] = useState(String(year));
  const [filters, setFilters] = useState<MastersFilters>({ year, region: '', school: '', subject: '', studyType: '', intake: '' });
  const [selected, setSelected] = useState<string[]>([]);
  const [pending, setPending] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const clock = useSyncExternalStore(subscribeClock, minuteNow, useCallback(() => Date.parse(nowIso), [nowIso]));
  const now = new Date(clock);

  useEffect(() => {
    // 同一账号退出后再次登录时，旧 RSC 初始值也不能覆盖最新申请进度。
    if (!activeUserId) return;
    let cancelled = false;
    fetchWatches(activeUserId).then(value => {
      if (cancelled) return;
      setWatches(value.watches);
      setOwnRounds(value.rounds);
      setWatchStatus('ready');
    }).catch(() => { if (!cancelled) setWatchStatus('failed'); });
    return () => { cancelled = true; };
  }, [activeUserId]);

  const reloadWatches = async () => {
    if (!activeUserId) return;
    setWatchStatus('loading');
    try {
      const value = await fetchWatches(activeUserId);
      setWatches(value.watches);
      setOwnRounds(value.rounds);
      setWatchStatus('ready');
    } catch { setWatchStatus('failed'); }
  };

  const updateWatch = async (roundId: string, input?: MastersWatchInput) => {
    if (!activeUserId || watchStatus !== 'ready' || pending.includes(roundId)) return;
    setPending(previous => [...previous, roundId]);
    setErrors(previous => ({ ...previous, [roundId]: '' }));
    try {
      const response = await fetch('/api/masters/watches', {
        method: input ? 'PUT' : 'DELETE',
        headers: { 'Content-Type': 'application/json', 'X-Masters-User': activeUserId },
        body: JSON.stringify(input ?? { roundId }),
      });
      if (!response.ok) throw new Error('Watch save failed');
      const data: unknown = await response.json();
      assertMastersOwner(data, activeUserId);
      if (input) {
        const watch = parseMastersWatch(data, activeUserId);
        if (watch.roundId !== roundId) throw new Error('Round changed');
        setWatches(previous => [...previous.filter(item => item.roundId !== roundId), watch]);
        const published = rounds.find(round => round.id === roundId);
        if (published) setOwnRounds(previous => [...previous.filter(round => round.id !== roundId), published]);
      } else {
        if (data.success !== true) throw new Error('Watch not removed');
        setWatches(previous => previous.filter(watch => watch.roundId !== roundId));
        setOwnRounds(previous => previous.filter(round => round.id !== roundId));
      }
      // 仅显式保存/取消关注成功后清除此轮草稿，两处表单随后共用新的服务端状态。
      setDrafts(previous => { const next = { ...previous }; delete next[roundId]; return next; });
      window.dispatchEvent(new Event('masters-watches-changed'));
    } catch {
      setErrors(previous => ({ ...previous, [roundId]: copy.saveFailed }));
    } finally { setPending(previous => previous.filter(id => id !== roundId)); }
  };

  const byId = new Map([...ownRounds, ...rounds].map(round => [round.id, round]));
  const myPublicRounds = ownRounds.filter(round => watches.some(watch => watch.roundId === round.id));
  const source = view === 'mine' ? myPublicRounds : rounds;
  const filtered = filterMastersRounds(source, filters, now);
  const detailRound = detailSelection ? filtered.find(round => round.id === detailSelection.roundId) : undefined;
  // 筛选移除、取消关注或记录下架后，不能在之后恢复筛选时意外重开旧详情。
  if (detailSelection && !detailRound) setDetailSelection(null);
  const organized = organizeMastersRounds(filtered, now);
  const yearRounds = source.filter(round => round.intakeYear === year);
  const publicYearRounds = rounds.filter(round => round.intakeYear === year);
  const coveredSchools = new Set(publicYearRounds.map(round => `${round.region}:${round.details.university.trim().toLowerCase()}`));
  const coveredProgrammes = new Set(publicYearRounds.map(round => `${round.region}:${round.details.university.trim().toLowerCase()}:${round.details.programme.trim().toLowerCase()}`));
  const coveredRegions = mastersRegions.filter(region => publicYearRounds.some(round => round.region === region.id));
  const options = (field: 'university' | 'subject' | 'intakeLabel') => [...new Set(yearRounds.map(round => round.details[field]))].sort();
  const unknown = unavailableWatches(watches, ownRounds);
  const exportIds = selected.filter(id => {
    const round = byId.get(id);
    return round && canExportMastersRound(round, now);
  });
  const toggleSelected = (id: string) => setSelected(previous => previous.includes(id) ? previous.filter(value => value !== id) : previous.length < 50 ? [...previous, id] : previous);

  const openRound = (roundId: string, trigger?: HTMLElement) => {
    if (filtered.some(round => round.id === roundId)) setDetailSelection({ roundId, trigger });
  };
  const buttonClass = 'inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white disabled:opacity-40';
  const selectClass = 'mt-2 min-h-11 w-full rounded-xl border border-white/15 bg-zinc-950 px-3 text-sm text-white';
  const renderRound = (round: MastersRound, idPrefix = 'round') => {
    const watch = watches.find(item => item.roundId === round.id);
    const draft = drafts[round.id] ?? { status: watch?.status ?? 'preparing', reminders: watch?.reminders ?? false };
    return <RoundCard key={`${idPrefix}:${round.id}`} idPrefix={idPrefix} round={round} watch={watch} now={now} locale={locale} copy={copy} signedIn={!!activeUserId} watchesReady={watchStatus === 'ready'} busy={pending.includes(round.id)} error={errors[round.id]} selected={exportIds.includes(round.id)} selectionFull={selected.length >= 50} draft={draft} onDraftChange={value => setDrafts(previous => ({ ...previous, [round.id]: value }))} onSelect={toggleSelected} onSave={input => { void updateWatch(round.id, input); }} onRemove={id => { void updateWatch(id); }} />;
  };
  const renderGroups = (groups: typeof organized.active) => groups.map(group => <section key={group.key} className="space-y-4">
    {group.rounds.length > 1 && <h2 className="px-1 t-title-4 text-violet-200">{group.rounds[0].details.university} · {group.rounds[0].details.programme} <span className="t-footnote text-white/60">({group.rounds.length} {copy.rounds})</span></h2>}
    {renderRound(group.rounds[0])}
    {group.rounds.length > 1 && <details open={view === 'mine'} className="rounded-xl border border-white/10 p-4">
      <summary className="min-h-10 cursor-pointer py-2 t-footnote text-white/70">{copy.otherRounds.replace('{count}', String(group.rounds.length - 1))}</summary>
      <div className="mt-4 space-y-4">{group.rounds.slice(1).map(round => renderRound(round))}</div>
    </details>}
  </section>);

  return (
    <div className="mx-auto max-w-5xl">
      <header className="border-b border-white/10 pb-5">
        <Link href="/daily" className="inline-flex min-h-10 items-center t-footnote text-violet-200">← {locale === 'zh' ? '每日一新' : 'Daily Fresh'}</Link>
        <p className="mt-2 t-eyebrow text-violet-300">MASTERS · ADMISSIONS</p>
        <h1 className="mt-3 t-title-1 text-white">{copy.title}</h1>
        <p className="mt-2 t-footnote text-white/70">{copy.description}</p>
        <SourceLanguageNote locale={locale} />
        <form className="mt-4 flex flex-wrap items-end gap-3" onSubmit={event => { event.preventDefault(); const value = Number(yearInput); if (Number.isInteger(value) && value >= 2020 && value <= 2100) router.push(`/masters?year=${value}`); }}>
          <label className="t-footnote text-white/70" htmlFor="masters-year">{copy.year}<input id="masters-year" type="number" min={2020} max={2100} required value={yearInput} onChange={event => setYearInput(event.target.value)} className={`${selectClass} max-w-36`} /></label>
          <button type="submit" className={buttonClass}>{copy.applyYear}</button>
        </form>
        {!loadFailed && <aside data-masters-coverage className="mt-4 space-y-1 rounded-xl border border-white/10 px-4 py-3 t-footnote text-white/70">
          <p>{copy.coverage.replace('{schools}', String(coveredSchools.size)).replace('{programmes}', String(coveredProgrammes.size)).replace('{rounds}', String(publicYearRounds.length))}</p>
          <p>{copy.coveredRegions}: {coveredRegions.length ? coveredRegions.map(region => region[locale]).join(locale === 'zh' ? '、' : ', ') : copy.noCoverage}</p>
          <p className="text-white/60">{copy.coverageHint}</p>
        </aside>}
        <details className="mt-3 t-footnote text-white/60"><summary className="min-h-10 cursor-pointer py-2">{copy.aboutDates}</summary><p>{copy.yearHint}</p><p className="mt-2 max-w-3xl">{copy.scope}</p></details>
      </header>

      <div className="mt-6">
        <div>
          <p className="mb-2 t-footnote text-white/70">{locale === 'zh' ? '项目范围' : 'Programme scope'}</p>
          <div className="inline-flex gap-3" role="group" aria-label={locale === 'zh' ? '项目范围' : 'Programme scope'}>
            {(['all', 'mine'] as const).map(value => <button key={value} type="button" onClick={() => setView(value)} aria-pressed={view === value} className={`min-h-11 border-b-2 px-2 py-2 text-sm font-medium ${view === value ? 'border-violet-300 text-violet-100' : 'border-transparent text-white/60'}`}>{copy[value]}</button>)}
          </div>
        </div>
      </div>
      <div className="my-4 grid gap-4 sm:grid-cols-2">
        <label className="t-footnote text-white/70">{copy.region}<select className={selectClass} value={filters.region} onChange={event => setFilters(previous => ({ ...previous, region: event.target.value }))}><option value="">{copy.allOption}</option>{mastersRegions.map(region => <option key={region.id} value={region.id}>{region[locale]}</option>)}</select></label>
        <label className="t-footnote text-white/70">{copy.deadlineWindow}<select className={selectClass} value={filters.deadlineWindow ?? ''} onChange={event => setFilters(previous => ({ ...previous, deadlineWindow: event.target.value ? Number(event.target.value) as 30 | 60 | 90 : undefined }))}><option value="">{copy.allDates}</option>{([30, 60, 90] as const).map(days => <option key={days} value={days}>{copy.nextDays.replace('{days}', String(days))}</option>)}</select></label>
      </div>
      <details className="mb-5 rounded-xl border border-white/10 px-4"><summary className="min-h-11 cursor-pointer py-3 t-footnote text-white/70">{copy.moreFilters}{[filters.school, filters.subject, filters.intake, filters.studyType].some(Boolean) ? ` · ${copy.filtersActive}` : ''}</summary><div className="grid gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-3">
        {([['school', 'university'], ['subject', 'subject'], ['intake', 'intakeLabel']] as const).map(([field, detail]) => <label key={field} className="t-footnote text-white/70">{copy[field]}<select className={selectClass} value={filters[field]} onChange={event => setFilters(previous => ({ ...previous, [field]: event.target.value }))}><option value="">{copy.allOption}</option>{options(detail).map(value => <option key={value} value={value}>{value}</option>)}</select></label>)}
        <label className="t-footnote text-white/70">{copy.studyType}<select className={selectClass} value={filters.studyType} onChange={event => setFilters(previous => ({ ...previous, studyType: event.target.value }))}><option value="">{copy.allOption}</option><option value="taught">{copy.taught}</option><option value="research">{copy.research}</option></select></label>
        <button type="button" className={`${buttonClass} self-end`} onClick={() => setFilters({ year, region: '', school: '', subject: '', studyType: '', intake: '' })}>{copy.resetFilters}</button>
      </div></details>

      {!activeUserId && <p className="mb-4 t-footnote text-white/60"><Link href={buildLoginHref('/masters')} className="inline-flex min-h-10 items-center text-violet-200 underline underline-offset-4">{copy.login}</Link></p>}
      {activeUserId && watchStatus !== 'ready' && <div role="status" className="mb-6 rounded-xl border border-amber-300/20 p-5"><p className="t-footnote text-amber-200">{watchStatus === 'loading' ? copy.loading : copy.watchesFailed}</p>{watchStatus === 'failed' && <button type="button" onClick={reloadWatches} className={`${buttonClass} mt-3`}>{copy.retry}</button>}</div>}
      {view === 'all' && loadFailed ? <div role="alert" className="rounded-xl border border-amber-300/20 p-7"><h2 className="t-title-3 text-white">{copy.contentFailed}</h2><button type="button" onClick={() => router.refresh()} className={`${buttonClass} mt-4`}>{copy.retry}</button></div>
        : view === 'mine' && (!activeUserId || watchStatus !== 'ready') ? null
          : <>
            <div className="mb-4 flex justify-end">
              <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1" role="group" aria-label={copy.viewGroup}>
                {(['calendar', 'timeline'] as const).map(value => <button key={value} type="button" onClick={() => setCalendarMode(value)} aria-pressed={calendarMode === value} data-masters-detail-fallback={calendarMode === value ? 'true' : undefined} className={`min-h-11 rounded-lg px-4 py-2 text-sm font-medium ${calendarMode === value ? 'bg-white/10 text-white' : 'text-white/60'}`}>{value === 'calendar' ? copy.viewCalendar : copy.viewTimeline}</button>)}
              </div>
            </div>
            {calendarMode === 'calendar'
              ? <MastersCalendar year={year} rounds={filtered} now={now} locale={locale} copy={copy} onSelectRound={openRound} />
              : <MastersTimeline rounds={filtered} now={now} locale={locale} copy={copy} onSelectRound={openRound} />}

            <section id="masters-round-list" aria-labelledby="masters-round-list-title" className="mt-10 border-t border-white/15 pt-7 sm:mt-12">
              <h2 id="masters-round-list-title" className="t-title-3 text-white">{copy.listTitle}</h2>
              <div className="mb-5 mt-4 border-y border-white/10 py-3">
                <div className="flex flex-wrap items-center gap-3">
                  {exportIds.length > 0 ? <a href={`/api/masters/calendar?ids=${encodeURIComponent(exportIds.join(','))}`} download className={buttonClass}>{copy.export} ({exportIds.length})</a> : <button type="button" disabled className={buttonClass}>{copy.export}</button>}
                  <span className="t-footnote text-white/60">{copy.selected} {exportIds.length}/50</span>
                  {selected.length > 0 && <button type="button" onClick={() => setSelected([])} className="min-h-11 px-2 t-footnote text-white/70 underline underline-offset-4">{copy.clearSelection}</button>}
                </div>
                <details className="mt-2 t-footnote text-white/60"><summary className="min-h-10 cursor-pointer py-2">{copy.exportEligible}</summary><p>{copy.maxSelection} · {copy.exportHint}</p></details>
              </div>
              {filtered.length === 0 ? <div className="rounded-xl border border-white/10 px-6 py-10 text-center"><h3 className="t-title-3 text-white">{view === 'mine' && watches.length === 0 ? copy.noWatches : copy.noResults}</h3><p className="mt-3 t-footnote text-white/60">{view === 'mine' && watches.length === 0 ? copy.noWatchesHint : copy.noResultsHint}</p></div>
                : <div className="space-y-6">
                  <p className="t-footnote text-white/60">{copy.deadlineOrder} · {organized.activeCount} {copy.rounds}</p>
                  {renderGroups(organized.active)}
                  {organized.closedCount > 0 && <details className="rounded-2xl border border-white/10 p-4 sm:p-5"><summary className="min-h-11 cursor-pointer py-2 t-title-4 text-white/70">{copy.closedRounds} ({organized.closedCount})</summary><div className="mt-4 space-y-6">{renderGroups(organized.closed)}</div></details>}
                </div>}
            </section>
          </>}

      {view === 'mine' && activeUserId && watchStatus === 'ready' && unknown.length > 0 && <section className="mt-8 rounded-2xl border border-white/10 p-5 sm:p-7">
        <h2 className="t-title-3 text-white">{copy.unavailable}</h2><p className="mt-2 t-footnote text-white/60">{copy.unavailableHint}</p>
        <ul className="mt-4 divide-y divide-white/10">{unknown.map((watch, index) => <li key={watch.roundId} className="flex flex-wrap items-center justify-between gap-3 py-3"><span className="text-sm text-white/70">{copy.unavailable} {index + 1} · {copy[watch.status]}</span><button type="button" disabled={pending.includes(watch.roundId)} onClick={() => { void updateWatch(watch.roundId); }} className={buttonClass}>{copy.remove}</button>{errors[watch.roundId] && <p role="alert" className="w-full t-footnote text-amber-200">{errors[watch.roundId]}</p>}</li>)}</ul>
      </section>}
      <MastersRoundDrawer open={!!detailRound} title={copy.drawerTitle} closeLabel={copy.drawerClose} trigger={detailSelection?.trigger} onClose={() => setDetailSelection(null)}>
        {detailRound && renderRound(detailRound, 'drawer-round')}
      </MastersRoundDrawer>
    </div>
  );
}

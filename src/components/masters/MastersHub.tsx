'use client';

import SourceLanguageNote from '@/components/SourceLanguageNote';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useAuth } from '@/components/AuthProvider';
import { buildLoginHref } from '@/lib/login-return';
import { mastersRegions, type MastersRound, type MastersWatch, type MastersWatchInput } from '@/lib/masters/types';
import RoundCard from './RoundCard';
import MastersCalendar from './MastersCalendar';
import MastersTimeline from './MastersTimeline';
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
  /** 初始视图。默认日历，列表留给需要逐条精读时切换。 */
  initialMode?: 'list' | 'calendar' | 'timeline';
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

function MastersHubForIdentity({ year, nowIso, rounds, userId, activeUserId, initialWatches, watchedRounds, loadFailed = false, watchesFailed = false, initialMode = 'calendar' }: MastersHubProps & { activeUserId: string | null }) {
  const locale = useLocale() === 'en' ? 'en' : 'zh';
  const copy = mastersText[locale];
  const router = useRouter();
  const sameIdentity = activeUserId !== null && activeUserId === userId;
  const needsFetch = activeUserId !== null && !sameIdentity;
  const [watches, setWatches] = useState(sameIdentity ? initialWatches : []);
  const [ownRounds, setOwnRounds] = useState(sameIdentity ? watchedRounds : []);
  const [watchStatus, setWatchStatus] = useState<'ready' | 'loading' | 'failed'>(needsFetch ? 'loading' : sameIdentity && watchesFailed ? 'failed' : 'ready');
  const [view, setView] = useState<'all' | 'mine'>('all');
  // 默认进日历：一眼看清申请节奏与「还在不在申请期内」是这张页面的主要用途，
  // 列表留给需要逐条精读和关注轮次时切换。
  const [mode, setMode] = useState<'list' | 'calendar' | 'timeline'>(initialMode);
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
      window.dispatchEvent(new Event('masters-watches-changed'));
    } catch {
      setErrors(previous => ({ ...previous, [roundId]: copy.saveFailed }));
    } finally { setPending(previous => previous.filter(id => id !== roundId)); }
  };

  const byId = new Map([...ownRounds, ...rounds].map(round => [round.id, round]));
  const myPublicRounds = ownRounds.filter(round => watches.some(watch => watch.roundId === round.id));
  const source = view === 'mine' ? myPublicRounds : rounds;
  const filtered = filterMastersRounds(source, filters, now);
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

  /**
   * 从日历跳回列表：切回列表视图后目标卡片可能还在折叠的同项目轮次里，
   * 所以先展开祖先 details 再滚动定位。跨帧等待是因为切换视图要等一次渲染。
   */
  const locateRound = (roundId: string) => {
    setMode('list');
    const reveal = () => {
      const target = document.getElementById(`round-${roundId}`);
      if (!target) return false;
      for (let parent = target.parentElement; parent; parent = parent.parentElement) {
        if (parent instanceof HTMLDetailsElement) parent.open = true;
      }
      target.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      target.focus({ preventScroll: true });
      return true;
    };
    if (reveal()) return;
    const deadline = Date.now() + 2000;
    // 有界等待一次渲染提交；超时即放弃，避免无限轮询。
    const follow = () => {
      if (reveal() || Date.now() > deadline) return;
      requestAnimationFrame(follow);
    };
    requestAnimationFrame(follow);
  };
  const buttonClass = 'inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white disabled:opacity-40';
  const selectClass = 'mt-2 min-h-11 w-full rounded-xl border border-white/15 bg-zinc-950 px-3 text-sm text-white';
  const renderRound = (round: MastersRound) => {
    const watch = watches.find(item => item.roundId === round.id);
    return <RoundCard key={`${round.id}:${watch?.updatedAt ?? 'none'}`} round={round} watch={watch} now={now} locale={locale} copy={copy} signedIn={!!activeUserId} watchesReady={watchStatus === 'ready'} busy={pending.includes(round.id)} error={errors[round.id]} selected={exportIds.includes(round.id)} selectionFull={selected.length >= 50} onSelect={toggleSelected} onSave={input => { void updateWatch(round.id, input); }} onRemove={id => { void updateWatch(id); }} />;
  };
  const renderGroups = (groups: typeof organized.active) => groups.map(group => <section key={group.key} className="space-y-4">
    {group.rounds.length > 1 && <h2 className="px-1 t-title-4 text-violet-200">{group.rounds[0].details.university} · {group.rounds[0].details.programme} <span className="t-footnote text-white/60">({group.rounds.length} {copy.rounds})</span></h2>}
    {renderRound(group.rounds[0])}
    {group.rounds.length > 1 && <details open={view === 'mine'} className="rounded-xl border border-white/10 p-4">
      <summary className="min-h-10 cursor-pointer py-2 t-footnote text-white/70">{copy.otherRounds.replace('{count}', String(group.rounds.length - 1))}</summary>
      <div className="mt-4 space-y-4">{group.rounds.slice(1).map(renderRound)}</div>
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

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1" role="group" aria-label={copy.viewGroup}>
          {(['list', 'calendar', 'timeline'] as const).map(value => <button key={value} type="button" onClick={() => setMode(value)} aria-pressed={mode === value} className={`min-h-10 rounded-lg px-4 py-2 text-sm font-medium ${mode === value ? 'bg-white/10 text-white' : 'text-white/60'}`}>{value === 'list' ? copy.viewList : value === 'calendar' ? copy.viewCalendar : copy.viewTimeline}</button>)}
        </div>
        <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1" role="group" aria-label={locale === 'zh' ? '申请列表' : 'Application list'}>
          {(['all', 'mine'] as const).map(value => <button key={value} type="button" onClick={() => setView(value)} aria-pressed={view === value} className={`min-h-10 rounded-lg px-4 py-2 text-sm font-medium ${view === value ? 'bg-white/10 text-white' : 'text-white/60'}`}>{copy[value]}</button>)}
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
      {mode === 'list' && <div className="mb-5 border-y border-white/10 py-3">
        <div className="flex flex-wrap items-center gap-3">
          {exportIds.length > 0 ? <a href={`/api/masters/calendar?ids=${encodeURIComponent(exportIds.join(','))}`} download className={buttonClass}>{copy.export} ({exportIds.length})</a> : <button type="button" disabled className={buttonClass}>{copy.export}</button>}
          <span className="t-footnote text-white/60">{copy.selected} {exportIds.length}/50</span>
          {selected.length > 0 && <button type="button" onClick={() => setSelected([])} className="min-h-11 px-2 t-footnote text-white/70 underline underline-offset-4">{copy.clearSelection}</button>}
        </div>
        <details className="mt-2 t-footnote text-white/60"><summary className="min-h-10 cursor-pointer py-2">{copy.exportEligible}</summary><p>{copy.maxSelection} · {copy.exportHint}</p></details>
      </div>}

      {view === 'all' && loadFailed ? <div role="alert" className="rounded-xl border border-amber-300/20 p-7"><h2 className="t-title-3 text-white">{copy.contentFailed}</h2><button type="button" onClick={() => router.refresh()} className={`${buttonClass} mt-4`}>{copy.retry}</button></div>
        : view === 'mine' && (!activeUserId || watchStatus !== 'ready') ? null
          : mode === 'calendar' ? <MastersCalendar year={year} rounds={filtered} now={now} locale={locale} copy={copy} onLocate={locateRound} />
          : mode === 'timeline' ? <MastersTimeline rounds={filtered} now={now} locale={locale} copy={copy} onLocate={locateRound} />
          : filtered.length === 0 ? <div className="rounded-xl border border-white/10 px-6 py-10 text-center"><h2 className="t-title-3 text-white">{view === 'mine' && watches.length === 0 ? copy.noWatches : copy.noResults}</h2><p className="mt-3 t-footnote text-white/60">{view === 'mine' && watches.length === 0 ? copy.noWatchesHint : copy.noResultsHint}</p></div>
            : <div className="space-y-6">
              <p className="t-footnote text-white/60">{copy.deadlineOrder} · {organized.activeCount} {copy.rounds}</p>
              {renderGroups(organized.active)}
              {organized.closedCount > 0 && <details className="rounded-2xl border border-white/10 p-4 sm:p-5"><summary className="min-h-11 cursor-pointer py-2 t-title-4 text-white/70">{copy.closedRounds} ({organized.closedCount})</summary><div className="mt-4 space-y-6">{renderGroups(organized.closed)}</div></details>}
            </div>}

      {view === 'mine' && activeUserId && watchStatus === 'ready' && unknown.length > 0 && <section className="mt-8 rounded-2xl border border-white/10 p-5 sm:p-7">
        <h2 className="t-title-3 text-white">{copy.unavailable}</h2><p className="mt-2 t-footnote text-white/60">{copy.unavailableHint}</p>
        <ul className="mt-4 divide-y divide-white/10">{unknown.map((watch, index) => <li key={watch.roundId} className="flex flex-wrap items-center justify-between gap-3 py-3"><span className="text-sm text-white/70">{copy.unavailable} {index + 1} · {copy[watch.status]}</span><button type="button" disabled={pending.includes(watch.roundId)} onClick={() => { void updateWatch(watch.roundId); }} className={buttonClass}>{copy.remove}</button>{errors[watch.roundId] && <p role="alert" className="w-full t-footnote text-amber-200">{errors[watch.roundId]}</p>}</li>)}</ul>
      </section>}
    </div>
  );
}

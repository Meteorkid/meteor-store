'use client';

import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Link, useRouter } from '@/i18n/navigation';
import { buildLoginHref } from '@/lib/login-return';
import type { VocabularyEntry, VocabularyList } from '@/lib/study/vocabulary-types';
import VocabularyReviewQueue from './VocabularyReviewQueue';
import { vocabularyButtonClass, vocabularyFailure, vocabularyText, type VocabularyFailure } from './vocabulary-text';

interface Props {
  initialData: VocabularyList | null;
  ownerId: string;
  locale: 'zh' | 'en';
}
type Filters = { query: string; dueOnly: boolean };
type ListState = { data: VocabularyList; filters: Filters };

export default function VocabularyManager(props: Props) {
  const { user, loading } = useAuth();
  const copy = vocabularyText[props.locale];
  if (loading) return <p role="status" className="text-white/70">{copy.loading}</p>;
  if (!user?.id) return <Link href={buildLoginHref('/study/vocabulary')} className={vocabularyButtonClass}>{copy.login}</Link>;
  if (user.id !== props.ownerId) return <p role="alert" className="text-amber-200">{copy.changed} <button type="button" className={vocabularyButtonClass} onClick={() => window.location.reload()}>{copy.refresh}</button></p>;
  return <ManagerForOwner key={props.ownerId} {...props} />;
}

function ManagerForOwner({ initialData, ownerId, locale }: Props) {
  const copy = vocabularyText[locale];
  const router = useRouter();
  const searchId = useId();
  const [draftQuery, setDraftQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({ query: '', dueOnly: false });
  const [list, setList] = useState<ListState | null>(initialData ? { data: initialData, filters } : null);
  const [counts, setCounts] = useState(initialData ? { total: initialData.total, dueCount: initialData.dueCount } : null);
  const [loading, setLoading] = useState(false);
  const [loadFailure, setLoadFailure] = useState<VocabularyFailure | null>(initialData ? null : 'failed');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteFailure, setDeleteFailure] = useState<VocabularyFailure | null>(null);
  const [notice, setNotice] = useState('');
  const active = useRef(false);
  const requestVersion = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);
  const mutationBusy = useRef(false);
  const lastLoad = useRef<{ filters: Filters; cursor: string | null }>({ filters, cursor: null });
  const matchesFilters = list?.filters.query === filters.query && list?.filters.dueOnly === filters.dueOnly;
  const visible = matchesFilters ? list!.data : null;

  useEffect(() => {
    active.current = true;
    return () => { active.current = false; controllerRef.current?.abort(); };
  }, []);

  const load = useCallback(async (next: Filters, cursor: string | null = null) => {
    const version = ++requestVersion.current;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    lastLoad.current = { filters: next, cursor };
    setLoading(true);
    setLoadFailure(null);
    const params = new URLSearchParams({ limit: '50' });
    if (next.query) params.set('query', next.query);
    if (next.dueOnly) params.set('dueOnly', '1');
    if (cursor) params.set('cursor', cursor);
    const current = () => active.current && version === requestVersion.current && !controller.signal.aborted;
    try {
      const options = { cache: 'no-store' as const, headers: { 'X-Study-User': ownerId }, signal: controller.signal };
      const response = await fetch(`/api/study/vocabulary?${params}`, options);
      if (!current()) return;
      if (!response.ok) { setLoadFailure(vocabularyFailure(response.status)); return; }
      const data = await response.json() as VocabularyList & { userId: string };
      if (!current()) return;
      if (data.userId !== ownerId) { setLoadFailure('changed'); return; }
      if (!Array.isArray(data.entries) || typeof data.total !== 'number' || typeof data.dueCount !== 'number') throw new Error('Invalid vocabulary response');
      // 筛选结果的 total 是命中数；顶部继续显示整个账号的收藏数。
      let total = data.total;
      if ((next.query || next.dueOnly) && !cursor) {
        const summaryResponse = await fetch('/api/study/vocabulary?limit=1', options);
        if (!current()) return;
        if (!summaryResponse.ok) { setLoadFailure(vocabularyFailure(summaryResponse.status)); return; }
        const summary = await summaryResponse.json();
        if (!current()) return;
        if (summary.userId !== ownerId) { setLoadFailure('changed'); return; }
        if (typeof summary.total !== 'number') throw new Error('Invalid vocabulary count');
        total = summary.total;
      }
      if (!current()) return;
      setList(previous => {
        if (!cursor || !previous || previous.filters.query !== next.query || previous.filters.dueOnly !== next.dueOnly) return { data, filters: next };
        const existingIds = new Set(previous.data.entries.map(entry => entry.id));
        return { data: { ...data, entries: [...previous.data.entries, ...data.entries.filter(entry => !existingIds.has(entry.id))] }, filters: next };
      });
      setCounts(previous => ({ total: cursor && (next.query || next.dueOnly) ? previous?.total ?? total : total, dueCount: data.dueCount }));
    } catch {
      if (current()) setLoadFailure('failed');
    } finally {
      if (current()) setLoading(false);
    }
  }, [ownerId]);

  useEffect(() => {
    const onChanged = () => { void load(filters); };
    window.addEventListener('study:vocabulary-changed', onChanged);
    return () => window.removeEventListener('study:vocabulary-changed', onChanged);
  }, [filters, load]);

  function changeFilters(next: Filters) {
    setFilters(next);
    setDeleteId(null);
    setDeleteFailure(null);
    setNotice('');
    void load(next);
  }

  function search(event: FormEvent) {
    event.preventDefault();
    changeFilters({ ...filters, query: draftQuery.trim() });
  }

  async function remove(entry: VocabularyEntry) {
    if (mutationBusy.current || deleteFailure === 'login' || deleteFailure === 'changed') return;
    mutationBusy.current = true;
    setDeleting(true);
    setDeleteFailure(null);
    try {
      const response = await fetch('/api/study/vocabulary', {
        method: 'DELETE', cache: 'no-store',
        headers: { 'Content-Type': 'application/json', 'X-Study-User': ownerId },
        body: JSON.stringify({ id: entry.id }),
      });
      if (!active.current) return;
      if (!response.ok) { setDeleteFailure(vocabularyFailure(response.status)); return; }
      const data = await response.json();
      if (!active.current) return;
      if (data.userId !== ownerId) { setDeleteFailure('changed'); return; }
      if (data.success !== true) { setDeleteFailure('changed'); return; }
      setList(previous => previous ? { ...previous, data: { ...previous.data, entries: previous.data.entries.filter(item => item.id !== entry.id), total: Math.max(0, previous.data.total - 1) } } : previous);
      setCounts(previous => previous ? { ...previous, total: Math.max(0, previous.total - 1) } : previous);
      setDeleteId(null);
      setNotice(copy.deleted);
      window.dispatchEvent(new Event('study:vocabulary-changed'));
      router.refresh();
    } catch {
      if (active.current) setDeleteFailure('failed');
    } finally {
      mutationBusy.current = false;
      if (active.current) setDeleting(false);
    }
  }

  const locked = loadFailure === 'login' || loadFailure === 'changed';
  return <div className="min-w-0 space-y-8">
    {counts && <dl className="grid grid-cols-2 gap-3 sm:gap-5">
      <div className="rounded-2xl border border-white/10 p-4 sm:p-6"><dt className="text-sm text-white/70">{copy.total}</dt><dd className="mt-2 t-title-2 tabular-nums text-white">{counts.total}</dd></div>
      <div className="rounded-2xl border border-violet-400/20 p-4 sm:p-6"><dt className="text-sm text-white/70">{copy.due}</dt><dd className="mt-2 t-title-2 tabular-nums text-violet-200">{counts.dueCount}</dd></div>
    </dl>}
    <form onSubmit={search} className="space-y-2">
      <label htmlFor={searchId} className="text-sm font-semibold text-white/80">{copy.search}</label>
      <div className="flex gap-2"><input id={searchId} value={draftQuery} onChange={event => setDraftQuery(event.target.value)} placeholder={copy.searchHint} maxLength={120} type="search" disabled={deleting || locked} className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/20 bg-white/[0.04] px-3 text-base text-white outline-none focus:border-violet-300" /><button type="submit" disabled={deleting || locked} className={vocabularyButtonClass}>{copy.searchAction}</button></div>
    </form>
    <div className="flex flex-wrap gap-3" aria-label={copy.list}>
      <button type="button" aria-pressed={!filters.dueOnly} onClick={() => changeFilters({ ...filters, dueOnly: false })} disabled={deleting || locked} className={`${vocabularyButtonClass} ${!filters.dueOnly ? 'border-violet-400/50 bg-violet-400/15' : ''}`}>{copy.all}</button>
      <button type="button" aria-pressed={filters.dueOnly} onClick={() => changeFilters({ ...filters, dueOnly: true })} disabled={deleting || locked} className={`${vocabularyButtonClass} ${filters.dueOnly ? 'border-violet-400/50 bg-violet-400/15' : ''}`}>{copy.dueOnly}</button>
    </div>
    {loadFailure && <div role="alert" className="rounded-xl border border-amber-300/25 p-4 text-sm leading-6 text-amber-200">
      {loadFailure === 'login' ? <Link href={buildLoginHref('/study/vocabulary')} className={vocabularyButtonClass}>{copy.login}</Link>
        : loadFailure === 'changed' ? <>{copy.changed} <button type="button" className={vocabularyButtonClass} onClick={() => window.location.reload()}>{copy.refresh}</button></>
          : <>{copy.loadFailed} <button type="button" className={vocabularyButtonClass} onClick={() => void load(lastLoad.current.filters, lastLoad.current.cursor)} disabled={loading}>{copy.retry}</button></>}
    </div>}
    {loading && <p role="status" className="text-sm text-white/70">{copy.loading}</p>}
    {notice && <p role="status" className="text-sm text-emerald-200">{notice}</p>}
    {!locked && visible && <>
      {filters.dueOnly && <section aria-label={copy.reviewTitle} className="space-y-4"><h2 className="t-title-3 text-white">{copy.reviewTitle}</h2><VocabularyReviewQueue initialEntries={visible.entries} ownerId={ownerId} locale={locale} /></section>}
      {!filters.dueOnly && (visible.entries.length === 0 ? <div className="rounded-2xl border border-white/10 p-6 text-center">
        <p className="t-body text-white/70">{filters.query ? copy.noMatches : copy.empty}</p>
        <Link href="/study/ielts" className={`mt-4 ${vocabularyButtonClass}`}>{copy.read}</Link>
      </div> : <section aria-label={copy.list} aria-busy={loading}>
        <h2 className="mb-4 t-title-3 text-white">{copy.list} <span className="text-sm font-normal text-white/60">({visible.total})</span></h2>
        <ul className="grid min-w-0 gap-4">
          {visible.entries.map(entry => <li key={entry.id} className="min-w-0 rounded-2xl border border-white/10 p-4 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h3 className="break-words t-title-2 text-white" lang="en">{entry.snapshot.word}</h3><p className="mt-1 break-words text-sm text-white/60" lang="en">{entry.snapshot.lemma} · {entry.snapshot.partOfSpeech}</p></div><button type="button" className={vocabularyButtonClass} disabled={deleting || loading} onClick={() => { setDeleteId(entry.id); setDeleteFailure(null); setNotice(''); }}>{copy.delete}</button></div>
            <p className="mt-4 break-words t-body text-white" lang="zh">{entry.snapshot.meaningZh}</p>
            {entry.snapshot.usageZh && <p className="mt-2 break-words text-base leading-7 text-white/80" lang="zh">{entry.snapshot.usageZh}</p>}
            <blockquote className="mt-4 border-l-2 border-violet-300/40 pl-4"><p className="break-words text-base leading-7 text-white/90" lang="en">{entry.snapshot.sentence}</p>{entry.snapshot.sentenceZh && <p className="mt-2 break-words text-sm leading-6 text-white/70" lang="zh">{entry.snapshot.sentenceZh}</p>}</blockquote>
            <p className="mt-4 break-words text-sm leading-6 text-white/60">{copy.source}：{locale === 'en' ? entry.snapshot.titleEn : entry.snapshot.titleZh} · {entry.snapshot.side === 'high' ? copy.high : copy.basic} · {copy[entry.snapshot.source]}</p>
            <p className="mt-2 text-sm leading-6 text-white/70">{copy.nextReview}：<time dateTime={entry.reviewDueOn}>{entry.reviewDueOn}</time> · {copy.stage} {entry.reviewStage + 1}/6</p>
            {deleteId === entry.id && <div role="group" aria-label={copy.deleteConfirm} className="mt-4 rounded-xl border border-rose-300/25 p-4">
              <p className="text-sm leading-6 text-white/80">{copy.deleteConfirm}</p>
              <div className="mt-3 flex flex-wrap gap-3"><button type="button" disabled={deleting || deleteFailure === 'login' || deleteFailure === 'changed'} className={`${vocabularyButtonClass} border-rose-300/40 text-rose-200`} onClick={() => void remove(entry)}>{deleting ? copy.deleting : copy.deleteAction}</button><button type="button" disabled={deleting} className={vocabularyButtonClass} onClick={() => { setDeleteId(null); setDeleteFailure(null); }}>{copy.cancel}</button></div>
              {deleteFailure && <div role="alert" className="mt-3 text-sm text-amber-200">{deleteFailure === 'login' ? <Link href={buildLoginHref('/study/vocabulary')} className={vocabularyButtonClass}>{copy.login}</Link> : deleteFailure === 'changed' ? <>{copy.changed} <button type="button" onClick={() => window.location.reload()} className={vocabularyButtonClass}>{copy.refresh}</button></> : copy.failed}</div>}
            </div>}
          </li>)}
        </ul>
      </section>)}
      {visible.nextCursor && <button type="button" disabled={loading || deleting} onClick={() => void load(filters, visible.nextCursor)} className={vocabularyButtonClass}>{loading ? copy.loadingMore : copy.more}</button>}
    </>}
  </div>;
}

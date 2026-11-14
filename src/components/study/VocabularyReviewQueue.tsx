'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Link, useRouter } from '@/i18n/navigation';
import { buildLoginHref } from '@/lib/login-return';
import type { VocabularyEntry } from '@/lib/study/vocabulary-types';
import { vocabularyButtonClass, vocabularyFailure, vocabularyText, type VocabularyFailure } from './vocabulary-text';

interface Props {
  initialEntries: VocabularyEntry[];
  ownerId: string;
  locale: 'zh' | 'en';
  onReviewed?: (entry: VocabularyEntry) => void;
}

export default function VocabularyReviewQueue(props: Props) {
  const { user, loading } = useAuth();
  const copy = vocabularyText[props.locale];
  if (loading) return <p role="status" className="text-sm text-white/70">{copy.loading}</p>;
  if (!user?.id) return <Link href={buildLoginHref('/study/vocabulary')} className={vocabularyButtonClass}>{copy.login}</Link>;
  if (user.id !== props.ownerId) return <p role="alert" className="text-sm text-amber-200">{copy.changed} <button type="button" className={vocabularyButtonClass} onClick={() => window.location.reload()}>{copy.refresh}</button></p>;
  return <ReviewForOwner key={props.ownerId} {...props} />;
}

function ReviewForOwner({ initialEntries, ownerId, locale, onReviewed }: Props) {
  const copy = vocabularyText[locale];
  const router = useRouter();
  const [entries, setEntries] = useState(initialEntries);
  const [sourceEntries, setSourceEntries] = useState(initialEntries);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<VocabularyFailure | null>(null);
  const [lastResult, setLastResult] = useState<'remembered' | 'forgot'>('remembered');
  const active = useRef(false);
  const busy = useRef(false);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  // 刷新带回新队列时保留本次完成提示；owner 变化仍由外层重新挂载隔离。
  if (sourceEntries !== initialEntries) {
    setSourceEntries(initialEntries);
    setEntries(initialEntries);
    setRevealed(false);
    setFailure(null);
  }
  const entry = entries[0];

  async function review(result: 'remembered' | 'forgot') {
    if (!entry || !revealed || busy.current || failure === 'login' || failure === 'changed') return;
    busy.current = true;
    setPending(true);
    setFailure(null);
    setLastResult(result);
    try {
      const response = await fetch('/api/study/vocabulary/reviews', {
        method: 'POST', cache: 'no-store',
        headers: { 'Content-Type': 'application/json', 'X-Study-User': ownerId },
        body: JSON.stringify({ id: entry.id, expectedRevision: entry.revision, result }),
      });
      if (!active.current) return;
      if (!response.ok) { setFailure(vocabularyFailure(response.status)); return; }
      const data = await response.json();
      if (!active.current) return;
      if (data.userId !== ownerId) { setFailure('changed'); return; }
      if (data.entry?.id !== entry.id) throw new Error('Invalid review response');
      setEntries(current => current.filter(item => item.id !== entry.id));
      setReviewedCount(count => count + 1);
      setRevealed(false);
      onReviewed?.(data.entry);
      window.dispatchEvent(new Event('study:vocabulary-changed'));
      router.refresh();
    } catch {
      if (active.current) setFailure('failed');
    } finally {
      busy.current = false;
      if (active.current) setPending(false);
    }
  }

  if (!entry) return <div role="status" className="space-y-3">
    <p className="t-title-4 text-white">{reviewedCount ? copy.complete : copy.noDue}</p>
    <p className="text-sm leading-6 text-white/70">{reviewedCount ? copy.completeHint : copy.dueHint}</p>
    <div className="flex flex-wrap gap-3"><Link href="/study/ielts" className={vocabularyButtonClass}>{copy.read}</Link><Link href="/study/vocabulary" className={vocabularyButtonClass}>{copy.open}</Link></div>
  </div>;

  const snapshot = entry.snapshot;
  return <div className="min-w-0 rounded-2xl border border-violet-400/25 bg-violet-400/[0.04] p-4 sm:p-6" aria-busy={pending}>
    <p className="t-footnote text-violet-200">{copy.remaining.replace('{count}', String(entries.length))}</p>
    <h3 className="mt-3 break-words t-title-2 text-white" lang="en">{snapshot.word}</h3>
    <p className="mt-3 break-words t-body text-white/90" lang="en">{snapshot.sentence}</p>
    <p className="mt-3 text-sm leading-6 text-white/60">{copy.reviewHint}</p>
    {revealed ? <div className="mt-5 border-t border-white/10 pt-5">
      <p className="text-sm text-white/60" lang="en">{snapshot.lemma} · {snapshot.partOfSpeech}</p>
      <p className="mt-2 break-words t-body text-white" lang="zh">{snapshot.meaningZh}</p>
      {snapshot.usageZh && <p className="mt-2 break-words text-base leading-7 text-white/80" lang="zh">{snapshot.usageZh}</p>}
      {snapshot.sentenceZh && <p className="mt-3 break-words text-sm leading-6 text-white/70" lang="zh">{snapshot.sentenceZh}</p>}
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" className={`${vocabularyButtonClass} border-emerald-400/30 bg-emerald-400/10 text-emerald-100`} disabled={pending || failure === 'login' || failure === 'changed'} onClick={() => void review('remembered')}>{copy.remembered}</button>
        <button type="button" className={vocabularyButtonClass} disabled={pending || failure === 'login' || failure === 'changed'} onClick={() => void review('forgot')}>{copy.forgot}</button>
      </div>
    </div> : <button type="button" className={`mt-5 ${vocabularyButtonClass}`} onClick={() => setRevealed(true)}>{copy.reveal}</button>}
    {pending && <p role="status" className="mt-3 text-sm text-white/70">{copy.recording}</p>}
    {failure && <div role="alert" className="mt-3 text-sm text-amber-200">
      {failure === 'login' ? <Link href={buildLoginHref('/study/vocabulary')} className={vocabularyButtonClass}>{copy.login}</Link>
        : failure === 'changed' ? <>{copy.changed} <button type="button" className={vocabularyButtonClass} onClick={() => window.location.reload()}>{copy.refresh}</button></>
          : <>{copy.failed} <button type="button" className={vocabularyButtonClass} onClick={() => void review(lastResult)} disabled={pending}>{copy.retry}</button></>}
    </div>}
  </div>;
}

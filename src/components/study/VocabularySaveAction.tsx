'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Link, useRouter } from '@/i18n/navigation';
import { buildLoginHref } from '@/lib/login-return';
import { vocabularyButtonClass, vocabularyFailure, vocabularyText, type VocabularyFailure } from './vocabulary-text';

interface Props {
  saveToken?: string;
  sourceKey?: string;
  returnTo: string;
  locale: 'zh' | 'en';
}

export default function VocabularySaveAction(props: Props) {
  const { user, loading } = useAuth();
  const copy = vocabularyText[props.locale];
  if (loading) return <p role="status" className="mt-4 text-sm text-white/70">{copy.checking}</p>;
  if (!user?.id) return <Link href={buildLoginHref(props.returnTo)} className={`mt-4 ${vocabularyButtonClass}`}>{copy.loginSave}</Link>;
  if (!props.sourceKey) return <p className="mt-4 text-sm text-white/70">{copy.lookupAgain}</p>;
  return <SaveForOwner key={`${user.id}:${props.sourceKey}:${props.saveToken ?? ''}`} {...props} sourceKey={props.sourceKey} ownerId={user.id} />;
}

function SaveForOwner({ saveToken, sourceKey, returnTo, locale, ownerId }: Props & { sourceKey: string; ownerId: string }) {
  const copy = vocabularyText[locale];
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'ready' | 'saved' | 'saving'>('checking');
  const [failure, setFailure] = useState<VocabularyFailure | null>(null);
  const [attempt, setAttempt] = useState(0);
  const active = useRef(false);
  const busy = useRef(false);

  useEffect(() => {
    active.current = true;
    const controller = new AbortController();
    void (async () => {
      try {
        const response = await fetch(`/api/study/vocabulary?sourceKey=${encodeURIComponent(sourceKey)}`, {
          cache: 'no-store', headers: { 'X-Study-User': ownerId }, signal: controller.signal,
        });
        if (!active.current || controller.signal.aborted) return;
        if (!response.ok) { setFailure(vocabularyFailure(response.status)); return; }
        const data = await response.json();
        if (!active.current || controller.signal.aborted) return;
        if (data.userId !== ownerId) { setFailure('changed'); return; }
        if (!('entry' in data)) throw new Error('Invalid vocabulary response');
        setStatus(data.entry ? 'saved' : 'ready');
        setFailure(null);
      } catch {
        if (active.current && !controller.signal.aborted) setFailure('failed');
      }
    })();
    return () => { active.current = false; controller.abort(); };
  }, [sourceKey, ownerId, attempt]);

  async function save() {
    if (busy.current || status === 'checking' || status === 'saved' || failure === 'login' || failure === 'changed' || failure === 'expired') return;
    if (!saveToken) { setFailure('expired'); return; }
    busy.current = true;
    setStatus('saving');
    setFailure(null);
    try {
      const response = await fetch('/api/study/vocabulary', {
        method: 'POST', cache: 'no-store',
        headers: { 'Content-Type': 'application/json', 'X-Study-User': ownerId },
        body: JSON.stringify({ saveToken }),
      });
      if (!active.current) return;
      if (!response.ok) { setFailure(response.status === 400 ? 'expired' : vocabularyFailure(response.status)); setStatus('ready'); return; }
      const data = await response.json();
      if (!active.current) return;
      if (data.userId !== ownerId) { setFailure('changed'); setStatus('ready'); return; }
      if (!data.entry?.id || data.entry.sourceKey !== sourceKey) throw new Error('Invalid vocabulary response');
      setStatus('saved');
      window.dispatchEvent(new Event('study:vocabulary-changed'));
      router.refresh();
    } catch {
      if (active.current) { setFailure('failed'); setStatus('ready'); }
    } finally { busy.current = false; }
  }

  function reload() {
    setFailure(null);
    setStatus('checking');
    setAttempt(value => value + 1);
  }

  return <div className="mt-4 border-t border-white/15 pt-4">
    {status === 'saved' ? <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <p role="status" className="text-sm text-emerald-200">{copy.saved}</p>
      <Link href="/study/vocabulary" className="inline-flex min-h-11 items-center text-sm text-violet-200 underline underline-offset-4">{copy.open}</Link>
    </div> : <>
      {failure === 'login' ? <Link href={buildLoginHref(returnTo)} className={vocabularyButtonClass}>{copy.login}</Link>
        : failure === 'changed' ? <p role="alert" className="text-sm text-amber-200">{copy.changed} <button type="button" className={vocabularyButtonClass} onClick={() => window.location.reload()}>{copy.refresh}</button></p>
          : failure === 'expired' || (!saveToken && status === 'ready') ? <p role="status" className="text-sm text-amber-200">{copy.lookupAgain}</p>
            : <>
              <button type="button" onClick={status === 'checking' && failure ? reload : () => void save()} disabled={status === 'saving' || (status === 'checking' && !failure)} className={vocabularyButtonClass}>
                {status === 'saving' ? copy.saving : status === 'checking' ? failure ? copy.retry : copy.checking : copy.save}
              </button>
              {failure && <p role="alert" className="mt-2 text-sm text-amber-200">{copy.failed}</p>}
            </>}
    </>}
  </div>;
}

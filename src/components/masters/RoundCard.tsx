'use client';

import { useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { buildLoginHref } from '@/lib/login-return';
import { getMastersRoundState } from '@/lib/masters/dates';
import { mastersRegions, type MastersRound, type MastersWatch, type MastersWatchInput } from '@/lib/masters/types';
import { canExportMastersRound, mastersDeadlineLabel, mastersStateLabel } from './state';
import type { MastersCopy } from './text';

export interface MastersRoundDraft {
  status: MastersWatchInput['status'];
  reminders: boolean;
}

interface RoundCardProps {
  round: MastersRound;
  idPrefix?: string;
  draft?: MastersRoundDraft;
  onDraftChange?: (draft: MastersRoundDraft) => void;
  watch?: MastersWatch;
  now: Date;
  locale: 'zh' | 'en';
  copy: MastersCopy;
  signedIn: boolean;
  watchesReady: boolean;
  busy: boolean;
  error?: string;
  selected: boolean;
  selectionFull: boolean;
  onSelect: (id: string) => void;
  onSave: (input: MastersWatchInput) => void;
  onRemove: (id: string) => void;
}

export default function RoundCard({ round, idPrefix = 'round', draft, onDraftChange, watch, now, locale, copy, signedIn, watchesReady, busy, error, selected, selectionFull, onSelect, onSave, onRemove }: RoundCardProps) {
  const [localDraft, setLocalDraft] = useState<MastersRoundDraft>({ status: watch?.status ?? 'preparing', reminders: watch?.reminders ?? false });
  const progressRef = useRef<HTMLSelectElement>(null);
  const pendingFollow = useRef(false);
  useEffect(() => {
    if (!pendingFollow.current || busy) return;
    pendingFollow.current = false;
    // 只接住本实例关注按钮被表单替换时落到 BODY 的焦点，不干扰另一张卡片或用户已选的控件。
    if (watch && watchesReady && document.activeElement === document.body && progressRef.current?.getClientRects().length) {
      progressRef.current.focus({ preventScroll: true });
    }
  }, [busy, watch, watchesReady, error]);
  const { status, reminders } = draft ?? localDraft;
  const updateDraft = (value: MastersRoundDraft) => {
    if (draft) onDraftChange?.(value);
    else setLocalDraft(value);
  };
  const cardId = `${idPrefix}-${round.id}`;
  const progressId = idPrefix === 'round' ? `progress-${round.id}` : `${cardId}-progress`;
  const exportId = `${cardId}-export`;
  const remindersId = `${cardId}-reminders`;
  const details = round.details;
  const timing = getMastersRoundState(round, now);
  const region = mastersRegions.find(item => item.id === round.region);
  const exportable = canExportMastersRound(round, now);
  const buttonClass = 'inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white disabled:opacity-40 aria-disabled:opacity-40 aria-disabled:cursor-wait';

  return (
    <article className="rounded-2xl border border-white/10 bg-black p-5 outline-none focus-visible:border-violet-300/40 sm:p-7" aria-labelledby={`${cardId}-title`} id={cardId} tabIndex={-1}>
      <div className="flex flex-wrap items-center gap-2 t-footnote text-white/60">
        <span>{region?.[locale]}</span><span aria-hidden>·</span><span>{copy[details.studyType]}</span><span aria-hidden>·</span><span>{details.subject}</span>
        <span className={`ml-auto rounded-full border px-3 py-1 ${timing.state === 'closing' ? 'border-amber-300/30 text-amber-200' : 'border-white/15 text-white/70'}`}>{mastersStateLabel(round, now, locale)}</span>
      </div>
      <p className="mt-5 t-footnote font-semibold text-violet-200">{details.university}</p>
      <h2 id={`${cardId}-title`} className="mt-2 t-title-3 text-white">{details.programme}</h2>
      <p className="mt-2 t-footnote text-white/70">{round.intakeYear} · {details.intakeLabel} · {details.roundName}</p>
      <div className="mt-4 flex flex-wrap gap-2 t-footnote">
        <span className="rounded-md bg-white/5 px-2.5 py-1 text-white/80">{copy[details.eventType]}</span>
        {details.rolling && <span className="rounded-md bg-violet-400/10 px-2.5 py-1 text-violet-200">{copy.rolling}</span>}
        {details.mayCloseEarly && <span className="rounded-md bg-amber-400/10 px-2.5 py-1 text-amber-200">{copy.closeEarly}</span>}
      </div>

      <dl className="mt-6 grid gap-5 sm:grid-cols-2">
        <div><dt className="t-footnote text-white/60">{copy.deadline}</dt>
          <dd className="mt-1 text-lg font-semibold text-white">{mastersDeadlineLabel(round, locale) || mastersStateLabel(round, now, locale)}</dd>
          {details.deadlineOn && !details.deadlineAt && <dd className="mt-2 t-footnote text-white/60">{copy.dateOnly}</dd>}
          {timing.daysLeft !== null && timing.state !== 'closed' && <dd className="mt-2 t-footnote text-amber-200">{timing.daysLeft === 0 ? copy.dueToday : `${copy.daysLeft} ${timing.daysLeft} ${copy.days}`}</dd>}
        </div>
        <div><dt className="t-footnote text-white/60">{copy.opens}</dt>
          <dd className="mt-1 text-sm leading-7 text-white/80">{details.opensOn ?? copy.unknownOpening}</dd>
          {details.openingState === 'open' && timing.state !== 'closed' && <dd className="mt-1 t-footnote text-emerald-200">{copy.confirmedOpen}</dd>}
          {details.openingState === 'closed' && <dd className="mt-1 t-footnote text-white/60">{copy.confirmedClosed}</dd>}
          {details.openingNote && <dd className="mt-1 t-footnote text-white/60">{details.openingNote}</dd>}
        </div>
        <div><dt className="t-footnote text-white/60">{copy.applicant}</dt><dd className="mt-1 text-sm leading-7 text-white/80">{details.applicantGroup}</dd></div>
        <div><dt className="t-footnote text-white/60">{copy.mode}</dt><dd className="mt-1 text-sm leading-7 text-white/80">{details.studyMode}</dd></div>
      </dl>

      {round.dateChangedAt && <div className="mt-5 border-l-2 border-amber-300/40 pl-4">
        <p className="t-footnote font-semibold text-amber-200">{copy.changed} · {round.dateChangedAt.slice(0, 10)} · {copy.version} {round.dateVersion}</p>
        {round.previousDeadlineText && <p className="mt-1 t-footnote text-white/70">{copy.previous}: {round.previousDeadlineText}</p>}
        <p className="mt-1 t-footnote text-white/60">{copy.exportHint}</p>
      </div>}
      <details className="mt-5 border-t border-white/10 pt-4">
        <summary className="cursor-pointer t-footnote text-white/70">{copy.source} · {copy.verified}: {round.verifiedOn ?? copy.unverified}</summary>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/70">{details.sourceNote}</p>
        {details.deadlineText && <p className="mt-2 text-sm leading-7 text-white/70">{details.deadlineText}</p>}
      </details>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <a href={details.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm font-semibold text-violet-200 underline underline-offset-4">{copy.official} ↗</a>
        <label htmlFor={exportId} className={`flex min-h-11 items-center gap-2 t-footnote ${exportable ? 'text-white/80' : 'text-white/60'}`}>
          <input id={exportId} type="checkbox" checked={selected} disabled={!exportable || (selectionFull && !selected)} onChange={() => onSelect(round.id)} className="h-4 w-4 accent-violet-400" aria-label={`${copy.exportSelection}: ${details.university} ${details.programme} ${details.roundName}`} />
          {copy.exportSelection}
        </label>
      </div>

      <div className="mt-5 border-t border-white/10 pt-5">
        {!signedIn ? <Link href={buildLoginHref('/masters')} className={buttonClass}>{copy.login}</Link>
          : !watch ? <button type="button" disabled={!watchesReady || busy} onClick={() => {
            if (busy || !watchesReady) return;
            pendingFollow.current = true;
            onSave({ roundId: round.id, status: 'preparing', reminders: false });
          }} className={buttonClass}>{busy ? copy.saving : copy.watch}</button>
            : <form onSubmit={event => { event.preventDefault(); if (busy || !watchesReady) return; onSave({ roundId: round.id, status, reminders }); }}>
              <fieldset disabled={!watchesReady}>
                <legend className="mb-3 t-footnote font-semibold text-white/80">{copy.progress}</legend>
                <label className="sr-only" htmlFor={progressId}>{copy.progress}</label>
                <select ref={progressRef} id={progressId} value={status} disabled={busy} onChange={event => updateDraft({ status: event.target.value as MastersWatchInput['status'], reminders })} className="min-h-11 w-full rounded-xl border border-white/15 bg-zinc-950 px-3 text-sm text-white sm:w-auto">
                  {(['preparing', 'submitted', 'abandoned'] as const).map(value => <option key={value} value={value}>{copy[value]}</option>)}
                </select>
                <label htmlFor={remindersId} className="mt-4 flex items-start gap-3 text-sm text-white/80"><input id={remindersId} type="checkbox" checked={reminders} disabled={busy || status !== 'preparing'} onChange={event => updateDraft({ status, reminders: event.target.checked })} className="mt-1 h-4 w-4 accent-violet-400" /><span>{copy.reminders}<span className="mt-1 block t-footnote text-white/60">{status === 'preparing' ? copy.reminderHint : copy.reminderPaused}</span></span></label>
                <div className="mt-4 flex flex-wrap gap-3"><button type="submit" aria-disabled={busy} className={buttonClass}>{busy ? copy.saving : copy.save}</button><button type="button" aria-disabled={busy} onClick={() => { if (!busy && watchesReady) onRemove(round.id); }} className="min-h-11 px-2 text-sm text-white/60 underline underline-offset-4 aria-disabled:opacity-40 aria-disabled:cursor-wait">{copy.remove}</button></div>
              </fieldset>
            </form>}
        {error && <p role="alert" className="mt-3 t-footnote text-amber-200">{error}</p>}
      </div>
    </article>
  );
}

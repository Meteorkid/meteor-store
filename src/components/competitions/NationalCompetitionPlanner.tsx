import type { NationalCompetition } from '@/data/national-competitions';
import { Link } from '@/i18n/navigation';
import type { CompetitionFilters, CompetitionStatus } from '@/lib/national-competitions';
import {
  competitionFields,
  competitionStatus,
  filterNationalCompetitions,
  scheduleForYear,
} from '@/lib/national-competitions';
import { competitionCalendarText, type CompetitionCalendarCopy } from './text';

interface Props {
  locale: 'zh' | 'en';
  year: number;
  years: readonly number[];
  nowIso: string;
  competitions: readonly NationalCompetition[];
  filters: CompetitionFilters;
  bClassNote: string;
  sources: {
    classification2025: string;
    classification2026: string;
    calendar2025: string;
    calendar2026: string;
  };
}

const statusClass: Record<CompetitionStatus, string> = {
  open: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100',
  upcoming: 'border-violet-300/25 bg-violet-300/10 text-violet-100',
  ended: 'border-white/10 bg-white/[0.03] text-white/60',
  pending: 'border-amber-300/25 bg-amber-300/10 text-amber-100',
};

export default function NationalCompetitionPlanner({ locale, year, years, nowIso, competitions, filters, bClassNote, sources }: Props) {
  const copy = competitionCalendarText[locale];
  const now = new Date(nowIso);
  const rows = filterNationalCompetitions(competitions, year, filters, now);
  const fields = competitionFields(competitions);
  const withWindow = competitions.filter((competition) => scheduleForYear(competition, year)).length;
  const pending = competitions.length - withWindow;
  const statusLabel: Record<CompetitionStatus, string> = {
    open: copy.statusOpen,
    upcoming: copy.statusUpcoming,
    ended: copy.statusEnded,
    pending: copy.statusPending,
  };
  const yearHref = (nextYear: number) => {
    const query = new URLSearchParams({ year: String(nextYear) });
    if (filters.query) query.set('q', filters.query);
    if (filters.field) query.set('field', filters.field);
    if (filters.status !== 'all') query.set('status', filters.status);
    if (filters.sort !== 'soon') query.set('sort', filters.sort);
    return `/competitions?${query.toString()}`;
  };
  const resetHref = `/competitions?year=${year}`;

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 pb-16 pt-10 sm:pt-14">
        <div className="mx-auto max-w-7xl">
          <header className="border-b border-white/10 pb-8">
            <Link href="/pathfinder" className="inline-flex min-h-10 items-center t-footnote text-violet-200">← {copy.back}</Link>
            <p className="mt-3 t-eyebrow text-violet-300">{copy.eyebrow}</p>
            <h1 className="mt-3 t-title-1 text-white">{copy.title}</h1>
            <p className="mt-4 max-w-4xl t-body text-white/60">{copy.description}</p>
            <p className="mt-3 max-w-4xl t-footnote text-white/60">{copy.classification}</p>

            <nav className="mt-6 flex flex-wrap gap-2" aria-label={copy.year}>
              {years.map((option) => (
                <Link key={option} href={yearHref(option)} aria-current={option === year ? 'page' : undefined}
                  className={`inline-flex min-h-11 items-center rounded-xl border px-4 py-2 text-sm font-semibold ${option === year ? 'border-violet-300/40 bg-violet-500/15 text-violet-100' : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white'}`}>
                  {option}
                </Link>
              ))}
            </nav>
            <p className="mt-3 t-footnote text-white/50">{copy.nextYearNotice}</p>
          </header>

          <div className="mt-7 grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section className="rounded-2xl border border-violet-300/20 bg-violet-500/[0.07] p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="t-eyebrow text-violet-300">{copy.aTitle}</p>
                  <p className="mt-2 text-sm text-white/70">{copy.aCount.replace('{count}', String(competitions.length))}</p>
                </div>
                <p className="t-footnote text-white/60">{copy.exactPending}</p>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Metric value={withWindow} label={locale === 'zh' ? '有公开月份窗口' : 'with public month windows'} />
                <Metric value={pending} label={locale === 'zh' ? '日期待公布' : 'dates pending'} />
                <Metric value={fields.length} label={locale === 'zh' ? '学科方向' : 'subject groups'} />
              </div>
            </section>
            <aside id="b-class" className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-5">
              <p className="t-eyebrow text-amber-200">{copy.bTitle}</p>
              <p className="mt-3 text-sm leading-6 text-white/70">{bClassNote}</p>
              <a href={sources.classification2026} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-10 items-center text-sm font-semibold text-amber-100 underline underline-offset-4">{copy.bRuleSource} ↗</a>
            </aside>
          </div>

          <form method="get" action={`/${locale}/competitions`} className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <input type="hidden" name="year" value={year} />
            <div className="grid gap-3 md:grid-cols-[minmax(200px,1fr)_180px_160px_190px_auto]">
              <label className="t-footnote text-white/60">{copy.search}<input name="q" type="search" defaultValue={filters.query} maxLength={100} className={inputClass} /></label>
              <label className="t-footnote text-white/60">{copy.field}<select name="field" defaultValue={filters.field} className={inputClass}><option value="">{copy.allFields}</option>{fields.map((field) => <option key={field} value={field}>{field}</option>)}</select></label>
              <label className="t-footnote text-white/60">{copy.status}<select name="status" defaultValue={filters.status} className={inputClass}><option value="all">{copy.allStatuses}</option>{Object.entries(statusLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="t-footnote text-white/60">{copy.sort}<select name="sort" defaultValue={filters.sort} className={inputClass}><option value="soon">{copy.sortSoon}</option><option value="source">{copy.sortSource}</option></select></label>
              <button type="submit" className="min-h-11 self-end rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500">{copy.submit}</button>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="t-footnote text-white/60">{copy.monthNotice}</p>
              <Link href={resetHref} className="min-h-10 text-xs text-white/60 underline underline-offset-4">{copy.reset}</Link>
            </div>
          </form>

          <section className="mt-8" aria-live="polite">
            <div className="mb-3 flex items-end justify-between gap-4">
              <h2 className="t-title-3 text-white">{copy.results.replace('{count}', String(rows.length))}</h2>
              <p className="t-footnote text-white/60">{year} · {copy.englishNameNote}</p>
            </div>
            {rows.length ? (
              <>
                <div className="hidden overflow-x-auto rounded-2xl border border-white/10 md:block">
                  <table className="min-w-full border-collapse text-left text-sm">
                    <caption className="sr-only">{copy.tableCaption.replace('{year}', String(year))}</caption>
                    <thead className="bg-white/[0.05] text-white/60">
                      <tr>{[copy.number, copy.competition, copy.level, copy.window, copy.organizer, copy.website].map((label) => <th key={label} scope="col" className="whitespace-nowrap border-b border-white/10 px-4 py-3 text-xs font-semibold">{label}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {rows.map((competition) => {
                        const schedule = scheduleForYear(competition, year);
                        const status = competitionStatus(schedule, now);
                        return <tr key={competition.id} className="align-top hover:bg-white/[0.025]">
                          <td className="px-4 py-4 font-mono text-xs text-white/35">{String(competition.order).padStart(2, '0')}</td>
                          <td className="max-w-md px-4 py-4"><p className="font-semibold leading-6 text-white">{competition.name}</p><p className="mt-1 t-footnote text-white/60">{competition.field}</p></td>
                          <td className="px-4 py-4"><span className="whitespace-nowrap rounded-full border border-violet-300/20 bg-violet-300/[0.08] px-2.5 py-1 text-xs text-violet-100">{copy.levelA}</span></td>
                          <td className="min-w-48 px-4 py-4"><DateWindow schedule={schedule} copy={copy} /><StatusBadge status={status} label={statusLabel[status]} /></td>
                          <td className="max-w-xs px-4 py-4 text-xs leading-5 text-white/60">{competition.organizer || '—'}</td>
                          <td className="px-4 py-4"><OfficialLink competition={competition} label={copy.official} missing={copy.noOfficial} /></td>
                        </tr>;
                      })}
                    </tbody>
                  </table>
                </div>
                <ul className="grid gap-3 md:hidden">
                  {rows.map((competition) => {
                    const schedule = scheduleForYear(competition, year);
                    const status = competitionStatus(schedule, now);
                    return <li key={competition.id} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <div className="flex items-start justify-between gap-3"><span className="font-mono text-xs text-white/35">{String(competition.order).padStart(2, '0')}</span><span className="rounded-full border border-violet-300/20 px-2.5 py-1 text-[11px] text-violet-100">{copy.levelA}</span></div>
                      <h3 className="mt-3 t-title-4 leading-6 text-white">{competition.name}</h3>
                      <p className="mt-1 t-footnote text-white/60">{competition.field}</p>
                      <div className="mt-3"><DateWindow schedule={schedule} copy={copy} /><StatusBadge status={status} label={statusLabel[status]} /></div>
                      {competition.organizer && <p className="mt-3 border-t border-white/10 pt-3 t-footnote leading-5 text-white/60">{competition.organizer}</p>}
                      <div className="mt-3"><OfficialLink competition={competition} label={copy.official} missing={copy.noOfficial} /></div>
                    </li>;
                  })}
                </ul>
              </>
            ) : <div className="rounded-2xl border border-white/10 px-6 py-12 text-center"><h3 className="t-title-3 text-white">{copy.empty}</h3><p className="mt-3 t-footnote text-white/60">{copy.emptyHint}</p><Link href={resetHref} className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white">{copy.reset}</Link></div>}
          </section>

          <SourceList copy={copy} sources={sources} />
        </div>
      </main>
    </div>
  );
}

const inputClass = 'mt-2 min-h-11 w-full rounded-xl border border-white/15 bg-zinc-950 px-3 text-sm text-white outline-none focus:border-violet-400/60';

function Metric({ value, label }: { value: number; label: string }) { return <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-3"><strong className="block t-title-3 tabular-nums text-white">{value}</strong><span className="mt-1 block t-footnote leading-5 text-white/60">{label}</span></div>; }
function StatusBadge({ status, label }: { status: CompetitionStatus; label: string }) { return <span className={`mt-2 flex w-fit rounded-full border px-2.5 py-1 text-[11px] ${statusClass[status]}`}>{label}</span>; }
function DateWindow({ schedule, copy }: { schedule: ReturnType<typeof scheduleForYear>; copy: CompetitionCalendarCopy }) {
  if (!schedule) return <><p className="t-footnote text-white/50">{copy.pendingDate}</p><p className="mt-1 text-xs text-amber-100">{copy.exactPending}</p></>;
  const start = schedule.start ?? copy.startUnknown;
  const end = schedule.end ?? (schedule.endLabel === '-' ? copy.endUnknown : schedule.endLabel);
  return <><p className="font-mono text-xs text-white/80">{start} — {end}</p><p className="mt-1 t-footnote text-white/50">{schedule.startLabel} — {schedule.endLabel} · {copy.monthPrecision}</p><a href={schedule.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex text-[11px] text-white/45 underline underline-offset-2 hover:text-white/70">{copy.dateSource} ↗</a></>;
}
function OfficialLink({ competition, label, missing }: { competition: NationalCompetition; label: string; missing: string }) {
  return competition.officialUrl
    ? <a href={competition.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center whitespace-nowrap text-xs font-semibold text-violet-200 underline underline-offset-4">{label} ↗</a>
    : <span className="text-xs text-white/40">{missing}</span>;
}
function SourceList({ copy, sources }: { copy: CompetitionCalendarCopy; sources: Props['sources'] }) {
  return <footer className="mt-10 border-t border-white/10 pt-6"><p className="t-eyebrow text-white/50">{copy.sourceTitle}</p><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/60">
    <a href={sources.classification2025} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">{copy.source2025} ↗</a>
    <a href={sources.classification2026} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">{copy.source2026} ↗</a>
    <a href={sources.calendar2025} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">{copy.sourceCalendar2025} ↗</a>
    <a href={sources.calendar2026} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">{copy.sourceCalendar2026} ↗</a>
  </div></footer>;
}

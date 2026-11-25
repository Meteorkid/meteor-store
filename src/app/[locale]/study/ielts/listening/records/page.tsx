import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link, redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/auth';
import { buildLoginHref } from '@/lib/login-return';
import { getListeningPracticeOverview } from '@/lib/ielts-listening/attempts';
import { getListeningLesson } from '@/lib/ielts-listening/catalog';
import { listeningText } from '@/components/ielts-listening/listening-text';

export const dynamic = 'force-dynamic';

/**
 * 练习记录与错题本。错题本按「每道题最近一次做到它的结果」聚合，
 * 所以这里不重算一次，完全用服务层的结论；日期统一按北京时间显示，避免服务端与客户端两套口径。
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = listeningText[locale === 'en' ? 'en' : 'zh'];
  return { title: copy.recordsMetaTitle, description: copy.recordsMetaDescription, robots: { index: false, follow: false } };
}

function formatWhen(iso: string, locale: 'zh' | 'en'): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-GB', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Shanghai',
  }).format(date);
}

function formatDuration(seconds: number): string {
  if (!seconds) return '—';
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes ? `${minutes}m ${String(rest).padStart(2, '0')}s` : `${rest}s`;
}

function lessonLabel(slug: string, locale: 'zh' | 'en', gone: string): { part: string; title: string; titleAlt: string | null; href: string | null } {
  const lesson = getListeningLesson(slug);
  if (!lesson) return { part: slug, title: gone, titleAlt: null, href: null };
  return {
    part: listeningText[locale].part(lesson.part), title: lesson.title[locale],
    titleAlt: locale === 'zh' ? lesson.title.en : null, href: `/study/ielts/listening/${slug}`,
  };
}

export default async function ListeningRecordsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale === 'en' ? 'en' : 'zh';
  const copy = listeningText[typedLocale];
  const records = copy.records;

  const session = await getSession();
  if (!session) redirect({ href: buildLoginHref('/study/ielts/listening/records'), locale });
  const overview = await getListeningPracticeOverview(session!.userId, 50).catch(() => null);

  const attempts = overview?.attempts ?? [];
  const wrongBook = overview?.wrongBook ?? [];
  const bestFull = Math.max(0, ...wrongBook.map(entry => entry.bestFullScore ?? 0));
  const totalAttempts = wrongBook.reduce((sum, entry) => sum + entry.attempts, 0);
  const stillWrong = wrongBook.reduce((sum, entry) => sum + entry.wrongNumbers.length, 0);

  return <div className="mx-auto max-w-5xl">
    <header className="border-b border-white/10 pb-8">
      <Link href="/study/ielts/listening" className="t-footnote text-white/55 transition-colors hover:text-white">{copy.backToLibrary}</Link>
      <h1 className="mt-3 t-title-1 text-white">{records.title}</h1>
      {typedLocale === 'zh' && <p lang="en" className="mt-1.5 text-lg font-medium text-white/55">Listening practice records · Wrong-answer book</p>}
      <p className="mt-3 max-w-3xl t-body text-white/60">{records.description}</p>
      {overview && <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs text-white/70">{records.bestFullScore} {bestFull}/10</span>
        <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs text-white/70">{records.attemptTimes(totalAttempts)}</span>
        <span className={`rounded-full border px-3 py-1 text-xs ${stillWrong ? 'border-amber-300/30 bg-amber-300/10 text-amber-100' : 'border-emerald-300/25 bg-emerald-400/10 text-emerald-100'}`}>
          {records.stillWrong} {stillWrong}
        </span>
      </div>}
    </header>

    {!overview ? <p role="alert" className="mt-8 rounded-xl border border-amber-300/25 bg-amber-300/[0.07] px-4 py-3 t-footnote text-amber-100">{records.unavailable}</p>
      : attempts.length === 0 ? <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-8 text-center">
        <p className="text-sm text-white/65">{records.empty}</p>
        <Link href="/study/ielts/listening" className="mt-3 inline-flex min-h-10 items-center rounded-xl border border-violet-300/40 bg-violet-400/15 px-4 text-sm font-semibold text-white">
          {records.emptyAction}
        </Link>
      </div> : <>
        <section className="mt-9">
          <h2 className="t-title-2 text-white">{records.summaryTitle}</h2>
          {wrongBook.length === 0 ? <p className="mt-3 t-footnote text-white/50">{records.noWrong}</p> : <div className="mt-3 space-y-2">
            {wrongBook.map(entry => {
              const label = lessonLabel(entry.lessonSlug, typedLocale, records.goneLesson);
              return <div key={entry.lessonSlug} className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] font-semibold text-white/70">{label.part}</span>
                    <span className="text-sm font-medium text-white/90">{label.title}{label.titleAlt && <span lang="en" className="mt-0.5 block text-xs font-normal text-white/45">{label.titleAlt}</span>}</span>
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 t-footnote text-white/50">
                    <span>{records.attemptTimes(entry.attempts)}</span>
                    <span>{records.lastPracticed} · {formatWhen(entry.lastPracticedAt, typedLocale)}</span>
                    {entry.bestFullScore !== null && <span>{records.bestFullScore} {entry.bestFullScore}/10</span>}
                  </p>
                  {entry.wrongNumbers.length > 0 && <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-amber-100">
                    {entry.wrongNumbers.map(number => <span key={number} className="rounded bg-amber-300/15 px-1.5 py-0.5 font-semibold tabular-nums">{number}</span>)}
                  </p>}
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {entry.wrongNumbers.length > 0 && label.href && <Link
                    href={`${label.href}?q=${entry.wrongNumbers.join(',')}`}
                    className="inline-flex min-h-10 items-center rounded-xl border border-amber-300/40 bg-amber-300/10 px-3 text-xs font-semibold text-amber-100 transition-colors hover:bg-amber-300/15">
                    {records.retryWrong}
                  </Link>}
                  {label.href && <Link href={label.href}
                    className="inline-flex min-h-10 items-center rounded-xl border border-white/20 px-3 text-xs text-white/80 transition-colors hover:bg-white/10">
                    {records.openLesson}
                  </Link>}
                </div>
              </div>;
            })}
          </div>}
        </section>

        <section className="mt-12">
          <h2 className="t-title-2 text-white">{records.detailTitle}</h2>
          <div className="mt-3 hidden overflow-x-auto sm:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/12 text-xs text-white/50">
                  <th scope="col" className="py-2 pr-4 font-medium">{records.date}</th>
                  <th scope="col" className="py-2 pr-4 font-medium">{records.lesson}</th>
                  <th scope="col" className="py-2 pr-4 font-medium">{records.mode}</th>
                  <th scope="col" className="py-2 pr-4 font-medium text-right">{records.score}</th>
                  <th scope="col" className="py-2 pr-4 font-medium">{records.wrong}</th>
                  <th scope="col" className="py-2 font-medium text-right">{records.duration}</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map(attempt => {
                  const label = lessonLabel(attempt.lessonSlug, typedLocale, records.goneLesson);
                  return <tr key={attempt.id} className="border-b border-white/[0.06] last:border-0">
                    <td className="py-2.5 pr-4 whitespace-nowrap text-white/60">{formatWhen(attempt.createdAt, typedLocale)}</td>
                    <td className="py-2.5 pr-4 text-white/85">{label.part} · {label.title}{label.titleAlt && <span lang="en" className="mt-0.5 block text-xs text-white/45">{label.titleAlt}</span>}</td>
                    <td className="py-2.5 pr-4 text-white/55">{attempt.mode === 'full' ? records.modeFull : records.modeCustom}</td>
                    <td className="py-2.5 pr-4 text-right font-semibold tabular-nums text-white">{attempt.score}/{attempt.total}</td>
                    <td className="py-2.5 pr-4 text-white/60">{attempt.wrongNumbers.length ? attempt.wrongNumbers.join(', ') : records.none}</td>
                    <td className="py-2.5 text-right tabular-nums text-white/50">{formatDuration(attempt.durationSec)}</td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
          <ul className="mt-3 space-y-2 sm:hidden">
            {attempts.map(attempt => {
              const label = lessonLabel(attempt.lessonSlug, typedLocale, records.goneLesson);
              return <li key={attempt.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <p className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-white/90">{label.part} · {label.title}</span>
                  <span className="text-sm font-semibold tabular-nums text-white">{attempt.score}/{attempt.total}</span>
                </p>
                <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 t-footnote text-white/50">
                  <span>{formatWhen(attempt.createdAt, typedLocale)}</span>
                  <span>{attempt.mode === 'full' ? records.modeFull : records.modeCustom}</span>
                  <span>{records.duration} {formatDuration(attempt.durationSec)}</span>
                </p>
                {attempt.wrongNumbers.length > 0 && <p className="mt-1 t-footnote text-amber-100">{records.wrong} · {attempt.wrongNumbers.join(', ')}</p>}
              </li>;
            })}
          </ul>
        </section>
      </>}
  </div>;
}

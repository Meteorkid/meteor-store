import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/auth';
import { listListeningTests, listListeningLessons } from '@/lib/ielts-listening/catalog';
import { getListeningPracticeOverview } from '@/lib/ielts-listening/attempts';
import { listeningText } from '@/components/ielts-listening/listening-text';

export const dynamic = 'force-dynamic';

/**
 * 听力题库：按套题分组，每套四个 Part。卡片上给出题型、原文词数、是否有合成录音，
 * 登录后再补每篇的练习次数、整篇最好分与仍答错的题（直接进错题重练）。
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = listeningText[locale === 'en' ? 'en' : 'zh'];
  return { title: copy.metaTitle, description: copy.metaDescription, robots: { index: true, follow: true } };
}

function estimateMinutes(wordCount: number): number {
  return Math.max(2, Math.round(wordCount / 140));
}

export default async function ListeningLibraryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale === 'en' ? 'en' : 'zh';
  const copy = listeningText[typedLocale];

  const tests = listListeningTests();
  const lessons = listListeningLessons();
  const totalQuestions = lessons.length * 10;

  const session = await getSession();
  const overview = session
    ? await getListeningPracticeOverview(session.userId, 50).catch(() => null)
    : null;
  const wrongByLesson = new Map((overview?.wrongBook ?? []).map(entry => [entry.lessonSlug, entry] as const));
  const bestFull = Math.max(0, ...(overview?.wrongBook ?? []).map(entry => entry.bestFullScore ?? 0));

  return <div className="mx-auto max-w-6xl">
    <header className="border-b border-white/10 pb-9">
      <p className="t-eyebrow text-violet-300">{copy.eyebrow}</p>
      <h1 className="mt-3 t-title-1 text-white">{copy.title}</h1>
      <p className="mt-4 max-w-3xl t-body text-white/60">{copy.description}</p>
      <p className="mt-3 t-footnote text-white/45">{copy.disclaimer}</p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs text-white/70">{copy.testsCount(tests.length)}</span>
        <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs text-white/70">{copy.partsCount(lessons.length)}</span>
        <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs text-white/70">{copy.questionsCount(totalQuestions)}</span>
        {bestFull > 0 && <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">{copy.best} {bestFull}/10</span>}
        <Link href="/study/ielts/listening/records" className="ml-auto inline-flex min-h-10 items-center rounded-xl border border-white/20 px-4 text-sm text-white/85 transition-colors hover:bg-white/10">
          {copy.recordsLabel}
        </Link>
      </div>
    </header>

    {tests.map(test => <section key={test.slug} className="mt-10">
      <div className="mb-4">
        <h2 className="t-title-2 text-white">{test.title[typedLocale]}</h2>
        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-white/55">{test.description[typedLocale]}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {test.lessons.map(lesson => {
          const record = wrongByLesson.get(lesson.slug);
          const wrongNumbers = record?.wrongNumbers ?? [];
          const retryHref = wrongNumbers.length ? `/study/ielts/listening/${lesson.slug}?q=${wrongNumbers.join(',')}` : null;
          return <article key={lesson.slug} className="flex min-w-0 flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-white/20">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-violet-400/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-violet-100">{copy.part(lesson.part)}</span>
              <span className="t-footnote text-white/45">{lesson.wordCount} words · {copy.minutes(estimateMinutes(lesson.wordCount))}</span>
              <span className="rounded border border-white/15 px-1.5 py-0.5 text-[10px] text-white/55">{lesson.audio ? copy.audioAi : copy.readingMode}</span>
            </div>
            <h3 className="mt-2 text-lg font-semibold leading-7 text-white">{lesson.title[typedLocale]}</h3>
            <p className="mt-1.5 text-[13px] leading-6 text-white/60">{lesson.summary[typedLocale]}</p>
            <ul className="mt-2.5 flex flex-wrap gap-1.5">{lesson.kinds.map(kind =>
              <li key={kind} className="rounded-full border border-white/12 bg-white/5 px-2 py-0.5 text-[11px] text-white/65">{copy.kinds[kind]}</li>)}
            </ul>
            {lesson.accent && <p className="mt-2 t-footnote text-white/40">{copy.accent} · {lesson.accent[typedLocale]}</p>}
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
              <Link href={`/study/ielts/listening/${lesson.slug}`}
                className="inline-flex min-h-10 items-center rounded-xl border border-violet-300/40 bg-violet-400/15 px-3.5 text-sm font-semibold text-white transition-colors hover:bg-violet-400/25">
                {copy.start}
              </Link>
              {retryHref && <Link href={retryHref}
                className="inline-flex min-h-10 items-center rounded-xl border border-amber-300/40 bg-amber-300/10 px-3 text-xs font-semibold text-amber-100 transition-colors hover:bg-amber-300/15">
                {copy.startWrong} · {wrongNumbers.length}
              </Link>}
              <span className="t-footnote text-white/40">
                {record ? record.attempts > 0 ? copy.attempted(record.attempts) : copy.noAttempt : copy.noAttempt}
                {record?.bestFullScore !== null && record?.bestFullScore !== undefined ? ` · ${copy.best} ${record.bestFullScore}/10` : ''}
              </span>
            </div>
          </article>;
        })}
      </div>
    </section>)}

    {!session && <p className="mt-10 t-footnote text-white/45">{copy.practice.loginToSave}</p>}
  </div>;
}

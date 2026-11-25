import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/auth';
import { getListeningLesson, listListeningLessons } from '@/lib/ielts-listening/catalog';
import { listeningText } from '@/components/ielts-listening/listening-text';
import IeltsListeningPractice from '@/components/ielts-listening/IeltsListeningPractice';

export const dynamic = 'force-dynamic';

/**
 * 一个 Part 的练习页。?q=3,7 表示错题重练：服务端只做语法层的解析，
 * 题号是否合法、多选是否整组，交给协议里的 normalizeListeningScope 收窄（客户端与服务端同一规则）。
 */

function parseScope(raw: string | string[] | undefined): number[] | null {
  const text = Array.isArray(raw) ? raw.join(',') : raw;
  if (!text) return null;
  const numbers = text.split(/[,\s]+/).map(value => Number.parseInt(value, 10)).filter(value => Number.isInteger(value));
  return numbers.length ? numbers.slice(0, 10) : null;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const typedLocale = locale === 'en' ? 'en' : 'zh';
  const copy = listeningText[typedLocale];
  const lesson = getListeningLesson(slug);
  if (!lesson) return { title: copy.metaTitle, robots: { index: false, follow: false } };
  return {
    title: `${lesson.title[typedLocale]} · ${copy.title}`,
    description: lesson.summary[typedLocale].slice(0, 160),
    robots: { index: true, follow: true },
  };
}

export default async function ListeningPracticePage({ params, searchParams }: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const typedLocale = locale === 'en' ? 'en' : 'zh';
  const copy = listeningText[typedLocale];

  const lesson = getListeningLesson(slug);
  if (!lesson) notFound();
  const query = await searchParams;
  const requestedScope = parseScope(query.q);

  const lessons = listListeningLessons();
  const position = lessons.findIndex(item => item.slug === lesson.slug);
  const previous = position > 0 ? lessons[position - 1] : null;
  const next = position >= 0 && position < lessons.length - 1 ? lessons[position + 1] : null;

  const session = await getSession();

  return <article className="mx-auto max-w-6xl">
    <Link href="/study/ielts/listening" className="t-footnote text-white/55 transition-colors hover:text-white">{copy.backToLibrary}</Link>

    <header className="mt-5 border-b border-white/10 pb-7">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-violet-400/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-violet-100">{copy.part(lesson.part)}</span>
        {lesson.kinds.map(kind => <span key={kind} className="rounded-full border border-white/12 bg-white/5 px-2 py-0.5 text-[11px] text-white/65">{copy.kinds[kind]}</span>)}
        <span className="rounded-full border border-white/12 bg-white/5 px-2 py-0.5 text-[11px] text-white/55">{lesson.audio ? copy.audioAi : copy.readingMode}</span>
        <span className="t-footnote text-white/40">{lesson.wordCount} words</span>
      </div>
      <h1 className="mt-3 t-title-1 text-white">{lesson.title[typedLocale]}</h1>
      <p className="mt-3 max-w-3xl t-body text-white/60">{lesson.summary[typedLocale]}</p>
      {lesson.accent && <p className="mt-2 t-footnote text-white/40">{copy.accent} · {lesson.accent[typedLocale]}</p>}
    </header>

    {lesson.tips && lesson.tips.length > 0 && <details className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <summary className="cursor-pointer text-sm font-medium text-white/75">{copy.tips}</summary>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {lesson.tips.map(tip => <li key={tip.title.en} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
          <p className="text-[13px] font-semibold text-white/85">{tip.title[typedLocale]}</p>
          <p className="mt-1 text-[12px] leading-6 text-white/60">{tip.body[typedLocale]}</p>
        </li>)}
      </ul>
    </details>}

    <div className="mt-6">
      <IeltsListeningPractice lesson={lesson} locale={typedLocale} requestedScope={requestedScope} ownerId={session?.userId ?? null} />
    </div>

    <nav aria-label={copy.library} className="mt-12 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
      {previous ? <Link href={`/study/ielts/listening/${previous.slug}`} className="t-footnote text-white/65 transition-colors hover:text-white">
        ← {copy.part(previous.part)}
      </Link> : <span />}
      <Link href="/study/ielts/listening/records" className="t-footnote text-white/50 transition-colors hover:text-white">{copy.recordsLabel}</Link>
      {next ? <Link href={`/study/ielts/listening/${next.slug}`} className="t-footnote text-white/65 transition-colors hover:text-white">
        {copy.part(next.part)} →
      </Link> : <span />}
    </nav>
  </article>;
}

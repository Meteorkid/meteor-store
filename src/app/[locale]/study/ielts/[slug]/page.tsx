import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/auth';
import { listIeltsPairs } from '@/lib/ielts/catalog';
import { getIeltsProgressEntry } from '@/lib/ielts/service';
import { IELTS_CRITERION_LABELS, countWords, type IeltsCriterionKey } from '@/lib/ielts/types';
import { categoryLabel, ieltsCopy, topicLabel } from '@/components/ielts/ielts-text';
import IeltsComparison from '@/components/ielts/IeltsComparison';
import IeltsLearningNotes, { IeltsStudyLinks } from '@/components/ielts/IeltsLearningNotes';
import IeltsProgressActions from '@/components/ielts/IeltsProgressActions';

export const dynamic = 'force-dynamic';

/**
 * 一组对照的详情页：题目 + 左右对照 + 四项评分维度 + 可抄走的写法。
 *
 * 一次把整库读出来（几组到几十组，除正文外只有元数据），
 * 顺带得到上一组/下一组，不必为翻页再查一次数据库。
 */

const CRITERION_ORDER: IeltsCriterionKey[] = ['TR', 'CC', 'LR', 'GRA'];

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const copy = ieltsCopy(locale);
  const pair = (await listIeltsPairs()).find(item => item.slug === slug);
  if (!pair) return { title: copy.notFound, robots: { index: false, follow: false } };
  const typedLocale = locale === 'en' ? 'en' : 'zh';
  return {
    title: `${pair.content.title[typedLocale]} · ${copy.title}`,
    description: pair.content.prompt[typedLocale].slice(0, 160),
    robots: { index: true, follow: true },
  };
}

export default async function IeltsPairPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const typedLocale = locale === 'en' ? 'en' : 'zh';
  const copy = ieltsCopy(locale);

  const pairs = await listIeltsPairs();
  const index = pairs.findIndex(item => item.slug === slug);
  if (index < 0) notFound();
  const pair = pairs[index];
  const previous = index > 0 ? pairs[index - 1] : null;
  const next = index < pairs.length - 1 ? pairs[index + 1] : null;

  const session = await getSession();
  const progress = session ? await getIeltsProgressEntry(session.userId, pair.slug).catch(() => null) : null;

  const { content } = pair;
  const lowWords = countWords(content.segments.map(segment => segment.low).join(' '));
  const highWords = countWords(content.segments.map(segment => segment.high).join(' '));
  const criteriaByKey = new Map(content.criteria.map(item => [item.key, item.note]));

  return (
    <article className="mx-auto max-w-6xl">
      <Link href="/study/ielts" className="t-footnote text-white/55 transition-colors hover:text-white">
        {copy.backToLibrary}
      </Link>

      <header className="mt-5 border-b border-white/10 pb-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/12 bg-white/5 px-2.5 py-0.5 text-[11px] text-white/70">{copy.taskLabels[pair.task]}</span>
          <span className="rounded-full border border-white/12 bg-white/5 px-2.5 py-0.5 text-[11px] text-white/70">{categoryLabel(locale, pair.category)}</span>
          <span className="rounded-full border border-white/12 bg-white/5 px-2.5 py-0.5 text-[11px] text-white/70">{topicLabel(locale, pair.topic)}</span>
        </div>
        <h1 className="mt-4 t-title-1 text-white">{content.title[typedLocale]}</h1>
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="t-eyebrow text-white/45">{copy.promptTitle}</p>
          <p className="mt-2 t-body whitespace-pre-line text-white/85">{content.prompt[typedLocale]}</p>
          {typedLocale === 'zh' && content.prompt.en !== content.prompt.zh && (
            <details className="mt-2">
              <summary className="t-footnote cursor-pointer text-white/45 hover:text-white/70">English</summary>
              <p className="mt-2 t-footnote whitespace-pre-line text-white/60">{content.prompt.en}</p>
            </details>
          )}
          {typedLocale === 'en' && content.prompt.zh !== content.prompt.en && (
            <details className="mt-2">
              <summary className="t-footnote cursor-pointer text-white/45 hover:text-white/70">中文</summary>
              <p className="mt-2 t-footnote whitespace-pre-line text-white/60">{content.prompt.zh}</p>
            </details>
          )}
        </div>
        <p className="mt-3 t-footnote text-white/45">
          {copy.bandLow} {copy.words(lowWords)} · {copy.bandHigh} {copy.words(highWords)} · {copy.segments(content.segments.length)}
        </p>
        <IeltsStudyLinks locale={typedLocale} />
      </header>

      <div className="mt-8">
        <IeltsComparison slug={slug} locale={typedLocale} segments={content.segments} />
      </div>

      <IeltsLearningNotes content={content} locale={typedLocale} />

      <section className="mt-12 border-t border-white/10 pt-8" aria-labelledby="ielts-criteria">
        <h2 id="ielts-criteria" className="t-title-2 text-white">{copy.criteriaTitle}</h2>
        <dl className="mt-5 grid gap-4 md:grid-cols-2">
          {CRITERION_ORDER.map(key => {
            const note = criteriaByKey.get(key);
            if (!note) return null;
            return (
              <div key={key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <dt className="flex items-center gap-2 t-title-4 text-white">
                  <span className="rounded-md border border-violet-400/30 bg-violet-400/10 px-1.5 py-0.5 text-[11px] text-violet-200">{key === 'TR' && pair.task !== 'task2' ? 'TA' : IELTS_CRITERION_LABELS[key].short[typedLocale]}</span>
                  {key === 'TR' && pair.task !== 'task2' ? (typedLocale === 'zh' ? '任务完成度' : 'Task Achievement') : IELTS_CRITERION_LABELS[key][typedLocale]}
                </dt>
                <dd className="mt-2 t-footnote text-white/70">{note[typedLocale]}</dd>
              </div>
            );
          })}
        </dl>
      </section>

      <section className="mt-12 border-t border-white/10 pt-8" aria-labelledby="ielts-takeaways">
        <h2 id="ielts-takeaways" className="t-title-2 text-white">{copy.takeawaysTitle}</h2>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {content.takeaways[typedLocale].map(item => (
            <li key={item} className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 t-body text-white/85">{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-12 border-t border-white/10 pt-8" aria-labelledby="ielts-progress">
        <h2 id="ielts-progress" className="t-title-2 text-white">{copy.progressTitle}</h2>
        <div className="mt-4">
          <IeltsProgressActions
            locale={typedLocale}
            slug={pair.slug}
            userId={session?.userId ?? null}
            initialStudied={Boolean(progress?.studiedAt)}
            initialBookmarked={Boolean(progress?.bookmarkedAt)}
          />
        </div>
      </section>

      {(previous || next) && (
        <nav className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6" aria-label={copy.relatedTitle}>
          {previous ? (
            <Link href={`/study/ielts/${previous.slug}`} className="t-footnote text-white/65 transition-colors hover:text-white">
              ← {copy.prevPair}：{previous.content.title[typedLocale]}
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/study/ielts/${next.slug}`} className="t-footnote text-white/65 transition-colors hover:text-white">
              {copy.nextPair}：{next.content.title[typedLocale]} →
            </Link>
          ) : <span />}
        </nav>
      )}
    </article>
  );
}

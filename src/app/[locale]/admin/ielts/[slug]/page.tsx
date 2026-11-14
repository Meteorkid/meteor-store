import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { isAdminSession } from '@/lib/admin';
import { getAdminPageSession } from '@/lib/admin-session';
import { findIeltsPairRow, validCuratedPairs } from '@/lib/ielts/catalog';
import { IELTS_CRITERION_LABELS, IeltsPairSlugSchema, countWords, type IeltsCriterionKey } from '@/lib/ielts/types';
import { categoryLabel, ieltsCopy, topicLabel } from '@/components/ielts/ielts-text';
import IeltsComparison from '@/components/ielts/IeltsComparison';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string; slug: string }> };
const CRITERION_ORDER: IeltsCriterionKey[] = ['TR', 'CC', 'LR', 'GRA'];
const backLinkClass = 'inline-flex min-h-11 items-center rounded-lg px-2 t-footnote text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const session = await getAdminPageSession();
  const allowed = Boolean(session && isAdminSession(session));
  return {
    title: allowed ? (locale === 'en' ? 'IELTS preview · Admin' : '雅思对照预览 · 管理后台') : 'Not found',
    robots: { index: false, follow: false },
  };
}

export default async function IeltsPreviewPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const session = await getAdminPageSession();
  if (!session || !isAdminSession(session)) notFound();
  if (!IeltsPairSlugSchema.safeParse(slug).success) notFound();

  // 公开合并层会排除草稿；仅在管理员身份确认后读取原始行。
  const row = await findIeltsPairRow(slug);
  const seed = row?.content ? undefined : validCuratedPairs().find(item => item.slug === slug);
  const pair = row ?? seed;
  const content = row?.content ?? seed?.content;
  if (!pair || !content) notFound();

  const typedLocale = locale === 'en' ? 'en' : 'zh';
  const en = typedLocale === 'en';
  const copy = ieltsCopy(locale);
  const backLabel = en ? '← Back to IELTS management' : '← 返回雅思对照管理';
  const statusLabel = pair.status === 'draft' ? (en ? 'Draft' : '草稿')
    : pair.status === 'hidden' ? (en ? 'Unpublished' : '已下架') : (en ? 'Public' : '公开');
  const lowWords = countWords(content.segments.map(segment => segment.low).join(' '));
  const highWords = countWords(content.segments.map(segment => segment.high).join(' '));
  const criteriaByKey = new Map(content.criteria.map(item => [item.key, item.note]));

  return (
    <article className="mx-auto min-w-0 max-w-6xl break-words">
      <Link href="/admin/ielts" locale={typedLocale} className={backLinkClass}>{backLabel}</Link>
      <header className="mt-4 border-b border-white/10 pb-7">
        <p className="t-footnote text-amber-200">
          {en ? 'Administrator preview. Review the content, then return to the list to publish.' : '仅管理员可见的预览。检查内容后，返回列表发布。'}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/70">
          <span className="rounded-full border border-white/15 px-2.5 py-1">{statusLabel}</span>
          <span>{copy.taskLabels[pair.task]}</span>
          <span>{categoryLabel(locale, pair.category)}</span>
          <span>{topicLabel(locale, pair.topic)}</span>
        </div>
        <h1 className="mt-4 t-title-1 text-white">{content.title[typedLocale]}</h1>
        <section className="mt-5 rounded-2xl border border-white/10 p-4" aria-labelledby="ielts-preview-prompt">
          <h2 id="ielts-preview-prompt" className="t-eyebrow text-white/60">{copy.promptTitle}</h2>
          <p className="mt-2 t-body whitespace-pre-line text-white/85">{content.prompt[typedLocale]}</p>
          {content.prompt.en !== content.prompt.zh && (
            <details className="mt-2">
              <summary className="min-h-11 cursor-pointer py-3 t-footnote text-white/70">{en ? '中文' : 'English'}</summary>
              <p className="mt-2 t-body whitespace-pre-line text-white/70">{content.prompt[en ? 'zh' : 'en']}</p>
            </details>
          )}
        </section>
        <p className="mt-3 t-footnote text-white/60">
          {copy.bandLow} {copy.words(lowWords)} · {copy.bandHigh} {copy.words(highWords)} · {copy.segments(content.segments.length)}
        </p>
      </header>

      <div className="mt-8">
        <IeltsComparison locale={typedLocale} segments={content.segments} />
      </div>

      <section className="mt-12 border-t border-white/10 pt-8" aria-labelledby="ielts-preview-criteria">
        <h2 id="ielts-preview-criteria" className="t-title-2 text-white">{copy.criteriaTitle}</h2>
        <dl className="mt-5 grid gap-4 md:grid-cols-2">
          {CRITERION_ORDER.map(key => {
            const note = criteriaByKey.get(key);
            if (!note) return null;
            return (
              <div key={key} className="rounded-2xl border border-white/10 p-4">
                <dt className="t-title-4 text-white">
                  <span className="mr-2 text-violet-200">{key}</span>
                  {IELTS_CRITERION_LABELS[key][typedLocale]}
                </dt>
                <dd className="mt-2 t-body text-white/70">{note[typedLocale]}</dd>
              </div>
            );
          })}
        </dl>
      </section>

      <section className="mt-12 border-t border-white/10 pt-8" aria-labelledby="ielts-preview-takeaways">
        <h2 id="ielts-preview-takeaways" className="t-title-2 text-white">{copy.takeawaysTitle}</h2>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {content.takeaways[typedLocale].map(item => (
            <li key={item} className="rounded-xl border border-white/10 px-4 py-3 t-body text-white/85">{item}</li>
          ))}
        </ul>
      </section>
      <div className="mt-8 border-t border-white/10 pt-4">
        <Link href="/admin/ielts" locale={typedLocale} className={backLinkClass}>{backLabel}</Link>
      </div>
    </article>
  );
}

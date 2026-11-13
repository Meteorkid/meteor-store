import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getSession } from '@/lib/auth';
import { listIeltsPairs } from '@/lib/ielts/catalog';
import { listIeltsProgress } from '@/lib/ielts/service';
import { countWords } from '@/lib/ielts/types';
import { ieltsCopy } from '@/components/ielts/ielts-text';
import IeltsLibrary, { type IeltsLibraryItem } from '@/components/ielts/IeltsLibrary';

export const dynamic = 'force-dynamic';

/**
 * 雅思写作对照库。
 *
 * 这是学习区里唯一公开、可被搜索引擎收录的页面：范文是共享内容而不是私人数据，
 * 游客直接读，登录只是为了跨设备记住「已学 / 收藏」。
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = ieltsCopy(locale);
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    robots: { index: true, follow: true },
  };
}

export default async function IeltsLibraryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale === 'en' ? 'en' : 'zh';
  const copy = ieltsCopy(locale);

  const pairs = await listIeltsPairs();
  const session = await getSession();
  const progress = session ? await listIeltsProgress(session.userId).catch(() => []) : [];
  const progressBySlug = new Map(progress.map(entry => [entry.slug, entry]));

  const items: IeltsLibraryItem[] = pairs.map(pair => ({
    slug: pair.slug,
    task: pair.task,
    category: pair.category,
    topic: pair.topic,
    title: pair.content.title[typedLocale],
    prompt: pair.content.prompt[typedLocale],
    lowWords: countWords(pair.content.segments.map(segment => segment.low).join(' ')),
    highWords: countWords(pair.content.segments.map(segment => segment.high).join(' ')),
    upgrades: pair.content.segments.length,
    studied: Boolean(progressBySlug.get(pair.slug)?.studiedAt),
    bookmarked: Boolean(progressBySlug.get(pair.slug)?.bookmarkedAt),
  }));

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 border-b border-white/10 pb-9">
        <p className="t-eyebrow text-violet-300">{copy.eyebrow}</p>
        <h1 className="mt-3 t-title-1 text-white">{copy.title}</h1>
        <p className="mt-4 max-w-3xl t-body text-white/65">{copy.description}</p>
        <p className="mt-3 t-footnote text-white/45">
          {copy.libraryCount(items.length)}
          {!session && <> · {copy.loginToMark}</>}
        </p>
      </header>
      <IeltsLibrary locale={typedLocale} items={items} />
    </div>
  );
}

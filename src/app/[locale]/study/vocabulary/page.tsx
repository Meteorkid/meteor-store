import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/auth';
import { buildLoginHref } from '@/lib/login-return';
import { listVocabulary } from '@/lib/study/vocabulary-service';
import VocabularyManager from '@/components/study/VocabularyManager';
import { vocabularyText } from '@/components/study/vocabulary-text';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = vocabularyText[locale === 'en' ? 'en' : 'zh'];
  return { title: copy.metaTitle, description: copy.metaDescription, robots: { index: false, follow: false } };
}

export default async function VocabularyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale === 'en' ? 'en' : 'zh';
  const copy = vocabularyText[typedLocale];
  const session = await getSession();
  if (!session) redirect({ href: buildLoginHref('/study/vocabulary'), locale });
  const ownerId = session!.userId;
  const [result] = await Promise.allSettled([listVocabulary(ownerId, { limit: 50 })]);
  return <div className="mx-auto max-w-4xl">
    <header className="mb-10 border-b border-white/10 pb-9">
      <p className="t-eyebrow text-violet-300">{copy.eyebrow}</p>
      <h1 className="mt-3 t-title-1 text-white">{copy.title}</h1>
      <p className="mt-4 max-w-3xl t-body text-white/60">{copy.description}</p>
    </header>
    <VocabularyManager initialData={result.status === 'fulfilled' ? result.value : null} ownerId={ownerId} locale={typedLocale} />
  </div>;
}

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import BlogPageShell from '@/components/blog/BlogPageShell';
import StarMap from '@/components/StarMap';
import { getFeedPosts } from '@/data/blog-feed';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'StarMap' });
  return { title: t('title'), description: t('description') };
}

export default async function BlogStarsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'StarMap' });
  const posts = await getFeedPosts(locale as Locale);

  return (
    <BlogPageShell
      locale={locale as Locale}
      activeStarMap
      header={
        <header className="relative mb-8">
          <h1 className="t-title-2">{t('title')}</h1>
          <p className="t-footnote mt-2 text-white/60">{t('description')}</p>
        </header>
      }
    >
      <div className="w-full">
        <StarMap posts={posts} />

        <p className="t-footnote mt-4 text-white/40">{t('hint')}</p>
      </div>
    </BlogPageShell>
  );
}

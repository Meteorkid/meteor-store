import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TagDirectory from '@/components/TagDirectory';
import { getFeedTags } from '@/data/blog-feed';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogTagsPage' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function BlogTagsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'BlogTagsPage' });
  const tags = await getFeedTags(locale as Locale);

  return (
    <div className="blog-scope min-h-screen bg-black text-white">
      <Header />
      <main className="relative container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-4xl">
          <header className="relative mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="t-title-2">{t('title')}</h1>
              <span aria-hidden className="t-footnote text-white/20">/</span>
              <p className="t-footnote text-white/60">{t('hint')}</p>
            </div>
            <Link
              href="/blog"
              className="t-footnote shrink-0 text-white/60 transition-colors duration-200 hover:text-white"
            >
              {t('backToBlog')}
            </Link>
          </header>

          <TagDirectory tags={tags} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

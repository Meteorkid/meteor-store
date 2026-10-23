import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogList from '@/components/BlogList';
import { findFeedTag, getFeedTags } from '@/data/blog-feed';
import { getSectionBySlug } from '@/data/blog-sections';
import { routing, type Locale } from '@/i18n/routing';
import { SITE_URL } from '@/lib/constants';

interface TagPageProps {
  params: Promise<{ locale: string; tag: string }>;
  searchParams: Promise<{ section?: string }>;
}

// 构建时预渲染已有标签；投稿带来的新标签走按需渲染，审核通过时 revalidate
export async function generateStaticParams() {
  const localizedTags = await Promise.all(routing.locales.map(async locale => {
    const tags = await getFeedTags(locale);
    return tags.map(tag => ({ locale, tag: tag.label }));
  }));
  return localizedTags.flat();
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { locale, tag: tagParam } = await params;
  const localizedTags = await Promise.all(routing.locales.map(async tagLocale => ({
    locale: tagLocale, tag: await findFeedTag(tagLocale, decodeURIComponent(tagParam)),
  })));
  const tag = localizedTags.find(item => item.locale === locale)?.tag;
  const t = await getTranslations({ locale, namespace: 'BlogTagPage' });
  if (!tag) return { title: t('notFound'), robots: { index: false, follow: false } };
  const canonical = `${SITE_URL}/${locale}${tag.href}`;
  const languages = Object.fromEntries(localizedTags.flatMap(item =>
    item.tag ? [[item.locale, `${SITE_URL}/${item.locale}${item.tag.href}`]] : []));
  return {
    title: `#${tag.label} - ${t('blogSuffix')}`,
    description: t('description', { tag: tag.label, count: tag.count }),
    alternates: { canonical, languages: { ...languages, 'x-default': languages.zh ?? languages.en ?? canonical } },
  };
}

export default async function BlogTagPage({ params, searchParams }: TagPageProps) {
  const { locale, tag: tagParam } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'BlogTagPage' });
  const tag = await findFeedTag(locale as Locale, decodeURIComponent(tagParam));
  if (!tag) notFound();

  // 双重筛选：标签固定为当前路由，分区可选 ?section= 叠加
  const section = sp.section ? getSectionBySlug(sp.section) : undefined;

  return (
    <div className="blog-scope min-h-screen bg-black text-white">
      <Header />
      <main className="relative container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-4xl">
          <header className="relative mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="t-title-2">#{tag.label}</h1>
              <span aria-hidden className="t-footnote text-white/20">/</span>
              <p className="t-footnote tabular-nums text-white/60">{t('count', { count: tag.count })}</p>
            </div>
            <Link
              href="/blog/tags"
              className="t-footnote shrink-0 text-white/60 transition-colors duration-200 hover:text-white"
            >
              {t('allTags')} →
            </Link>
          </header>

          <BlogList
            initialTags={[tag]}
            sectionId={section?.id}
            locale={locale as Locale}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

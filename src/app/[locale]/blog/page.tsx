import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import BlogList from '@/components/BlogList';
import BlogPageShell from '@/components/blog/BlogPageShell';
import { Link } from '@/i18n/navigation';
import { findFeedTags } from '@/data/blog-feed';
import { buildOpenGraphMetadata } from '@/lib/seo';
import { getSectionBySlug } from '@/data/blog-sections';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogPage' });

  return {
    title: t('title'),
    description: t('description'),
    ...buildOpenGraphMetadata({ title: t('title'), description: t('description'), path: `/${locale}/blog`, locale }),
    alternates: {
      types: { 'application/rss+xml': `/${locale}/blog/feed.xml` },
    },
  };
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ section?: string; tags?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: 'BlogPage' });

  // 分区筛选走服务端；标签从 ?tags=a,b 逗号分隔带入，客户端继续原位增删
  const section = sp.section ? getSectionBySlug(sp.section) : undefined;
  const initialTags = sp.tags
    ? await findFeedTags(locale as Locale, sp.tags.split(',').filter(Boolean))
    : [];

  const header = (
    <header className="pb-5 md:pb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h1 className="t-title-2 text-white">{t('title')}</h1>
            <p className="t-footnote max-w-xl text-white/55">{t('description')}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/blog/submit"
            className="inline-flex min-h-11 items-center rounded-lg bg-white px-4 text-sm font-semibold text-black transition-colors hover:bg-white/85"
          >
            {t('submit')}
          </Link>
          <Link
            href="/blog/my-posts"
            className="inline-flex min-h-11 items-center rounded-lg border border-white/15 bg-white/[0.04] px-4 text-sm font-medium text-white transition-colors hover:bg-white/[0.08]"
          >
            {t('myPosts')}
          </Link>
          <a
            href={`/${locale}/blog/feed.xml`}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-4 text-sm font-medium text-white/75 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            <span aria-hidden>◉</span>
            RSS
          </a>
        </div>
      </div>
    </header>
  );

  return (
    <BlogPageShell
      locale={locale as Locale}
      activeSectionId={section?.id}
      header={header}
    >
      <div className="w-full">
        <BlogList
          locale={locale as Locale}
          sectionId={section?.id}
          initialTags={initialTags}
        />
      </div>
    </BlogPageShell>
  );
}

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogList from '@/components/BlogList';
import TopicProposalForm from '@/components/TopicProposalForm';
import { findFeedTag } from '@/data/blog-feed';
import { blogScopeStyle, blogSections, getSectionBySlug } from '@/data/blog-sections';
import { routing, type Locale } from '@/i18n/routing';

interface SectionPageProps {
  params: Promise<{ locale: string; section: string }>;
  searchParams: Promise<{ tag?: string }>;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    blogSections.map((s) => ({ locale, section: s.slug }))
  );
}

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { locale, section: slug } = await params;
  const section = getSectionBySlug(slug);
  const t = await getTranslations({ locale, namespace: 'BlogSectionPage' });
  return section
    ? {
        title: `${section.label[locale as Locale]} - ${t('blogSuffix')}`,
        description: section.description[locale as Locale],
        alternates: {
          types: { 'application/rss+xml': `/blog/section/${section.slug}/feed.xml` },
        },
      }
    : { title: t('notFound') };
}

export default async function BlogSectionPage({ params, searchParams }: SectionPageProps) {
  const { locale, section: slug } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'BlogSectionPage' });
  const section = getSectionBySlug(slug);
  if (!section) notFound();

  // 双重筛选：分区固定为当前路由，标签可选 ?tag= 叠加
  const tag = sp.tag ? await findFeedTag(locale as Locale, sp.tag) : undefined;

  return (
    <div className="blog-scope min-h-screen bg-black text-white" style={blogScopeStyle(section.id)}>
      <Header />
      <main className="relative container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-4xl">
          {/* 分区身份靠色点和工具条里的高亮表达，不需要巨幅标题 */}
          <header className="relative mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="t-title-2 flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: `rgb(${section.rgb})` }}
                />
                {section.label[locale as Locale]}
              </h1>
              <span aria-hidden className="t-footnote text-white/20">/</span>
              <p className="t-footnote text-white/60">{section.description[locale as Locale]}</p>
            </div>
            <a
              href={`/blog/section/${section.slug}/feed.xml`}
              className="t-footnote shrink-0 text-white/60 transition-colors duration-200 hover:text-white/70"
            >
              <span aria-hidden>◉</span> {t('subscribe')}
            </a>
          </header>

          <BlogList
            sectionId={section.id}
            activeTag={tag ? { key: tag.key, label: tag.label } : null}
            locale={locale as Locale}
          />

          {section.allowProposals && (
            <div className="mt-16">
              <TopicProposalForm sectionId={section.id} sectionLabel={section.label[locale as Locale]} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

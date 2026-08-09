import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogList from '@/components/BlogList';
import TopicProposalForm from '@/components/TopicProposalForm';
import { findFeedTags } from '@/data/blog-feed';
import { blogScopeStyle, blogSections, getSectionBySlug } from '@/data/blog-sections';
import { FOUR_SYMBOLS } from '@/data/celestial';
import { routing, type Locale } from '@/i18n/routing';

interface SectionPageProps {
  params: Promise<{ locale: string; section: string }>;
  searchParams: Promise<{ tags?: string }>;
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

  // 分区固定为当前路由；?tags=a,b 逗号分隔带入初始标签，客户端继续原位增删
  const initialTags = sp.tags
    ? await findFeedTags(locale as Locale, sp.tags.split(',').filter(Boolean))
    : [];
  const starSymbol = section.star ? FOUR_SYMBOLS[section.star.symbolId] : undefined;
  const starLabel = section.star
    ? `${section.star.sus[locale as Locale]} · ${section.star.beast[locale as Locale]}`
    : undefined;
  const starReason = section.star?.reason[locale as Locale];

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
              {section.star && starSymbol && starLabel && starReason && (
                <span className="group relative inline-flex">
                  <span
                    tabIndex={0}
                    aria-describedby={`star-reason-${section.id}`}
                    aria-label={`${t('starTooltip')}：${starLabel}。${starReason}`}
                    className="t-footnote inline-flex items-center gap-1.5 rounded-full border bg-white/[0.04] px-2.5 py-1 text-white/65 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/50"
                    style={{
                      borderColor: `rgb(${starSymbol.rgb} / 0.45)`,
                      boxShadow: `inset 0 0 16px rgb(${starSymbol.rgb} / 0.06)`,
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      style={{ color: `rgb(${starSymbol.rgb})` }}
                    >
                      <path d="M12 2l2.9 6.26 6.6.64-5 4.4 1.5 6.5L12 16.9 5.99 19.8 7.5 13.3l-5-4.4 6.6-.64z" />
                    </svg>
                    {starLabel}
                  </span>
                  <span
                    id={`star-reason-${section.id}`}
                    role="tooltip"
                    className="pointer-events-none absolute left-0 top-full z-30 mt-2 w-max max-w-[min(18rem,calc(100vw-2rem))] translate-y-1 rounded-xl border border-white/10 bg-black/90 px-3 py-2 text-xs leading-relaxed text-white/75 opacity-0 shadow-xl backdrop-blur-md transition-[opacity,transform] duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
                  >
                    {starReason}
                  </span>
                </span>
              )}
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
            initialTags={initialTags}
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

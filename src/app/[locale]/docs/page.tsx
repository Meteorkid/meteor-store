import type { Metadata } from 'next';
import { buildOpenGraphMetadata } from '@/lib/seo';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { helpCategories, localizeHelpArticles } from '@/data/help-articles';
import { buildHelpSearchEntries } from '@/data/help-search.server';
import HelpCenterSearch from '@/components/help/HelpCenterSearch';
import HelpCosmicBg from '@/components/help/HelpCosmicBg';
import { OpenInPanelButton } from '@/components/help/OpenInPanelButton';
import { SectionMasthead, SectionTabs } from '@/components/section/SectionPage';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { SHOW_PRICING } from '@/lib/constants';

interface DocsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ params }: DocsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'DocsPage' });

  return {
    title: t('title'),
    description: t('description'),
    ...buildOpenGraphMetadata({ title: t('title'), description: t('description'), path: `/${locale}/docs`, locale }),
  };
}

export default async function DocsPage({ params, searchParams }: DocsPageProps) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);
  const currentLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: 'DocsPage' });
  const articles = localizeHelpArticles(currentLocale, SHOW_PRICING);
  const searchEntries = buildHelpSearchEntries(currentLocale, SHOW_PRICING);
  const isZh = currentLocale === 'zh';

  const populatedCategories = helpCategories
    .map((category) => ({
      ...category,
      articles: articles.filter((article) => article.category === category.id),
    }))
    .filter((category) => category.articles.length > 0);

  const featuredArticles = articles.filter((a) => a.featured).slice(0, 4);

  return (
    <div className="min-h-screen bg-black text-white">
      <HelpCosmicBg />
      <Header />
      <main className="relative overflow-hidden" style={{ zIndex: 1 }}>
        <div aria-hidden className="site-glow-top pointer-events-none absolute inset-x-0 top-0 h-[42rem]" />

        <SectionMasthead
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
          accent="226 232 240"
          aside={(
            <div>
              <HelpCenterSearch
                entries={searchEntries}
                placeholder={isZh ? '搜索帮助文章…' : 'Search help articles…'}
                noResults={isZh ? '未找到相关文章，试试其他关键词或提交反馈' : 'No results found. Try different keywords or submit feedback.'}
                initialQuery={typeof q === 'string' ? q : undefined}
              />
              <p className="mt-2 t-footnote text-white/60">
                {isZh ? '支持标题、摘要与关键词；也可以直接按分类浏览。' : 'Search titles, excerpts, and keywords, or browse by category.'}
              </p>
            </div>
          )}
        />

        <SectionTabs
          ariaLabel={isZh ? '帮助分类' : 'Help categories'}
          items={populatedCategories.map((category) => ({
            href: `#${category.id}`,
            label: category.label[currentLocale],
            count: category.articles.length,
          }))}
        />

        <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 md:pb-20 md:pt-12">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-14">
            <div className="min-w-0 space-y-14">
              {populatedCategories.map((category) => (
                <section
                  key={category.id}
                  id={category.id}
                  className="scroll-mt-24"
                  aria-labelledby={`help-category-${category.id}`}
                >
                  <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-white/10 pb-4">
                    <h2 id={`help-category-${category.id}`} className="t-title-3 text-white">
                      {category.label[currentLocale]}
                    </h2>
                    <span className="t-footnote tabular-nums text-white/60">{category.articles.length}</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {category.articles.map((article) => (
                      <article
                        key={article.slug}
                        className="glass-card group relative overflow-hidden rounded-2xl p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="t-title-4 mb-1.5 text-white/85 transition-colors duration-200 group-hover:text-white">
                              <Link
                                href={`/docs/${article.slug}`}
                                className="outline-none after:absolute after:inset-0 after:z-[1] after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-violet-300"
                              >
                                {article.title}
                              </Link>
                            </h3>
                            <p className="t-footnote line-clamp-2 text-pretty text-white/60">{article.excerpt}</p>
                          </div>
                          <div className="mt-1 flex shrink-0 items-center gap-1">
                            <OpenInPanelButton slug={article.slug} variant="icon" className="relative z-10" />
                            <span aria-hidden className="text-white/25 transition-colors duration-300 group-hover:text-violet-300/70">
                              →
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <aside className="min-w-0 space-y-6 lg:sticky lg:top-24">
              {featuredArticles.length > 0 && (
                <div className="glass-card rounded-2xl p-5">
                  <p className="t-eyebrow text-violet-300">{isZh ? '热门推荐' : 'Popular'}</p>
                  <div className="mt-4 space-y-4">
                    {featuredArticles.map((article) => (
                      <Link key={article.slug} href={`/docs/${article.slug}`} className="group block">
                        <h3 className="t-title-4 text-white/85 transition-colors group-hover:text-white">{article.title}</h3>
                        <p className="mt-1 t-footnote line-clamp-2 text-white/55">{article.excerpt}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="glass-card relative overflow-hidden rounded-2xl p-5">
                <p className="t-eyebrow text-violet-300">{t('feedbackEyebrow')}</p>
                <h2 className="mt-3 t-title-4 text-white">{t('notFound')}</h2>
                <p className="mt-2 t-footnote text-pretty text-white/60">{t('checkReadme')}</p>
                <Link
                  href="/feedback?type=question"
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/85"
                >
                  {t('submitQuestion')}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { helpCategories, localizeHelpArticles, isHelpArticleVisible } from '@/data/help-articles';
import { buildHelpSearchEntries } from '@/data/help-search.server';
import HelpCenterSearch from '@/components/help/HelpCenterSearch';
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

  const populatedCategories = helpCategories
    .map((category) => ({
      ...category,
      articles: articles.filter((article) => article.category === category.id),
    }))
    .filter((category) => category.articles.length > 0);

  const featuredArticles = articles.filter((a) => a.featured);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="relative overflow-hidden">
        {/* 背景光晕 — 覆盖搜索区卡高度 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.16),transparent_68%)]"
        />
        <div className="container relative mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto max-w-5xl">

            {/* 页面头部 */}
            <header className="mb-10 max-w-3xl md:mb-14">
              <p className="t-eyebrow mb-4 text-violet-300">{t('eyebrow')}</p>
              <h1 className="t-title-1 mb-5 text-white">{t('title')}</h1>
              <p className="t-body max-w-2xl text-white/60">{t('description')}</p>
            </header>

            {/* 搜索 */}
            <div className="mb-12 max-w-2xl">
              <HelpCenterSearch
                entries={searchEntries}
                placeholder={currentLocale === 'zh' ? '搜索帮助文章…' : 'Search help articles…'}
                noResults={currentLocale === 'zh' ? '未找到相关文章，试试其他关键词或提交反馈' : 'No results found. Try different keywords or submit feedback.'}
                initialQuery={typeof q === 'string' ? q : undefined}
              />
            </div>

            {/* 热门推荐 */}
            {featuredArticles.length > 0 && (
              <section className="mb-16" aria-labelledby="featured-heading">
                <p className="t-eyebrow mb-4 text-violet-300">
                  {currentLocale === 'zh' ? '热门推荐' : 'Popular'}
                </p>
                <h2 id="featured-heading" className="sr-only">
                  {currentLocale === 'zh' ? '热门帮助文章' : 'Popular help articles'}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {featuredArticles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/docs/${article.slug}`}
                      className="glass-card group block rounded-2xl p-5 outline-none motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      <div className="relative z-10">
                        <h3 className="t-title-4 mb-2 text-white/90 transition-colors duration-200 group-hover:text-white">
                          {article.title}
                        </h3>
                        <p className="t-footnote text-white/50">{article.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 分类导航锚点 */}
            <nav className="mb-14" aria-label={currentLocale === 'zh' ? '帮助分类' : 'Help categories'}>
              <ul className="flex flex-wrap gap-2">
                {populatedCategories.map((category) => (
                  <li key={category.id}>
                    <a
                      href={`#${category.id}`}
                      className="inline-block rounded-full border border-white/10 px-4 py-1.5 text-sm text-white/60 outline-none transition-colors hover:border-violet-400/40 hover:text-white/90 focus-visible:ring-2 focus-visible:ring-violet-300"
                    >
                      {category.label[currentLocale]}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* 完整教程库 — 纵向全宽区块 */}
            <div className="space-y-16">
              {populatedCategories.map((category) => (
                <section
                  key={category.id}
                  id={category.id}
                  className="scroll-mt-24"
                  aria-labelledby={`help-category-${category.id}`}
                >
                  <div className="mb-7 flex items-center justify-between">
                    <h2 id={`help-category-${category.id}`} className="t-title-2 text-white">
                      {category.label[currentLocale]}
                    </h2>
                    <span className="t-footnote tabular-nums text-white/20">
                      {category.articles.length}
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {category.articles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/docs/${article.slug}`}
                        className="group block rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 outline-none transition-colors hover:border-white/[0.14] hover:bg-white/[0.03] motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="t-title-4 mb-1.5 text-white/85 transition-colors duration-200 group-hover:text-white">
                              {article.title}
                            </h3>
                            <p className="t-footnote line-clamp-2 text-white/50">
                              {article.excerpt}
                            </p>
                          </div>
                          <span
                            aria-hidden
                            className="mt-1 shrink-0 text-white/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-violet-200 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                          >
                            →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* 底部反馈区 */}
            <section className="relative mt-20 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] px-6 py-10 text-center md:px-12 md:py-14">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.18),transparent_62%)]"
              />
              <div className="relative">
                <p className="t-eyebrow mb-3 text-violet-300">{t('feedbackEyebrow')}</p>
                <h2 className="t-title-2 mb-3 text-white">{t('notFound')}</h2>
                <p className="t-body mx-auto mb-7 max-w-xl text-white/60">{t('checkReadme')}</p>
                <Link
                  href="/feedback?type=question"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black outline-none transition-colors hover:bg-white/85 focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  {t('submitQuestion')}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

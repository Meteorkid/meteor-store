import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { helpCategories, localizeHelpArticles, isHelpArticleVisible } from '@/data/help-articles';
import { buildHelpSearchEntries } from '@/data/help-search.server';
import HelpCenterSearch from '@/components/help/HelpCenterSearch';
import HelpCosmicBg from '@/components/help/HelpCosmicBg';
import { MeteorTrail, StarDust, ConstellationDot, SectionDivider } from '@/components/help/HelpDecorations';
import { OpenInPanelButton } from '@/components/help/OpenInPanelButton';
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
      <HelpCosmicBg />
      <Header />
      <main className="relative overflow-hidden" style={{ zIndex: 1 }}>
        {/* 顶部星云光晕 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[44rem] bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(88,28,135,0.2),transparent_55%),radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(139,92,246,0.12),transparent_60%)]"
        />
        <div className="container relative mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto max-w-5xl">

            {/* 页面头部 — 星座点缀 */}
            <header className="mb-10 max-w-3xl md:mb-14">
              <div className="mb-4 flex items-center gap-2" aria-hidden="true">
                <ConstellationDot active />
                <div className="h-px w-8 bg-gradient-to-r from-violet-400/40 to-transparent" />
                <ConstellationDot />
                <div className="h-px w-16 bg-gradient-to-r from-violet-400/20 to-transparent" />
              </div>
              <p className="t-eyebrow mb-4 text-violet-300">{t('eyebrow')}</p>
              <h1 className="t-title-1 mb-5 text-white">{t('title')}</h1>
              <p className="t-body max-w-2xl text-white/60">{t('description')}</p>
            </header>

            {/* 搜索 — 星芒光晕 */}
            <div className="relative mb-12 max-w-2xl">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-4 rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.1),transparent_70%)] opacity-0 transition-opacity duration-500 has-[:focus]:opacity-100"
                style={{ zIndex: -1 }}
              />
              <HelpCenterSearch
                entries={searchEntries}
                placeholder={currentLocale === 'zh' ? '搜索帮助文章…' : 'Search help articles…'}
                noResults={currentLocale === 'zh' ? '未找到相关文章，试试其他关键词或提交反馈' : 'No results found. Try different keywords or submit feedback.'}
                initialQuery={typeof q === 'string' ? q : undefined}
              />
            </div>

            {/* 分类导航 — 星宿节点连线 */}
            <nav className="mb-14" aria-label={currentLocale === 'zh' ? '帮助分类' : 'Help categories'}>
              <div className="flex flex-wrap items-center gap-2">
                {populatedCategories.map((category, i) => (
                  <span key={category.id} className="flex items-center gap-2">
                    <a
                      href={`#${category.id}`}
                      className="group relative inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-1.5 text-sm text-white/50 outline-none backdrop-blur-sm transition-all duration-300 hover:border-violet-400/40 hover:bg-white/[0.05] hover:text-white/85 hover:shadow-[0_0_12px_rgba(139,92,246,0.15)] focus-visible:ring-2 focus-visible:ring-violet-300"
                    >
                      <span
                        aria-hidden
                        className="inline-block h-1.5 w-1.5 rounded-full bg-white/20 transition-all duration-300 group-hover:bg-violet-300 group-hover:shadow-[0_0_6px_rgba(196,181,253,0.6)]"
                      />
                      {category.label[currentLocale]}
                    </a>
                    {i < populatedCategories.length - 1 && (
                      <span aria-hidden className="hidden h-px w-4 bg-gradient-to-r from-violet-400/15 to-transparent sm:inline-block" />
                    )}
                  </span>
                ))}
              </div>
            </nav>

            {/* 热门推荐 — 流星尾迹 */}
            {featuredArticles.length > 0 && (
              <section className="mb-20" aria-labelledby="featured-heading">
                <div className="mb-5 flex items-center gap-2">
                  <MeteorTrail className="h-5 w-5" />
                  <p className="t-eyebrow text-violet-300">
                    {currentLocale === 'zh' ? '热门推荐' : 'Popular'}
                  </p>
                </div>
                <h2 id="featured-heading" className="sr-only">
                  {currentLocale === 'zh' ? '热门帮助文章' : 'Popular help articles'}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {featuredArticles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/docs/${article.slug}`}
                      className="glass-card group relative block overflow-hidden rounded-2xl p-5 outline-none motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      {/* 流星 hover 装饰 */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none"
                      >
                        <div className="h-px w-full origin-bottom-left rotate-45 bg-gradient-to-r from-transparent via-violet-400/20 to-violet-300/40" />
                        <div className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-violet-300/60 shadow-[0_0_8px_rgba(196,181,253,0.4)]" />
                      </div>
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

            <SectionDivider />

            {/* 完整教程库 — 星座卡片 */}
            <div className="mt-16 space-y-20">
              {populatedCategories.map((category) => (
                <section
                  key={category.id}
                  id={category.id}
                  className="scroll-mt-24"
                  aria-labelledby={`help-category-${category.id}`}
                >
                  <div className="mb-7 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StarDust />
                      <h2 id={`help-category-${category.id}`} className="t-title-2 text-white">
                        {category.label[currentLocale]}
                      </h2>
                    </div>
                    <span className="t-footnote tabular-nums rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-0.5 text-white/30 backdrop-blur-sm">
                      {category.articles.length}
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {category.articles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/docs/${article.slug}`}
                        className="group relative block overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.01] p-5 outline-none backdrop-blur-sm transition-all duration-300 hover:border-violet-400/20 hover:bg-white/[0.03] hover:shadow-[0_0_20px_rgba(139,92,246,0.06)] motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      >
                        {/* 左上角星点 */}
                        <div
                          aria-hidden
                          className="absolute left-3 top-3 h-1 w-1 rounded-full bg-white/0 transition-all duration-500 group-hover:bg-violet-300/50 group-hover:shadow-[0_0_6px_rgba(196,181,253,0.3)]"
                        />
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="t-title-4 mb-1.5 text-white/80 transition-colors duration-200 group-hover:text-white">
                              {article.title}
                            </h3>
                            <p className="t-footnote line-clamp-2 text-white/45">
                              {article.excerpt}
                            </p>
                          </div>
                          {/* 操作按钮组 */}
                          <div className="mt-1 flex shrink-0 items-center gap-1">
                            <OpenInPanelButton slug={article.slug} variant="icon" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 motion-reduce:transition-none" />
                            <span
                              aria-hidden
                              className="text-white/25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-violet-300/70 group-hover:drop-shadow-[0_0_4px_rgba(196,181,253,0.3)] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                            >
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M5 12h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="18.5" cy="12" r="1.5" fill="currentColor" opacity="0.3" />
                              </svg>
                            </span>
                          </div>
                          </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* 底部反馈区 — 星云 + 流星 */}
            <section className="relative mt-24 overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] px-6 py-12 text-center backdrop-blur-sm md:px-12 md:py-16">
              {/* 星云背景 */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(139,92,246,0.22),transparent_58%),radial-gradient(circle_at_85%_20%,rgba(168,85,247,0.1),transparent_30%)]"
              />
              {/* 流星划过 */}
              <div aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 opacity-40">
                <div className="h-px w-full origin-bottom-left -rotate-45 bg-gradient-to-r from-transparent via-violet-400/30 to-violet-300/60" />
                <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-violet-300/50 shadow-[0_0_12px_rgba(196,181,253,0.4)]" />
              </div>
              {/* 星点装饰 */}
              <div aria-hidden className="pointer-events-none absolute bottom-6 left-6 flex gap-3">
                <ConstellationDot active />
                <ConstellationDot />
                <ConstellationDot />
              </div>
              <div className="relative">
                <p className="t-eyebrow mb-3 text-violet-300">{t('feedbackEyebrow')}</p>
                <h2 className="t-title-2 mb-3 text-white">{t('notFound')}</h2>
                <p className="t-body mx-auto mb-7 max-w-xl text-white/60">{t('checkReadme')}</p>
                <Link
                  href="/feedback?type=question"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black outline-none transition-all duration-300 hover:bg-white/85 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  {t('submitQuestion')}
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  >
                    →
                  </span>
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

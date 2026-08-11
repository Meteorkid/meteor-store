import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  helpCategories,
  findLocalizedHelpArticle,
  localizeHelpArticles,
} from '@/data/help-articles';
import { getHelpArticle, getRelatedHelpArticles } from '@/data/help';
import { renderHelpMarkdown, type HelpHeading } from '@/lib/help-markdown';
import HelpCosmicBg from '@/components/help/HelpCosmicBg';
import { StarDust, ConstellationDot, MeteorTrail } from '@/components/help/HelpDecorations';
import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { SITE_URL } from '@/lib/constants';

interface HelpArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    localizeHelpArticles(locale).map((article) => ({ locale, slug: article.slug }))
  );
}

export async function generateMetadata({
  params,
}: HelpArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = findLocalizedHelpArticle(slug, locale as Locale);

  if (!article) {
    return {
      title: locale === 'zh' ? '未找到帮助文章' : 'Help article not found',
    };
  }

  const articlePath = `/docs/${article.slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.keywords,
    alternates: {
      canonical: `${SITE_URL}/${locale}${articlePath}`,
      languages: {
        zh: `${SITE_URL}/zh${articlePath}`,
        en: `${SITE_URL}/en${articlePath}`,
      },
    },
  };
}

export default async function HelpArticlePage({ params }: HelpArticlePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const currentLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: 'HelpArticlePage' });
  const article = await getHelpArticle(currentLocale, slug);

  if (!article) notFound();

  const category = helpCategories.find((item) => item.id === article.category);
  if (!category) notFound();

  const categoryLabel = category.label[currentLocale];
  const relatedArticles = await getRelatedHelpArticles(currentLocale, article);

  const { html, headings } = renderHelpMarkdown({
    content: article.content,
    slug: article.slug,
    locale: currentLocale,
  });

  const hasToc = headings.length > 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <HelpCosmicBg />
      <Header />
      <main className="relative" style={{ zIndex: 1 }}>
        {/* 顶部星云 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(88,28,135,0.18),transparent_55%)]"
        />

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="mx-auto max-w-6xl">
            <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
              {/* 正文区域 */}
              <article className="min-w-0">
                {/* 面包屑 — 星标分隔 */}
                <nav aria-label={t('breadcrumbsLabel')} className="mb-10">
                  <ol className="t-footnote flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-white/60">
                    <li>
                      <Link
                        href="/docs"
                        className="rounded-sm outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-violet-300"
                      >
                        {t('helpCenter')}
                      </Link>
                    </li>
                    <li aria-hidden>
                      <StarDust className="text-[10px]" />
                    </li>
                    <li>
                      <Link
                        href={`/docs#${category.id}`}
                        className="rounded-sm outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-violet-300"
                      >
                        {categoryLabel}
                      </Link>
                    </li>
                    <li aria-hidden>
                      <StarDust className="text-[10px]" />
                    </li>
                    <li className="min-w-0 text-white/70" aria-current="page">
                      <span className="line-clamp-1">{article.title}</span>
                    </li>
                  </ol>
                </nav>

                {/* 文章头部 — 星宿装饰 */}
                <header className="mb-12 border-b border-white/[0.06] pb-10">
                  <div className="t-footnote mb-5 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/[0.04] px-2.5 py-0.5 text-violet-300">
                      <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-violet-300/60 shadow-[0_0_4px_rgba(196,181,253,0.4)]" />
                      {categoryLabel}
                    </span>
                    <span aria-hidden>
                      <ConstellationDot />
                    </span>
                    <span className="rounded-full border border-white/[0.06] bg-white/[0.015] px-2.5 py-0.5 text-white/45">
                      {kindLabel(article.kind, currentLocale)}
                    </span>
                    <span aria-hidden>
                      <ConstellationDot />
                    </span>
                    <span className="tabular-nums text-white/50">
                      {currentLocale === 'zh'
                        ? `${article.readingMinutes} 分钟阅读`
                        : `${article.readingMinutes} min read`}
                    </span>
                    <span aria-hidden>
                      <ConstellationDot />
                    </span>
                    <time dateTime={article.updatedAt} className="tabular-nums text-white/50">
                      {formatHelpDate(article.updatedAt, currentLocale)}
                    </time>
                  </div>

                  <h1 className="t-title-1 mb-4 text-white">{article.title}</h1>
                  <p className="t-body max-w-3xl text-white/60">{article.excerpt}</p>
                </header>

                {/* 文章正文 */}
                <div
                  className="help-content prose prose-invert prose-violet max-w-none"
                  dangerouslySetInnerHTML={{ __html: html }}
                />

                {/* 相关文章 — 邻近星体 */}
                {relatedArticles.length > 0 && (
                  <section className="mt-20 border-t border-white/[0.06] pt-12">
                    <div className="mb-5 flex items-center gap-2">
                      <MeteorTrail className="h-4 w-4" />
                      <h2 className="t-eyebrow text-violet-300">
                        {currentLocale === 'zh' ? '相关文章' : 'Related articles'}
                      </h2>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {relatedArticles.map((related) => (
                        <Link
                          key={related.slug}
                          href={`/docs/${related.slug}`}
                          className="group relative block overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.01] px-4 py-3.5 outline-none backdrop-blur-sm transition-all duration-300 hover:border-violet-400/20 hover:bg-white/[0.03] focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        >
                          <div
                            aria-hidden
                            className="absolute left-2 top-2 h-1 w-1 rounded-full bg-white/0 transition-all duration-500 group-hover:bg-violet-300/40 group-hover:shadow-[0_0_4px_rgba(196,181,253,0.2)]"
                          />
                          <p className="t-title-4 text-white/80 transition-colors duration-200 group-hover:text-white">
                            {related.title}
                          </p>
                          <p className="t-footnote mt-1 line-clamp-1 text-white/45">{related.excerpt}</p>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {/* 仍未解决 — 星云 CTA */}
                <section className="relative mt-16 overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] px-6 py-10 text-center backdrop-blur-sm md:px-10">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(139,92,246,0.2),transparent_55%),radial-gradient(circle_at_85%_80%,rgba(168,85,247,0.08),transparent_30%)]"
                  />
                  <div aria-hidden className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 opacity-30">
                    <div className="h-px w-full origin-bottom-left -rotate-45 bg-gradient-to-r from-transparent via-violet-400/25 to-violet-300/50" />
                    <div className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-violet-300/40 shadow-[0_0_8px_rgba(196,181,253,0.3)]" />
                  </div>
                  <div className="relative">
                    <h2 className="t-title-2 mb-3 text-white">{t('unresolvedTitle')}</h2>
                    <p className="t-body mx-auto mb-6 max-w-xl text-white/60">
                      {t('unresolvedDescription')}
                    </p>
                    <Link
                      href={`/feedback?type=question&slug=${encodeURIComponent(article.slug)}`}
                      className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black outline-none transition-all duration-300 hover:bg-white/85 hover:shadow-[0_0_20px_rgba(255,255,255,0.12)] focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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

                {/* 返回链接 */}
                <div className="mt-12 border-t border-white/[0.06] pt-8">
                  <Link
                    href="/docs"
                    className="t-footnote group inline-flex items-center gap-2 rounded-sm text-white/50 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-violet-300"
                  >
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                    >
                      ←
                    </span>
                    {t('backToHelp')}
                  </Link>
                </div>
              </article>

              {/* 桌面端侧边目录 — 星图风格 */}
              {hasToc && (
                <aside className="hidden lg:block">
                  <div className="sticky top-24">
                    <div className="mb-4 flex items-center gap-2">
                      <ConstellationDot active />
                      <p className="t-eyebrow text-white/35">
                        {currentLocale === 'zh' ? '目录' : 'On this page'}
                      </p>
                    </div>
                    <nav className="relative">
                      {/* 连线 */}
                      <div
                        aria-hidden
                        className="absolute left-[3px] top-2 h-[calc(100%-16px)] w-px bg-gradient-to-b from-violet-400/15 via-violet-400/10 to-transparent"
                      />
                      <HelpTocList headings={headings} />
                    </nav>
                  </div>
                </aside>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': article.kind === 'troubleshooting' ? 'FAQPage' : 'HowTo',
            name: article.title,
            description: article.excerpt,
            url: `${SITE_URL}/${currentLocale}/docs/${article.slug}`,
            dateModified: article.updatedAt,
            ...(article.kind === 'troubleshooting'
              ? {
                  mainEntity: headings.map((h) => ({
                    '@type': 'Question',
                    name: h.text,
                    acceptedAnswer: { '@type': 'Answer', text: '' },
                  })),
                }
              : {
                  step: headings.map((h, i) => ({
                    '@type': 'HowToStep',
                    position: i + 1,
                    name: h.text,
                  })),
                }),
          }),
        }}
      />
    </div>
  );
}

/** 星图风格目录列表 */
function HelpTocList({ headings }: { headings: HelpHeading[] }) {
  return (
    <ul className="space-y-2.5">
      {headings.map((heading) => (
        <li
          key={heading.id}
          style={{ paddingLeft: heading.level === 3 ? '1rem' : '0' }}
          className="relative"
        >
          {/* 节点 */}
          <span
            aria-hidden
            className="absolute left-0 top-[0.6rem] h-1.5 w-1.5 rounded-full bg-white/15 transition-all duration-300 group-hover:bg-violet-300/60 group-hover:shadow-[0_0_4px_rgba(196,181,253,0.4)]"
            style={{ left: heading.level === 3 ? '0.5rem' : '0' }}
          />
          <a
            href={`#${heading.id}`}
            className="group t-footnote block rounded-sm py-1 pl-4 text-white/45 outline-none transition-colors hover:text-white/80 focus-visible:ring-2 focus-visible:ring-violet-300"
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

function kindLabel(kind: string, locale: Locale): string {
  const map: Record<string, { zh: string; en: string }> = {
    tutorial: { zh: '教程', en: 'Tutorial' },
    'how-to': { zh: '操作指南', en: 'How-to' },
    troubleshooting: { zh: '故障排查', en: 'Troubleshooting' },
    policy: { zh: '规则说明', en: 'Policy' },
  };
  return map[kind]?.[locale] ?? kind;
}

function formatHelpDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

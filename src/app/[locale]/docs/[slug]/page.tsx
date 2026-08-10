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
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
            {/* 正文区域 */}
            <article className="min-w-0">
              {/* 面包屑 */}
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
                  <li aria-hidden className="text-white/20">/</li>
                  <li>
                    <Link
                      href={`/docs#${category.id}`}
                      className="rounded-sm outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-violet-300"
                    >
                      {categoryLabel}
                    </Link>
                  </li>
                  <li aria-hidden className="text-white/20">/</li>
                  <li className="min-w-0 text-white/70" aria-current="page">
                    <span className="line-clamp-1">{article.title}</span>
                  </li>
                </ol>
              </nav>

              {/* 文章头部 */}
              <header className="mb-12 border-b border-white/[0.08] pb-10">
                <div className="t-footnote mb-5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-semibold text-violet-300">{categoryLabel}</span>
                  <span aria-hidden className="text-white/20">·</span>
                  <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-white/50">
                    {kindLabel(article.kind, currentLocale)}
                  </span>
                  <span aria-hidden className="text-white/20">·</span>
                  <span className="tabular-nums text-white/60">
                    {currentLocale === 'zh'
                      ? `${article.readingMinutes} 分钟阅读`
                      : `${article.readingMinutes} min read`}
                  </span>
                  <span aria-hidden className="text-white/20">·</span>
                  <time dateTime={article.updatedAt} className="tabular-nums text-white/60">
                    {t('updatedAt', {
                      date: formatHelpDate(article.updatedAt, currentLocale),
                    })}
                  </time>
                </div>
                <h1 className="t-title-1 mb-6 text-white">{article.title}</h1>
                <p className="t-body border-l-2 border-violet-400/50 pl-5 text-white/60">
                  {article.excerpt}
                </p>
              </header>

              {/* 移动端目录 (可折叠) */}
              {hasToc && (
                <details className="mb-10 rounded-2xl border border-white/10 bg-white/[0.02] lg:hidden">
                  <summary className="t-title-4 cursor-pointer list-none px-5 py-4 text-white/80 select-none">
                    {currentLocale === 'zh' ? '目录' : 'Table of Contents'}
                  </summary>
                  <nav className="border-t border-white/[0.08] px-5 py-4">
                    <HelpTocList headings={headings} />
                  </nav>
                </details>
              )}

              {/* 正文 */}
              <div
                className="prose prose-invert max-w-none prose-headings:text-white prose-h2:mt-14 prose-h2:mb-5 prose-h2:text-[clamp(1.5rem,_1.05rem_+_0.94vw,_1.875rem)] prose-h2:font-bold prose-h2:leading-[1.25] prose-h2:tracking-[-0.02em] prose-h3:mt-9 prose-h3:mb-3 prose-h3:text-[clamp(1.125rem,_1.6vw,_1.375rem)] prose-h3:font-semibold prose-h3:leading-[1.35] prose-h3:tracking-[-0.015em] prose-h3:text-white/85 prose-p:text-[1.0625rem] prose-p:leading-[1.8] prose-p:text-white/70 prose-li:text-[1.0625rem] prose-li:leading-[1.8] prose-li:text-white/70 prose-a:text-white prose-a:underline prose-a:decoration-white/25 prose-a:underline-offset-4 hover:prose-a:decoration-white prose-blockquote:border-l-2 prose-blockquote:border-violet-400/40 prose-blockquote:not-italic prose-blockquote:text-white/60 prose-strong:font-semibold prose-strong:text-white prose-code:rounded prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.9375rem] prose-code:text-emerald-300 prose-code:before:content-none prose-code:after:content-none prose-pre:overflow-x-auto prose-pre:rounded-2xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-white/[0.03] prose-hr:border-white/10 prose-img:h-auto prose-img:max-w-full prose-img:rounded-2xl prose-img:border prose-img:border-white/10"
                dangerouslySetInnerHTML={{ __html: html }}
              />

              {/* 相关文章 */}
              {relatedArticles.length > 0 && (
                <section className="mt-20" aria-labelledby="related-help-articles">
                  <p className="t-eyebrow mb-3 text-violet-300">{t('relatedEyebrow')}</p>
                  <h2 id="related-help-articles" className="t-title-2 mb-6 text-white">
                    {t('relatedTitle')}
                  </h2>
                  <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
                    {relatedArticles.map((relatedArticle) => (
                      <Link
                        key={relatedArticle.slug}
                        href={`/docs/${relatedArticle.slug}`}
                        className="group flex items-start gap-5 rounded-sm py-5 outline-none transition-colors hover:bg-white/[0.025] focus-visible:ring-2 focus-visible:ring-violet-300"
                      >
                        <div className="min-w-0 flex-1">
                          <h3 className="t-title-4 mb-1 text-white/90 transition-colors group-hover:text-white">
                            {relatedArticle.title}
                          </h3>
                          <p className="t-footnote line-clamp-2 text-white/60">
                            {relatedArticle.excerpt}
                          </p>
                        </div>
                        <span
                          aria-hidden
                          className="mt-1 shrink-0 text-white/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-violet-200 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                        >
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* 仍未解决 */}
              <section className="relative mt-16 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] px-6 py-9 text-center md:px-10">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.16),transparent_66%)]"
                />
                <div className="relative">
                  <h2 className="t-title-2 mb-3 text-white">{t('unresolvedTitle')}</h2>
                  <p className="t-body mx-auto mb-6 max-w-xl text-white/60">
                    {t('unresolvedDescription')}
                  </p>
                  <Link
                    href={`/feedback?type=question&slug=${encodeURIComponent(article.slug)}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black outline-none transition-colors hover:bg-white/85 focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    {t('submitQuestion')}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </section>

              {/* 返回链接 */}
              <div className="mt-12 border-t border-white/[0.08] pt-8">
                <Link
                  href="/docs"
                  className="t-footnote group inline-flex items-center gap-2 rounded-sm text-white/60 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-violet-300"
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

            {/* 桌面端侧边目录 */}
            {hasToc && (
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <p className="t-eyebrow mb-4 text-white/40">
                    {currentLocale === 'zh' ? '目录' : 'On this page'}
                  </p>
                  <nav>
                    <HelpTocList headings={headings} />
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* JSON-LD 结构化数据 */}
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

/** 目录列表 */
function HelpTocList({ headings }: { headings: HelpHeading[] }) {
  return (
    <ul className="space-y-2">
      {headings.map((heading) => (
        <li
          key={heading.id}
          style={{ paddingLeft: heading.level === 3 ? '1rem' : '0' }}
        >
          <a
            href={`#${heading.id}`}
            className="t-footnote block rounded-sm py-1 text-white/50 outline-none transition-colors hover:text-white/80 focus-visible:ring-2 focus-visible:ring-violet-300"
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** 文章类型本地化标签 */
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

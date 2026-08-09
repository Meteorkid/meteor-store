import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { helpCategories, localizeHelpArticles } from '@/data/help-articles';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

interface DocsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: DocsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'DocsPage' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const currentLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: 'DocsPage' });
  const articles = localizeHelpArticles(currentLocale);
  const populatedCategories = helpCategories
    .map((category) => ({
      ...category,
      articles: articles.filter((article) => article.category === category.id),
    }))
    .filter((category) => category.articles.length > 0);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.16),transparent_68%)]"
        />
        <div className="container relative mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto max-w-5xl">
            <header className="mb-14 max-w-3xl md:mb-20">
              <p className="t-eyebrow mb-4 text-violet-300">{t('eyebrow')}</p>
              <h1 className="t-title-1 mb-5 text-white">{t('title')}</h1>
              <p className="t-body max-w-2xl text-white/60">{t('description')}</p>
            </header>

            <div className="grid gap-x-12 gap-y-14 lg:grid-cols-2 lg:gap-y-16">
              {populatedCategories.map((category) => (
                <section
                  key={category.id}
                  id={category.id}
                  className="scroll-mt-24"
                  aria-labelledby={`help-category-${category.id}`}
                >
                  <h2 id={`help-category-${category.id}`} className="t-title-2 mb-6 text-white">
                    {category.label[currentLocale]}
                  </h2>
                  <ul className="space-y-4">
                    {category.articles.map((article) => (
                      <li key={article.slug}>
                        <Link
                          href={`/docs/${article.slug}`}
                          className="glass-card group block rounded-2xl p-5 outline-none motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        >
                          <div className="relative z-10 flex items-start gap-4">
                            <div className="min-w-0 flex-1">
                              <h3 className="t-title-4 mb-2 text-white/90 transition-colors duration-200 group-hover:text-white">
                                {article.title}
                              </h3>
                              <p className="t-footnote mb-4 text-white/60">{article.excerpt}</p>
                              <time
                                dateTime={article.updatedAt}
                                className="t-footnote tabular-nums text-white/60"
                              >
                                {t('updatedAt', {
                                  date: formatHelpDate(article.updatedAt, currentLocale),
                                })}
                              </time>
                            </div>
                            <span
                              aria-hidden
                              className="mt-1 shrink-0 text-white/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-violet-200 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                            >
                              →
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

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

function formatHelpDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

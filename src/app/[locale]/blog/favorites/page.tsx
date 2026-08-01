import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSession } from '@/lib/auth';
import { getUserFavoritePosts } from '@/lib/favorites';
import { getSectionById } from '@/data/blog-sections';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogFavoritesPage' });
  return {
    title: t('metaTitle'),
    robots: { index: false, follow: false },
  };
}

export const dynamic = 'force-dynamic';

export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'BlogFavoritesPage' });
  const session = await getSession();
  if (!session) redirect('/login');

  const posts = await getUserFavoritePosts(session.userId, locale as Locale);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h1 className="t-title-2">{t('title')}</h1>
            <Link
              href="/blog"
              className="t-footnote text-white/60 transition-colors duration-200 hover:text-white"
            >
              {t('backToBlog')}
            </Link>
          </header>

          {posts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="t-body text-white/60">{t('empty')}</p>
              <Link
                href="/blog"
                className="t-footnote mt-4 inline-block text-white/60 underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-white"
              >
                {t('browse')}
              </Link>
            </div>
          ) : (
            <div>
              {posts.map((post) => {
                const section = getSectionById(post.section);
                return (
                  <article key={post.slug} className="blog-row">
                    <Link href={post.href} className="block py-6 group">
                      <div className="t-footnote mb-2 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        {section && (
                          <span style={{ color: `rgb(${section.rgb} / 0.8)` }}>
                            {section.label[locale as Locale]}
                          </span>
                        )}
                        <span aria-hidden className="text-white/20">·</span>
                        <time className="tabular-nums text-white/60" dateTime={post.date}>
                          {post.date.replace(/-/g, '.')}
                        </time>
                        {post.author && (
                          <>
                            <span aria-hidden className="text-white/20">·</span>
                            <span className="text-white/60">{post.author}</span>
                          </>
                        )}
                      </div>

                      <h2 className="t-title-3 mb-2 text-white/90 transition-colors duration-200 group-hover:text-white">
                        {post.title}
                      </h2>

                      <p className="line-clamp-2 text-[0.9375rem] leading-relaxed text-white/60">
                        {post.excerpt}
                      </p>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

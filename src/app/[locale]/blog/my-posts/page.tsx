import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSession } from '@/lib/auth';
import { getPostsByAuthor, type PostStatus } from '@/lib/posts';
import { getSectionById } from '@/data/blog-sections';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogMyPostsPage' });
  return {
    title: t('metaTitle'),
    robots: { index: false, follow: false },
  };
}

export const dynamic = 'force-dynamic';

export default async function MyPostsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'BlogMyPostsPage' });
  const session = await getSession();
  if (!session) redirect('/login');

  const STATUS_LABEL: Record<PostStatus, { text: string; className: string }> = {
    draft: { text: t('statusDraft'), className: 'text-white/60' },
    pending: { text: t('statusPending'), className: 'text-amber-300' },
    published: { text: t('statusPublished'), className: 'text-emerald-300' },
    rejected: { text: t('statusRejected'), className: 'text-red-300' },
  };

  const posts = await getPostsByAuthor(session.userId);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h1 className="t-title-2">{t('title')}</h1>
            <Link
              href="/blog/submit"
              className="t-footnote text-white/60 transition-colors duration-200 hover:text-white"
            >
              {t('writeLink')}
            </Link>
          </header>

          {posts.length === 0 ? (
            <p className="t-body py-16 text-center text-white/60">{t('empty')}</p>
          ) : (
            <div>
              {posts.map((post) => {
                const status = STATUS_LABEL[post.status];
                const section = getSectionById(post.sectionId);
                return (
                  <article key={post.id} className="blog-row">
                    <div className="py-6">
                      <div className="t-footnote mb-2 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <span className={status.className}>{status.text}</span>
                        <span aria-hidden className="text-white/20">·</span>
                        <span className="text-white/60">{section?.label[locale as Locale] ?? post.sectionId}</span>
                        <span aria-hidden className="text-white/20">·</span>
                        <time className="tabular-nums text-white/60" dateTime={post.updatedAt}>
                          {post.updatedAt.slice(0, 10).replace(/-/g, '.')}
                        </time>
                      </div>

                      <h2 className="t-title-3 mb-2 text-white/90">
                        {post.status === 'published' ? (
                          <Link href={`/blog/p/${post.id}`} className="hover:text-white">
                            {post.title}
                          </Link>
                        ) : (
                          post.title
                        )}
                      </h2>

                      <p className="line-clamp-2 text-[0.9375rem] leading-relaxed text-white/60">
                        {post.excerpt}
                      </p>

                      {post.status === 'rejected' && post.reviewNote && (
                        <p className="t-footnote mt-3 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3 py-2 text-red-200/90">
                          {t('rejectedReason', { reason: post.reviewNote })}
                        </p>
                      )}
                    </div>
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

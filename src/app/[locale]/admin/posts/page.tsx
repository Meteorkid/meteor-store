import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { getAllPosts } from '@/lib/admin-stats';
import { countPendingReports } from '@/lib/reports';
import { getSectionById } from '@/data/blog-sections';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminNav from '@/components/AdminNav';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AdminPostsPage' });
  const session = await getSession();
  const allowed = session && isAdminSession(session);
  return {
    title: allowed ? t('metaTitle') : t('metaNotFound'),
    robots: { index: false, follow: false },
  };
}

export const dynamic = 'force-dynamic';

export default async function PostsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'AdminPostsPage' });
  const session = await getSession();
  if (!session || !isAdminSession(session)) notFound();

  const allPosts = await getAllPosts();

  // 批量取每个数据库投稿的 pending 举报数,文件文章不参与(站主文章不走举报)
  const dbPostIds = allPosts
    .filter((p) => p.source === 'database')
    .map((p) => p.id);
  let pendingReports = new Map<string, number>();
  try {
    pendingReports = await countPendingReports('post', dbPostIds);
  } catch (err) {
    // 举报读失败不影响列表展示,只是不显示举报数
    console.error('读取投稿 pending 举报数失败', err);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h1 className="t-title-2">{t('title')}</h1>
            <p className="t-footnote tabular-nums text-white/60">
              {t('count', { count: allPosts.length })}
            </p>
          </header>

          <AdminNav />

          <div className="mt-8 overflow-x-auto">
            {allPosts.length === 0 ? (
              <p className="t-body text-white/40">{t('noPosts')}</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 t-footnote">
                    <th className="py-3 pr-4 font-medium">{t('tableTitle')}</th>
                    <th className="py-3 pr-4 font-medium">{t('tableSource')}</th>
                    <th className="py-3 pr-4 font-medium">{t('tableSection')}</th>
                    <th className="py-3 pr-4 font-medium">{t('tableAuthor')}</th>
                    <th className="py-3 pr-4 font-medium">{t('tableStatus')}</th>
                    <th className="py-3 pr-4 font-medium">{t('tableDate')}</th>
                    <th className="py-3 pr-4 font-medium">{t('tableReports')}</th>
                    <th className="py-3 pr-4 font-medium">{t('tableActions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {allPosts.map((post) => {
                    const section = getSectionById(post.section);
                    const sectionLabel =
                      section?.label[locale as Locale] ?? post.section;
                    const date = post.publishedAt ?? post.createdAt;
                    const editHref =
                      post.source === 'file'
                        ? `https://github.com/Meteorkid/meteor-store/edit/main/content/blog/zh/${post.id}.md`
                        : `/blog/submit?id=${post.id}&admin=1`;

                    return (
                      <tr
                        key={post.source === 'file' ? `file-${post.id}` : `db-${post.id}`}
                        className="border-b border-white/5 transition-colors hover:bg-white/5"
                      >
                        <td className="py-3 pr-4">
                          <Link
                            href={post.href}
                            className="text-white/90 hover:text-white transition-colors"
                          >
                            {post.title}
                          </Link>
                        </td>
                        <td className="py-3 pr-4">
                          {post.source === 'file' ? (
                            <span className="inline-block rounded bg-white/10 px-2 py-0.5 text-xs text-white/60">
                              {t('sourceFile')}
                            </span>
                          ) : (
                            <span className="inline-block rounded bg-blue-500/15 px-2 py-0.5 text-xs text-blue-400">
                              {t('sourceDatabase')}
                            </span>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-white/70">
                          {sectionLabel}
                        </td>
                        <td className="py-3 pr-4 text-white/70">
                          {post.author ?? '—'}
                        </td>
                        <td className="py-3 pr-4">
                          {post.source === 'database' && post.status ? (
                            <StatusBadge status={post.status} t={t} />
                          ) : (
                            <span className="text-white/30">—</span>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-white/50 tabular-nums whitespace-nowrap">
                          {formatDate(date)}
                        </td>
                        <td className="py-3 pr-4 whitespace-nowrap">
                          {post.source === 'database' ? (
                            (() => {
                              const n = pendingReports.get(post.id) ?? 0;
                              if (n === 0) {
                                return <span className="text-white/25">—</span>;
                              }
                              return (
                                <Link
                                  href={`/admin/reports?status=pending&targetType=post&targetId=${post.id}`}
                                  className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/25"
                                  title={t('reportsHint', { count: n })}
                                >
                                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                  {n}
                                </Link>
                              );
                            })()
                          ) : (
                            <span className="text-white/25">—</span>
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          <a
                            href={editHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/50 hover:text-white transition-colors text-xs"
                          >
                            {t('editLink')}
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function StatusBadge({
  status,
  t,
}: {
  status: string;
  t: (key: string) => string;
}) {
  const styles: Record<string, string> = {
    published: 'bg-green-500/15 text-green-400',
    pending: 'bg-yellow-500/15 text-yellow-400',
    draft: 'bg-white/10 text-white/50',
    rejected: 'bg-red-500/15 text-red-400',
  };

  const labels: Record<string, string> = {
    published: t('statusPublished'),
    pending: t('statusPending'),
    draft: t('statusDraft'),
    rejected: t('statusRejected'),
  };

  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs ${styles[status] ?? 'bg-white/10 text-white/50'}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return dateStr;
  }
}
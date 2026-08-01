import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReviewQueue, { type ReviewItem } from '@/components/ReviewQueue';
import { getSession } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { getPendingPosts } from '@/lib/posts';
import { getSectionById } from '@/data/blog-sections';
import { markdownToHtml } from '@/lib/markdown';
import type { Locale } from '@/i18n/routing';

/**
 * 标题也要跟着权限走。metadata 在页面组件之前求值，写成静态的话
 * 未授权访问者虽然看到 404 页面，标题栏却写着「待审核」——等于告诉他这里有个后台。
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AdminReviewPage' });
  const session = await getSession();
  const allowed = session && isAdminEmail(session.email);
  return {
    title: allowed ? t('metaTitle') : t('metaNotFound'),
    robots: { index: false, follow: false },
  };
}

export const dynamic = 'force-dynamic';

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'AdminReviewPage' });
  const session = await getSession();
  // 非管理员按「页面不存在」处理，不暴露后台的存在
  if (!session || !isAdminEmail(session.email)) notFound();

  const pending = await getPendingPosts();

  const items: ReviewItem[] = pending.map((p) => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt,
    authorName: p.authorName,
    sectionLabel: getSectionById(p.sectionId)?.label[locale as Locale] ?? p.sectionId,
    tags: p.tags,
    createdAt: p.createdAt,
    // 审核时看到的就是发布后的样子：同一条 sanitize 管线
    html: markdownToHtml(p.content),
  }));

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h1 className="t-title-2">{t('title')}</h1>
            <p className="t-footnote tabular-nums text-white/60">{t('count', { count: items.length })}</p>
          </header>

          <ReviewQueue items={items} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ReviewQueue, { type ReviewItem } from '@/components/ReviewQueue';
import { getAdminPageSession } from '@/lib/admin-session';
import { isAdminSession } from '@/lib/admin';
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
  const session = await getAdminPageSession();
  const allowed = session && isAdminSession(session);
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
  const session = await getAdminPageSession();
  // 非管理员按「页面不存在」处理，不暴露后台的存在
  if (!session || !isAdminSession(session)) notFound();

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

  /*
   * 这一页收回阅读宽度：布局给的内容列约 872px，而这里渲染的是**整篇文章正文**，
   * 英文投稿在这个宽度下一行接近 110 个字符，远超舒适区间。
   * 其余后台页是表格和表单，宽一点反而更好，所以不动布局、只在这里收。
   */
  return (
    <div className="max-w-3xl">
      <header className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h1 className="t-title-2">{t('title')}</h1>
        <p className="t-footnote tabular-nums text-white/60">{t('count', { count: items.length })}</p>
      </header>

      <ReviewQueue items={items} />
    </div>
  );
}

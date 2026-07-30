import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReviewQueue, { type ReviewItem } from '@/components/ReviewQueue';
import { getSession } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { getPendingPosts } from '@/lib/posts';
import { getSectionById } from '@/data/blog-sections';
import { markdownToHtml } from '@/lib/markdown';

/**
 * 标题也要跟着权限走。metadata 在页面组件之前求值，写成静态的话
 * 未授权访问者虽然看到 404 页面，标题栏却写着「待审核」——等于告诉他这里有个后台。
 */
export async function generateMetadata(): Promise<Metadata> {
  const session = await getSession();
  const allowed = session && isAdminEmail(session.email);
  return {
    title: allowed ? '待审核 - Meteor Store' : '页面未找到 - Meteor Store',
    robots: { index: false, follow: false },
  };
}

export const dynamic = 'force-dynamic';

export default async function ReviewPage() {
  const session = await getSession();
  // 非管理员按「页面不存在」处理，不暴露后台的存在
  if (!session || !isAdminEmail(session.email)) notFound();

  const pending = await getPendingPosts();

  const items: ReviewItem[] = pending.map((p) => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt,
    authorName: p.authorName,
    sectionLabel: getSectionById(p.sectionId)?.label ?? p.sectionId,
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
            <h1 className="t-title-2">待审核</h1>
            <p className="t-footnote tabular-nums text-white/60">{items.length} 篇</p>
          </header>

          <ReviewQueue items={items} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

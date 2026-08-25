import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import AdminNav from '@/components/AdminNav';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PathfinderAdminManager from '@/components/PathfinderAdminManager';
import PathfinderNotesManager from '@/components/PathfinderNotesManager';
import { isAdminSession } from '@/lib/admin';
import { getSession } from '@/lib/auth';
import { listCatalogItems } from '@/lib/pathfinder/catalog';
import { sortCatalogItems } from '@/lib/pathfinder/catalog-view';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const session = await getSession();
  const allowed = session && isAdminSession(session);
  return {
    title: allowed ? (locale === 'zh' ? 'Pathfinder 内容审核' : 'Pathfinder moderation') : '404',
    robots: { index: false, follow: false },
  };
}
export default async function AdminPathfinderPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getSession();
  if (!session || !isAdminSession(session)) notFound();
  const zh = locale === 'zh';

  // 待生成的候选按最近新增排序：解读的价值随时间衰减，旧动态先不排队
  const candidates = sortCatalogItems(
    (await listCatalogItems({ type: 'ai-update' })).filter((item) => item.status === 'published'),
    'recent',
  ).slice(0, 40).map((item) => ({
    id: item.id,
    title: item.title.zh || item.title.en,
    organization: item.organization.zh || item.organization.en,
    publishedAt: item.publishedAt,
  }));

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8">
            <p className="t-eyebrow text-violet-300">PATHFINDER</p>
            <h1 className="t-title-2 mt-3">{zh ? '可信目录审核' : 'Trusted catalog moderation'}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
              {zh ? '管理自动同步来源，核验每条信息是否可信、仍然有效，以及是否适合进入大学生学习路径。' : 'Manage sync sources and verify whether each item is trustworthy, current, and suitable for student learning paths.'}
            </p>
          </header>
          <AdminNav />
          <div className="mt-8"><PathfinderAdminManager /></div>
          <PathfinderNotesManager zh={zh} candidates={candidates} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

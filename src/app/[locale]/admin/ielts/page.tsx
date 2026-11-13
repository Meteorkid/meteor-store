import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import AdminIeltsManager, { type AdminIeltsPair, type AdminIeltsRow } from '@/components/admin/AdminIeltsManager';
import { isAdminSession } from '@/lib/admin';
import { getAdminPageSession } from '@/lib/admin-session';
import { listIeltsPairRows, listIeltsPairs, validCuratedPairs, type IeltsPairRow } from '@/lib/ielts/catalog';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const session = await getAdminPageSession();
  const allowed = Boolean(session && isAdminSession(session));
  return {
    title: allowed ? (locale === 'en' ? 'IELTS writing pairs · Admin' : '雅思写作对照 · 管理后台') : 'Not found',
    robots: { index: false, follow: false },
  };
}

export default async function IeltsAdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getAdminPageSession();
  if (!session || !isAdminSession(session)) notFound();

  const typedLocale = locale === 'en' ? 'en' : 'zh';
  const [rows, pairs] = await Promise.all([listIeltsPairRows(), listIeltsPairs()]);

  /*
   * 初始数据与 GET /api/admin/ielts 的摘要字段保持一致（同一套映射）。
   * 页面直接读服务端数据，省掉一次 HTTP 往返；客户端写操作之后会用接口结果替换。
   */
  const curated = new Map(validCuratedPairs().map(seed => [seed.slug, seed]));
  const rowBySlug = new Map(rows.map(row => [row.slug, row]));
  const initialRows: AdminIeltsRow[] = rows.map(row => {
    const seed = curated.get(row.slug);
    return {
      slug: row.slug,
      task: row.task,
      category: row.category,
      topic: row.topic,
      status: row.status,
      source: row.source,
      sortOrder: row.sortOrder,
      title: row.content?.title ?? seed?.content.title ?? null,
      // catalog 的 IeltsPairRow 类型没声明 updatedAt（查询是 SELECT *，运行时存在）；后台只读展示它
      updatedAt: (row as IeltsPairRow & { updatedAt?: string }).updatedAt ?? '',
      inCurated: Boolean(seed),
    };
  });
  const initialPairs: AdminIeltsPair[] = pairs.map(pair => ({
    slug: pair.slug,
    task: pair.task,
    category: pair.category,
    topic: pair.topic,
    sortOrder: pair.sortOrder,
    source: pair.source,
    title: pair.content.title,
    fromDatabase: Boolean(rowBySlug.get(pair.slug)?.content),
  }));

  return (
    <>
      <header className="mb-8">
        <h1 className="t-title-2">{typedLocale === 'en' ? 'IELTS writing pairs' : '雅思写作对照'}</h1>
        <p className="mt-2 max-w-3xl text-sm text-white/60">
          {typedLocale === 'en'
            ? 'Curated pairs ship with the code in the repository; this page manages the database side: generated pairs and overrides. Generated pairs start as drafts and go public after you publish them. Unpublishing hides the file version of the same slug as well; deleting the database row restores the file version.'
            : '精选对照随代码上线（写在仓库文件里），这一页管的是数据库里的生成与覆盖：生成的对照先是草稿，检查后发布才公开；下架会把文件里同一组也一起藏起来；删除数据库行则让文件版本回到公开列表。'}
        </p>
      </header>
      <AdminIeltsManager initialRows={initialRows} initialPairs={initialPairs} locale={typedLocale} />
    </>
  );
}

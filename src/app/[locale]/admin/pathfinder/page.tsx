import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import PathfinderAdminManager from '@/components/PathfinderAdminManager';
import PathfinderNotesManager from '@/components/PathfinderNotesManager';
import { listSourceHealth } from '@/lib/pathfinder/source-health';
import { isAdminSession } from '@/lib/admin';
import { getAdminPageSession } from '@/lib/admin-session';
import { listCatalogItems } from '@/lib/pathfinder/catalog';
import { sortCatalogItems } from '@/lib/pathfinder/catalog-view';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const session = await getAdminPageSession();
  const allowed = session && isAdminSession(session);
  return {
    title: allowed ? (locale === 'zh' ? 'Pathfinder 内容审核' : 'Pathfinder moderation') : '404',
    robots: { index: false, follow: false },
  };
}
export default async function AdminPathfinderPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getAdminPageSession();
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

  const health = await listSourceHealth();
  const unhealthy = health.filter((source) => source.level !== 'ok');

  return (
    <>
      <header className="mb-8">
        <p className="t-eyebrow text-violet-300">PATHFINDER</p>
        <h1 className="t-title-2 mt-3">{zh ? '可信目录审核' : 'Trusted catalog moderation'}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
          {zh ? '管理自动同步来源，核验每条信息是否可信、仍然有效，以及是否适合进入大学生学习路径。' : 'Manage sync sources and verify whether each item is trustworthy, current, and suitable for student learning paths.'}
        </p>
      </header>
      {/*
        * 来源健康度放在最前面。
        *
        * 起因是一次静默故障：hugging-face-blog 从上线起一条内容都没进来过，
        * 而后台只显示条目、不显示来源状态，目录看起来仍然「有内容」——
        * 少掉一整个来源这件事没有任何地方会说。
        */}
      <section className="mt-8">
        <h2 className="t-title-3">{zh ? '来源健康度' : 'Source health'}</h2>
        {unhealthy.length === 0 ? (
          <p className="mt-3 rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {zh ? `${health.length} 个来源全部正常。` : `All ${health.length} sources are healthy.`}
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {unhealthy.map((source) => (
              <li
                key={source.id}
                className={`rounded-xl border px-4 py-3 text-sm ${
                  source.level === 'critical'
                    ? 'border-red-400/30 bg-red-500/10 text-red-100'
                    : 'border-amber-400/25 bg-amber-500/10 text-amber-100'
                }`}
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-semibold">{source.name}</span>
                  <span className="t-footnote opacity-80">{source.id}</span>
                  <span className="t-footnote">{source.reason}</span>
                </div>
                {source.lastError && (
                  <p className="mt-1 t-footnote opacity-80">{source.lastError.slice(0, 160)}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8"><PathfinderAdminManager /></div>
      <PathfinderNotesManager zh={zh} candidates={candidates} />
    </>
  );
}

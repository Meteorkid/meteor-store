import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import CatalogItemCard from '@/components/pathfinder/CatalogItemCard';
import FollowButton from '@/components/pathfinder/FollowButton';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getSession } from '@/lib/auth';
import { listCatalogItems } from '@/lib/pathfinder/catalog';
import { sortCatalogItems } from '@/lib/pathfinder/catalog-view';
import {
  collectDirectory,
  directorySlug,
  filterByDirectory,
  type PathfinderDirectoryKind,
} from '@/lib/pathfinder/directory';
import { listPathfinderFollows, listPathfinderSaves } from '@/lib/pathfinder/saves';

/**
 * 主题页与机构页共用的渲染。
 *
 * 两者的差别只有「按哪个字段分组」，页面结构、关注入口和排序完全一样，
 * 各写一份只会让两边慢慢长歪。
 */
export default async function DirectoryPage({
  kind,
  slug,
  locale,
}: {
  kind: PathfinderDirectoryKind;
  slug: string;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: 'PathfinderHub.directory' });
  const normalized = directorySlug(decodeURIComponent(slug));
  const catalog = await listCatalogItems();
  const items = sortCatalogItems(filterByDirectory(catalog, kind, normalized), 'action');

  // 没有任何条目的入口直接 404：留着等于给搜索引擎和用户各留一个空壳页
  if (items.length === 0) notFound();

  const pathfinderLocale = locale === 'en' ? 'en' : 'zh';
  const label = collectDirectory(catalog, kind, pathfinderLocale, 1)
    .find((entry) => entry.slug === normalized)?.label ?? normalized;

  const session = await getSession();
  const [follows, saves] = await Promise.all([
    session ? listPathfinderFollows(session.userId) : Promise.resolve({ organization: [], topic: [] }),
    session ? listPathfinderSaves(session.userId) : Promise.resolve([]),
  ]);
  const savedIds = new Set(saves.map((save) => save.itemId));

  return (
    <main className="container mx-auto px-4 py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-8 flex flex-wrap items-center gap-2 t-footnote text-white/60" aria-label={t('breadcrumb')}>
          <Link href="/pathfinder">{t('discover')}</Link>
          <span aria-hidden="true">/</span>
          <Link href={kind === 'topic' ? '/pathfinder/topics' : '/pathfinder/organizations'}>
            {t(`index.${kind}`)}
          </Link>
        </nav>

        <header className="mb-10 border-b border-white/10 pb-9">
          <p className="t-eyebrow text-violet-300">{t(`eyebrow.${kind}`)}</p>
          <h1 className="mt-3 t-title-1 text-white">{label}</h1>
          <p className="mt-4 t-body text-white/60">{t('count', { count: items.length })}</p>
          <div className="mt-6">
            <FollowButton
              kind={kind}
              value={normalized}
              initialFollowing={follows[kind].includes(normalized)}
              signedIn={Boolean(session)}
            />
          </div>
        </header>

        <div>
          {items.map((item) => (
            <CatalogItemCard
              key={item.id}
              item={item}
              locale={locale as Locale}
              saveState={{ signedIn: Boolean(session), saved: savedIds.has(item.id) }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

/** 主题 / 机构索引页共用的渲染。 */
export async function DirectoryIndex({
  kind,
  locale,
}: {
  kind: PathfinderDirectoryKind;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: 'PathfinderHub.directory' });
  const pathfinderLocale = locale === 'en' ? 'en' : 'zh';
  const entries = collectDirectory(await listCatalogItems(), kind, pathfinderLocale);
  const base = kind === 'topic' ? '/pathfinder/topics' : '/pathfinder/organizations';

  return (
    <main className="container mx-auto px-4 py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 border-b border-white/10 pb-9">
          <p className="t-eyebrow text-violet-300">{t(`eyebrow.${kind}`)}</p>
          <h1 className="mt-3 t-title-1 text-white">{t(`index.${kind}`)}</h1>
          <p className="mt-4 max-w-3xl t-body text-white/60">{t(`indexDescription.${kind}`)}</p>
        </header>

        {entries.length === 0 ? (
          <p className="text-sm text-white/60">{t('empty')}</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {entries.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={`${base}/${encodeURIComponent(entry.slug)}`}
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  {entry.label}
                  <span className="t-footnote text-white/60">{entry.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

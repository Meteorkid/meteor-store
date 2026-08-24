import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import CatalogItemCard from '@/components/pathfinder/CatalogItemCard';
import CatalogToolbar, { CatalogPagination } from '@/components/pathfinder/CatalogToolbar';
import PathfinderFilters from '@/components/pathfinder/PathfinderFilters';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getSession } from '@/lib/auth';
import { listCatalogItems } from '@/lib/pathfinder/catalog';
import { listPathfinderSaves } from '@/lib/pathfinder/saves';
import {
  filterCatalogItems,
  paginateCatalog,
  parseCatalogFilters,
  sortCatalogItems,
} from '@/lib/pathfinder/catalog-view';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PathfinderHub.opportunities' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    // 供阅读器自动发现；机器可读的完整契约在 /api/v1/pathfinder/openapi.json
    alternates: {
      types: { 'application/rss+xml': `/${locale}/pathfinder/feed.xml` },
    },
  };
}

export default async function PathfinderOpportunitiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'PathfinderHub.opportunities' });
  const rawParams = await searchParams;
  const filters = parseCatalogFilters(rawParams);
  const catalog = await listCatalogItems();
  const items = sortCatalogItems(filterCatalogItems(catalog, filters), filters.sort);
  const page = paginateCatalog(items, filters.page);
  // 收藏状态一次查完再分发给卡片，避免每张卡片各打一个请求
  const session = await getSession();
  const savedIds = new Set(session
    ? (await listPathfinderSaves(session.userId)).map((save) => save.itemId)
    : []);
  const hasDeadlines = catalog.some((item) => item.deadlineAt !== null || item.deadlineDate !== null);

  return (
    <main className="container mx-auto px-4 py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 max-w-4xl border-b border-white/10 pb-9">
          <p className="t-eyebrow text-violet-300">{t('eyebrow')}</p>
          <h1 className="mt-3 t-title-1 text-white">{t('title')}</h1>
          <p className="mt-4 max-w-3xl t-body text-white/60">{t('description')}</p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
          <div className="lg:order-2">
            <PathfinderFilters hasDeadlines={hasDeadlines} />
          </div>
          <section className="min-w-0 lg:order-1" aria-live="polite">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="t-eyebrow text-white/60">{t('resultEyebrow')}</p>
                <h2 className="mt-2 t-title-3 text-white">{t('resultCount', { count: items.length })}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="t-footnote text-white/60">{t('traceable')}</p>
                <a
                  href={`/${locale}/pathfinder/feed.xml`}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  ◉ RSS
                </a>
                <a
                  href="/api/v1/pathfinder/openapi.json"
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  API
                </a>
              </div>
            </div>

            <CatalogToolbar
              locale={locale}
              searchParams={rawParams}
              sort={filters.sort}
              compact={filters.compact}
              page={page}
            />

            {page.items.length > 0 ? (
              <div>
                {page.items.map((item) => (
                  <CatalogItemCard
                    key={item.id}
                    item={item}
                    locale={locale as Locale}
                    compact={filters.compact}
                    saveState={{ signedIn: Boolean(session), saved: savedIds.has(item.id) }}
                  />
                ))}
                <CatalogPagination locale={locale} searchParams={rawParams} page={page} />
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-white/10 px-5 py-12 text-center">
                <h3 className="t-title-3 text-white">{t('emptyTitle')}</h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/60">{t('emptyDescription')}</p>
                <Link href="/pathfinder/opportunities" className="mt-5 inline-flex rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.05]">
                  {t('clearFilters')}
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

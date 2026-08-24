import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  CATALOG_SORTS,
  buildCatalogQuery,
  type CatalogPage,
  type CatalogSort,
} from '@/lib/pathfinder/catalog-view';

/**
 * 机会库的排序、视图与翻页控件。
 *
 * 全部用链接实现而不是客户端状态：这三件事都只是换一种查看方式，
 * 走 URL 才能被收藏、被分享、被后退键还原，也不需要给这个服务端页面
 * 再拉一个客户端组件进来。
 */
export default async function CatalogToolbar({
  locale,
  searchParams,
  sort,
  compact,
  page,
}: {
  locale: string;
  searchParams: Record<string, string | string[] | undefined>;
  sort: CatalogSort;
  compact: boolean;
  page: CatalogPage<unknown>;
}) {
  const t = await getTranslations({ locale, namespace: 'PathfinderHub.sort' });
  const href = (patch: Record<string, string | null>) => (
    `/pathfinder/opportunities${buildCatalogQuery(searchParams, { page: null, ...patch })}`
  );

  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-4">
      <nav className="flex flex-wrap items-center gap-2" aria-label={t('label')}>
        <span className="t-footnote text-white/60">{t('label')}</span>
        {CATALOG_SORTS.map((option) => (
          <Link
            key={option}
            href={href({ sort: option === 'default' ? null : option })}
            aria-current={sort === option ? 'true' : undefined}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              sort === option
                ? 'border-violet-400/40 bg-violet-500/15 text-violet-100'
                : 'border-white/10 text-white/60 hover:bg-white/[0.05]'
            }`}
          >
            {t(option)}
          </Link>
        ))}
      </nav>

      <nav className="flex flex-wrap items-center gap-2" aria-label={t('viewLabel')}>
        <span className="t-footnote text-white/60">{t('viewLabel')}</span>
        <Link
          href={href({ view: null })}
          aria-current={compact ? undefined : 'true'}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
            compact
              ? 'border-white/10 text-white/60 hover:bg-white/[0.05]'
              : 'border-violet-400/40 bg-violet-500/15 text-violet-100'
          }`}
        >
          {t('viewFull')}
        </Link>
        <Link
          href={href({ view: 'compact' })}
          aria-current={compact ? 'true' : undefined}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
            compact
              ? 'border-violet-400/40 bg-violet-500/15 text-violet-100'
              : 'border-white/10 text-white/60 hover:bg-white/[0.05]'
          }`}
        >
          {t('viewCompact')}
        </Link>
      </nav>

      {page.pageCount > 1 && (
        <p className="ml-auto t-footnote text-white/60">
          {t('pageStatus', { page: page.page, pageCount: page.pageCount, total: page.total })}
        </p>
      )}
    </div>
  );
}

export async function CatalogPagination({
  locale,
  searchParams,
  page,
}: {
  locale: string;
  searchParams: Record<string, string | string[] | undefined>;
  page: CatalogPage<unknown>;
}) {
  if (page.pageCount <= 1) return null;
  const t = await getTranslations({ locale, namespace: 'PathfinderHub.sort' });
  const href = (target: number) => (
    `/pathfinder/opportunities${buildCatalogQuery(searchParams, {
      page: target <= 1 ? null : String(target),
    })}`
  );

  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5"
      aria-label={t('pageStatus', { page: page.page, pageCount: page.pageCount, total: page.total })}
    >
      {page.page > 1 ? (
        <Link
          href={href(page.page - 1)}
          rel="prev"
          className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/[0.05]"
        >
          {t('previousPage')}
        </Link>
      ) : <span />}
      <p className="t-footnote text-white/60">
        {t('pageStatus', { page: page.page, pageCount: page.pageCount, total: page.total })}
      </p>
      {page.page < page.pageCount ? (
        <Link
          href={href(page.page + 1)}
          rel="next"
          className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/[0.05]"
        >
          {t('nextPage')}
        </Link>
      ) : <span />}
    </nav>
  );
}

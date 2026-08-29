import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import CatalogItemCard from '@/components/pathfinder/CatalogItemCard';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getSession } from '@/lib/auth';
import { listCatalogItems } from '@/lib/pathfinder/catalog';
import { formatDate } from '@/lib/pathfinder/catalog-view';
import { buildPathfinderWeekly, WEEKLY_FEATURED_LIMIT } from '@/lib/pathfinder/directory';
import { sortCatalogItems } from '@/lib/pathfinder/catalog-view';
import { listPathfinderSaves } from '@/lib/pathfinder/saves';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PathfinderHub.weekly' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

/**
 * 学生周报。
 *
 * 只回答两个问题：这周多了什么、这周有什么要截止。
 * 不做「本周热点」——热度不是这个产品的判据，也没有互动数据可依。
 * 内容由 `buildPathfinderWeekly` 算出，将来要发周报邮件时复用同一份，
 * 不会出现页面和邮件各说一套。
 */
export default async function PathfinderWeeklyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'PathfinderHub.weekly' });
  const pathfinderLocale = locale === 'en' ? 'en' : 'zh';

  const weekly = buildPathfinderWeekly(await listCatalogItems());
  const session = await getSession();
  const savedIds = new Set(session
    ? (await listPathfinderSaves(session.userId)).map((save) => save.itemId)
    : []);
  const saveState = (id: string) => ({ signedIn: Boolean(session), saved: savedIds.has(id) });

  const since = formatDate(weekly.since, pathfinderLocale);
  const until = formatDate(weekly.until, pathfinderLocale);

  return (
    <main className="container mx-auto px-4 py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 border-b border-white/10 pb-9">
          <p className="t-eyebrow text-violet-300">{t('eyebrow')}</p>
          <h1 className="mt-3 t-title-1 text-white">{t('title')}</h1>
          <p className="mt-4 max-w-3xl t-body text-white/60">{t('description')}</p>
          {since && until && (
            <p className="mt-3 t-footnote text-white/60">{t('range', { since, until })}</p>
          )}
        </header>

        {weekly.added.length === 0 && weekly.closing.length === 0 ? (
          <div className="rounded-2xl border border-white/10 px-5 py-12 text-center">
            <h2 className="t-title-3 text-white">{t('emptyTitle')}</h2>
            {/* 空周报如实说「这周没有」，不用旧内容凑数 */}
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/60">{t('emptyDescription')}</p>
            <Link
              href="/pathfinder/opportunities"
              className="mt-5 inline-flex rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.05]"
            >
              {t('browse')}
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {weekly.closing.length > 0 && (
              <section>
                <h2 className="t-title-2 text-white">{t('closingTitle', { count: weekly.closing.length })}</h2>
                <p className="mt-2 text-sm text-white/60">{t('closingDescription')}</p>
                <div className="mt-3">
                  {weekly.closing.slice(0, 8).map((item) => (
                    <CatalogItemCard
                      key={item.id}
                      item={item}
                      locale={locale as Locale}
                      saveState={saveState(item.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {weekly.highlights.length > 0 && (
              <section>
                <h2 className="t-title-2 text-white">{t('highlightsTitle')}</h2>
                <p className="mt-2 text-sm text-white/60">{t('highlightsDescription')}</p>
                <div className="mt-3">
                  {weekly.highlights.map((item) => (
                    <CatalogItemCard
                      key={item.id}
                      item={item}
                      locale={locale as Locale}
                      saveState={saveState(item.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {weekly.added.length > 0 && (() => {
              /*
               * 先给最值得行动的一小批，其余折叠。
               *
               * 标题里的数字是**全部**新增数，而展开的只有前 WEEKLY_FEATURED_LIMIT 条——
               * 两者不一致会让人以为漏了，所以下面那句说明必须写清楚「先给出几条、
               * 其余多少条可展开」。历史教训：标题写着 91 条而页面只渲染 20 条，
               * 中间没有任何交代。
               */
              const featured = sortCatalogItems(weekly.added, 'action').slice(0, WEEKLY_FEATURED_LIMIT);
              const rest = weekly.added.filter((item) => !featured.includes(item));

              return (
                <section>
                  <h2 className="t-title-2 text-white">{t('addedTitle', { count: weekly.added.length })}</h2>
                  {rest.length > 0 && (
                    <p className="mt-2 t-footnote text-white/60">
                      {t('addedFeaturedNote', { shown: featured.length, rest: rest.length })}
                    </p>
                  )}
                  <div className="mt-3">
                    {featured.map((item) => (
                      <CatalogItemCard key={item.id} item={item} locale={locale as Locale} compact />
                    ))}
                  </div>
                  {rest.length > 0 && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm text-violet-200 hover:underline">
                        {t('addedMore', { rest: rest.length })}
                      </summary>
                      <div className="mt-3">
                        {rest.map((item) => (
                          <CatalogItemCard key={item.id} item={item} locale={locale as Locale} compact />
                        ))}
                      </div>
                    </details>
                  )}
                </section>
              );
            })()}
          </div>
        )}
      </div>
    </main>
  );
}

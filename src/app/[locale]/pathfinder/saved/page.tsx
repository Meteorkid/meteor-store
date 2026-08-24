import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import CatalogItemCard from '@/components/pathfinder/CatalogItemCard';
import ReminderToggle from '@/components/pathfinder/ReminderToggle';
import { Link, redirect } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getSession } from '@/lib/auth';
import { getDeadlineState } from '@/lib/pathfinder/catalog-view';
import { getSavedPathfinderItems } from '@/lib/pathfinder/saves';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PathfinderHub.saves' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

/**
 * 我的收藏。
 *
 * 已下架或已删除的条目自然筛不到（收藏记录保留，但不显示）——
 * 与博客收藏一致：作者重新发布或改地址后无法自动恢复，这是可接受的代价。
 */
export default async function PathfinderSavedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'PathfinderHub.saves' });

  const session = await getSession();
  if (!session) {
    redirect({ href: { pathname: '/login', query: { next: '/pathfinder/saved' } }, locale });
  }

  const saved = await getSavedPathfinderItems(session!.userId);
  const active = saved.filter(({ item }) => getDeadlineState(item).state !== 'expired');
  const expired = saved.filter(({ item }) => getDeadlineState(item).state === 'expired');

  return (
    <main className="container mx-auto px-4 py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 border-b border-white/10 pb-9">
          <p className="t-eyebrow text-violet-300">{t('eyebrow')}</p>
          <h1 className="mt-3 t-title-1 text-white">{t('title')}</h1>
          <p className="mt-4 max-w-3xl t-body text-white/60">{t('description')}</p>
        </header>

        {saved.length === 0 ? (
          <div className="rounded-2xl border border-white/10 px-5 py-12 text-center">
            <h2 className="t-title-3 text-white">{t('emptyTitle')}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/60">{t('emptyDescription')}</p>
            <Link
              href="/pathfinder/opportunities"
              className="mt-5 inline-flex rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.05]"
            >
              {t('browse')}
            </Link>
          </div>
        ) : (
          <>
            <section>
              <h2 className="t-title-3 text-white">{t('activeTitle', { count: active.length })}</h2>
              <div className="mt-3">
                {active.map(({ item, remindDeadline }) => (
                  <div key={item.id}>
                    <CatalogItemCard item={item} locale={locale as Locale} />
                    <div className="pb-4">
                      <ReminderToggle itemId={item.id} initialEnabled={remindDeadline} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {expired.length > 0 && (
              <section className="mt-12">
                {/* 过期的收藏不直接删掉：用户可能想回看自己当时关注过什么 */}
                <h2 className="t-title-3 text-white/60">{t('expiredTitle', { count: expired.length })}</h2>
                <div className="mt-3 opacity-60">
                  {expired.map(({ item }) => (
                    <CatalogItemCard key={item.id} item={item} locale={locale as Locale} compact />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

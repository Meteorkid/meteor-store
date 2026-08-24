import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import CatalogItemCard from '@/components/pathfinder/CatalogItemCard';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { listCatalogItems } from '@/lib/pathfinder/catalog';
import {
  catalogStats,
  formatCatalogDeadlineDate,
  localizedText,
  selectPathfinderHomeFeed,
  sortByDeadline,
} from '@/lib/pathfinder/catalog-view';

const DIRECTION_KEYS = ['ai', 'frontend', 'backend', 'data'] as const;

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PathfinderHub.discover' });
  return { title: t('metaTitle'), description: t('metaDescription'), robots: { index: true, follow: true } };
}

export default async function PathfinderPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: 'PathfinderHub.discover' });
  const catalog = await listCatalogItems();
  const stats = catalogStats(catalog);
  const homeFeed = selectPathfinderHomeFeed(catalog);
  const deadlines = sortByDeadline(catalog).slice(0, 5);

  return (
    <main className="container mx-auto px-4 py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <header className="grid grid-cols-1 gap-8 border-b border-white/10 pb-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end lg:pb-12">
          <div>
            <p className="t-eyebrow text-violet-300">{t('eyebrow')}</p>
            <h1 className="mt-4 max-w-4xl t-display text-white">{t('title')}</h1>
            <p className="mt-5 max-w-2xl t-body text-white/60">{t('description')}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/pathfinder/opportunities" className="rounded-xl bg-violet-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-violet-500">
                {t('browse')}
              </Link>
              <Link href="/pathfinder/plan" className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-white/[0.08]">
                {t('buildPlan')}
              </Link>
            </div>
          </div>
          <form action={`/${locale}/pathfinder/opportunities`} className="glass rounded-2xl p-3">
            <label htmlFor="pathfinder-discover-search" className="sr-only">{t('searchLabel')}</label>
            <div className="flex gap-2">
              <input id="pathfinder-discover-search" name="q" type="search" maxLength={100} placeholder={t('searchPlaceholder')} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/60 focus:border-violet-400/60" />
              <button className="rounded-xl bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white/15" type="submit">{t('search')}</button>
            </div>
            <p className="mt-2 px-1 t-footnote text-white/60">{t('searchHint')}</p>
          </form>
        </header>

        <section aria-label={t('statsAria')} className="grid grid-cols-2 border-b border-white/10 sm:grid-cols-4">
          {([
            ['total', stats.total],
            ['learning', stats.learning],
            ['official', stats.official],
            ['directions', stats.directions],
          ] as const).map(([key, value], index) => (
            <div key={key} className={`py-5 ${index % 2 ? 'pl-5' : ''} ${index > 0 ? 'sm:border-l sm:border-white/10 sm:pl-6' : ''}`}>
              <strong className="block t-title-3 tabular-nums text-white">{value}</strong>
              <span className="mt-1 block t-footnote text-white/60">{t(`stats.${key}`)}</span>
            </div>
          ))}
        </section>

        <section className="py-10 sm:py-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="t-eyebrow text-violet-300">{t('directionsEyebrow')}</p>
              <h2 className="mt-2 t-title-2 text-white">{t('directionsTitle')}</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DIRECTION_KEYS.map((direction, index) => (
              <Link key={direction} href={`/pathfinder/directions/${direction}`} className="glass-card group rounded-2xl p-5">
                <span aria-hidden="true" className="font-mono text-xs text-white/35">0{index + 1}</span>
                <h3 className="mt-5 t-title-3 text-white transition-colors group-hover:text-violet-200">{t(`directions.${direction}.title`)}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{t(`directions.${direction}.description`)}</p>
                <span className="mt-5 inline-flex text-xs font-semibold text-violet-200">{t('viewDirection')} →</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <section>
              <SectionHeader eyebrow={t('featuredEyebrow')} title={t('featuredTitle')} href="/pathfinder/opportunities" linkLabel={t('viewAll')} />
              <div>
                {homeFeed.featured.map((item, index) => <CatalogItemCard key={item.id} item={item} locale={typedLocale} featured={index === 0} />)}
              </div>
            </section>

            {homeFeed.opportunities.length > 0 && (
              <section className="mt-12 sm:mt-16">
                <SectionHeader eyebrow={t('latestEyebrow')} title={t('latestTitle')} href="/pathfinder/opportunities" linkLabel={t('viewAll')} />
                <div>{homeFeed.opportunities.map((item) => <CatalogItemCard key={item.id} item={item} locale={typedLocale} />)}</div>
              </section>
            )}

            {homeFeed.openSource.length > 0 && (
              <section className="mt-12 sm:mt-16">
                <SectionHeader eyebrow={t('openSourceEyebrow')} title={t('openSourceTitle')} href="/pathfinder/opportunities?type=open-source" linkLabel={t('viewAll')} />
                <div>{homeFeed.openSource.map((item) => <CatalogItemCard key={item.id} item={item} locale={typedLocale} />)}</div>
              </section>
            )}

            {homeFeed.updates.length > 0 && (
              <section className="mt-12 sm:mt-16">
                <SectionHeader eyebrow={t('updatesEyebrow')} title={t('updatesTitle')} />
                <p className="mb-2 max-w-2xl text-sm leading-6 text-white/60">{t('updatesDescription')}</p>
                <div>{homeFeed.updates.map((item) => <CatalogItemCard key={item.id} item={item} locale={typedLocale} />)}</div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            {deadlines.length > 0 && (
              <section className="glass rounded-2xl p-5">
                <p className="t-eyebrow text-amber-300">{t('deadlinesEyebrow')}</p>
                <h2 className="mt-2 t-title-4 text-white">{t('deadlinesTitle')}</h2>
                <ol className="mt-4 divide-y divide-white/[0.07]">
                  {deadlines.map((item) => (
                    <li key={item.id} className="py-4 first:pt-0 last:pb-0">
                      <Link href={`/pathfinder/items/${item.id}`} className="block text-sm font-semibold leading-5 text-white hover:text-violet-200">
                        {localizedText(item.title, locale)}
                      </Link>
                      <p className="mt-1 t-footnote text-white/60">{formatCatalogDeadlineDate(item, typedLocale)} · {localizedText(item.organization, locale)}</p>
                    </li>
                  ))}
                </ol>
                <Link href="/pathfinder/opportunities?deadline=30d" className="mt-5 inline-flex text-xs font-semibold text-amber-200 hover:text-amber-100">
                  {t('viewDeadlines')} →
                </Link>
              </section>
            )}

            <section className="rounded-2xl border border-violet-400/20 bg-violet-500/[0.08] p-5">
              <p className="t-eyebrow text-violet-300">{t('planEyebrow')}</p>
              <h2 className="mt-2 t-title-3 text-white">{t('planTitle')}</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">{t('planDescription')}</p>
              <Link href="/pathfinder/plan" className="mt-5 inline-flex rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500">
                {t('buildPlan')}
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function SectionHeader({ eyebrow, title, href, linkLabel }: { eyebrow: string; title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <div>
        <p className="t-eyebrow text-violet-300">{eyebrow}</p>
        <h2 className="mt-2 t-title-2 text-white">{title}</h2>
      </div>
      {href && linkLabel && <Link href={href} className="shrink-0 text-xs font-semibold text-white/60 hover:text-white/80">{linkLabel} →</Link>}
    </div>
  );
}

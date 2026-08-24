import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import CatalogItemCard from '@/components/pathfinder/CatalogItemCard';
import { PATHFINDER_DIRECTION_GUIDES, getPathfinderDirectionGuide } from '@/data/pathfinder-directions';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { listCatalogItems } from '@/lib/pathfinder/catalog';
import { localizedText, sortByRecency } from '@/lib/pathfinder/catalog-view';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return PATHFINDER_DIRECTION_GUIDES.map((direction) => ({ slug: direction.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getPathfinderDirectionGuide(slug);
  if (!guide) return {};
  const t = await getTranslations({ locale, namespace: 'PathfinderHub.directionPage' });
  const title = localizedText(guide.title, locale);
  return { title: t('metaTitle', { direction: title }), description: localizedText(guide.description, locale) };
}

export default async function PathfinderDirectionPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const guide = getPathfinderDirectionGuide(slug);
  if (!guide) notFound();
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: 'PathfinderHub.directionPage' });
  const items = sortByRecency(await listCatalogItems({ direction: guide.slug, learningEligible: true })).slice(0, 8);

  return (
    <main className="container mx-auto px-4 py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <nav aria-label={t('directionNav')} className="no-scrollbar -mx-4 mb-9 flex gap-2 overflow-x-auto px-4">
          {PATHFINDER_DIRECTION_GUIDES.map((direction) => (
            <Link
              key={direction.slug}
              href={`/pathfinder/directions/${direction.slug}`}
              aria-current={direction.slug === guide.slug ? 'page' : undefined}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${
                direction.slug === guide.slug
                  ? 'border-violet-400/40 bg-violet-500/15 text-white'
                  : 'border-white/10 text-white/60 hover:text-white/80'
              }`}
            >
              {localizedText(direction.title, locale)}
            </Link>
          ))}
        </nav>

        <header className="border-b border-white/10 pb-10">
          <p className="t-eyebrow text-violet-300">{t('eyebrow')}</p>
          <h1 className="mt-4 max-w-4xl t-display text-white">{localizedText(guide.title, locale)}</h1>
          <p className="mt-5 max-w-3xl t-body text-white/60">{localizedText(guide.description, locale)}</p>
        </header>

        <div className="grid grid-cols-1 gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:py-14">
          <div className="min-w-0">
            <section>
              <p className="t-eyebrow text-violet-300">{t('mapEyebrow')}</p>
              <h2 className="mt-2 t-title-2 text-white">{t('mapTitle')}</h2>
              <div className="mt-6">
                {guide.stages.map((stage, index) => (
                  <article key={stage.title.zh} className="grid grid-cols-[42px_minmax(0,1fr)] gap-4 border-t border-white/10 py-6 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-6">
                    <span className="font-mono text-sm text-violet-300/70">0{index + 1}</span>
                    <div>
                      <h3 className="t-title-3 text-white">{localizedText(stage.title, locale)}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/60">{localizedText(stage.description, locale)}</p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {stage.skills.map((skill) => (
                          <li key={skill.zh} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-white/70">
                            {localizedText(skill, locale)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-12 sm:mt-16">
              <p className="t-eyebrow text-violet-300">{t('recommendedEyebrow')}</p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <h2 className="t-title-2 text-white">{t('recommendedTitle')}</h2>
                <Link href={`/pathfinder/opportunities?direction=${guide.slug}`} className="shrink-0 text-xs font-semibold text-white/60 hover:text-white/80">{t('viewAll')} →</Link>
              </div>
              <div className="mt-3">
                {items.map((item) => <CatalogItemCard key={item.id} item={item} locale={typedLocale} />)}
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="glass rounded-2xl p-5">
              <p className="t-eyebrow text-white/60">{t('fitLabel')}</p>
              <p className="mt-3 text-sm leading-6 text-white/80">{localizedText(guide.fit, locale)}</p>
              <div className="my-5 h-px bg-white/10" />
              <p className="t-eyebrow text-white/60">{t('outcomeLabel')}</p>
              <p className="mt-3 text-sm leading-6 text-white/80">{localizedText(guide.outcome, locale)}</p>
            </section>
            <section className="rounded-2xl border border-violet-400/20 bg-violet-500/[0.08] p-5">
              <h2 className="t-title-4 text-white">{t('planTitle')}</h2>
              <p className="mt-2 text-sm leading-6 text-white/60">{t('planDescription')}</p>
              <Link href={`/pathfinder/plan?direction=${guide.slug}`} className="mt-5 inline-flex rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500">
                {t('buildPlan')}
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

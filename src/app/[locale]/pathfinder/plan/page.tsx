import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { getCatalogItem } from '@/lib/pathfinder/catalog';
import { PATHFINDER_DIRECTIONS, type PathfinderItemType } from '@/lib/pathfinder/catalog-types';
import { localizedText } from '@/lib/pathfinder/catalog-view';
import PathfinderClient from '../PathfinderClient';

const ITEM_GOAL_TYPES = {
  'open-source': 'project',
  competition: 'competition',
  internship: 'internship',
  'ai-update': 'explore',
} as const satisfies Record<PathfinderItemType, 'explore' | 'project' | 'competition' | 'internship'>;

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PathfinderHub.planPage' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function PathfinderPlanPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ item?: string | string[]; direction?: string | string[] }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'PathfinderHub.planPage' });
  const query = await searchParams;
  const rawItem = Array.isArray(query.item) ? query.item[0] : query.item;
  const requestedItemId = rawItem?.slice(0, 120);
  const preferredItem = requestedItemId ? await getCatalogItem(requestedItemId) : null;
  const rawDirection = Array.isArray(query.direction) ? query.direction[0] : query.direction;
  const queryDirection = PATHFINDER_DIRECTIONS.find((direction) => direction === rawDirection);
  const initialDirection = preferredItem?.direction ?? queryDirection;
  const initialGoalType = preferredItem ? ITEM_GOAL_TYPES[preferredItem.itemType] : undefined;

  return (
    <main className="container mx-auto px-4 py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 max-w-3xl sm:mb-12">
          <p className="t-eyebrow text-violet-300">{t('eyebrow')}</p>
          <h1 className="mt-3 t-title-1 text-white">{t('title')}</h1>
          <p className="mt-4 t-body text-white/60">{t('description')}</p>
        </header>
        <PathfinderClient
          preferredItemId={preferredItem?.id}
          preferredItemTitle={preferredItem ? localizedText(preferredItem.title, locale) : undefined}
          initialDirection={initialDirection}
          initialGoalType={initialGoalType}
          locale={locale as Locale}
        />
      </div>
    </main>
  );
}

import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { PathfinderCatalogItem } from '@/lib/pathfinder/catalog-types';
import {
  formatCatalogCost,
  formatCatalogDeadlineDate,
  formatDate,
  getDeadlineState,
  localizedText,
} from '@/lib/pathfinder/catalog-view';

const TYPE_TONES: Record<PathfinderCatalogItem['itemType'], string> = {
  'open-source': 'border-sky-400/25 bg-sky-400/10 text-sky-200',
  competition: 'border-amber-400/25 bg-amber-400/10 text-amber-200',
  internship: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
  'ai-update': 'border-violet-400/25 bg-violet-400/10 text-violet-200',
};

export default async function CatalogItemCard({
  item,
  locale,
  featured = false,
}: {
  item: PathfinderCatalogItem;
  locale: Locale;
  featured?: boolean;
}) {
  const t = await getTranslations({ locale, namespace: 'PathfinderHub.catalog' });
  const deadline = getDeadlineState(item);
  const deadlineDate = formatCatalogDeadlineDate(item, locale);
  const verifiedDate = formatDate(item.verifiedAt, locale);
  const title = localizedText(item.title, locale);
  const summary = localizedText(item.summary, locale);

  return (
    <article
      className={`group relative border-t border-white/10 py-5 transition-colors duration-200 hover:bg-white/[0.025] ${
        featured ? 'sm:py-7' : ''
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${TYPE_TONES[item.itemType]}`}>
          {t(`types.${item.itemType}`)}
        </span>
        <span className="t-footnote text-white/60">
          {item.directions.map((direction) => t(`directions.${direction}`)).join(' · ')}
        </span>
        <span aria-hidden="true" className="text-white/25">·</span>
        <span className="t-footnote text-white/60">{t(`difficulties.${item.difficulty}`)}</span>
        {item.requiresManualEligibilityCheck && (
          <span className="rounded-full border border-amber-400/25 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-100">
            {t('manualEligibility')}
          </span>
        )}
        {deadlineDate && deadline.state !== 'expired' && (
          <span
            className={`ml-auto rounded-full border px-2 py-1 text-[11px] ${
              deadline.state === 'urgent'
                ? 'border-red-400/30 bg-red-500/10 text-red-200'
                : deadline.state === 'soon'
                  ? 'border-amber-400/30 bg-amber-500/10 text-amber-200'
                  : 'border-white/10 text-white/60'
            }`}
          >
            {t('deadline', { date: deadlineDate })}
          </span>
        )}
      </div>

      <h3 className={`${featured ? 't-title-2' : 't-title-3'} mt-3 text-white`}>
        <Link href={`/pathfinder/items/${item.id}`} className="transition-colors hover:text-violet-200">
          {title}
        </Link>
      </h3>
      <p className={`mt-3 max-w-3xl text-white/60 ${featured ? 't-body line-clamp-3' : 'text-sm leading-6 line-clamp-3'}`}>
        {summary}
      </p>

      <div className="relative mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="text-sm font-medium text-white/80">{localizedText(item.organization, locale)}</span>
        {item.estimatedMinutes !== null && (
          <Meta>{t('time', { hours: Math.max(1, Math.round(item.estimatedMinutes / 60)) })}</Meta>
        )}
        <Meta>{item.cost.amount === 0 ? t('free') : formatCatalogCost(item, locale) ?? t('costUnknown')}</Meta>
        <Meta>{t(`remote.${item.remoteStatus}`)}</Meta>
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/[0.06] pt-3">
        <span className="inline-flex items-center gap-1.5 t-footnote text-white/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
          {t(`trust.${item.source.trustLevel}`)} · {localizedText(item.source.name, locale)}
        </span>
        {verifiedDate && <span className="t-footnote text-white/60">{t('verified', { date: verifiedDate })}</span>}
        {item.learningEligible && !item.requiresManualEligibilityCheck && (
          <Link
            href={`/pathfinder/plan?item=${encodeURIComponent(item.id)}`}
            className="ml-auto rounded-lg border border-violet-400/25 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-100 transition-colors hover:bg-violet-500/20"
          >
            {t('addToPlan')}
          </Link>
        )}
      </div>
    </article>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  return <span className="t-footnote text-white/60">{children}</span>;
}

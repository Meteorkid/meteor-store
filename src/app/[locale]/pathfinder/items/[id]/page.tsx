import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import CatalogItemCard from '@/components/pathfinder/CatalogItemCard';
import SaveButton from '@/components/pathfinder/SaveButton';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getSession } from '@/lib/auth';
import { getCatalogItem, listCatalogItems } from '@/lib/pathfinder/catalog';
import { findRelatedItems } from '@/lib/pathfinder/related';
import { listPathfinderSaves } from '@/lib/pathfinder/saves';
import { CATALOG_FACT_KEYS } from '@/lib/pathfinder/catalog-fields';
import {
  formatCatalogCost,
  formatCatalogDeadlineDate,
  formatDate,
  getDeadlineState,
  localizedText,
  localizedTextState,
  sortByRecency,
} from '@/lib/pathfinder/catalog-view';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const item = await getCatalogItem(id);
  if (!item) return {};
  return { title: localizedText(item.title, locale), description: localizedText(item.summary, locale) };
}

export default async function PathfinderItemPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const item = await getCatalogItem(id);
  if (!item) notFound();
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: 'PathfinderHub.itemPage' });
  const deadline = getDeadlineState(item);
  const pathfinderLocale = locale === 'en' ? 'en' : 'zh';
  const title = localizedTextState(item.title, pathfinderLocale);
  const summary = localizedTextState(item.summary, pathfinderLocale);
  const allFacts = {
    time: { label: t('time'), value: item.estimatedMinutes === null ? t('unknown') : t('minutes', { minutes: item.estimatedMinutes }) },
    cost: { label: t('costLabel'), value: item.cost.amount === 0 ? t('free') : formatCatalogCost(item, typedLocale) ?? t('unknown') },
    device: { label: t('device'), value: t(`devices.${item.device}`) },
    network: { label: t('network'), value: t(`networks.${item.network}`) },
    remote: { label: t('remoteLabel'), value: t(`remote.${item.remoteStatus}`) },
    region: { label: t('region'), value: item.region ? localizedText(item.region, locale) : t('unknown') },
    deadline: { label: t('deadlineLabel'), value: item.deadlineText ? localizedText(item.deadlineText, locale) : formatCatalogDeadlineDate(item, typedLocale) ?? t('unknown') },
    published: { label: t('publishedAt'), value: formatDate(item.publishedAt, typedLocale) ?? t('unknown') },
  };
  // 每类条目只列真正相关的事实（顺序与判断见 catalog-fields.ts）：
  // 一条 AI 动态标着「免费 · 形式未注明 · 需要电脑」既没有信息量，
  // 又会让人误以为这是可以报名的机会。
  const facts = CATALOG_FACT_KEYS[item.itemType].map((key) => allFacts[key]);
  const session = await getSession();
  const saved = session
    ? (await listPathfinderSaves(session.userId)).some((save) => save.itemId === item.id)
    : false;
  const sameDirection = await listCatalogItems({ direction: item.direction });
  // 同一条线索的条目：靠标题里的专名重叠判定，见 lib/pathfinder/related.ts。
  // 这与下面「同方向的其它条目」是两回事——前者说的是同一件事的后续，
  // 后者只是碰巧在一个方向里，不能混在一个区块里让读者自己分辨。
  const storyline = item.itemType === 'ai-update'
    ? findRelatedItems(item, await listCatalogItems({ type: 'ai-update' })).slice(0, 5)
    : [];
  const storylineIds = new Set(storyline.map((candidate) => candidate.id));
  const related = sortByRecency(sameDirection)
    .filter((candidate) => candidate.id !== item.id && !storylineIds.has(candidate.id))
    .slice(0, 4);

  return (
    <main className="container mx-auto px-4 py-10 sm:py-14 lg:py-16">
      <article className="mx-auto max-w-7xl">
        <nav className="mb-8 flex flex-wrap items-center gap-2 t-footnote text-white/60" aria-label={t('breadcrumb')}>
          <Link href="/pathfinder">{t('discover')}</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/pathfinder/opportunities?type=${item.itemType}`}>{t(`types.${item.itemType}`)}</Link>
        </nav>

        <header className="border-b border-white/10 pb-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-2.5 py-1 text-[11px] font-semibold text-violet-200">{t(`types.${item.itemType}`)}</span>
            <span className="t-footnote text-white/60">{item.directions.map((direction) => t(`directions.${direction}`)).join(' · ')}</span>
            {item.itemType !== 'ai-update' && (
              <>
                <span aria-hidden="true" className="text-white/25">·</span>
                <span className="t-footnote text-white/60">{t(`difficulties.${item.difficulty}`)}</span>
              </>
            )}
          </div>
          <h1 lang={title.fallback ? 'en' : undefined} className="mt-5 max-w-5xl t-title-1 text-white">{title.text}</h1>
          <p lang={summary.fallback ? 'en' : undefined} className="mt-4 max-w-4xl t-body text-white/60">
            {summary.text || t('noSummary')}
          </p>
          {/* 与卡片一致：只有摘要仍是英文才提示，专有名词标题不算「没有中文版本」 */}
          {summary.fallback && (
            <p className="mt-3 t-footnote text-white/60">{t('originalLanguage')}</p>
          )}
          <p className="mt-5 text-sm font-semibold text-white/80">{localizedText(item.organization, locale)}</p>
        </header>

        <div className="grid grid-cols-1 gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
          <div className="min-w-0 space-y-12">
            <section>
              <p className="t-eyebrow text-violet-300">{t('fitEyebrow')}</p>
              <h2 className="mt-2 t-title-2 text-white">{t('fitTitle')}</h2>
              <p className="mt-4 t-body text-white/70">{localizedText(item.eligibility, locale)}</p>
              {item.requiresManualEligibilityCheck && (
                <p className="mt-4 rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-100">
                  {t('manualEligibilityNotice')}
                </p>
              )}
            </section>

            <section>
              <p className="t-eyebrow text-violet-300">{t('skillsEyebrow')}</p>
              <h2 className="mt-2 t-title-2 text-white">{t('skillsTitle')}</h2>
              {item.tags.skill.length > 0 ? (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {item.tags.skill.map((skill) => <li key={skill} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-sm text-white/70">{skill}</li>)}
                </ul>
              ) : (
                <p className="mt-4 text-sm leading-6 text-white/60">{t('skillsUnknown')}</p>
              )}
            </section>

            <section>
              <p className="t-eyebrow text-violet-300">{t('sourceEyebrow')}</p>
              <h2 className="mt-2 t-title-2 text-white">{t('sourceTitle')}</h2>
              <div className="mt-5 border-y border-white/10">
                <FactRow label={t('sourceName')} value={`${localizedText(item.source.name, locale)} · ${t(`trust.${item.source.trustLevel}`)}`} />
                <FactRow label={t('publishedAt')} value={formatDate(item.publishedAt, typedLocale) ?? t('unknown')} />
                <FactRow label={t('discoveredAt')} value={formatDate(item.discoveredAt, typedLocale) ?? t('unknown')} />
                <FactRow label={t('verifiedAt')} value={formatDate(item.verifiedAt, typedLocale) ?? t('unknown')} />
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <SaveButton
                  itemId={item.id}
                  initialSaved={saved}
                  signedIn={Boolean(session)}
                />
              </div>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <a href={item.canonicalUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-white/10 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-white/15">
                  {t('openOriginal')} ↗
                </a>
                <a href={item.source.siteUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/10 px-4 py-2.5 text-center text-sm font-semibold text-white/70 hover:text-white">
                  {t('visitSource')} ↗
                </a>
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="glass rounded-2xl p-5">
              <h2 className="t-title-4 text-white">{t('factsTitle')}</h2>
              <dl className="mt-4 divide-y divide-white/[0.07]">
                {facts.map((fact) => <CompactFact key={fact.label} label={fact.label} value={fact.value} />)}
              </dl>
              {deadline.state === 'expired' && <p className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">{t('expired')}</p>}
            </section>

            {item.learningEligible && !item.requiresManualEligibilityCheck ? (
              <section className="rounded-2xl border border-violet-400/20 bg-violet-500/[0.08] p-5">
                <p className="t-eyebrow text-violet-300">{t('planEyebrow')}</p>
                <h2 className="mt-2 t-title-3 text-white">{t('planTitle')}</h2>
                <p className="mt-3 text-sm leading-6 text-white/60">{t('planDescription')}</p>
                <Link href={`/pathfinder/plan?item=${encodeURIComponent(item.id)}`} className="mt-5 inline-flex rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500">
                  {t('addToPlan')}
                </Link>
              </section>
            ) : (
              <section className="rounded-2xl border border-white/10 p-5">
                <p className="text-sm font-semibold text-white">{item.requiresManualEligibilityCheck ? t('manualOnlyTitle') : t('contextOnlyTitle')}</p>
                <p className="mt-2 text-sm leading-6 text-white/60">{item.requiresManualEligibilityCheck ? t('manualOnlyDescription') : t('contextOnlyDescription')}</p>
              </section>
            )}
          </aside>
        </div>

        {storyline.length > 0 && (
          <section className="border-t border-white/10 pt-10">
            <p className="t-eyebrow text-violet-300">{t('storylineEyebrow')}</p>
            <h2 className="mt-2 t-title-2 text-white">{t('storylineTitle', { count: storyline.length })}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/60">{t('storylineDescription')}</p>
            <div className="mt-3">
              {storyline.map((candidate) => (
                <CatalogItemCard key={candidate.id} item={candidate} locale={typedLocale} compact />
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="border-t border-white/10 pt-10">
            <p className="t-eyebrow text-violet-300">{t('relatedEyebrow')}</p>
            <h2 className="mt-2 t-title-2 text-white">{t('relatedTitle')}</h2>
            <div className="mt-3">{related.map((candidate) => <CatalogItemCard key={candidate.id} item={candidate} locale={typedLocale} />)}</div>
          </section>
        )}
      </article>
    </main>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return <div className="grid grid-cols-1 gap-1 border-b border-white/[0.07] py-4 last:border-b-0 sm:grid-cols-[180px_minmax(0,1fr)]"><dt className="text-sm text-white/60">{label}</dt><dd className="text-sm text-white/80">{value}</dd></div>;
}

function CompactFact({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-4 py-3"><dt className="t-footnote text-white/60">{label}</dt><dd className="text-right t-footnote text-white/80">{value}</dd></div>;
}

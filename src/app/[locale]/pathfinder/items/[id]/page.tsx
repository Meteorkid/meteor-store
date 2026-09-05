import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import CatalogItemCard from '@/components/pathfinder/CatalogItemCard';
import SaveButton from '@/components/pathfinder/SaveButton';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getSession } from '@/lib/auth';
import { getCatalogItem, listCatalogItems } from '@/lib/pathfinder/catalog';
import { getApprovedEditorialNote } from '@/lib/pathfinder/editorial-store';
import { fetchDigestContent } from '@/lib/pathfinder/digest-content';
import { articleSummaryUrl } from '@/lib/pathfinder/ingestion/article-summary';
import { PATHFINDER_SYNC_SOURCE_MAP } from '@/lib/pathfinder/ingestion/sources';
import { findRelatedItems } from '@/lib/pathfinder/related';
import { listPathfinderSaves } from '@/lib/pathfinder/saves';
import { CATALOG_FACT_KEYS } from '@/lib/pathfinder/catalog-fields';
import {
  formatCatalogCost,
  formatCatalogDeadlineDate,
  formatDate,
  getDeadlineState,
  isDigestItem,
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
  // 只取已人工确认的解读；草稿永远不进渲染层
  const editorialNote = item.itemType === 'ai-update'
    ? await getApprovedEditorialNote(item.id)
    : null;
  const session = await getSession();
  const saved = session
    ? (await listPathfinderSaves(session.userId)).some((save) => save.itemId === item.id)
    : false;
  const sameDirection = await listCatalogItems({ direction: item.direction });
  // 同一条线索的条目：靠标题里的专名重叠判定，见 lib/pathfinder/related.ts。
  // 这与下面「同方向的其它条目」是两回事——前者说的是同一件事的后续，
  // 后者只是碰巧在一个方向里，不能混在一个区块里让读者自己分辨。
  /*
   * 资讯摘要条目额外抓一次全文。不进数据库——一期 320KB，按天累积一年约 117MB，
   * 而日报发布后内容不再变，缓存命中率接近 100%（见 digest-content.ts）。
   */
  const digestSource = isDigestItem(item) ? PATHFINDER_SYNC_SOURCE_MAP.get(item.sourceId) : undefined;
  const digestUrl = digestSource ? articleSummaryUrl(digestSource, item.canonicalUrl) : null;
  const digest = digestUrl && digestSource?.articleSummary
    ? await fetchDigestContent(digestUrl, digestSource.articleSummary.fetchHost)
    : null;

  /*
   * 每类条目只列真正相关的事实（顺序与判断见 catalog-fields.ts）：
   * 一条 AI 动态标着「免费 · 形式未注明 · 需要电脑」既没有信息量，
   * 又会让人误以为这是可以报名的机会。
   *
   * 日报再补一条「收录快讯」：去掉恒定的地区之后它只剩发布时间一行，
   * 而「这期有多少条」既是真事实，也让人在读之前知道要面对多大的量。
   */
  const facts = [
    ...CATALOG_FACT_KEYS[item.itemType].map((key) => allFacts[key]),
    ...(digest ? [{ label: t('digestItemsLabel'), value: t('digestItemCount', { count: digest.itemCount }) }] : []),
  ];

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
          {/*
            拿到全文时不再重复摘要。
            日报的卡片摘要取自「今日总结」的首段，而全文里那一段照样会渲染出来——
            两处逐字相同、同屏可见，读者会以为页面出错了。
            全文抓取失败（digest 为 null）时这段必须保留，否则页面只剩一个标题。
          */}
          {!digest && (
            <>
              <p lang={summary.fallback ? 'en' : undefined} className="mt-4 max-w-4xl t-body text-white/60">
                {summary.text || t('noSummary')}
              </p>
              {/* 与卡片一致：只有摘要仍是英文才提示，专有名词标题不算「没有中文版本」 */}
              {summary.fallback && (
                <p className="mt-3 t-footnote text-white/60">{t('originalLanguage')}</p>
              )}
            </>
          )}
          <p className="mt-5 text-sm font-semibold text-white/80">{localizedText(item.organization, locale)}</p>
        </header>

        <div className="grid grid-cols-1 gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
          <div className="min-w-0 space-y-12">
            {digest && (
              <section>
                <p className="t-eyebrow text-violet-300">{t('digestEyebrow')}</p>
                <h2 className="mt-2 t-title-2 text-white">{t('digestTitle')}</h2>
                {/* 上游 .md 自带的出处声明，原样展示，不改写也不省略 */}
                {digest.attribution && (
                  <p className="mt-3 border-l-2 border-violet-400/30 pl-3 t-footnote text-white/60">
                    {digest.attribution}
                  </p>
                )}

                {digest.sections.map((section) => (
                  <div key={section.heading} className="mt-10 first:mt-8">
                    <h3 className="t-title-3 text-white">{section.heading}</h3>

                    {section.html && (
                      <div
                        className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/70 prose-li:text-white/70 prose-strong:text-white prose-a:text-violet-200 prose-a:underline prose-a:decoration-violet-300/30 prose-a:underline-offset-4 prose-a:font-normal hover:prose-a:decoration-violet-200 mt-4"
                        dangerouslySetInnerHTML={{ __html: section.html }}
                      />
                    )}

                    {/*
                      有小节的节按小节折叠：实测「分频道观察」与「分公司动态」
                      合计占一期 97% 的篇幅，全铺开页面重到没法读。
                      条目数放在标题旁，让人在展开前就知道值不值得点。
                    */}
                    {section.subsections.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {section.subsections.map((sub) => (
                          <details
                            key={sub.heading}
                            className="group rounded-xl border border-white/10 bg-white/[0.02] open:border-violet-400/25 open:bg-violet-500/[0.06]"
                          >
                            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                              {/* 只有开合状态用得上这个箭头，读屏靠 details 自身语义，故隐藏 */}
                              <span
                                aria-hidden="true"
                                className="text-violet-300 motion-safe:transition-transform group-open:rotate-90"
                              >
                                ›
                              </span>
                              <span className="min-w-0 flex-1 t-title-4 text-white">{sub.heading}</span>
                              <span className="shrink-0 t-footnote text-white/60">
                                {t('digestItemCount', { count: sub.itemCount })}
                              </span>
                            </summary>
                            <div
                              className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/70 prose-li:text-white/70 prose-strong:text-white prose-a:text-violet-200 prose-a:underline prose-a:decoration-violet-300/30 prose-a:underline-offset-4 prose-a:font-normal hover:prose-a:decoration-violet-200 border-t border-white/10 px-4 py-4"
                              dangerouslySetInnerHTML={{ __html: sub.html }}
                            />
                          </details>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}

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

            {editorialNote && (
              <section>
                <p className="t-eyebrow text-violet-300">{t('noteEyebrow')}</p>
                <h2 className="mt-2 t-title-2 text-white">{t('noteTitle')}</h2>
                {/*
                  来源标注不可省：这段文字由模型起草、由人确认，读者有权知道它
                  和上面那段官方摘要不是一回事。
                */}
                <p className="mt-3 t-footnote text-white/60">
                  {editorialNote.editedByHuman ? t('noteProvenanceEdited') : t('noteProvenance')}
                </p>

                <div className="mt-5 space-y-5">
                  <div>
                    <h3 className="t-title-4 text-white">{t('noteWhatHappened')}</h3>
                    <p className="mt-2 t-body text-white/70">{editorialNote.whatHappened}</p>
                  </div>
                  <div>
                    <h3 className="t-title-4 text-white">{t('noteWhyItMatters')}</h3>
                    <p className="mt-2 t-body text-white/70">{editorialNote.whyItMatters}</p>
                  </div>
                  {editorialNote.skills.length > 0 && (
                    <div>
                      <h3 className="t-title-4 text-white">{t('noteSkills')}</h3>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {editorialNote.skills.map((skill) => (
                          <li key={skill} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-sm text-white/70">
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <h3 className="t-title-4 text-white">{t('noteSuggestedAction')}</h3>
                    <p className="mt-2 t-body text-white/70">{editorialNote.suggestedAction}</p>
                  </div>
                </div>
              </section>
            )}

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
                <a href={item.canonicalUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-violet-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-violet-500">
                  {t('openOriginal')} ↗
                </a>
                <a href={item.source.siteUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-violet-400/40 bg-violet-500/15 px-4 py-2.5 text-center text-sm font-semibold text-violet-100 hover:bg-violet-500/25 hover:text-white">
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

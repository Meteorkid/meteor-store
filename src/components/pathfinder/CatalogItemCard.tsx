import { getTranslations } from 'next-intl/server';
import SaveButton from '@/components/pathfinder/SaveButton';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { PathfinderCatalogItem } from '@/lib/pathfinder/catalog-types';
import { catalogMetaFields } from '@/lib/pathfinder/catalog-fields';
import {
  formatCatalogDeadlineDate,
  formatDate,
  getDeadlineState,
  isActionableTask,
  localizedText,
  localizedTextState,
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
  compact = false,
  saveState,
}: {
  item: PathfinderCatalogItem;
  locale: Locale;
  featured?: boolean;
  /** 紧凑视图：只保留类型、标题和关键元信息，一屏能扫更多条目。 */
  compact?: boolean;
  /**
   * 收藏状态。由页面一次性批量查好后传进来——每张卡片自己 fetch 一次的话，
   * 机会库一页 24 张卡就是 24 个请求。不传则不渲染收藏按钮。
   */
  saveState?: { signedIn: boolean; saved: boolean };
}) {
  const t = await getTranslations({ locale, namespace: 'PathfinderHub.catalog' });
  const pathfinderLocale = locale === 'en' ? 'en' : 'zh';
  const deadline = getDeadlineState(item);
  const deadlineDate = formatCatalogDeadlineDate(item, pathfinderLocale);
  const verifiedDate = formatDate(item.verifiedAt, pathfinderLocale);
  const title = localizedTextState(item.title, pathfinderLocale);
  const summary = localizedTextState(item.summary, pathfinderLocale);
  const meta = catalogMetaFields(item, pathfinderLocale, t);
  // 整仓库入口回答「可以参与这个项目」，具体 issue 才回答「第一步做什么」——
  // 两者在同一个列表里混着，不标出来学生分不清哪条是现在就能动手的
  const actionableTask = isActionableTask(item);
  // AI 动态没有报名截止一说，发布时间已经在元信息里，不再重复渲染截止标签
  const showDeadline = item.itemType !== 'ai-update'
    && deadlineDate
    && deadline.state !== 'expired';

  if (compact) {
    return (
      <article className="group flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-white/10 py-3 transition-colors duration-200 hover:bg-white/[0.025]">
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${TYPE_TONES[item.itemType]}`}>
          {t(`types.${item.itemType}`)}
        </span>
        <h3 className="t-title-4 min-w-0 flex-1 text-white">
          <Link
            href={`/pathfinder/items/${item.id}`}
            lang={title.fallback ? 'en' : undefined}
            className="transition-colors hover:text-violet-200"
          >
            {title.text}
          </Link>
        </h3>
        {actionableTask && (
          <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[11px] text-emerald-200">
            {t('actionableTask')}
          </span>
        )}
        <span className="t-footnote text-white/60">{meta[0]}</span>
        {showDeadline && (
          <span className={`t-footnote ${deadline.state === 'urgent' ? 'text-red-200' : 'text-white/60'}`}>
            {t('deadline', { date: deadlineDate })}
          </span>
        )}
      </article>
    );
  }

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
        {item.itemType !== 'ai-update' && (
          <>
            <span aria-hidden="true" className="text-white/25">·</span>
            <span className="t-footnote text-white/60">{t(`difficulties.${item.difficulty}`)}</span>
          </>
        )}
        {actionableTask && (
          <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-1 text-[11px] font-semibold text-emerald-200">
            {t('actionableTask')}
          </span>
        )}
        {item.requiresManualEligibilityCheck && (
          <span className="rounded-full border border-amber-400/25 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-100">
            {t('manualEligibility')}
          </span>
        )}
        {showDeadline && (
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
        <Link
          href={`/pathfinder/items/${item.id}`}
          lang={title.fallback ? 'en' : undefined}
          className="transition-colors hover:text-violet-200"
        >
          {title.text}
        </Link>
      </h3>

      {summary.text ? (
        <p
          lang={summary.fallback ? 'en' : undefined}
          className={`mt-3 max-w-3xl text-white/60 ${featured ? 't-body line-clamp-3' : 'text-sm leading-6 line-clamp-3'}`}
        >
          {summary.text}
        </p>
      ) : (
        // 来源没给摘要时留白会让卡片看起来是坏的；如实说明并把动作指向原文
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/60">{t('noSummary')}</p>
      )}

      {/*
        只按摘要判断要不要提示语言：标题里大量是 IBM Z Datathon、Apache Airflow
        这类专有名词，本来就没有中文写法，按标题提示会让几乎每张卡片都挂一条噪音。
        摘要是真正需要翻译的正文，它是英文才说明这条内容没有中文版本。
      */}
      {summary.fallback && (
        <p className="mt-2 t-footnote text-white/60">{t('originalLanguage')}</p>
      )}

      <div className="relative mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="text-sm font-medium text-white/80">{meta[0]}</span>
        {meta.slice(1).map((field) => <Meta key={field}>{field}</Meta>)}
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/[0.06] pt-3">
        <span className="inline-flex items-center gap-1.5 t-footnote text-white/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
          {t(`trust.${item.source.trustLevel}`)} · {localizedText(item.source.name, locale)}
        </span>
        {verifiedDate && <span className="t-footnote text-white/60">{t('verified', { date: verifiedDate })}</span>}
        <span className="ml-auto inline-flex flex-wrap items-center gap-2">
          {saveState && (
            <SaveButton
              itemId={item.id}
              initialSaved={saveState.saved}
              signedIn={saveState.signedIn}
            />
          )}
          {item.learningEligible && !item.requiresManualEligibilityCheck && (
            <Link
              href={`/pathfinder/plan?item=${encodeURIComponent(item.id)}`}
              className="rounded-lg border border-violet-400/25 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-100 transition-colors hover:bg-violet-500/20"
            >
              {t('addToPlan')}
            </Link>
          )}
        </span>
      </div>
    </article>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  return <span className="t-footnote text-white/60">{children}</span>;
}

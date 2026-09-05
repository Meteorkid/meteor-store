import type { PathfinderCatalogItem, PathfinderItemType } from './catalog-types';
import {
  formatCatalogCost,
  formatDate,
  isActionableTask,
  localizedText,
  type PathfinderLocale,
} from './catalog-view';

/** 卡片元信息只需要取词条，抽成函数签名以便脱离 next-intl 单独测试。 */
export type CatalogTranslate = (key: string, values?: Record<string, string | number>) => string;

/**
 * 卡片上按类型显示哪些字段。
 *
 * 四类条目曾共用一套字段，于是一条 AI 动态也会显示「免费 · 形式未注明」——
 * 那两个字段对新闻毫无意义，却占着卡片最显眼的位置，还让人误以为这是能报名的机会。
 * 现在每类只渲染真正相关的字段：
 *
 * - 竞赛：主办方、费用、地区（要不要交钱、能不能参加）
 * - 实习：公司、地点、参与形式、发布时间（在哪上班、还新不新）
 * - 开源仓库：组织、预计投入、技能标签（要花多久、练什么）
 * - 开源任务（具体 issue）：仓库、预计投入、issue 标签（在哪个仓库、是什么类型的活）
 * - AI 动态：机构、发布时间（谁说的、什么时候说的）
 */
export function catalogMetaFields(
  item: PathfinderCatalogItem,
  locale: PathfinderLocale,
  t: CatalogTranslate,
): string[] {
  const organization = localizedText(item.organization, locale);
  const region = item.region ? localizedText(item.region, locale) : null;
  const published = formatDate(item.publishedAt, locale);
  const publishedField = published ? t('published', { date: published }) : null;
  const cost = item.cost.amount === 0
    ? t('free')
    : formatCatalogCost(item, locale) ?? t('costUnknown');
  const hours = item.estimatedMinutes !== null
    ? t('time', { hours: Math.max(1, Math.round(item.estimatedMinutes / 60)) })
    : null;

  switch (item.itemType) {
    case 'ai-update':
      return [organization, publishedField].filter(isText);
    case 'internship':
      return [
        organization,
        region,
        // 「形式未注明」占一个字段却什么都没说；未知就不显示，详情页仍如实列出
        item.remoteStatus === 'unspecified' ? null : t(`remote.${item.remoteStatus}`),
        publishedField,
      ].filter(isText);
    case 'competition':
      return [organization, cost, region].filter(isText);
    case 'open-source':
    default: {
      // 具体 issue 的 organization 存的就是 owner/repo，技能标签往往为空，
      // 这时用 issue 自己的标签（bug、documentation…）说明这是什么类型的活
      const detail = isActionableTask(item) && item.tags.skill.length === 0
        ? item.tags.topic.filter((tag) => !tag.includes('/')).slice(0, 2)
        : item.tags.skill.slice(0, 2);
      return [organization, hours, ...detail].filter(isText);
    }
  }
}

/**
 * 详情页侧栏「关键事实」按类型选取的字段顺序。
 * 与卡片同源的判断：不相关的事实不是「留白更安全」，而是会误导。
 */
export const CATALOG_FACT_KEYS = {
  /*
   * AI 动态不列地区：抓取管线给每条 RSS 都硬编码 `region: 'global'`
   * （见 ingestion/parse.ts），线上实测 100/100 全是「全球」——一个恒定值
   * 不构成事实，只是占着位置。这正是本文件开头说的那类问题，当时只清了卡片，
   * 详情页的事实表漏了。
   */
  'ai-update': ['published'],
  competition: ['deadline', 'cost', 'region', 'remote', 'time', 'device', 'network'],
  internship: ['region', 'remote', 'deadline', 'published'],
  'open-source': ['time', 'device', 'network'],
} as const satisfies Record<PathfinderItemType, readonly string[]>;

function isText(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

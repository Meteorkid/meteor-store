import {
  PATHFINDER_DIFFICULTIES,
  PATHFINDER_DIRECTIONS,
  PATHFINDER_ITEM_TYPES,
  PATHFINDER_REMOTE_STATUSES,
  type PathfinderCatalogItem,
  type PathfinderDifficulty,
  type PathfinderDirection,
  type PathfinderItemType,
  type PathfinderRemoteStatus,
} from './catalog-types';

export type PathfinderLocale = 'zh' | 'en';
export type DeadlineFilter = '30d' | '90d';

export interface CatalogFilterState {
  q: string;
  type?: PathfinderItemType;
  direction?: PathfinderDirection;
  difficulty?: PathfinderDifficulty;
  remoteStatus?: PathfinderRemoteStatus;
  deadline?: DeadlineFilter;
}

type SearchParamValue = string | string[] | undefined;

export function localizedText(value: { zh: string; en: string }, locale: string) {
  return locale === 'en' ? value.en : value.zh;
}

export function formatCatalogCost(item: PathfinderCatalogItem, locale: PathfinderLocale) {
  if (item.cost.label) return localizedText(item.cost.label, locale);
  if (item.cost.amount === null || !item.cost.currency) return null;
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'zh-CN', {
    style: 'currency',
    currency: item.cost.currency,
    currencyDisplay: 'symbol',
    maximumFractionDigits: 2,
  }).format(item.cost.amount);
}

export function parseCatalogFilters(
  params: Record<string, SearchParamValue>,
): CatalogFilterState {
  const q = first(params.q)?.trim().slice(0, 100) ?? '';
  const type = asMember(first(params.type), PATHFINDER_ITEM_TYPES);
  const direction = asMember(first(params.direction), PATHFINDER_DIRECTIONS);
  const difficulty = asMember(first(params.difficulty), PATHFINDER_DIFFICULTIES);
  const remoteStatus = asMember(first(params.remote), PATHFINDER_REMOTE_STATUSES);
  const deadlineValue = first(params.deadline);
  const deadline = deadlineValue === '30d' || deadlineValue === '90d' ? deadlineValue : undefined;

  return { q, type, direction, difficulty, remoteStatus, deadline };
}

export function filterCatalogItems(
  items: readonly PathfinderCatalogItem[],
  filters: CatalogFilterState,
  now = new Date(),
) {
  const query = filters.q.toLocaleLowerCase();
  const deadlineLimit = filters.deadline
    ? new Date(now.getTime() + (filters.deadline === '30d' ? 30 : 90) * 86_400_000)
    : null;

  return items.filter((item) => {
    if (item.status !== 'published') return false;
    if (filters.type && item.itemType !== filters.type) return false;
    if (filters.direction && !item.directions.includes(filters.direction)) return false;
    if (filters.difficulty && item.difficulty !== filters.difficulty) return false;
    if (filters.remoteStatus && item.remoteStatus !== filters.remoteStatus) return false;
    if (deadlineLimit) {
      const deadline = catalogDeadlineTimestamp(item);
      const expiry = catalogDeadlineTimestamp(item, true);
      if (
        deadline === null
        || expiry === null
        || expiry < now.getTime()
        || deadline > deadlineLimit.getTime()
      ) return false;
    }
    if (!query) return true;

    const haystack = [
      item.title.zh,
      item.title.en,
      item.summary.zh,
      item.summary.en,
      item.organization.zh,
      item.organization.en,
      item.source.name.zh,
      item.source.name.en,
      item.eligibility.zh,
      item.eligibility.en,
      item.region?.zh ?? '',
      item.region?.en ?? '',
      ...Object.values(item.tags).flat(),
    ]
      .join('\n')
      .toLocaleLowerCase();
    return haystack.includes(query);
  });
}

export type DeadlineState = 'unknown' | 'expired' | 'urgent' | 'soon' | 'later';

export function getDeadlineState(item: PathfinderCatalogItem, now = new Date()): {
  state: DeadlineState;
  daysLeft: number | null;
} {
  const deadline = catalogDeadlineTimestamp(item, true);
  if (deadline === null) return { state: 'unknown', daysLeft: null };
  const daysLeft = Math.ceil((deadline - now.getTime()) / 86_400_000);
  if (daysLeft < 0) return { state: 'expired', daysLeft };
  if (daysLeft <= 7) return { state: 'urgent', daysLeft };
  if (daysLeft <= 30) return { state: 'soon', daysLeft };
  return { state: 'later', daysLeft };
}

export function sortByDeadline(items: readonly PathfinderCatalogItem[], now = new Date()) {
  return [...items]
    .filter((item) => {
      const deadline = getDeadlineState(item, now);
      return deadline.state !== 'unknown' && deadline.state !== 'expired';
    })
    .sort((a, b) => catalogDeadlineTimestamp(a)! - catalogDeadlineTimestamp(b)!);
}

/**
 * 精确截止时间直接使用官方时区换算；只有日期时只用于排序，过期判断采用 UTC-12
 * 的日末，确保不会因为擅自假设时区而提前隐藏。
 */
export function catalogDeadlineTimestamp(
  item: Pick<PathfinderCatalogItem, 'deadlineAt' | 'deadlineDate'>,
  conservativeEnd = false,
): number | null {
  if (item.deadlineAt) {
    const timestamp = Date.parse(item.deadlineAt);
    return Number.isFinite(timestamp) ? timestamp : null;
  }
  if (!item.deadlineDate || !/^\d{4}-\d{2}-\d{2}$/.test(item.deadlineDate)) return null;
  const suffix = conservativeEnd ? 'T23:59:59-12:00' : 'T00:00:00Z';
  const timestamp = Date.parse(`${item.deadlineDate}${suffix}`);
  return Number.isFinite(timestamp) ? timestamp : null;
}

/** 日期级截止用于排程时按全球最早进入该日期的 UTC+14 计算，避免把整周行动排过官方日期。 */
export function catalogDeadlinePlanningTimestamp(
  item: Pick<PathfinderCatalogItem, 'deadlineAt' | 'deadlineDate'>,
): number | null {
  if (item.deadlineAt) {
    const timestamp = Date.parse(item.deadlineAt);
    return Number.isFinite(timestamp) ? timestamp : null;
  }
  if (!item.deadlineDate || !/^\d{4}-\d{2}-\d{2}$/.test(item.deadlineDate)) return null;
  const timestamp = Date.parse(`${item.deadlineDate}T00:00:00+14:00`);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function formatCatalogDeadlineDate(
  item: Pick<PathfinderCatalogItem, 'deadlineAt' | 'deadlineDate'>,
  locale: PathfinderLocale,
) {
  if (item.deadlineAt) return formatDate(item.deadlineAt, locale);
  if (!item.deadlineDate) return null;
  const date = new Date(`${item.deadlineDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function sortByRecency(items: readonly PathfinderCatalogItem[]) {
  return [...items].sort(
    (a, b) => new Date(b.verifiedAt).getTime() - new Date(a.verifiedAt).getTime(),
  );
}

export function formatDate(value: string | null, locale: PathfinderLocale) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Shanghai',
  }).format(date);
}

export function catalogStats(items: readonly PathfinderCatalogItem[]) {
  return {
    total: items.length,
    learning: items.filter((item) => item.learningEligible).length,
    official: items.filter((item) => item.source.trustLevel === 'official').length,
    directions: new Set(items.flatMap((item) => item.directions)).size,
  };
}

export interface PathfinderHomeFeed {
  featured: PathfinderCatalogItem[];
  opportunities: PathfinderCatalogItem[];
  openSource: PathfinderCatalogItem[];
  updates: PathfinderCatalogItem[];
}

/**
 * 首页按类型设置固定席位，避免高频同步的开源 issue 淹没低频但更时效敏感的竞赛与实习。
 * 竞赛、实习优先展示仍可报名且截止日更近的项目；没有明确截止日的长期入口排在其后。
 */
export function selectPathfinderHomeFeed(
  items: readonly PathfinderCatalogItem[],
  now = new Date(),
): PathfinderHomeFeed {
  const published = items.filter((item) => item.status === 'published');
  const competitions = prioritizeHomeOpportunities(
    published.filter((item) => item.itemType === 'competition'),
    now,
  );
  const internships = prioritizeHomeOpportunities(
    published.filter((item) => item.itemType === 'internship'),
    now,
  );
  const openSourceCandidates = sortByRecency(
    published.filter((item) => item.itemType === 'open-source'),
  );

  const featured = [
    competitions.find((item) => item.learningEligible),
    internships.find((item) => item.learningEligible),
    openSourceCandidates.find((item) => item.learningEligible),
  ].filter((item): item is PathfinderCatalogItem => Boolean(item));
  const featuredIds = new Set(featured.map((item) => item.id));

  return {
    featured,
    opportunities: interleaveByType(
      competitions.filter((item) => !featuredIds.has(item.id)).slice(0, 3),
      internships.filter((item) => !featuredIds.has(item.id)).slice(0, 3),
    ),
    openSource: openSourceCandidates
      .filter((item) => !featuredIds.has(item.id))
      .slice(0, 4),
    updates: sortByRecency(
      published.filter((item) => item.itemType === 'ai-update'),
    ).slice(0, 4),
  };
}

function prioritizeHomeOpportunities(
  items: readonly PathfinderCatalogItem[],
  now: Date,
) {
  const activeDated = sortByDeadline(items, now);
  const datedIds = new Set(activeDated.map((item) => item.id));
  const undated = sortByRecency(items.filter((item) => (
    catalogDeadlineTimestamp(item, true) === null && !datedIds.has(item.id)
  )));
  return [...activeDated, ...undated];
}

function interleaveByType(
  competitions: readonly PathfinderCatalogItem[],
  internships: readonly PathfinderCatalogItem[],
) {
  const result: PathfinderCatalogItem[] = [];
  const size = Math.max(competitions.length, internships.length);
  for (let index = 0; index < size; index += 1) {
    if (competitions[index]) result.push(competitions[index]);
    if (internships[index]) result.push(internships[index]);
  }
  return result;
}

function first(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

function asMember<T extends string>(value: string | undefined, allowed: readonly T[]): T | undefined {
  return allowed.includes(value as T) ? (value as T) : undefined;
}

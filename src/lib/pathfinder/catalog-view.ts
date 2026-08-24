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

/**
 * 浏览排序。默认（`default`）保持既有的「先按截止时间、再按核验时间」，
 * 其余四种把内部已有的信号显式暴露给浏览的人：新增、临期、门槛、可行动性。
 */
export const CATALOG_SORTS = ['default', 'recent', 'deadline', 'beginner', 'action'] as const;
export type CatalogSort = (typeof CATALOG_SORTS)[number];

/** 机会库每页条数。分页而不是无限堆叠，避免首屏一次渲染上百张卡片。 */
export const CATALOG_PAGE_SIZE = 24;

export interface CatalogFilterState {
  q: string;
  type?: PathfinderItemType;
  direction?: PathfinderDirection;
  difficulty?: PathfinderDifficulty;
  remoteStatus?: PathfinderRemoteStatus;
  deadline?: DeadlineFilter;
  /** 只看具体可上手的任务（见 isActionableTask）。 */
  taskOnly?: boolean;
  sort: CatalogSort;
  page: number;
  compact: boolean;
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
  const taskOnly = first(params.task) === '1';
  const sort = asMember(first(params.sort), CATALOG_SORTS) ?? 'default';
  const page = parsePage(first(params.page));
  const compact = first(params.view) === 'compact';

  return { q, type, direction, difficulty, remoteStatus, deadline, taskOnly, sort, page, compact };
}

function parsePage(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed >= 1 ? Math.min(parsed, 1000) : 1;
}

/** 筛选只关心「留下哪些条目」，排序与分页状态不参与，方便单独复用与测试。 */
export type CatalogFilterCriteria = Omit<CatalogFilterState, 'sort' | 'page' | 'compact'>;

/**
 * 是不是「一件现在就能动手的具体事」，而不是一个入口页。
 *
 * 目录里两类条目都有粗细两种粒度：
 * - 开源：整仓库（Django、PyTorch）vs 具体 issue
 * - 实习：招聘门户（「XX 集团招聘入口」）vs 具体岗位
 *
 * 粗粒度只告诉学生「这里有机会」，细粒度才回答「第一步做什么」。
 * 判定都用已有数据推导，不新增数据库字段、不需要回填历史：
 * issue 地址固定形如 `.../issues/123`，招聘门户在种子里统一标了
 * `format: ['job-board']`，抓取回来的具体岗位没有这个标记。
 */
export function isActionableTask(
  item: Pick<PathfinderCatalogItem, 'itemType' | 'canonicalUrl' | 'tags'>,
): boolean {
  if (item.itemType === 'open-source') return /\/issues\/\d+$/.test(item.canonicalUrl);
  if (item.itemType === 'internship') return !item.tags.format.includes('job-board');
  return false;
}

export function filterCatalogItems(
  items: readonly PathfinderCatalogItem[],
  filters: CatalogFilterCriteria,
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
    if (filters.taskOnly && !isActionableTask(item)) return false;
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

const DIFFICULTY_ENTRY_ORDER: Record<PathfinderDifficulty, number> = {
  beginner: 0,
  all: 1,
  intermediate: 2,
  advanced: 3,
};

/**
 * 「最值得行动」的可浏览评分。
 *
 * 与 `ranking.ts` 不同：那套评分依赖用户画像，只在生成学习路径时才有输入；
 * 浏览机会库时没有画像，所以这里只用条目自身的客观信号——能不能进路径、
 * 资格是否要人工核对、来源可信度、临期程度、核验新鲜度。
 * 评分只影响排序，不改变任何可行性判定。
 */
export function catalogActionScore(item: PathfinderCatalogItem, now = new Date()): number {
  let score = 0;

  // 能直接进入学习路径的条目才谈得上「可行动」
  if (item.learningEligible) score += 30;
  // 资格要人工核对意味着看完还不知道自己能不能报，行动成本明显更高
  if (item.requiresManualEligibilityCheck) score -= 18;
  if (item.source.trustLevel === 'official') score += 8;

  const { state, daysLeft } = getDeadlineState(item, now);
  if (state === 'expired') return -100;
  // 临期的机会更值得现在动手；但只剩 1 天的项目对学生来说往往已经来不及准备
  if (state === 'urgent') score += daysLeft !== null && daysLeft <= 1 ? 12 : 24;
  else if (state === 'soon') score += 18;
  else if (state === 'later') score += 6;

  const verifiedAt = Date.parse(item.verifiedAt);
  if (Number.isFinite(verifiedAt)) {
    const ageDays = Math.max(0, Math.floor((now.getTime() - verifiedAt) / 86_400_000));
    if (ageDays <= 7) score += 10;
    else if (ageDays <= 30) score += 6;
    else if (ageDays <= 90) score += 3;
  }

  // 免费与已知费用都比「费用待确认」更容易决定要不要投入
  if (item.cost.amount === 0) score += 6;
  else if (item.cost.amount !== null) score += 2;

  return score;
}

/**
 * 按浏览排序整理列表。所有分支都以 id 作为最终 tiebreaker，
 * 保证同分条目在服务端多次渲染之间顺序稳定（否则分页会漏条或重复）。
 */
export function sortCatalogItems(
  items: readonly PathfinderCatalogItem[],
  sort: CatalogSort,
  now = new Date(),
): PathfinderCatalogItem[] {
  const list = [...items];
  const byId = (a: PathfinderCatalogItem, b: PathfinderCatalogItem) => a.id.localeCompare(b.id);

  switch (sort) {
    case 'recent':
      return list.sort((a, b) => (
        Date.parse(b.discoveredAt) - Date.parse(a.discoveredAt) || byId(a, b)
      ));
    case 'deadline': {
      // 无截止时间的长期入口排在最后，而不是被过滤掉——筛选是筛选，排序是排序
      const timestamp = (item: PathfinderCatalogItem) => {
        const value = catalogDeadlineTimestamp(item);
        const stillOpen = getDeadlineState(item, now).state !== 'expired';
        return value !== null && stillOpen ? value : Number.POSITIVE_INFINITY;
      };
      return list.sort((a, b) => timestamp(a) - timestamp(b) || byId(a, b));
    }
    case 'beginner':
      return list.sort((a, b) => (
        DIFFICULTY_ENTRY_ORDER[a.difficulty] - DIFFICULTY_ENTRY_ORDER[b.difficulty]
        || Number(b.learningEligible) - Number(a.learningEligible)
        || Number(a.requiresManualEligibilityCheck) - Number(b.requiresManualEligibilityCheck)
        || byId(a, b)
      ));
    case 'action':
      return list.sort((a, b) => (
        catalogActionScore(b, now) - catalogActionScore(a, now) || byId(a, b)
      ));
    default: {
      const active = sortByDeadline(list, now);
      const activeIds = new Set(active.map((item) => item.id));
      const rest = sortByRecency(list.filter((item) => !activeIds.has(item.id)));
      return [...active, ...rest];
    }
  }
}

/**
 * 在保留当前筛选的前提下改写查询参数。
 *
 * 排序、视图与翻页都是「在当前结果集上换个看法」，不该把用户已选的筛选丢掉；
 * 反过来，改排序或换视图必须回到第 1 页，否则会停在一个对新顺序毫无意义的页码上。
 * 值为 null 时删除该参数，让默认值不进 URL。
 */
export function buildCatalogQuery(
  current: Record<string, string | string[] | undefined>,
  patch: Record<string, string | null>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(current)) {
    const single = Array.isArray(value) ? value[0] : value;
    if (single) params.set(key, single);
  }
  for (const [key, value] of Object.entries(patch)) {
    if (value === null) params.delete(key);
    else params.set(key, value);
  }
  params.sort();
  const query = params.toString();
  return query ? `?${query}` : '';
}

export interface CatalogPage<T> {
  items: T[];
  page: number;
  pageCount: number;
  total: number;
}

/** 越界页码钳回最后一页，避免分享出去的旧链接落到空白页。 */
export function paginateCatalog<T>(
  items: readonly T[],
  page: number,
  pageSize = CATALOG_PAGE_SIZE,
): CatalogPage<T> {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  const start = (current - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page: current, pageCount, total };
}

/**
 * 在固定席位内优先展示不同来源的条目。
 *
 * 首页最近四条 AI 动态全部来自同一家机构时，读者拿到的不是「今天发生了什么」，
 * 而是「某一家今天发了什么」。`keyOf` 决定按什么去重：默认按来源，
 * 开源区块按仓库——四条策展 issue 可能同属一个抓取来源却全来自 apache/airflow，
 * 按来源算它们只占一个席位，按仓库算才拦得住。第一轮按 `maxPerSource` 跳过超额，
 * **但席位没填满时会回填被跳过的条目**——来源本来就少的区块（比如竞赛只有一个
 * 官方聚合源）不该因为多样性约束而少显示内容，多样性是排序偏好，不是过滤器。
 * 两轮都保持传入顺序，不做打散重排。
 */
export function diversifyBySource(
  items: readonly PathfinderCatalogItem[],
  maxPerSource: number,
  limit: number,
  keyOf: (item: PathfinderCatalogItem) => string = (item) => item.sourceId,
): PathfinderCatalogItem[] {
  if (limit <= 0) return [];
  const counts = new Map<string, number>();
  const picked: PathfinderCatalogItem[] = [];
  const deferred: PathfinderCatalogItem[] = [];

  for (const item of items) {
    if (picked.length >= limit) break;
    const key = keyOf(item);
    const used = counts.get(key) ?? 0;
    if (maxPerSource > 0 && used >= maxPerSource) {
      deferred.push(item);
      continue;
    }
    counts.set(key, used + 1);
    picked.push(item);
  }

  for (const item of deferred) {
    if (picked.length >= limit) break;
    picked.push(item);
  }
  return picked;
}

/**
 * 取本地化文案，并说明取到的是不是当前语言的原文。
 *
 * 抓取源多数只有英文，入库时把英文回填进 zh 字段（见 ingestion/sync.ts），
 * 于是中文页面会出现英文标题。这不是可以就地翻译掉的问题，但可以如实标注：
 * `fallback` 为 true 时界面用 `lang` 属性标出真实语言，读屏才不会用中文音库念英文。
 */
export function localizedTextState(
  value: { zh: string; en: string },
  locale: PathfinderLocale,
): { text: string; fallback: boolean } {
  const text = localizedText(value, locale);
  if (locale !== 'zh') return { text, fallback: false };
  // 中文档位里一个汉字都没有，说明这段文案是英文原文回填的
  return { text, fallback: text.length > 0 && !/[\u4e00-\u9fff]/.test(text) };
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

/** 首页同一区块内单一来源最多占的席位数。 */
export const HOME_MAX_PER_SOURCE = 2;

export interface PathfinderHomeFeed {
  featured: PathfinderCatalogItem[];
  opportunities: PathfinderCatalogItem[];
  openSource: PathfinderCatalogItem[];
  updates: PathfinderCatalogItem[];
}

/**
 * 首页按类型设置固定席位，避免高频同步的开源 issue 淹没低频但更时效敏感的竞赛与实习。
 * 竞赛、实习优先展示仍可报名且截止日更近的项目；没有明确截止日的长期入口排在其后。
 *
 * 每个区块再限制单一来源的席位（见 HOME_MAX_PER_SOURCE）：一家机构连发四条时，
 * 首页会变成那家机构的公告栏，而不是「这段时间值得关注的事」。
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
      diversifyBySource(competitions.filter((item) => !featuredIds.has(item.id)), HOME_MAX_PER_SOURCE, 3),
      diversifyBySource(internships.filter((item) => !featuredIds.has(item.id)), HOME_MAX_PER_SOURCE, 3),
    ),
    openSource: diversifyBySource(
      openSourceCandidates.filter((item) => !featuredIds.has(item.id)),
      HOME_MAX_PER_SOURCE,
      4,
      // 同一个抓取来源会带回同一个仓库的多条 issue，这里按仓库限席位
      (item) => item.organization.en || item.organization.zh,
    ),
    updates: diversifyBySource(
      sortByRecency(published.filter((item) => item.itemType === 'ai-update')),
      HOME_MAX_PER_SOURCE,
      4,
    ),
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

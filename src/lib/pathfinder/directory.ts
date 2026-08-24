import type { PathfinderCatalogItem } from './catalog-types';
import { catalogDeadlineTimestamp, getDeadlineState, sortCatalogItems } from './catalog-view';

/**
 * 主题与机构入口。
 *
 * 机会库只有「四种类型 × 四个方向」两把尺子，而学生真正在追的往往是
 * 一个主题（Agent、RAG、多模态）或一家机构（OpenAI、字节、阿里）。
 * 这两个维度的数据早就在条目里（`tags.topic` 和 `organization`），
 * 缺的只是入口——所以这里全部从现有数据推导，不新增字段、不需要人工维护清单。
 */

export type PathfinderDirectoryKind = 'organization' | 'topic';

export interface PathfinderDirectoryEntry {
  /** 归一化后的值，同时用作 URL 参数与关注记录的键 */
  slug: string;
  /** 展示用的原始写法，取出现次数最多的那种 */
  label: string;
  count: number;
}

/**
 * 归一化主题 / 机构名，用作 URL 参数与关注记录的键。
 *
 * 与 `saves.ts` 的 `normalizeFollowValue` 必须保持同一套规则：
 * 关注按钮写进去的值和页面地址里的值对不上的话，页面就永远显示「未关注」。
 */
export function directorySlug(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, ' ').slice(0, 120);
}

function pickLabel(counts: Map<string, number>): string {
  let best = '';
  let bestCount = -1;
  for (const [label, count] of counts) {
    // 同一个 slug 下取出现最多的原始写法；并列时按字典序，保证结果稳定
    if (count > bestCount || (count === bestCount && label.localeCompare(best) < 0)) {
      best = label;
      bestCount = count;
    }
  }
  return best;
}

/** 条目在某个维度上的原始取值。机构取当前语言的写法，主题取标签。 */
function valuesOf(
  item: PathfinderCatalogItem,
  kind: PathfinderDirectoryKind,
  locale: 'zh' | 'en',
): string[] {
  if (kind === 'organization') {
    const value = locale === 'en' ? item.organization.en : item.organization.zh;
    return value ? [value] : [];
  }
  return item.tags.topic;
}

/**
 * 汇总某个维度下的全部入口，按条目数降序。
 *
 * `minCount` 用来挡掉只出现一次的长尾：一个只有一条内容的主题页
 * 除了制造死链没有别的作用。
 */
export function collectDirectory(
  items: readonly PathfinderCatalogItem[],
  kind: PathfinderDirectoryKind,
  locale: 'zh' | 'en' = 'zh',
  minCount = 2,
): PathfinderDirectoryEntry[] {
  const bySlug = new Map<string, { count: number; labels: Map<string, number> }>();
  // RSS 摄取会把来源机构名一并写进标签（见 ingestion/parse.ts），于是
  // 「Google DeepMind」「OpenAI」会以主题的身份出现在主题页里。机构已经有自己的
  // 入口，这里按机构名把它们排掉——在展示层判断，存量数据不需要重跑同步。
  const organizationSlugs = kind === 'topic'
    ? new Set(items.flatMap((item) => [
        directorySlug(item.organization.zh),
        directorySlug(item.organization.en),
      ]))
    : null;

  for (const item of items) {
    if (item.status !== 'published') continue;
    for (const raw of valuesOf(item, kind, locale)) {
      const slug = directorySlug(raw);
      if (!slug) continue;
      if (organizationSlugs?.has(slug)) continue;
      const bucket = bySlug.get(slug) ?? { count: 0, labels: new Map<string, number>() };
      bucket.count += 1;
      bucket.labels.set(raw, (bucket.labels.get(raw) ?? 0) + 1);
      bySlug.set(slug, bucket);
    }
  }

  return [...bySlug.entries()]
    .filter(([, bucket]) => bucket.count >= minCount)
    .map(([slug, bucket]) => ({ slug, label: pickLabel(bucket.labels), count: bucket.count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

/**
 * 某个入口下的条目。
 *
 * 机构匹配同时比对中英文写法：同一家机构在中文条目里是「阿里巴巴」、
 * 英文条目里是「Alibaba Group」，只比一种语言会让另一半条目从页面上消失。
 */
export function filterByDirectory(
  items: readonly PathfinderCatalogItem[],
  kind: PathfinderDirectoryKind,
  slug: string,
): PathfinderCatalogItem[] {
  const target = directorySlug(slug);
  if (!target) return [];

  return items.filter((item) => {
    if (item.status !== 'published') return false;
    if (kind === 'organization') {
      return directorySlug(item.organization.zh) === target
        || directorySlug(item.organization.en) === target;
    }
    return item.tags.topic.some((tag) => directorySlug(tag) === target);
  });
}

export interface PathfinderWeekly {
  /** 本周新收录 */
  added: PathfinderCatalogItem[];
  /** 本周内截止，还来得及行动 */
  closing: PathfinderCatalogItem[];
  /** 本周新增里最值得先看的 */
  highlights: PathfinderCatalogItem[];
  since: string;
  until: string;
}

/**
 * 学生周报的内容。
 *
 * 只回答两个问题：这周多了什么、这周有什么要截止。
 * 不做「本周热点」——热度不是这个产品的判据，而且没有互动数据可依。
 * 纯函数：周报页与将来的周报邮件用同一份内容，不会各算一套。
 */
export function buildPathfinderWeekly(
  items: readonly PathfinderCatalogItem[],
  now = new Date(),
  windowDays = 7,
): PathfinderWeekly {
  const since = new Date(now.getTime() - windowDays * 86_400_000);
  const published = items.filter((item) => item.status === 'published');

  const added = published
    .filter((item) => {
      const discovered = Date.parse(item.discoveredAt);
      return Number.isFinite(discovered) && discovered >= since.getTime();
    })
    .sort((a, b) => Date.parse(b.discoveredAt) - Date.parse(a.discoveredAt) || a.id.localeCompare(b.id));

  const closing = published
    .filter((item) => {
      const deadline = catalogDeadlineTimestamp(item);
      if (deadline === null) return false;
      // 已经过了的不放进来：周报是给「还来得及做的事」用的
      if (getDeadlineState(item, now).state === 'expired') return false;
      return deadline <= now.getTime() + windowDays * 86_400_000;
    })
    .sort((a, b) => (catalogDeadlineTimestamp(a) ?? 0) - (catalogDeadlineTimestamp(b) ?? 0)
      || a.id.localeCompare(b.id));

  return {
    added,
    closing,
    highlights: sortCatalogItems(added, 'action', now).slice(0, 3),
    since: since.toISOString(),
    until: now.toISOString(),
  };
}

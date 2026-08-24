import crypto from 'crypto';
import { unstable_cache } from 'next/cache';
import { STATIC_PATHFINDER_ITEMS } from '@/data/pathfinder/catalog-seeds';
import { listDatabaseCatalogItems } from './catalog-db';
import { catalogDeadlineTimestamp } from './catalog-view';
import type {
  ListCatalogItemsOptions,
  PathfinderCatalogItem,
} from './catalog-types';
import { readStaticPathfinderTombstones } from './static-tombstones';

export type {
  ListCatalogItemsOptions,
  PathfinderCatalogItem,
  PathfinderCatalogSource,
} from './catalog-types';

const TRACKING_PARAMS = new Set(['fbclid', 'gclid', 'mc_cid', 'mc_eid', 'ref', 'source']);
const STATIC_URL_HASHES = STATIC_PATHFINDER_ITEMS.map((item) => (
  crypto.createHash('sha256').update(normalizeCatalogUrl(item.canonicalUrl)).digest('hex')
));
export const PATHFINDER_CATALOG_CACHE_TAG = 'pathfinder-catalog-v2';

interface CatalogSnapshot {
  databaseItems: PathfinderCatalogItem[];
  staticTombstoneIds: string[];
  databaseAvailable: boolean;
  tombstoneStoreAvailable: boolean;
}

async function loadCatalogSnapshot(): Promise<CatalogSnapshot> {
  const [databaseResult, tombstoneResult] = await Promise.allSettled([
    listDatabaseCatalogItems(STATIC_URL_HASHES),
    readStaticPathfinderTombstones(),
  ]);
  if (databaseResult.status === 'rejected') {
    console.error('[pathfinder] 读取动态目录失败，本次尝试安全回退', databaseResult.reason);
  }
  if (tombstoneResult.status === 'rejected') {
    console.error('[pathfinder] 读取静态下架保护记录失败', tombstoneResult.reason);
  }
  const tombstones = tombstoneResult.status === 'fulfilled'
    ? tombstoneResult.value
    : { ids: [], available: false };
  return {
    databaseItems: databaseResult.status === 'fulfilled' ? databaseResult.value : [],
    staticTombstoneIds: tombstones.ids,
    databaseAvailable: databaseResult.status === 'fulfilled',
    tombstoneStoreAvailable: tombstones.available,
  };
}

const loadCachedCatalogSnapshot = unstable_cache(
  loadCatalogSnapshot,
  ['pathfinder-public-catalog-v2'],
  { revalidate: 60, tags: [PATHFINDER_CATALOG_CACHE_TAG] },
);

/**
 * 返回公开目录。数据库条目按规范 URL 覆盖静态种子；数据库不可用时只返回种子。
 */
export async function listCatalogItems(
  options: ListCatalogItemsOptions = {},
): Promise<PathfinderCatalogItem[]> {
  const snapshot = process.env.NODE_ENV === 'test'
    ? await loadCatalogSnapshot()
    : await loadCachedCatalogSnapshot();
  // 两个独立存储同时不可用时，生产环境宁可暂时不展示，也不能让已下架种子复活。
  if (process.env.NODE_ENV === 'production'
    && !snapshot.databaseAvailable
    && !snapshot.tombstoneStoreAvailable) return [];

  const tombstones = new Set(snapshot.staticTombstoneIds);
  const staticItems = STATIC_PATHFINDER_ITEMS.filter((item) => {
    const urlHash = crypto.createHash('sha256').update(normalizeCatalogUrl(item.canonicalUrl)).digest('hex');
    return !tombstones.has(item.id) && !tombstones.has(`url:${urlHash}`);
  });

  const filtered = mergeCatalogItems(staticItems, snapshot.databaseItems)
    .filter((item) => isCatalogItemPublicAt(item))
    .filter((item) => matchesOptions(item, options))
    .sort(compareCatalogItems);

  if (options.limit === undefined) return filtered;
  const limit = Math.trunc(options.limit);
  return limit > 0 ? filtered.slice(0, limit) : [];
}

/**
 * 精确截止时间按时间比较；只有官方日期、没有时区的条目，在该日期于全球最晚时区结束后
 * 才保守隐藏。这样不伪造报名时刻，也不会让静态时效机会永久公开。
 */
export function isCatalogItemPublicAt(
  item: PathfinderCatalogItem,
  now = new Date(),
): boolean {
  if (item.status !== 'published') return false;
  const deadline = catalogDeadlineTimestamp(item, true);
  if (deadline !== null && deadline < now.getTime()) return false;
  return true;
}

/** 按目录 ID 读取公开条目；失败降级行为与列表完全一致。 */
export async function getCatalogItem(id: string): Promise<PathfinderCatalogItem | null> {
  if (!id.trim()) return null;
  return (await listCatalogItems()).find((item) => item.id === id) ?? null;
}

/** 相同规范 URL 时动态目录覆盖静态种子，避免同一机会显示两次。 */
export function mergeCatalogItems(
  staticItems: readonly PathfinderCatalogItem[],
  databaseItems: readonly PathfinderCatalogItem[],
): PathfinderCatalogItem[] {
  const byUrl = new Map<string, PathfinderCatalogItem>();

  for (const item of staticItems) {
    byUrl.set(normalizeCatalogUrl(item.canonicalUrl), item);
  }
  for (const item of databaseItems) {
    const normalizedUrl = normalizeCatalogUrl(item.canonicalUrl);
    // 待审采集不能在审核前遮住可信静态种子；其余状态都是明确公开或下架决定。
    if (item.status !== 'pending' || !byUrl.has(normalizedUrl)) {
      byUrl.set(normalizedUrl, item);
    }
  }

  return [...byUrl.values()];
}

function matchesOptions(
  item: PathfinderCatalogItem,
  options: ListCatalogItemsOptions,
): boolean {
  if (!matchesOneOrMany(item.itemType, options.type)) return false;
  if (!matchesAnyDirection(item.directions, options.direction)) return false;
  if (!matchesOneOrMany(item.difficulty, options.difficulty)) return false;
  if (!matchesOneOrMany(item.remoteStatus, options.remoteStatus)) return false;
  if (options.learningEligible !== undefined && item.learningEligible !== options.learningEligible) {
    return false;
  }
  if (options.deadlineBefore !== undefined) {
    const deadline = catalogDeadlineTimestamp(item);
    const before = Date.parse(options.deadlineBefore);
    return deadline !== null && Number.isFinite(before) && deadline <= before;
  }
  return true;
}

function matchesOneOrMany<T>(value: T, expected: T | readonly T[] | undefined): boolean {
  if (expected === undefined) return true;
  return Array.isArray(expected) ? (expected as readonly T[]).includes(value) : value === expected;
}

function matchesAnyDirection<T>(values: readonly T[], expected: T | readonly T[] | undefined) {
  if (expected === undefined) return true;
  const expectedValues = Array.isArray(expected) ? expected : [expected];
  return expectedValues.some((value) => values.includes(value));
}

function compareCatalogItems(a: PathfinderCatalogItem, b: PathfinderCatalogItem): number {
  const aDeadline = catalogDeadlineTimestamp(a);
  const bDeadline = catalogDeadlineTimestamp(b);
  if (aDeadline !== null && bDeadline !== null && aDeadline !== bDeadline) return aDeadline - bDeadline;
  if (aDeadline !== null) return -1;
  if (bDeadline !== null) return 1;

  const verifiedOrder = b.verifiedAt.localeCompare(a.verifiedAt);
  return verifiedOrder !== 0 ? verifiedOrder : a.id.localeCompare(b.id);
}

/** 生成稳定的目录去重键；移除追踪参数、片段、大小写与尾斜杠差异。 */
export function normalizeCatalogUrl(raw: string): string {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return `invalid:${raw.trim()}`;
    url.hash = '';
    url.hostname = url.hostname.toLowerCase();
    for (const key of [...url.searchParams.keys()]) {
      if (key.startsWith('utm_') || TRACKING_PARAMS.has(key)) url.searchParams.delete(key);
    }
    if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/+$/, '');
    url.searchParams.sort();
    return url.toString();
  } catch {
    return `invalid:${raw.trim()}`;
  }
}

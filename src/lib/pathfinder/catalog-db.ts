import { desc, eq, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { pathfinderItems, pathfinderItemTags, pathfinderSources } from '@/lib/db/schema';
import {
  PATHFINDER_DIRECTIONS,
  PATHFINDER_TAG_DIMENSIONS,
  emptyPathfinderTags,
  type PathfinderCatalogItem,
  type PathfinderCatalogSource,
  type PathfinderDevice,
  type PathfinderDifficulty,
  type PathfinderDirection,
  type PathfinderItemStatus,
  type PathfinderItemType,
  type PathfinderNetwork,
  type PathfinderRemoteStatus,
  type PathfinderSourceAdapter,
  type PathfinderSourceType,
  type PathfinderTagDimension,
  type PathfinderTrustLevel,
} from './catalog-types';

/**
 * 读取全部动态条目。非公开状态也必须参与 URL 覆盖：管理员下架或标记 stale 的
 * 动态记录需要压住同链接静态种子，避免旧内容在回退层“复活”。
 */
export async function listDatabaseCatalogItems(
  staticUrlHashes: readonly string[] = [],
): Promise<PathfinderCatalogItem[]> {
  const selectRows = () => db
    .select({ item: pathfinderItems, source: pathfinderSources })
    .from(pathfinderItems)
    .innerJoin(pathfinderSources, eq(pathfinderItems.sourceId, pathfinderSources.id));
  const [publishedRows, overlayRows] = await Promise.all([
    selectRows()
      .where(eq(pathfinderItems.status, 'published'))
      .orderBy(desc(pathfinderItems.verifiedAt))
      .limit(500),
    staticUrlHashes.length > 0
      ? selectRows().where(inArray(pathfinderItems.urlHash, [...staticUrlHashes]))
      : Promise.resolve([]),
  ]);
  const rows = [...new Map(
    [...publishedRows, ...overlayRows].map((row) => [row.item.id, row]),
  ).values()];

  if (rows.length === 0) return [];

  const tagsByItem = new Map<string, ReturnType<typeof emptyPathfinderTags>>();
  const tagRows = await db
    .select()
    .from(pathfinderItemTags)
    .where(inArray(pathfinderItemTags.itemId, rows.map(({ item }) => item.id)));

  for (const tagRow of tagRows) {
    if (!isTagDimension(tagRow.dimension)) continue;
    const tags = tagsByItem.get(tagRow.itemId) ?? emptyPathfinderTags();
    tags[tagRow.dimension].push(tagRow.tag);
    tagsByItem.set(tagRow.itemId, tags);
  }

  return rows.map(({ item, source }) => mapDatabaseCatalogItem(
    item,
    source,
    tagsByItem.get(item.id) ?? emptyPathfinderTags(),
  ));
}

/** 单独导出纯映射，便于用真实 Drizzle 行验证新增契约不会在读取层丢字段。 */
export function mapDatabaseCatalogItem(
  item: typeof pathfinderItems.$inferSelect,
  source: typeof pathfinderSources.$inferSelect,
  tags: ReturnType<typeof emptyPathfinderTags> = emptyPathfinderTags(),
): PathfinderCatalogItem {
  const costAmount = item.costAmount ?? item.costCny;
  return {
    id: item.id,
    sourceId: item.sourceId,
    source: toCatalogSource(source),
    externalId: item.externalId,
    canonicalUrl: item.canonicalUrl,
    itemType: item.itemType as PathfinderItemType,
    title: { zh: item.titleZh, en: item.titleEn },
    summary: { zh: item.summaryZh, en: item.summaryEn },
    organization: { zh: item.organization, en: item.organizationEn },
    direction: item.direction as PathfinderDirection,
    directions: parseCatalogDirections(
      item.directions,
      item.direction as PathfinderDirection,
    ),
    difficulty: item.difficulty as PathfinderDifficulty,
    estimatedMinutes: item.estimatedMinutes,
    costCny: item.costCny,
    cost: {
      amount: costAmount,
      currency: item.costCurrency ?? (costAmount === null ? null : 'CNY'),
      label: localizeNullable(item.costLabelZh, item.costLabelEn),
    },
    device: item.device as PathfinderDevice,
    network: item.network as PathfinderNetwork,
    region: localizeNullable(item.regionZh, item.regionEn) ?? localizeDatabaseRegion(item.region),
    remoteStatus: item.remoteStatus as PathfinderRemoteStatus,
    eligibility: { zh: item.eligibilityZh, en: item.eligibilityEn },
    deadlineText: localizeNullable(item.deadlineTextZh, item.deadlineTextEn)
      ?? localizeDatabaseDeadline(item.deadlineText),
    deadlineDate: item.deadlineDate ?? item.deadlineAt?.slice(0, 10) ?? null,
    deadlineAt: item.deadlineAt,
    publishedAt: item.publishedAt,
    discoveredAt: item.discoveredAt,
    verifiedAt: item.verifiedAt,
    status: item.status as PathfinderItemStatus,
    learningEligible: item.learningEligible,
    requiresManualEligibilityCheck: item.requiresManualEligibilityCheck,
    tags,
    origin: 'database',
  };
}

function toCatalogSource(
  source: typeof pathfinderSources.$inferSelect,
): PathfinderCatalogSource {
  return {
    id: source.id,
    name: { zh: source.name, en: source.name },
    adapter: source.adapter as PathfinderSourceAdapter,
    siteUrl: source.siteUrl,
    sourceType: source.sourceType as PathfinderSourceType,
    trustLevel: source.trustLevel as PathfinderTrustLevel,
    enabled: source.enabled,
    autoPublish: source.autoPublish,
    syncIntervalMinutes: source.syncIntervalMinutes,
    lastSuccessAt: source.lastSuccessAt,
    lastError: source.lastError,
    consecutiveFailures: source.consecutiveFailures,
    origin: 'database',
  };
}

export function parseCatalogDirections(
  value: string,
  primary: PathfinderDirection,
): PathfinderDirection[] {
  try {
    const parsed: unknown = JSON.parse(value);
    const directions = Array.isArray(parsed)
      ? parsed.filter((direction): direction is PathfinderDirection => (
        typeof direction === 'string'
        && (PATHFINDER_DIRECTIONS as readonly string[]).includes(direction)
      ))
      : [];
    return [...new Set([primary, ...directions])];
  } catch {
    return [primary];
  }
}

function localizeNullable(zh: string | null, en: string | null) {
  if (zh === null && en === null) return null;
  return { zh: zh ?? en ?? '', en: en ?? zh ?? '' };
}

function localizeDatabaseRegion(value: string | null) {
  if (!value) return null;
  if (value.toLowerCase() === 'global') return { zh: '全球', en: 'Global' };
  return { zh: value, en: value };
}

function localizeDatabaseDeadline(value: string | null) {
  if (!value) return null;
  if (value === '以 Issue 当前开放状态为准') {
    return { zh: value, en: 'While the GitHub issue remains open' };
  }
  return { zh: value, en: value };
}

function isTagDimension(value: string): value is PathfinderTagDimension {
  return (PATHFINDER_TAG_DIMENSIONS as readonly string[]).includes(value);
}

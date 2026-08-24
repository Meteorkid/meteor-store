import crypto from 'crypto';
import { and, desc, eq, ilike, inArray, or } from 'drizzle-orm';
import { STATIC_PATHFINDER_ITEMS } from '@/data/pathfinder/catalog-seeds';
import { SITE_URL } from '@/lib/constants';
import { db } from '@/lib/db';
import { pathfinderItems, pathfinderItemTags, pathfinderSources } from '@/lib/db/schema';
import { isCatalogItemPublicAt, normalizeCatalogUrl } from './catalog';
import { PATHFINDER_SYNC_SOURCE_MAP } from './ingestion';
import { addStaticPathfinderTombstone } from './static-tombstones';
import type { PathfinderItemStatus, PathfinderTagDimension } from './catalog-types';

const STATIC_OVERRIDE_SOURCE_ID = 'pathfinder-static-overrides';
const STATIC_OVERRIDE_SOURCE_URL = `${SITE_URL}/pathfinder/static-overrides`;
const STATIC_URL_HASHES = STATIC_PATHFINDER_ITEMS.map((item) => sha256(normalizeCatalogUrl(item.canonicalUrl)));

export interface PathfinderAdminListOptions {
  status?: Exclude<PathfinderItemStatus, 'rejected'>;
  query?: string;
  offset?: number;
  limit?: number;
}

export async function listPathfinderAdminData(options: PathfinderAdminListOptions = {}) {
  const status = options.status ?? 'pending';
  const query = options.query?.trim().slice(0, 160) ?? '';
  const offset = Math.max(0, Math.trunc(options.offset ?? 0));
  const limit = Math.min(100, Math.max(1, Math.trunc(options.limit ?? 30)));
  const pattern = `%${query.replace(/[\\%_]/g, '\\$&')}%`;
  const queryFilter = query
    ? or(
        ilike(pathfinderItems.id, pattern),
        ilike(pathfinderItems.externalId, pattern),
        ilike(pathfinderItems.titleZh, pattern),
        ilike(pathfinderItems.titleEn, pattern),
        ilike(pathfinderItems.canonicalUrl, pattern),
        ilike(pathfinderItems.organization, pattern),
        ilike(pathfinderItems.organizationEn, pattern),
      )
    : undefined;
  const itemFilter = queryFilter
    ? and(eq(pathfinderItems.status, status), queryFilter)
    : eq(pathfinderItems.status, status);

  const [sourceRows, databasePage, staticOverrides] = await Promise.all([
    db.select().from(pathfinderSources).orderBy(pathfinderSources.name),
    db.select().from(pathfinderItems)
      .where(itemFilter)
      .orderBy(desc(pathfinderItems.discoveredAt))
      .limit(limit + 1)
      .offset(offset),
    status === 'published' && offset === 0
      ? db.select({
          urlHash: pathfinderItems.urlHash,
          status: pathfinderItems.status,
          sourceId: pathfinderItems.sourceId,
        })
          .from(pathfinderItems)
          .where(inArray(pathfinderItems.urlHash, STATIC_URL_HASHES))
      : Promise.resolve([]),
  ]);
  const pageItems = databasePage.slice(0, limit);
  const tagRows = pageItems.length > 0
    ? await db.select().from(pathfinderItemTags)
        .where(inArray(pathfinderItemTags.itemId, pageItems.map((item) => item.id)))
    : [];
  const tagsByItem = new Map<string, Partial<Record<PathfinderTagDimension, string[]>>>();
  for (const tag of tagRows) {
    const tags = tagsByItem.get(tag.itemId) ?? {};
    const dimension = tag.dimension as PathfinderTagDimension;
    tags[dimension] = [...(tags[dimension] ?? []), tag.tag];
    tagsByItem.set(tag.itemId, tags);
  }
  const sources = sourceRows.map((source) => ({
    ...source,
    canAutoPublish: canAutoPublishPathfinderSource(source.id),
  }));
  const suppressedStaticHashes = new Set(staticOverrides
    .filter((row) => row.status !== 'pending' || row.sourceId === STATIC_OVERRIDE_SOURCE_ID)
    .map((row) => row.urlHash));
  const staticItems = status === 'published' && offset === 0
    ? STATIC_PATHFINDER_ITEMS
        .filter((item) => isCatalogItemPublicAt(item))
        .filter((item) => !suppressedStaticHashes.has(sha256(normalizeCatalogUrl(item.canonicalUrl))))
        .filter((item) => !query || [
          item.id,
          item.title.zh,
          item.title.en,
          item.organization.zh,
          item.organization.en,
          item.canonicalUrl,
        ].some((value) => value.toLocaleLowerCase().includes(query.toLocaleLowerCase())))
        .map(toStaticAdminItem)
    : [];
  const hasMore = databasePage.length > limit;
  return {
    sources,
    staticItems,
    items: pageItems.map((item) => ({
      ...item,
      origin: 'database' as const,
      tags: tagsByItem.get(item.id) ?? {},
      inferredFields: item.sourceId === 'github-good-first-issues',
      canPublishForPath: canPublishPathfinderItemForLearning(item.sourceId, item.itemType)
        && !item.requiresManualEligibilityCheck,
    })),
    nextOffset: hasMore ? offset + limit : null,
  };
}

export async function reviewPathfinderItem(input: {
  id: string;
  reviewerId: string;
  decision: 'published' | 'rejected';
  learningEligible: boolean;
}) {
  const now = new Date().toISOString();
  const [candidate] = await db.select({
    sourceId: pathfinderItems.sourceId,
    itemType: pathfinderItems.itemType,
    requiresManualEligibilityCheck: pathfinderItems.requiresManualEligibilityCheck,
  }).from(pathfinderItems).where(and(
    eq(pathfinderItems.id, input.id),
    eq(pathfinderItems.status, 'pending'),
  )).limit(1);
  if (!candidate) return null;
  const learningEligible = input.decision === 'published'
    && input.learningEligible
    && !candidate.requiresManualEligibilityCheck
    && canPublishPathfinderItemForLearning(candidate.sourceId, candidate.itemType);
  const [item] = await db.update(pathfinderItems).set({
    status: input.decision,
    learningEligible,
    reviewerId: input.reviewerId,
    reviewedAt: now,
    verifiedAt: now,
    updatedAt: now,
  }).where(and(
    eq(pathfinderItems.id, input.id),
    eq(pathfinderItems.status, 'pending'),
  )).returning();
  return item ?? null;
}

/** 管理员紧急下架；条件更新避免并发审核把状态重新覆盖。 */
export async function archivePathfinderItem(input: { id: string; reviewerId: string }) {
  const now = new Date().toISOString();
  const [item] = await db.update(pathfinderItems).set({
    status: 'archived',
    learningEligible: false,
    reviewerId: input.reviewerId,
    reviewedAt: now,
    updatedAt: now,
  }).where(and(
    eq(pathfinderItems.id, input.id),
    inArray(pathfinderItems.status, ['pending', 'published', 'stale', 'expired']),
  )).returning();
  if (item) return item;

  const staticItem = STATIC_PATHFINDER_ITEMS.find((candidate) => candidate.id === input.id);
  if (!staticItem) return null;
  const urlHash = sha256(normalizeCatalogUrl(staticItem.canonicalUrl));
  await addStaticPathfinderTombstone(staticItem.id, urlHash);
  const [existing] = await db.select().from(pathfinderItems)
    .where(eq(pathfinderItems.urlHash, urlHash))
    .limit(1);
  if (existing) {
    const [archived] = await db.update(pathfinderItems).set({
      status: 'archived',
      learningEligible: false,
      reviewerId: input.reviewerId,
      reviewedAt: now,
      updatedAt: now,
    }).where(and(
      eq(pathfinderItems.id, existing.id),
      inArray(pathfinderItems.status, ['pending', 'published', 'stale', 'expired']),
    )).returning();
    return archived ?? null;
  }

  await ensureStaticOverrideSource(now);
  const [archived] = await db.insert(pathfinderItems).values({
    id: `pf_static_${urlHash.slice(0, 24)}`,
    sourceId: STATIC_OVERRIDE_SOURCE_ID,
    externalId: staticItem.id,
    canonicalUrl: staticItem.canonicalUrl,
    urlHash,
    itemType: staticItem.itemType,
    titleZh: staticItem.title.zh,
    titleEn: staticItem.title.en,
    summaryZh: staticItem.summary.zh,
    summaryEn: staticItem.summary.en,
    organization: staticItem.organization.zh,
    organizationEn: staticItem.organization.en,
    direction: staticItem.direction,
    directions: JSON.stringify(staticItem.directions),
    difficulty: staticItem.difficulty,
    estimatedMinutes: staticItem.estimatedMinutes,
    costCny: staticItem.costCny,
    costAmount: staticItem.cost.amount,
    costCurrency: staticItem.cost.currency,
    costLabelZh: staticItem.cost.label?.zh ?? null,
    costLabelEn: staticItem.cost.label?.en ?? null,
    device: staticItem.device,
    network: staticItem.network,
    region: staticItem.region?.zh ?? null,
    regionZh: staticItem.region?.zh ?? null,
    regionEn: staticItem.region?.en ?? null,
    remoteStatus: staticItem.remoteStatus,
    eligibilityZh: staticItem.eligibility.zh,
    eligibilityEn: staticItem.eligibility.en,
    deadlineText: staticItem.deadlineText?.zh ?? null,
    deadlineTextZh: staticItem.deadlineText?.zh ?? null,
    deadlineTextEn: staticItem.deadlineText?.en ?? null,
    deadlineDate: staticItem.deadlineDate,
    deadlineAt: staticItem.deadlineAt,
    publishedAt: staticItem.publishedAt,
    discoveredAt: staticItem.discoveredAt,
    verifiedAt: staticItem.verifiedAt,
    status: 'archived',
    learningEligible: false,
    requiresManualEligibilityCheck: staticItem.requiresManualEligibilityCheck,
    reviewerId: input.reviewerId,
    reviewedAt: now,
    contentHash: sha256(`static-archive:${staticItem.id}:${now}`),
    createdAt: now,
    updatedAt: now,
  }).onConflictDoNothing().returning();
  return archived ?? null;
}

/** 已下架条目只能恢复到待审核；静态种子的独立 tombstone 刻意保留，不会直接重新公开。 */
export async function restorePathfinderItem(input: { id: string; reviewerId: string }) {
  const now = new Date().toISOString();
  const [item] = await db.update(pathfinderItems).set({
    status: 'pending',
    learningEligible: false,
    reviewerId: input.reviewerId,
    reviewedAt: now,
    updatedAt: now,
  }).where(and(
    eq(pathfinderItems.id, input.id),
    eq(pathfinderItems.status, 'archived'),
  )).returning();
  return item ?? null;
}

export async function updatePathfinderSource(input: {
  id: string;
  enabled?: boolean;
  autoPublish?: boolean;
}) {
  if (input.autoPublish === true && !canAutoPublishPathfinderSource(input.id)) {
    return null;
  }
  const updates: Partial<typeof pathfinderSources.$inferInsert> = {
    updatedAt: new Date().toISOString(),
  };
  if (input.enabled !== undefined) updates.enabled = input.enabled;
  if (input.autoPublish !== undefined) updates.autoPublish = input.autoPublish;
  const [source] = await db.update(pathfinderSources)
    .set(updates)
    .where(eq(pathfinderSources.id, input.id))
    .returning();
  return source ?? null;
}

/** 自动发布资格只能由代码白名单授予，后台不能把社区/机会来源提升为直发。 */
export function canAutoPublishPathfinderSource(id: string): boolean {
  return PATHFINDER_SYNC_SOURCE_MAP.get(id)?.autoPublish === true;
}

/** GitHub 字段来自规则推断；没有编辑校正流程前，服务端强制禁止进入学习路径。 */
export function canPublishPathfinderItemForLearning(sourceId: string, itemType: string): boolean {
  return itemType !== 'ai-update' && sourceId !== 'github-good-first-issues';
}

async function ensureStaticOverrideSource(now: string) {
  await db.insert(pathfinderSources).values({
    id: STATIC_OVERRIDE_SOURCE_ID,
    name: 'Pathfinder static overrides',
    adapter: 'manual',
    siteUrl: STATIC_OVERRIDE_SOURCE_URL,
    sourceType: 'manual',
    trustLevel: 'official',
    enabled: false,
    autoPublish: false,
    syncIntervalMinutes: 1_440,
    createdAt: now,
    updatedAt: now,
  }).onConflictDoNothing();
}

function toStaticAdminItem(item: (typeof STATIC_PATHFINDER_ITEMS)[number]) {
  return {
    id: item.id,
    itemType: item.itemType,
    titleZh: item.title.zh,
    titleEn: item.title.en,
    summaryZh: item.summary.zh,
    summaryEn: item.summary.en,
    canonicalUrl: item.canonicalUrl,
    organization: item.organization.zh,
    organizationEn: item.organization.en,
    learningEligible: item.learningEligible,
    discoveredAt: item.discoveredAt,
    status: 'published' as const,
    origin: 'static' as const,
    direction: item.direction,
    directions: JSON.stringify(item.directions),
    difficulty: item.difficulty,
    estimatedMinutes: item.estimatedMinutes,
    costCny: item.costCny,
    costAmount: item.cost.amount,
    costCurrency: item.cost.currency,
    costLabelZh: item.cost.label?.zh ?? null,
    costLabelEn: item.cost.label?.en ?? null,
    device: item.device,
    network: item.network,
    region: item.region?.zh ?? null,
    regionZh: item.region?.zh ?? null,
    regionEn: item.region?.en ?? null,
    remoteStatus: item.remoteStatus,
    eligibilityZh: item.eligibility.zh,
    eligibilityEn: item.eligibility.en,
    deadlineText: item.deadlineText?.zh ?? null,
    deadlineTextZh: item.deadlineText?.zh ?? null,
    deadlineTextEn: item.deadlineText?.en ?? null,
    deadlineDate: item.deadlineDate,
    deadlineAt: item.deadlineAt,
    tags: item.tags,
    inferredFields: false,
    canPublishForPath: true,
    requiresManualEligibilityCheck: item.requiresManualEligibilityCheck,
  };
}

function sha256(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

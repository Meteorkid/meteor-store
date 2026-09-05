import crypto from 'crypto';
import { and, eq, inArray, or, sql, type SQLWrapper } from 'drizzle-orm';
import { db } from '@/lib/db';
import { pathfinderItems, pathfinderItemTags, pathfinderSources } from '@/lib/db/schema';
import { fetchPathfinderSource } from './fetch-source';
import { articleSummaryUrl, fetchArticleSummary } from './article-summary';
import { parsePathfinderSource } from './parse';
import { PATHFINDER_SYNC_SOURCE_MAP, PATHFINDER_SYNC_SOURCES } from './sources';
import { isTranslationEnabled, needsTranslation, translateAll } from '../translate';
import { PATHFINDER_DIRECTIONS, type PathfinderDirection } from '../catalog-types';
import type {
  IngestedPathfinderItem,
  PathfinderSyncBatchResult,
  PathfinderSourceSyncResult,
  PathfinderSyncSource,
} from './types';

type ExistingItem = typeof pathfinderItems.$inferSelect;

/**
 * 同步全部已启用的白名单来源。首次执行会写入来源配置；之后尊重数据库中的 enabled 开关。
 */
/**
 * 每轮同步最多跑几个 GitHub 来源。
 *
 * 取 2 是实测出来的，不是估的：单条昂贵查询稳定返回 200，而一轮跑 4 条时
 * 第三条就 403（次级限流）。GitHub 对搜索接口的次级限流看的不只是频次，
 * 还看查询开销，而策展 issue 用的是多 repo 限定 + `-linked:pr` 的复杂查询。
 *
 * 16 个桶因此需要 8 小时轮完一遍。对 good-first-issue 这类内容完全够用——
 * 一个新手任务不会在几小时内被抢光，而把配额一次打光会让整批来源连续失败
 * （实测曾有 12 个来源连续失败，最多 28 次）。
 */
const GITHUB_SOURCES_PER_RUN = 2;

export async function syncPathfinderSources(
  requestedIds?: readonly string[],
): Promise<PathfinderSyncBatchResult> {
  await ensureSourceRows();
  const rows = await db.select().from(pathfinderSources);
  const requested = requestedIds?.length ? new Set(requestedIds) : null;
  const startedAt = new Date();
  const sources = rows.flatMap((row) => {
    const config = PATHFINDER_SYNC_SOURCE_MAP.get(row.id);
    if (
      !config
      || !config.enabled
      || !row.enabled
      || (requested && !requested.has(row.id))
      || (!requested && !isPathfinderSourceDue(row.lastSuccessAt, row.syncIntervalMinutes, startedAt))
    ) return [];
    return [{
      config: {
        ...config,
        enabled: config.enabled && row.enabled,
        autoPublish: effectivePathfinderAutoPublish(config.autoPublish, row.autoPublish),
      },
      row,
    }];
  });

  /*
   * 每轮只跑一部分 GitHub 来源。
   *
   * 策展 issue 现在有 16 个分桶（为容纳新仓库与 `-linked:pr`、`updated:>=`
   * 两个限定符，桶数从 2 提到了 4）。它们的同步间隔相同，于是每轮同步会一次性
   * 打出 16 条搜索查询——即便间隔 6 秒，GitHub 的**次级限流**仍会在中途触发，
   * 之后的来源全被冷却跳过。实测 12 个来源因此连续失败，最多 28 次。
   *
   * 所以按「最久没成功过」排序，每轮只取前几个。16 个桶分四轮跑完，
   * 每个桶大约四小时轮到一次——对「找开源任务」这件事完全够用，
   * 而且再也不会把配额一次性打光。
   *
   * 显式指定 sourceIds 时不限流：那是人工触发的定向同步，量本来就小。
   */
  const githubSources = sources.filter((s) => s.config.adapterId === 'github');
  const otherSources = sources.filter((s) => s.config.adapterId !== 'github');
  const throttledGithub = requested
    ? githubSources
    : [...githubSources]
        .sort((a, b) => String(a.row.lastSuccessAt ?? '').localeCompare(String(b.row.lastSuccessAt ?? '')))
        .slice(0, GITHUB_SOURCES_PER_RUN);
  const selected = [...otherSources, ...throttledGithub];

  const results: PathfinderSourceSyncResult[] = [];
  // 2GB 服务器和外部站点都不适合高并发；逐个来源执行，单个来源失败不拖垮整批。
  for (const source of selected) {
    results.push(await syncOneSource(source.config, source.row));
  }
  const maintenanceChanged = (
    await expirePastDeadlineItems()
    + await markUnverifiedLearningItemsStale(startedAt)
    + await archiveOldAiUpdates(startedAt)
  );
  return { results, maintenanceChanged };
}

async function ensureSourceRows(): Promise<void> {
  const now = new Date().toISOString();
  await db.insert(pathfinderSources).values(PATHFINDER_SYNC_SOURCES.map((source) => ({
    id: source.id,
    name: source.name,
    adapter: source.adapterId,
    siteUrl: source.siteUrl,
    // 按抓取协议归类，不是「是不是 github」：greenhouse 也是 JSON API
    sourceType: source.adapterId === 'rss' ? 'rss' : 'api',
    trustLevel: source.trustLevel,
    enabled: source.enabled,
    autoPublish: source.autoPublish,
    syncIntervalMinutes: 60,
    createdAt: now,
    updatedAt: now,
  }))).onConflictDoUpdate({
    target: pathfinderSources.id,
    set: {
      // fetchUrl 不进数据库；这些展示字段可以随代码升级，enabled/autoPublish 保留后台配置。
      name: sqlExcluded('name'),
      adapter: sqlExcluded('adapter'),
      siteUrl: sqlExcluded('site_url'),
      sourceType: sqlExcluded('source_type'),
      trustLevel: sqlExcluded('trust_level'),
      enabled: sql`${pathfinderSources.enabled} and excluded.enabled`,
      // 管理员可以关闭直发；代码白名单撤权时必须把数据库遗留 true 钳回 false。
      autoPublish: sql`${pathfinderSources.autoPublish} and excluded.auto_publish`,
      updatedAt: now,
    },
  });
}

async function syncOneSource(
  source: PathfinderSyncSource,
  row: typeof pathfinderSources.$inferSelect,
): Promise<PathfinderSourceSyncResult> {
  try {
    const response = await fetchPathfinderSource(source, {
      etag: row.etag,
      lastModified: row.lastModified,
    });
    const now = new Date().toISOString();
    if (response.notModified) {
      await refreshSourceMembership(source, row.cursor, now);
      await markSourceSuccess(
        source.id,
        now,
        response.etag ?? row.etag,
        response.lastModified ?? row.lastModified,
        row.cursor,
      );
      return { sourceId: source.id, fetched: 0, inserted: 0, updated: 0, skipped: 0, notModified: true };
    }

    const incoming = parsePathfinderSource(source, response.body);
    const persisted = await persistItems(source, incoming, now);
    await markSourceSuccess(
      source.id,
      now,
      response.etag,
      response.lastModified,
      buildPathfinderMembershipCursor(incoming),
    );
    return {
      sourceId: source.id,
      fetched: incoming.length,
      notModified: false,
      ...persisted,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 500) : 'unknown sync error';
    await db.update(pathfinderSources).set({
      lastError: message,
      consecutiveFailures: row.consecutiveFailures + 1,
      updatedAt: new Date().toISOString(),
    }).where(eq(pathfinderSources.id, source.id));
    return {
      sourceId: source.id,
      fetched: 0,
      inserted: 0,
      updated: 0,
      skipped: 0,
      notModified: false,
      error: message,
    };
  }
}

/**
 * 给英文条目补上中文标题与摘要（原地修改传入的对象）。
 *
 * 抓取来源（RSS、GitHub）几乎不给中文，而管线在缺中文时用英文兜底，于是中文站
 * 长期显示英文——实测 178 条已发布条目里 178 条标题、172 条摘要中英逐字相同。
 *
 * **不重算 contentHash**：它是「英文原文变没变」的判据，把译文掺进去会让
 * 每次翻译结果的细微差异都被当成内容更新，条目每轮都被判为 changed。
 *
 * 翻译失败时什么都不做，英文兜底照旧生效——中文没补上只是不好看，
 * 而让同步整批失败会让机会库直接空掉。
 */
/**
 * 给没有摘要的条目补一段正文首段（原地修改）。
 *
 * 只在来源显式开启 `articleSummary` 时生效，且**只处理本来就没有摘要的条目**——
 * 这是抓取管线里唯一逐条拉文章页的路径，每条一次 HTTP 请求。
 *
 * 串行且带间隔：一次同步可能有几十条，并发打同一个站点既不礼貌也容易被限流。
 * 单条失败只是这条没摘要，不影响其它条目，也不影响整轮同步。
 */
async function applyArticleSummaries(
  source: PathfinderSyncSource,
  items: readonly IngestedPathfinderItem[],
): Promise<void> {
  const config = source.articleSummary;
  if (!config) return;

  /*
   * 默认只补空缺，省掉不必要的请求；`replacesFeedSummary` 的来源全量重取——
   * 它的 feed 给的是一份逐日不变的样板文，留着比空着更糟。
   */
  const pending = config.replacesFeedSummary
    ? items
    : items.filter((item) => !(item.summaryZh ?? item.summaryEn ?? '').trim());
  let missed = 0;
  for (const item of pending) {
    const url = articleSummaryUrl(source, item.canonicalUrl);
    if (!url) continue;
    const summary = await fetchArticleSummary(url, config);
    // 中文来源的正文摘要同样是中文，写进 summaryEn 会让列名与内容不符
    if (summary) {
      if (source.language === 'zh') item.summaryZh = summary;
      else item.summaryEn = summary;
    } else {
      missed += 1;
    }
    // 礼貌间隔：同一个站点连着拉几十页容易被限流
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  /*
   * 全军覆没时报警。
   *
   * 抽取失败是静默的——拿不到就保持原样，页面显示样板文或「未提供摘要」，
   * 没有任何迹象表明是上游改版。零星失败正常（单页超时），但**一条都没成功**
   * 基本只有一个解释：`containerMarker` / `heading` 对不上了。
   *
   * 只报汇总不逐条报：同步每小时一轮，逐条会把日志刷满。
   */
  if (pending.length > 0 && missed === pending.length) {
    console.error({
      event: 'pathfinder_article_summary_failed',
      sourceId: source.id,
      attempted: pending.length,
      mode: config.mode,
      marker: config.mode === 'markdown' ? config.heading : config.containerMarker,
    });
  }
}

async function applyChineseText(items: readonly IngestedPathfinderItem[]): Promise<void> {
  if (!isTranslationEnabled() || items.length === 0) return;

  // 来源偶尔本来就给中文，重复翻译既费钱又可能把已经通顺的原文改坏
  const pending = items.filter((item) => (
    needsTranslation(item.titleZh ?? item.titleEn) || needsTranslation(item.summaryZh ?? item.summaryEn)
  ));
  if (pending.length === 0) return;

  const translated = await translateAll(pending.map((item) => ({
    id: item.externalId,
    titleEn: item.titleEn ?? '',
    summaryEn: item.summaryEn ?? '',
  })));

  for (const item of pending) {
    const zh = translated.get(item.externalId);
    if (!zh) continue;
    if (zh.titleZh) item.titleZh = zh.titleZh;
    if (zh.summaryZh) item.summaryZh = zh.summaryZh;
  }
}

async function persistItems(
  source: PathfinderSyncSource,
  incoming: IngestedPathfinderItem[],
  now: string,
): Promise<{ inserted: number; updated: number; skipped: number }> {
  if (incoming.length === 0) return { inserted: 0, updated: 0, skipped: 0 };
  const prepared = incoming.map((item) => ({ item, urlHash: sha256(item.canonicalUrl) }));
  const externalIds = prepared.map(({ item }) => item.externalId);
  const urlHashes = prepared.map(({ urlHash }) => urlHash);
  const existing = await db.select().from(pathfinderItems).where(or(
    inArray(pathfinderItems.urlHash, urlHashes),
    and(
      eq(pathfinderItems.sourceId, source.id),
      inArray(pathfinderItems.externalId, externalIds),
    ),
  ));
  const byUrl = new Map(existing.map((item) => [item.urlHash, item]));
  const byExternal = new Map(existing
    .filter((item) => item.sourceId === source.id)
    .map((item) => [item.externalId, item]));

  const inserts: Array<typeof pathfinderItems.$inferInsert> = [];
  const pendingInserts: Array<{ item: IngestedPathfinderItem; urlHash: string }> = [];
  const updates: Array<{ existing: ExistingItem; item: IngestedPathfinderItem; urlHash: string }> = [];
  const unchanged: Array<{ existing: ExistingItem; item: IngestedPathfinderItem }> = [];
  let skipped = 0;

  for (const preparedItem of prepared) {
    const matched = byExternal.get(preparedItem.item.externalId) ?? byUrl.get(preparedItem.urlHash);
    // 同一 URL 已由另一来源收录时保留先到记录，不复制正文；详情仍回链官方原文。
    if (matched && matched.sourceId !== source.id) {
      skipped += 1;
      continue;
    }
    if (matched) {
      if (matched.contentHash === preparedItem.item.contentHash) {
        unchanged.push({ existing: matched, item: preparedItem.item });
        skipped += 1;
      } else {
        updates.push({ existing: matched, ...preparedItem });
      }
      continue;
    }
    pendingInserts.push(preparedItem);
  }

  /*
   * 只给「新增」和「英文原文变了」的条目补中文，`unchanged` 一律不动。
   *
   * 解析阶段永远把 titleZh 置为 null（来源不给中文），所以不能按 incoming 判断
   * 该不该翻——那样每轮同步都会把全部条目重译一遍，每小时上百条的调用费，
   * 而结果和上一轮一模一样。这里放在分类之后，正是因为只有到这一步才知道
   * 哪些条目的英文原文确实是新的。
   */
  const needsEnrichment = [...pendingInserts.map(({ item }) => item), ...updates.map(({ item }) => item)];
  // 顺序要紧：先补正文首段，翻译才有东西可翻；反过来的话补上的永远是英文
  await applyArticleSummaries(source, needsEnrichment);
  await applyChineseText(needsEnrichment);
  for (const preparedItem of pendingInserts) {
    inserts.push(toInsertRow(source, preparedItem.item, preparedItem.urlHash, now));
  }

  if (inserts.length > 0) {
    await db.insert(pathfinderItems).values(inserts).onConflictDoNothing();
  }
  // 即使正文没有变化，只要本轮仍从来源读到该条目，就刷新核验时间。
  // stale 条目只有在曾经人工通过或来源允许自动发布时才恢复公开。
  for (let offset = 0; offset < unchanged.length; offset += 20) {
    await Promise.all(unchanged.slice(offset, offset + 20).map(({ existing: old }) => {
      const restoredStatus = old.status === 'stale'
        ? restoredPathfinderStatus(old, source.autoPublish)
        : old.status;
      return db.update(pathfinderItems).set({
        verifiedAt: now,
        status: restoredStatus,
        updatedAt: now,
      }).where(eq(pathfinderItems.id, old.id));
    }));
  }
  // 大多数 Feed 条目写入后不再变化；只有 contentHash 变化的少量条目需要 UPDATE。
  // 限制为五路并发，避免 Neon HTTP 瞬间产生过多连接。
  for (let offset = 0; offset < updates.length; offset += 5) {
    await Promise.all(updates.slice(offset, offset + 5).map(({ existing: old, item, urlHash }) => (
      db.update(pathfinderItems).set({
        canonicalUrl: item.canonicalUrl,
        urlHash,
        titleZh: updateLocalizedZh(old.titleZh, old.titleEn, item.titleZh, item.titleEn ?? old.titleEn),
        titleEn: item.titleEn ?? old.titleEn,
        // null 表示上游已经删除摘要：英文采集字段必须清空；中文仅在其为旧英文
        // fallback 时同步清空，人工补写的中文摘要则保留。
        summaryZh: updateLocalizedZh(old.summaryZh, old.summaryEn, item.summaryZh, item.summaryEn ?? ''),
        summaryEn: item.summaryEn ?? '',
        organization: item.organization,
        organizationEn: item.organizationEn,
        direction: item.direction,
        directions: serializeDirections(item.direction, item.directions),
        difficulty: item.difficulty,
        estimatedMinutes: item.estimatedMinutes,
        costCny: item.costCny,
        costAmount: item.costAmount,
        costCurrency: item.costCurrency,
        costLabelZh: item.costLabelZh,
        costLabelEn: item.costLabelEn,
        device: item.device,
        network: item.network,
        region: item.region,
        regionZh: item.regionZh,
        regionEn: item.regionEn,
        remoteStatus: item.remoteStatus,
        eligibilityZh: updateLocalizedZh(
          old.eligibilityZh,
          old.eligibilityEn,
          item.eligibilityZh,
          item.eligibilityEn ?? '',
        ),
        eligibilityEn: item.eligibilityEn ?? '',
        deadlineText: item.deadlineText,
        deadlineTextZh: item.deadlineTextZh,
        deadlineTextEn: item.deadlineTextEn,
        deadlineDate: item.deadlineDate,
        deadlineAt: item.deadlineAt,
        publishedAt: item.publishedAt,
        status: changedPathfinderStatus(old.status, source.autoPublish),
        learningEligible: ['archived', 'rejected'].includes(old.status)
          ? false
          : source.autoPublish ? item.learningEligible : false,
        requiresManualEligibilityCheck: item.requiresManualEligibilityCheck,
        reviewerId: ['archived', 'rejected'].includes(old.status) ? old.reviewerId : null,
        reviewedAt: ['archived', 'rejected'].includes(old.status) ? old.reviewedAt : null,
        contentHash: item.contentHash,
        verifiedAt: now,
        updatedAt: now,
      }).where(eq(pathfinderItems.id, old.id))
    )));
  }

  // 对本轮所有 seen 条目重建标签。这样即使上次在 item 更新后、tag 写入前失败，
  // 下次 contentHash 未变化仍能自动修复，而不会永久留下缺失标签。
  const seenIds = [
    ...inserts.map((row) => row.id as string),
    ...updates.map(({ existing: item }) => item.id),
    ...unchanged.map(({ existing: item }) => item.id),
  ];
  if (seenIds.length > 0) {
    await db.delete(pathfinderItemTags).where(inArray(pathfinderItemTags.itemId, seenIds));
    const tags = [...inserts.map((row) => ({ id: row.id as string, item: incoming.find((i) => i.externalId === row.externalId)! })),
      ...updates.map(({ existing: item, item: incomingItem }) => ({ id: item.id, item: incomingItem })),
      ...unchanged.map(({ existing: item, item: incomingItem }) => ({ id: item.id, item: incomingItem }))]
      .flatMap(({ id, item }) => item.tags.map((tag) => ({
        itemId: id,
        dimension: 'topic' as const,
        tag: tag.slice(0, 80),
      })));
    if (tags.length > 0) await db.insert(pathfinderItemTags).values(tags).onConflictDoNothing();
  }

  return { inserted: inserts.length, updated: updates.length, skipped };
}

function toInsertRow(
  source: PathfinderSyncSource,
  item: IngestedPathfinderItem,
  urlHash: string,
  now: string,
): typeof pathfinderItems.$inferInsert {
  const title = item.titleZh ?? item.titleEn ?? 'Untitled';
  const summary = item.summaryZh ?? item.summaryEn ?? '';
  const eligibility = item.eligibilityZh ?? item.eligibilityEn ?? '';
  return {
    id: `pf_${sha256(`${source.id}:${item.externalId}`).slice(0, 24)}`,
    sourceId: source.id,
    externalId: item.externalId,
    canonicalUrl: item.canonicalUrl,
    urlHash,
    itemType: item.type,
    titleZh: item.titleZh ?? title,
    titleEn: item.titleEn ?? title,
    summaryZh: item.summaryZh ?? summary,
    summaryEn: item.summaryEn ?? summary,
    organization: item.organization,
    organizationEn: item.organizationEn,
    direction: item.direction,
    directions: serializeDirections(item.direction, item.directions),
    difficulty: item.difficulty,
    estimatedMinutes: item.estimatedMinutes,
    costCny: item.costCny,
    costAmount: item.costAmount,
    costCurrency: item.costCurrency,
    costLabelZh: item.costLabelZh,
    costLabelEn: item.costLabelEn,
    device: item.device,
    network: item.network,
    region: item.region,
    regionZh: item.regionZh,
    regionEn: item.regionEn,
    remoteStatus: item.remoteStatus,
    eligibilityZh: item.eligibilityZh ?? eligibility,
    eligibilityEn: item.eligibilityEn ?? eligibility,
    deadlineText: item.deadlineText,
    deadlineTextZh: item.deadlineTextZh,
    deadlineTextEn: item.deadlineTextEn,
    deadlineDate: item.deadlineDate,
    deadlineAt: item.deadlineAt,
    publishedAt: item.publishedAt,
    discoveredAt: now,
    verifiedAt: now,
    status: source.autoPublish ? 'published' : 'pending',
    learningEligible: item.learningEligible,
    requiresManualEligibilityCheck: item.requiresManualEligibilityCheck,
    contentHash: item.contentHash,
    createdAt: now,
    updatedAt: now,
  };
}

async function markSourceSuccess(
  sourceId: string,
  now: string,
  etag: string | null,
  lastModified: string | null,
  cursor: string | null,
) {
  await db.update(pathfinderSources).set({
    etag,
    lastModified,
    cursor,
    lastSuccessAt: now,
    lastError: null,
    consecutiveFailures: 0,
    updatedAt: now,
  }).where(eq(pathfinderSources.id, sourceId));
}

async function refreshSourceMembership(
  source: PathfinderSyncSource,
  cursor: string | null,
  now: string,
) {
  const externalIds = parsePathfinderMembershipCursor(cursor);
  if (externalIds.length === 0) return;
  const rows = await db.select().from(pathfinderItems).where(and(
    eq(pathfinderItems.sourceId, source.id),
    inArray(pathfinderItems.externalId, externalIds),
  ));
  for (let offset = 0; offset < rows.length; offset += 20) {
    await Promise.all(rows.slice(offset, offset + 20).map((item) => db.update(pathfinderItems).set({
      verifiedAt: now,
      status: item.status === 'stale'
        ? restoredPathfinderStatus(item, source.autoPublish)
        : item.status,
      updatedAt: now,
    }).where(eq(pathfinderItems.id, item.id))));
  }
}

async function expirePastDeadlineItems() {
  const nowDate = new Date();
  const now = nowDate.toISOString();
  // 仅公布日期且未披露时区时，保守保留到该日期在 UTC-12 的一天结束。
  const expiredDateBefore = new Date(nowDate.getTime() - 12 * 3_600_000).toISOString().slice(0, 10);
  const rows = await db.update(pathfinderItems).set({ status: 'expired', updatedAt: now }).where(and(
    eq(pathfinderItems.status, 'published'),
    or(
      // ISO 8601 UTC 文本按字典序可比较；所有标准 deadlineAt 都由解析层输出为 UTC ISO。
      inPast(pathfinderItems.deadlineAt, now),
      sql`${pathfinderItems.deadlineAt} is null and ${pathfinderItems.deadlineDate} < ${expiredDateBefore}`,
    ),
  )).returning({ id: pathfinderItems.id });
  return rows.length;
}

/**
 * 动态学习条目超过 30 天没有再次出现在可信来源中，就停止进入新路径。
 * 这对 GitHub 搜索结果尤其重要：Issue 关闭或跌出检索窗口后不能永久保持“已核验”。
 */
async function markUnverifiedLearningItemsStale(now: Date) {
  const staleBefore = new Date(now.getTime() - 30 * 86_400_000).toISOString();
  const updatedAt = now.toISOString();
  const rows = await db.update(pathfinderItems).set({ status: 'stale', updatedAt }).where(and(
    eq(pathfinderItems.status, 'published'),
    eq(pathfinderItems.learningEligible, true),
    sql`${pathfinderItems.verifiedAt} < ${staleBefore}`,
  )).returning({ id: pathfinderItems.id });
  return rows.length;
}

async function archiveOldAiUpdates(now: Date) {
  const archiveBefore = new Date(now.getTime() - 180 * 86_400_000).toISOString();
  const updatedAt = now.toISOString();
  const rows = await db.update(pathfinderItems).set({ status: 'archived', updatedAt }).where(and(
    eq(pathfinderItems.status, 'published'),
    eq(pathfinderItems.itemType, 'ai-update'),
    sql`coalesce(${pathfinderItems.publishedAt}, ${pathfinderItems.discoveredAt}) < ${archiveBefore}`,
  )).returning({ id: pathfinderItems.id });
  return rows.length;
}

export function isPathfinderSourceDue(
  lastSuccessAt: string | null,
  intervalMinutes: number,
  now: Date,
): boolean {
  if (!lastSuccessAt) return true;
  const lastSuccess = Date.parse(lastSuccessAt);
  if (!Number.isFinite(lastSuccess)) return true;
  return now.getTime() - lastSuccess >= Math.max(1, intervalMinutes) * 60_000;
}

export function effectivePathfinderAutoPublish(
  codeAllows: boolean,
  databaseAllows: boolean,
): boolean {
  return codeAllows && databaseAllows;
}

export function restoredPathfinderStatus(
  item: Pick<ExistingItem, 'reviewerId' | 'reviewedAt'>,
  autoPublish: boolean,
): ExistingItem['status'] {
  return autoPublish || (item.reviewerId !== null && item.reviewedAt !== null)
    ? 'published'
    : 'pending';
}

export function changedPathfinderStatus(
  currentStatus: ExistingItem['status'],
  autoPublish: boolean,
): ExistingItem['status'] {
  if (currentStatus === 'archived' || currentStatus === 'rejected') return currentStatus;
  return autoPublish ? 'published' : 'pending';
}

export function buildPathfinderMembershipCursor(
  items: readonly Pick<IngestedPathfinderItem, 'externalId'>[],
): string {
  return JSON.stringify({
    version: 1,
    externalIds: [...new Set(items.map((item) => item.externalId))].slice(0, 30),
  });
}

export function parsePathfinderMembershipCursor(cursor: string | null): string[] {
  if (!cursor) return [];
  try {
    const value = JSON.parse(cursor) as { version?: unknown; externalIds?: unknown };
    if (value.version !== 1 || !Array.isArray(value.externalIds)) return [];
    return [...new Set(value.externalIds.filter((id): id is string => (
      typeof id === 'string' && id.length > 0 && id.length <= 500
    )))].slice(0, 30);
  } catch {
    return [];
  }
}

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/**
 * 自动采集没有中文时会把英文复制到中文列。后续英文变化时，仅这种 fallback
 * 可以被新英文替换；人工补写的中文内容不能被同步任务覆盖。
 */
export function updateLocalizedZh(
  previousZh: string,
  previousEn: string,
  incomingZh: string | null,
  incomingEn: string,
): string {
  if (incomingZh !== null) return incomingZh;
  return previousZh === previousEn ? incomingEn : previousZh;
}

export function serializeDirections(
  primary: PathfinderDirection,
  directions: readonly PathfinderDirection[],
): string {
  const allowed = new Set<string>(PATHFINDER_DIRECTIONS);
  return JSON.stringify([...new Set([primary, ...directions].filter((value) => allowed.has(value)))]);
}

// 小型 SQL helper 单独封装，避免在 ensureSourceRows 里散落 raw SQL。
function sqlExcluded(column: string) {
  return sql.raw(`excluded.${column}`);
}

function inPast(column: SQLWrapper, now: string) {
  return sql`${column} is not null and ${column} < ${now}`;
}

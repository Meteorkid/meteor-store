import { createHash } from 'node:crypto';
import { and, desc, eq, gte, ilike, inArray, lt, lte, or, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { pathfinderItems, pathfinderSources } from '@/lib/db/schema';
import { cleanExternalText, isAllowedHost, normalizeIngestionUrl, toIsoDate } from '@/lib/pathfinder/ingestion/normalize';
import { PATHFINDER_SYNC_SOURCE_MAP } from '@/lib/pathfinder/ingestion/sources';
import { DailyDateSchema, DailyLinkItemSchema, shiftDailyDate, type DailyLinkItem } from './types';
import type { DailyContentResult } from './content';

const officialSourceIds = [...PATHFINDER_SYNC_SOURCE_MAP.values()]
  .filter(source => source.trustLevel === 'official').map(source => source.id);
const titlePatterns = [
  '%keynote%', '%launch%event%', '%press%conference%', '%devday%', '%dev day%',
  '%developer%conference%', '%developer%summit%',
  '%发布会%', '%發佈會%', '%發表會%', '%开发者大会%', '%開發者大會%', '%开发者峰会%', '%開發者峰會%',
];
const eventTitle = /\b(?:keynote|launch[\s-]+event|press[\s-]+conference|dev[\s-]?day|developers?['’]?[\s-]+(?:conference|summit))\b|发布会|發佈會|發表會|开发者大会|開發者大會|开发者峰会|開發者峰會/i;
// 同URL可能已归属AI栏目来源；新增feed不迁移来源归属，两者都允许完整品牌名。
const githubEventSourceIds = ['github-universe-events', 'github-ai-blog'];
const githubUniverseTitle = /\bgithub\s+universe\b/i;
const githubUniverseSqlPattern = '(^|[^A-Za-z0-9_])github[[:space:]]+universe([^A-Za-z0-9_]|$)';
// 事件识别、会场语音数据集等研究成果不是活动公告，不能仅凭标题中的活动用语发布。
const researchTitle = /\b(?:datasets?|benchmarks?|papers?)\b|论文|論文|数据集|資料集|基准测试|基準測試/i;

/** 复用已采集的官方公告；来源发布日期不代表活动开始日期，不据此猜预告或回放。 */
export async function loadDailyEvents(date: string, usedSourceKeys: string[]): Promise<DailyContentResult> {
  DailyDateSchema.parse(date);
  const start = new Date(`${shiftDailyDate(date, -29)}T00:00:00+08:00`).toISOString();
  const end = new Date(`${shiftDailyDate(date, 1)}T00:00:00+08:00`).toISOString();
  const now = new Date().toISOString();
  const rows = await db.select({
    id: pathfinderItems.id, sourceId: pathfinderItems.sourceId, status: pathfinderItems.status,
    titleZh: pathfinderItems.titleZh, titleEn: pathfinderItems.titleEn,
    summaryZh: pathfinderItems.summaryZh, summaryEn: pathfinderItems.summaryEn,
    canonicalUrl: pathfinderItems.canonicalUrl, publishedAt: pathfinderItems.publishedAt,
    sourceName: pathfinderSources.name, trustLevel: pathfinderSources.trustLevel,
  }).from(pathfinderItems)
    .innerJoin(pathfinderSources, eq(pathfinderItems.sourceId, pathfinderSources.id))
    .where(and(
      eq(pathfinderItems.status, 'published'), eq(pathfinderSources.trustLevel, 'official'),
      inArray(pathfinderSources.id, officialSourceIds),
      gte(pathfinderItems.publishedAt, start), lt(pathfinderItems.publishedAt, end), lte(pathfinderItems.publishedAt, now),
      or(
        ...titlePatterns.flatMap(pattern => [ilike(pathfinderItems.titleZh, pattern), ilike(pathfinderItems.titleEn, pattern)]),
        and(inArray(pathfinderItems.sourceId, githubEventSourceIds), or(
          sql`${pathfinderItems.titleZh} ~* ${githubUniverseSqlPattern}`,
          sql`${pathfinderItems.titleEn} ~* ${githubUniverseSqlPattern}`,
        )),
      ),
    ))
    .orderBy(desc(pathfinderItems.publishedAt))
    .limit(200);

  const used = new Set(usedSourceKeys);
  for (const key of usedSourceKeys) {
    const url = normalizeIngestionUrl(key);
    if (url) used.add(url);
  }
  const seenIds = new Set<string>();
  const seenUrls = new Set<string>();
  const items: DailyLinkItem[] = [];
  for (const row of rows) {
    const source = PATHFINDER_SYNC_SOURCE_MAP.get(row.sourceId);
    if (row.status !== 'published' || row.trustLevel !== 'official' || source?.trustLevel !== 'official') continue;
    const titleZh = cleanExternalText(row.titleZh, 300);
    const titleEn = cleanExternalText(row.titleEn, 300);
    const titles = `${titleZh} ${titleEn}`;
    const isGithubUniverse = githubEventSourceIds.includes(row.sourceId)
      && (githubUniverseTitle.test(titleZh) || githubUniverseTitle.test(titleEn));
    if ((!eventTitle.test(titles) && !isGithubUniverse) || researchTitle.test(titles)) continue;
    const sourcePublishedAt = toIsoDate(row.publishedAt);
    if (!sourcePublishedAt || sourcePublishedAt < start || sourcePublishedAt >= end || sourcePublishedAt > now) continue;
    const url = normalizeIngestionUrl(row.canonicalUrl);
    if (!url || !isAllowedHost(url, source.allowedItemHosts)) continue;
    const parsedUrl = new URL(url);
    if (parsedUrl.username || parsedUrl.password || (parsedUrl.port && parsedUrl.port !== '443')) continue;
    if (used.has(row.id) || used.has(url) || seenIds.has(row.id) || seenUrls.has(url)) continue;

    const item = DailyLinkItemSchema.safeParse({
      id: row.id, title: titleZh || titleEn,
      summary: cleanExternalText(row.summaryZh, 6000) || cleanExternalText(row.summaryEn, 6000),
      url, sourceName: cleanExternalText(row.sourceName, 100), sourceType: 'official',
      sourcePublishedAt, phase: 'announcement',
    });
    if (!item.success) continue;
    items.push(item.data);
    seenIds.add(row.id); seenUrls.add(url);
    if (items.length === 5) break;
  }

  if (!items.length) return { status: 'empty', title: '官方活动与发布会', summary: '已接入来源近30天暂无尚未收录的官方活动公告。', content: null };
  const identities = items.map(item => [item.id, item.url]).sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]));
  return {
    status: 'published', title: '官方活动与发布会',
    summary: `来自已接入官方来源的 ${items.length} 条活动公告，具体安排以原文为准。`,
    content: { kind: 'events', items },
    sourceKey: `events:${createHash('sha256').update(JSON.stringify(identities)).digest('hex')}`,
  };
}

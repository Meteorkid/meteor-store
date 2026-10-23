import { createHash } from 'node:crypto';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { pathfinderItems, pathfinderSources } from '@/lib/db/schema';
import { cleanExternalText, normalizeIngestionUrl, toIsoDate } from '@/lib/pathfinder/ingestion/normalize';
import { parseGreenhouseMembershipCursor } from '@/lib/pathfinder/ingestion/parse';
import { PATHFINDER_SYNC_SOURCE_MAP } from '@/lib/pathfinder/ingestion/sources';
import { DailyDateSchema, DailyLinkItemSchema, dailyDate, inferDailyRoleType, type DailyEdition, type DailyLinkItem } from './types';
import type { DailyContentResult } from './content';

type Channel = 'competitions' | 'internships';
type ItemRow = typeof pathfinderItems.$inferSelect;
type SourceRow = typeof pathfinderSources.$inferSelect;
const sourceIds: Record<Channel, string[]> = {
  competitions: ['codeforces-contests'],
  internships: ['databricks-student-jobs', 'scale-ai-student-jobs'],
};
const DAY = 86_400_000;

/** 只选当前官方动态记录；静态门户与目录降级不能充当当天采集结果。 */
export async function loadDailyOpportunities(channel: Channel, date: string, usedSourceKeys: string[]): Promise<DailyContentResult> {
  DailyDateSchema.parse(date);
  const now = new Date();
  if (date !== dailyDate(now)) throw new Error('动态机会只能生成当天内容');
  const expectedIds = sourceIds[channel];
  const sources = await db.select().from(pathfinderSources).where(inArray(pathfinderSources.id, expectedIds));
  const healthy = sources.filter(source => healthySource(source, channel, now));
  const unavailable = expectedIds.length - healthy.length;
  if (!healthy.length) throw new Error('机会来源暂不可用或尚未完成近期核验');
  const bySource = new Map(healthy.map(source => [source.id, source]));
  const memberships = new Map(healthy.map(source => [source.id, new Set(parseGreenhouseMembershipCursor(source.cursor) ?? [])]));
  const itemType = channel === 'competitions' ? 'competition' : 'internship';
  const rows = await db.select().from(pathfinderItems).where(and(
    eq(pathfinderItems.status, 'published'), eq(pathfinderItems.itemType, itemType),
    inArray(pathfinderItems.sourceId, healthy.map(source => source.id)),
  )).orderBy(desc(pathfinderItems.discoveredAt)).limit(200);

  const used = new Set(usedSourceKeys);
  for (const key of usedSourceKeys) {
    const url = normalizeIngestionUrl(key);
    if (url) used.add(url);
  }
  const candidates: DailyLinkItem[] = [];
  for (const row of rows) {
    const source = bySource.get(row.sourceId);
    const item = source ? currentOpportunity(row, source, channel, now, memberships.get(row.sourceId)) : null;
    if (!item || used.has(item.id) || used.has(item.url)) continue;
    if (channel === 'competitions') {
      const until = Date.parse(item.startAt!) - now.getTime();
      // 近期收录的未来 30 天赛事，或一周内开赛的旧条目；不把远期旧赛程每日循环推荐。
      if (until > 30 * DAY || (until > 7 * DAY && !recent(row.discoveredAt, now, 7 * DAY))) continue;
    }
    candidates.push(item);
  }
  if (channel === 'competitions') candidates.sort((a, b) => (a.startAt ?? '').localeCompare(b.startAt ?? '') || a.id.localeCompare(b.id));
  const seen = new Set<string>();
  const items = candidates.filter(item => {
    if (seen.has(item.id) || seen.has(item.url)) return false;
    seen.add(item.id); seen.add(item.url); return true;
  }).slice(0, 3);
  const title = channel === 'competitions' ? '每日编程竞赛' : '实习与应届机会';
  if (!items.length) {
    if (unavailable) throw new Error('部分机会来源暂不可用，当前可用来源暂无候选');
    return { status: 'empty', title, summary: channel === 'competitions'
      ? '官方近期赛程中暂无尚未入选、即将开始的编程比赛。'
      : '已接入官方职位板中暂无尚未入选且本次核验有效的学生岗位。', content: null };
  }
  const summary = channel === 'competitions'
    ? `${items.length} 场 Codeforces 官方比赛，显示开赛时间，报名安排以官方页面为准。`
    : `${items.length} 个近期核验仍在官方职位板的学生岗位；现有来源主要覆盖海外，地点与工作许可需自行核对。`;
  const identities = items.map(item => [item.id, item.url]).sort((a, b) => a[0].localeCompare(b[0]));
  return { status: 'published', title, summary: summary + (unavailable ? ` 另有 ${unavailable} 个来源暂不可用。` : ''),
    content: { kind: channel, items }, sourceKey: `${channel}:${date}:${createHash('sha256').update(JSON.stringify(identities)).digest('hex')}` };
}

/** 今日公开视图再次核验已选机会；不修改已保存的日刊，历史回看由调用方保留。 */
export async function filterAvailableDailyOpportunities(editions: DailyEdition[]): Promise<DailyEdition[]> {
  const targets = editions.filter(edition => edition.status === 'published'
    && (edition.content?.kind === 'competitions' || edition.content?.kind === 'internships'));
  if (!targets.length) return editions;
  const now = new Date();
  const ids = targets.flatMap(edition => edition.content && 'items' in edition.content ? edition.content.items.map(item => item.id) : []);
  const expectedSources = [...new Set(targets.flatMap(edition => sourceIds[edition.channel as Channel]))];
  const [sources, rows] = await Promise.all([
    db.select().from(pathfinderSources).where(inArray(pathfinderSources.id, expectedSources)),
    db.select().from(pathfinderItems).where(inArray(pathfinderItems.id, ids)).orderBy(desc(pathfinderItems.discoveredAt)).limit(ids.length),
  ]);
  const bySource = new Map(sources.map(source => [source.id, source]));
  const byId = new Map(rows.map(row => [row.id, row]));
  const memberships = new Map(sources.map(source => [source.id, new Set(parseGreenhouseMembershipCursor(source.cursor) ?? [])]));
  return editions.map(edition => {
    if (!targets.includes(edition) || !edition.content || !('items' in edition.content)) return edition;
    const channel = edition.content.kind as Channel;
    let unverifiable = false;
    const items = edition.content.items.flatMap(item => {
      const row = byId.get(item.id);
      if (!row || row.status !== 'published') return [];
      const source = bySource.get(row.sourceId);
      if (!source || !healthySource(source, channel, now)) { unverifiable = true; return []; }
      const current = currentOpportunity(row, source, channel, now, memberships.get(row.sourceId));
      return current ? [current] : [];
    });
    if (!items.length) return { ...edition, status: unverifiable ? 'failed' as const : 'empty' as const,
      content: null, title: '', summary: '', sourceKey: null, publishedAt: null };
    return { ...edition, content: { kind: channel, items }, summary: channel === 'competitions'
      ? `${items.length} 场仍未开始的官方比赛，所列时间为开赛时间。`
      : `${items.length} 个近期核验仍在官方职位板的学生岗位；地点与工作许可需自行核对。` };
  });
}

function healthySource(source: SourceRow, channel: Channel, now: Date): boolean {
  const config = PATHFINDER_SYNC_SOURCE_MAP.get(source.id);
  return sourceIds[channel].includes(source.id) && Boolean(config?.enabled && config.autoPublish)
    && config?.trustLevel === 'official' && source.trustLevel === 'official'
    && source.enabled && source.autoPublish && source.consecutiveFailures === 0
    && recent(source.lastSuccessAt, now, DAY)
    && (channel !== 'internships' || parseGreenhouseMembershipCursor(source.cursor) !== null);
}

function currentOpportunity(row: ItemRow, source: SourceRow, channel: Channel, now: Date, membership?: Set<string>): DailyLinkItem | null {
  if (row.status !== 'published' || row.itemType !== (channel === 'competitions' ? 'competition' : 'internship')
    || !recent(row.verifiedAt, now, DAY)) return null;
  const url = opportunityUrl(row.sourceId, row.externalId, row.canonicalUrl);
  if (!url) return null;
  const publishedAt = toIsoDate(row.publishedAt);
  if (row.publishedAt && (!publishedAt || Date.parse(publishedAt) > now.getTime())) return null;
  const common = { id: row.id, title: cleanExternalText(row.titleZh || row.titleEn, 300), url,
    sourceName: cleanExternalText(source.name, 100), sourceType: 'official',
    organization: cleanExternalText(row.organization || row.organizationEn, 200),
    verifiedAt: toIsoDate(row.verifiedAt), ...(publishedAt ? { sourcePublishedAt: publishedAt } : {}) };
  let data: unknown;
  if (channel === 'competitions') {
    const startAt = toIsoDate(row.deadlineAt);
    if (!startAt || Date.parse(startAt) <= now.getTime()) return null;
    data = { ...common, startAt, timeZone: 'UTC', phase: 'upcoming', location: '线上 · 全球 / Online · Worldwide',
      summary: 'Codeforces 官方未来赛程。所列为开赛时间；报名窗口、组别与参赛条件以官方页面为准。',
      eligibility: '注册及组别资格请以当场比赛规则为准；开赛时间不代表已核实的报名截止。' };
  } else {
    // 本轮未复核的正文不能仅凭岗位 ID 尚在板中，就被当作当前机会推荐。
    if (!membership?.has(row.externalId) || row.verifiedAt !== source.lastSuccessAt) return null;
    const region = cleanExternalText(row.regionZh || row.regionEn || row.region || '', 200);
    if (!region || region === 'unspecified') return null;
    const deadline = toIsoDate(row.deadlineAt);
    if (deadline && Date.parse(deadline) <= now.getTime()) return null;
    if (row.deadlineDate && row.deadlineDate < new Date(now.getTime() - 12 * 3_600_000).toISOString().slice(0, 10)) return null;
    const remoteStatus = row.remoteStatus === 'remote' || row.remoteStatus === 'hybrid' || row.remoteStatus === 'onsite'
      ? row.remoteStatus : 'unknown';
    data = { ...common, location: region, remoteStatus,
      roleType: inferDailyRoleType(row.titleEn || row.titleZh),
      summary: `${common.organization} 官方职位板当前仍列出的学生或应届岗位。职责与投递要求请阅读官方详情。`,
      eligibility: `${cleanExternalText(row.eligibilityZh || row.eligibilityEn, 1000)} 年级、所在地与工作许可须逐项核对；本站不判断你是否符合。` };
  }
  const parsed = DailyLinkItemSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

function recent(value: string | null, now: Date, window: number): boolean {
  const time = value ? Date.parse(value) : Number.NaN;
  return Number.isFinite(time) && time <= now.getTime() && time >= now.getTime() - window;
}

function opportunityUrl(sourceId: string, externalId: string, raw: string): string | null {
  const normalized = normalizeIngestionUrl(raw);
  if (!normalized || !/^\d+$/.test(externalId)) return null;
  const url = new URL(normalized);
  if (url.username || url.password || (url.port && url.port !== '443')) return null;
  if (sourceId === 'codeforces-contests') return url.hostname === 'codeforces.com'
    && /^\/contests?\/\d+$/.test(url.pathname) ? normalized : null;
  const hosts = sourceId === 'databricks-student-jobs' ? ['databricks.com', 'www.databricks.com', 'job-boards.greenhouse.io']
    : sourceId === 'scale-ai-student-jobs' ? ['scale.com', 'www.scale.com', 'job-boards.greenhouse.io'] : [];
  if (!hosts.includes(url.hostname)) return null;
  if (url.hostname === 'job-boards.greenhouse.io') {
    const board = sourceId === 'databricks-student-jobs' ? 'databricks' : 'scaleai';
    return url.pathname === `/${board}/jobs/${externalId}` ? normalized : null;
  }
  return url.searchParams.get('gh_jid') === externalId
    || new RegExp(`(?:/|-)${externalId}$`).test(url.pathname) ? normalized : null;
}

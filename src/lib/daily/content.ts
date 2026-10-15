import { createHash } from 'node:crypto';
import { and, desc, eq, gte, lt } from 'drizzle-orm';
import { db } from '@/lib/db';
import { pathfinderItems, pathfinderSources } from '@/lib/db/schema';
import { SITE_URL } from '@/lib/constants';
import { cleanExternalText, normalizeIngestionUrl, toIsoDate } from '@/lib/pathfinder/ingestion/normalize';
import { englishLessons } from './english-lessons';
import {
  DailyDateSchema, DailyLinkItemSchema, dailyDate, shiftDailyDate,
  type DailyEditionChannelId, type DailyContent, type DailyLinkItem,
} from './types';

export interface DailyContentResult {
  status: 'draft' | 'published' | 'empty';
  title: string;
  summary: string;
  content: DailyContent | null;
  sourceKey?: string;
}

// 完整合并 RSS 在生产需约 80 秒；官方 API 只取最新 20 篇，避免大响应拖垮每日生成。
const ARXIV_FEED_URL = 'https://export.arxiv.org/api/query?search_query=cat%3Acs.AI+OR+cat%3Acs.CL+OR+cat%3Acs.LG&start=0&max_results=20&sortBy=submittedDate&sortOrder=descending';
// 同时兼容历史 RSS 的正常体积，实际请求仍使用上面的小批量 API。
const MAX_FEED_BYTES = 8 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 10_000;
const ARXIV_INTERVAL_MS = 3_000;
const ANNOUNCEMENT_ORDER = { new: 0, cross: 1, replace: 2, 'replace-cross': 3 };
let arxivQueue: Promise<unknown> = Promise.resolve();
let lastArxivRequestAt: number | null = null;

/** 公共内容每期生成一次；采集错误必须上抛，不能伪装成当天无稿。 */
export async function loadDailyContent(
  channel: DailyEditionChannelId,
  date: string,
  usedSourceKeys: string[] = [],
): Promise<DailyContentResult> {
  DailyDateSchema.parse(date);
  const used = new Set(usedSourceKeys);
  if (channel === 'english') {
    const lesson = englishLessons.find((item) => !used.has(`english:${item.id}`));
    return lesson ? {
      status: 'draft', title: lesson.title, summary: lesson.summary,
      content: structuredClone(lesson.content), sourceKey: `english:${lesson.id}`,
    } : empty('每日英语', '原创课程池已用完，等待补充审核。');
  }
  if (channel === 'events') return empty('发布会日历', '尚无经确认的新活动，等待录入官方信息。');
  if (channel === 'ai') return loadAiContent(date, used);

  const xml = await fetchArxivFeed();
  const items = parseArxivFeed(xml, date, usedSourceKeys);
  return items.length > 0 ? {
    status: 'draft', title: '每日论文精选',
    summary: `精选 ${items.length} 篇近七天的 arXiv 预印本；保留原始摘要与来源日期，供审核后阅读。`,
    content: { kind: 'papers', items }, sourceKey: sourceKey('papers', items),
  } : empty('每日论文', '最近一期中没有尚未入选的近七天论文，或来源当天未更新。');
}

function empty(title: string, summary: string): DailyContentResult {
  return { status: 'empty', title, summary, content: null };
}

function sourceKey(channel: string, items: DailyLinkItem[]): string {
  const identities = items.map((item) => `${item.id}:${item.version ?? ''}`).sort();
  return `${channel}:${createHash('sha256').update(JSON.stringify(identities)).digest('hex')}`;
}

async function loadAiContent(date: string, used: Set<string>): Promise<DailyContentResult> {
  const start = new Date(`${date}T00:00:00+08:00`).toISOString();
  const end = new Date(`${shiftDailyDate(date, 1)}T00:00:00+08:00`).toISOString();
  // 直接查已发布数据库记录；目录的静态降级不能冒充当天真实采集结果。
  const rows = await db.select({
    id: pathfinderItems.id, titleZh: pathfinderItems.titleZh, titleEn: pathfinderItems.titleEn,
    summaryZh: pathfinderItems.summaryZh, summaryEn: pathfinderItems.summaryEn,
    canonicalUrl: pathfinderItems.canonicalUrl, publishedAt: pathfinderItems.publishedAt,
    sourceName: pathfinderSources.name, trustLevel: pathfinderSources.trustLevel,
  }).from(pathfinderItems)
    .innerJoin(pathfinderSources, eq(pathfinderItems.sourceId, pathfinderSources.id))
    .where(and(
      eq(pathfinderItems.status, 'published'), eq(pathfinderItems.itemType, 'ai-update'),
      gte(pathfinderItems.publishedAt, start), lt(pathfinderItems.publishedAt, end),
    ))
    .orderBy(desc(pathfinderItems.publishedAt))
    .limit(50);

  const seen = new Set<string>();
  const items: DailyLinkItem[] = [];
  for (const row of rows) {
    const publishedAt = toIsoDate(row.publishedAt);
    const url = normalizeIngestionUrl(row.canonicalUrl);
    if (!publishedAt || dailyDate(new Date(publishedAt)) !== date || !url
      || used.has(row.id) || used.has(url) || seen.has(url)) continue;
    const item = DailyLinkItemSchema.safeParse({
      id: row.id, title: cleanExternalText(row.titleZh || row.titleEn, 300),
      summary: cleanExternalText(row.summaryZh || row.summaryEn, 6000),
      url, sourceName: row.sourceName,
      sourceType: row.trustLevel === 'official' ? 'official' : 'aggregator',
      sourcePublishedAt: publishedAt,
    });
    if (!item.success) continue;
    seen.add(url);
    items.push(item.data);
    if (items.length === 5) break;
  }
  return items.length > 0 ? {
    status: 'published', title: 'AI 圈大事',
    summary: `来自当天已发布资讯的 ${items.length} 条摘要，保留原始出处与发布时间。`,
    content: { kind: 'ai', items }, sourceKey: sourceKey('ai', items),
  } : empty('AI 圈大事', '当天尚无可用的已发布资讯。');
}

/** arXiv 要求单连接及请求起点至少间隔三秒，后台并发补跑也必须串行。 */
async function fetchArxivFeed(): Promise<string> {
  const request = arxivQueue.catch(() => undefined).then(async () => {
    if (lastArxivRequestAt !== null) {
      const delay = ARXIV_INTERVAL_MS - (Date.now() - lastArxivRequestAt);
      if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
    }
    lastArxivRequestAt = Date.now();
    const response = await fetch(ARXIV_FEED_URL, {
      headers: { Accept: 'application/atom+xml, application/xml, text/xml', 'User-Agent': `Meteor-Daily/1.0 (+${SITE_URL}/daily)` },
      cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`arXiv 来源返回 HTTP ${response.status}`);
    if (response.url && response.url !== ARXIV_FEED_URL) throw new Error('arXiv 来源地址发生变化');
    if (Number(response.headers.get('content-length')) > MAX_FEED_BYTES) throw new Error('arXiv 来源超过体积上限');
    if (!response.body) throw new Error('arXiv 来源响应为空');
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > MAX_FEED_BYTES) {
          await reader.cancel().catch(() => undefined);
          throw new Error('arXiv 来源超过体积上限');
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    return Buffer.concat(chunks).toString('utf8');
  });
  arxivQueue = request;
  return request;
}

/** 只读取官方 Atom/RSS 元数据，不执行 DTD、外部实体，也不请求条目里的任何 URL。 */
export function parseArxivFeed(xml: string, date: string, usedSourceKeys: string[] = []): DailyLinkItem[] {
  DailyDateSchema.parse(date);
  if (Buffer.byteLength(xml, 'utf8') > MAX_FEED_BYTES) throw new Error('arXiv 来源超过体积上限');
  if (/<!\s*(?:DOCTYPE|ENTITY)\b/i.test(xml)) throw new Error('arXiv 来源不允许 DTD 或实体声明');
  const atom = /^\s*(?:<\?xml[^?]*\?>\s*)?<feed\b[^>]*>[\s\S]*<\/feed>\s*$/i.test(xml);
  if (!atom && (!/^\s*(?:<\?xml[^?]*\?>\s*)?<rss\b[^>]*>[\s\S]*<\/rss>\s*$/i.test(xml)
    || !/<channel\b[^>]*>[\s\S]*<\/channel>/i.test(xml))) throw new Error('arXiv 来源格式无效');
  const tag = atom ? 'entry' : 'item';
  const blocks = xml.match(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi')) ?? [];
  if ((xml.match(new RegExp(`<${tag}\\b`, 'gi')) ?? []).length !== blocks.length) throw new Error('arXiv 来源条目不完整');
  const earliest = new Date(`${shiftDailyDate(date, -6)}T00:00:00+08:00`).getTime();
  const latest = new Date(`${shiftDailyDate(date, 1)}T00:00:00+08:00`).getTime();
  const used = new Set(usedSourceKeys);
  const byId = new Map<string, DailyLinkItem>();
  let incompleteMetadata = false;
  for (const block of blocks) {
    const rawUrl = xmlText(block, atom ? 'id' : 'link');
    if (atom && !rawUrl) {
      incompleteMetadata = true;
      continue;
    }
    if (atom && /^https?:\/\/arxiv\.org\/api\/errors(?:#|$)/.test(rawUrl ?? '')) throw new Error('arXiv API 返回错误条目');
    // Atom 的官方 ID 使用 HTTP；仅解析标识并输出 HTTPS，不请求该 HTTP 地址。
    const canonicalUrl = atom ? rawUrl?.replace(/^http:\/\/arxiv\.org\//, 'https://arxiv.org/') : rawUrl;
    const match = canonicalUrl?.match(/^https:\/\/arxiv\.org\/abs\/((?:\d{4}\.\d{4,5}|[a-z-]+(?:\.[A-Z]{2})?\/\d{7}))(v\d+)?$/);
    if (!match) continue;
    const id = `https://arxiv.org/abs/${match[1]}`;
    if (used.has(id) || used.has(match[1])) continue;
    const guid = atom ? undefined : xmlText(block, 'guid');
    const version = guid?.match(/v\d+$/)?.[0] ?? match[2];
    if (!version) {
      incompleteMetadata = true;
      continue;
    }
    if (guid && guid !== `oai:arXiv.org:${match[1]}${version}`) continue;
    // Atom 的 updated 是修订日期，不能让多年前首发的论文混入近七天新稿。
    const publishedAt = toIsoDate(xmlText(block, atom ? 'published' : 'pubDate'));
    if (!publishedAt) {
      incompleteMetadata = true;
      continue;
    }
    if (Date.parse(publishedAt) < earliest || Date.parse(publishedAt) >= latest) continue;
    const description = xmlText(block, 'description');
    const abstract = atom ? xmlText(block, 'summary') : description?.match(/\bAbstract:\s*([\s\S]*)$/)?.[1]?.trim();
    const authors = atom
      ? (block.match(/<author\b[^>]*>[\s\S]*?<\/author>/gi) ?? [])
        .map((author) => xmlText(author, 'name')).filter(Boolean)
      : xmlText(block, 'dc:creator')?.split(/,\s*/).filter(Boolean);
    const announcementType = atom ? undefined : xmlText(block, 'arxiv:announce_type');
    const categories = atom
      ? [...block.matchAll(/<category\b[^>]*\bterm=["']([^"']+)["'][^>]*\/>/gi)].map((match) => match[1])
      : (block.match(/<category\b[^>]*>[\s\S]*?<\/category>/gi) ?? []).map((category) => xmlText(category, 'category'));
    const parsed = DailyLinkItemSchema.safeParse({
      id, title: xmlText(block, 'title'), summary: abstract?.slice(0, 6000), originalAbstract: abstract,
      url: id, sourceName: 'arXiv', sourceType: 'official', sourcePublishedAt: publishedAt,
      authors, version, preprint: true, announcementType,
      category: categories.filter(Boolean).join(' · '),
    });
    if (!parsed.success || !authors?.length) {
      incompleteMetadata = true;
      continue;
    }
    const previous = byId.get(id);
    if (!previous || Number(version.slice(1)) > Number(previous.version?.slice(1))) byId.set(id, parsed.data);
  }
  if (byId.size === 0 && incompleteMetadata) throw new Error('arXiv 来源论文元数据不完整');
  return [...byId.values()].sort((a, b) => (
    (b.sourcePublishedAt ?? '').localeCompare(a.sourcePublishedAt ?? '')
    || (a.announcementType ? ANNOUNCEMENT_ORDER[a.announcementType] : 4)
      - (b.announcementType ? ANNOUNCEMENT_ORDER[b.announcementType] : 4)
    || a.id.localeCompare(b.id)
  )).slice(0, 3);
}

function xmlText(block: string, tag: string): string | undefined {
  const match = block.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  if (!match) return undefined;
  // 摘要可能含 x < y 一类数学表达；不能先解码再按 HTML 删标签，否则原文会丢字。
  const entities: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
  return match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>|&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi,
    (raw, cdata: string | undefined, entity: string | undefined) => {
      if (cdata !== undefined) return cdata;
      if (!entity) return raw;
      if (!entity.startsWith('#')) return entities[entity.toLowerCase()] ?? raw;
      const hexadecimal = entity[1]?.toLowerCase() === 'x';
      const code = Number.parseInt(entity.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
      return code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff)
        ? String.fromCodePoint(code) : raw;
    }).replace(/\s+/g, ' ').trim();
}

import { DAILY_EDITION_CHANNEL_IDS } from './channels';
import { getDailyEditions, getLatestPublishedDailyDates } from './service';
import { DailyContentSchema, type DailyEdition, type DailyLinkItem, type PreviousPublishedDailyDates } from './types';
import {
  DAILY_PREVIEW_MAX_BYTES, DAILY_PREVIEW_URL_MAX_BYTES, DailyPreviewResponseSchema,
  type DailyPreviewContent, type DailyPreviewEdition, type DailyPreviewItem, type DailyPreviewResponse,
} from './panel-types';

function shorten(value: string, length: number): string {
  if (value.length <= length) return value;
  return `${value.slice(0, length - 1).replace(/[\uD800-\uDBFF]$/, '')}…`;
}
function dateTime(value?: string): string | undefined {
  if (!value) return undefined;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : undefined;
}
function safeUrl(value: string): string | undefined {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password
      && Buffer.byteLength(value, 'utf8') <= DAILY_PREVIEW_URL_MAX_BYTES ? value : undefined;
  } catch { return undefined; }
}
function previewItem(item: DailyLinkItem): DailyPreviewItem {
  return {
    id: shorten(item.id, 300), title: shorten(item.title, 160), summary: shorten(item.summary, 240),
    url: safeUrl(item.url), sourceName: shorten(item.sourceName, 80), sourceType: item.sourceType,
    sourcePublishedAt: dateTime(item.sourcePublishedAt), verifiedAt: dateTime(item.verifiedAt), startAt: dateTime(item.startAt),
    timeZone: item.timeZone ? shorten(item.timeZone, 80) : undefined, phase: item.phase,
    organization: item.organization ? shorten(item.organization, 120) : undefined,
    location: item.location ? shorten(item.location, 160) : undefined,
    roleType: item.roleType, remoteStatus: item.remoteStatus, difficulty: item.difficulty, preprint: item.preprint,
  };
}
function previewEdition(channel: DailyPreviewEdition['channel'], row?: DailyEdition, previousDate?: string): DailyPreviewEdition {
  const base = { channel, title: '', updatedAt: dateTime(row?.updatedAt) ?? null, previousDate, totalCount: 0, content: null };
  if (row?.status !== 'published' || !row.content) {
    return { ...base, status: row?.status === 'empty' || row?.status === 'failed' ? row.status : 'unpublished' };
  }
  const parsed = DailyContentSchema.safeParse(row.content);
  if (!parsed.success || parsed.data.kind !== channel) return { ...base, status: 'failed' };
  const content = parsed.data;
  let preview: DailyPreviewContent;
  let totalCount: number;
  if (content.kind === 'english') {
    totalCount = content.vocabulary.length;
    preview = { kind: 'english', vocabulary: content.vocabulary.slice(0, 5).map(word => ({
      term: shorten(word.term, 100), meaning: shorten(word.meaning, 200),
      example: shorten(word.example, 400), translation: shorten(word.translation, 400),
    })) };
  } else {
    totalCount = content.items.length;
    preview = { kind: content.kind, items: content.items.slice(0, content.kind === 'open-source' ? 1 : 5).map(previewItem) };
  }
  return { ...base, status: 'published', title: shorten(row.title, 160), totalCount, content: preview };
}

/** 只从公开读取链路抽取；当天已关闭岗位和已开赛赛事由原服务统一过滤。 */
export async function getDailyPreview(date: string): Promise<DailyPreviewResponse> {
  const [editions, previousDates] = await Promise.all([
    getDailyEditions(date),
    // 历史入口是辅助信息；读取失败时省略链接，不影响当天正文。
    getLatestPublishedDailyDates(date).catch((): PreviousPublishedDailyDates => ({})),
  ]);
  const rows = DAILY_EDITION_CHANNEL_IDS.map(channel => previewEdition(channel,
    editions.find(row => row.date === date && row.channel === channel), previousDates[channel]));
  const updatedAt = rows.reduce<string | null>((latest, row) => row.updatedAt && (!latest || row.updatedAt > latest) ? row.updatedAt : latest, null);
  const result = DailyPreviewResponseSchema.parse({ date, updatedAt, editions: rows });
  // URL 为可选跳转；极端长链接优先省略，确保正文仍能通过站内详情入口阅读。
  if (Buffer.byteLength(JSON.stringify(result), 'utf8') > DAILY_PREVIEW_MAX_BYTES) {
    for (const row of result.editions) {
      if (row.content && 'items' in row.content) for (const item of row.content.items) delete item.url;
    }
  }
  if (Buffer.byteLength(JSON.stringify(result), 'utf8') > DAILY_PREVIEW_MAX_BYTES) throw new Error('Preview too large');
  return result;
}

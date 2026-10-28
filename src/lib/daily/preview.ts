import { DAILY_EDITION_CHANNEL_IDS } from './channels';
import { getDailyEditions, getLatestPublishedDailyDates, getPublishedDailyEditionsByDates } from './service';
import { filterAvailableDailyOpportunities } from './opportunities';
import { DailyContentSchema, dailyDate, type DailyEdition, type DailyLinkItem, type PreviousPublishedDailyDates } from './types';
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
    id: item.id, title: shorten(item.title, 160), summary: shorten(item.summary, 240),
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
      term: word.term, meaning: shorten(word.meaning, 200),
      example: shorten(word.example, 400), translation: shorten(word.translation, 400),
    })) };
  } else {
    totalCount = content.items.length;
    preview = { kind: content.kind, items: content.items.slice(0, content.kind === 'open-source' ? 1 : 5).map(previewItem) };
  }
  return { ...base, status: 'published', title: shorten(row.title, 160), totalCount, content: preview };
}

function currentHistoricalEvent(row: DailyEdition): DailyEdition {
  if (row.status !== 'published' || row.content?.kind !== 'events') return row;
  const parsed = DailyContentSchema.safeParse(row.content);
  if (!parsed.success || parsed.data.kind !== 'events') return { ...row, status: 'failed', title: '', content: null };
  const items = parsed.data.items.filter(item => item.phase === 'announcement' || item.phase === 'replay'
    || ((item.phase === 'upcoming' || item.phase === 'live') && item.startAt && Date.parse(item.startAt) > Date.now()));
  return items.length ? { ...row, content: { kind: 'events', items } }
    : { ...row, status: 'empty', title: '', content: null };
}

/** 只从公开读取链路抽取；当天已关闭岗位和已开赛赛事由原服务统一过滤。 */
export async function getDailyPreview(date: string, options: { recent?: boolean } = {}): Promise<DailyPreviewResponse> {
  let historyFailed = false;
  const [editions, previousDates] = await Promise.all([
    getDailyEditions(date),
    // 历史入口是辅助信息；读取失败时省略链接，不影响当天正文。
    getLatestPublishedDailyDates(date).catch((): PreviousPublishedDailyDates => { historyFailed = true; return {}; }),
  ]);
  const rows = DAILY_EDITION_CHANNEL_IDS.map(channel => previewEdition(channel,
    editions.find(row => row.date === date && row.channel === channel), previousDates[channel]));
  if (options.recent && date === dailyDate()) {
    const selected: PreviousPublishedDailyDates = Object.fromEntries(rows.flatMap(row => row.status !== 'published' && previousDates[row.channel]
      ? [[row.channel, previousDates[row.channel]]] : []));
    if (Object.keys(selected).length) {
      try {
        const historical = await getPublishedDailyEditionsByDates(selected);
        const opportunities = historical.filter(row => row.channel === 'competitions' || row.channel === 'internships');
        // 机会核验失败不能拖掉已经读到的英语、论文等历史正文。
        const available = opportunities.length ? await filterAvailableDailyOpportunities(opportunities).catch(() => {
          historyFailed = true; return [];
        }) : [];
        const readable = [...historical.filter(row => row.channel !== 'competitions' && row.channel !== 'internships'), ...available]
          .map(currentHistoricalEvent);
        for (let index = 0; index < rows.length; index++) {
          const current = rows[index];
          if (!selected[current.channel]) continue;
          const previous = readable.find(row => row.channel === current.channel && row.date === selected[current.channel]);
          if (!previous) continue;
          const fallback = previewEdition(current.channel, previous, current.previousDate);
          if (fallback.status === 'published' && fallback.content) {
            rows[index] = { ...fallback, contentDate: previous.date, currentStatus: current.status };
          }
        }
      } catch { historyFailed = true; }
    }
  }
  const updatedAt = rows.filter(row => row.status === 'published' && row.content)
    .reduce<string | null>((latest, row) => row.updatedAt && (!latest || row.updatedAt > latest) ? row.updatedAt : latest, null);
  const result = DailyPreviewResponseSchema.parse({ date, updatedAt, editions: rows, ...(options.recent ? { historyFailed } : {}) });
  // URL 为可选跳转；极端长链接优先省略，确保正文仍能通过站内详情入口阅读。
  if (Buffer.byteLength(JSON.stringify(result), 'utf8') > DAILY_PREVIEW_MAX_BYTES) {
    for (const row of result.editions) {
      if (row.content && 'items' in row.content) for (const item of row.content.items) delete item.url;
    }
  }
  if (Buffer.byteLength(JSON.stringify(result), 'utf8') > DAILY_PREVIEW_MAX_BYTES) throw new Error('Preview too large');
  return result;
}

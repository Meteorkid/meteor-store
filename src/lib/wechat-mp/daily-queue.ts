import { and, desc, eq, inArray } from 'drizzle-orm';

import { dailyChannels, DAILY_EDITION_CHANNEL_IDS } from '@/lib/daily/channels';
import { DailyDateSchema, shiftDailyDate } from '@/lib/daily/types';
import { db } from '@/lib/db';
import { dailyEditions } from '@/lib/db/schema';
import type { WechatDailyQueueItem } from './types';

const CHANNEL_ORDER = new Map(
  DAILY_EDITION_CHANNEL_IDS.map((channel, index) => [channel, index] as const),
);

/**
 * 最近 days 天日刊是否已有可发布内容。
 *
 * 这里只查 date/channel/title/status，不碰 content；管理端每次进页面都会跑，
 * 没必要把七天的正文全部搬进内存。内容是否完整由创建草稿时的 sources.ts 再校验。
 */
export async function getDailyQueue(today: string, days = 7): Promise<WechatDailyQueueItem[]> {
  DailyDateSchema.parse(today);
  const safeDays = Math.min(Math.max(days, 1), 14);
  const dates = Array.from({ length: safeDays }, (_, index) => shiftDailyDate(today, -index));

  const rows = await db
    .select({
      date: dailyEditions.date,
      channel: dailyEditions.channel,
      title: dailyEditions.title,
    })
    .from(dailyEditions)
    .where(and(
      inArray(dailyEditions.date, dates),
      eq(dailyEditions.status, 'published'),
    ))
    .orderBy(desc(dailyEditions.date));

  const byDate = new Map<string, { count: number; channels: { label: string; order: number }[] }>();
  for (const row of rows) {
    if (!row.title.trim()) continue;
    const label = dailyChannels.find((channel) => channel.id === row.channel)?.zh ?? row.channel;
    const entry = byDate.get(row.date) ?? { count: 0, channels: [] };
    entry.count += 1;
    entry.channels.push({ label, order: CHANNEL_ORDER.get(row.channel) ?? 99 });
    byDate.set(row.date, entry);
  }

  return dates.map((date) => {
    const entry = byDate.get(date);
    if (!entry) return { date, count: 0, channels: [] };
    entry.channels.sort((a, b) => a.order - b.order);
    return { date, count: entry.count, channels: entry.channels.slice(0, 3).map((item) => item.label) };
  });
}

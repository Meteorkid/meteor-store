import { and, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { dailyEditions, dailyPreferences, dailyReminders } from '@/lib/db/schema';
import { loadDailyContent } from './content';
import {
  DAILY_CHANNEL_IDS, DAILY_EDITION_CHANNEL_IDS, DailyEditionChannelSchema, DailyContentSchema, DailyDateSchema, DailyPreferencesSchema,
  dailyDate, isDailyHistoryDate, shiftDailyDate,
  type DailyEditionChannelId, type DailyContent, type DailyEdition, type DailyPreferences, type DailyReminder,
} from './types';

function revisionAfter(previous?: string): string {
  return new Date(Math.max(Date.now(), previous ? Date.parse(previous) + 1 : 0)).toISOString();
}

export async function listDailyEditions(date: string): Promise<DailyEdition[]> {
  DailyDateSchema.parse(date);
  const rows = await db.select().from(dailyEditions).where(eq(dailyEditions.date, date));
  return rows.sort((a, b) => DAILY_CHANNEL_IDS.indexOf(a.channel) - DAILY_CHANNEL_IDS.indexOf(b.channel));
}

/** 草稿与错误详情只能留在后台；公开页也不能通过 RSC 载荷读到它们。 */
export function publicDailyEdition(row: DailyEdition): DailyEdition {
  if (row.status !== 'published') {
    return { id: row.id, date: row.date, channel: row.channel, status: row.status,
      title: '', summary: '', content: null, sourceKey: null, publishedAt: null, updatedAt: row.updatedAt };
  }
  return { id: row.id, date: row.date, channel: row.channel, status: row.status,
    title: row.title, summary: row.summary, content: row.content,
    sourceKey: null, publishedAt: row.publishedAt, updatedAt: row.updatedAt };
}

export async function getDailyEditions(date: string): Promise<DailyEdition[]> {
  if (!isDailyHistoryDate(date)) throw new Error('Date outside daily history');
  return (await listDailyEditions(date)).map(publicDailyEdition);
}

export async function getDailyPreferences(userId: string): Promise<DailyPreferences | null> {
  const [row] = await db.select({ channels: dailyPreferences.channels, reminders: dailyPreferences.reminders })
    .from(dailyPreferences).where(eq(dailyPreferences.userId, userId)).limit(1);
  return row ? DailyPreferencesSchema.parse(row) : null;
}

export async function saveDailyPreferences(userId: string, input: DailyPreferences): Promise<DailyPreferences> {
  const preferences = DailyPreferencesSchema.parse(input);
  const values = { ...preferences, updatedAt: new Date().toISOString() };
  await db.insert(dailyPreferences).values({ userId, ...values })
    .onConflictDoUpdate({ target: dailyPreferences.userId, set: values });
  return preferences;
}

export interface SaveDailyEditionInput {
  id?: string; date: string; channel: DailyEditionChannelId; title: string; summary: string;
  content: DailyContent; status: 'draft' | 'published'; expectedUpdatedAt?: string;
}

export async function saveDailyEdition(input: SaveDailyEditionInput): Promise<DailyEdition | null> {
  DailyDateSchema.parse(input.date);
  DailyEditionChannelSchema.parse(input.channel);
  const content = DailyContentSchema.parse(input.content);
  const id = `${input.date}:${input.channel}`;
  if (input.id && input.id !== id) throw new Error('Edition identity mismatch');
  if (content.kind !== input.channel) throw new Error('Content channel mismatch');
  if (input.status !== 'draft' && input.status !== 'published') throw new Error('Invalid edition status');
  if (!input.title.trim() || input.title.length > 300 || input.summary.length > 2000) throw new Error('Invalid edition text');
  if (content.kind === 'events' && content.items.some(item => item.sourceType !== 'official' || !item.phase)) {
    throw new Error('Events require an official source and phase');
  }
  if (content.kind === 'events') {
    for (const item of content.items) {
      if (item.startAt && !item.timeZone) throw new Error('Events require a confirmed timezone');
      if (item.timeZone) new Intl.DateTimeFormat('en', { timeZone: item.timeZone });
    }
  }
  const now = revisionAfter(input.expectedUpdatedAt);
  const values = { title: input.title.trim(), summary: input.summary.trim(), content,
    status: input.status, error: null, updatedAt: now,
    publishedAt: input.status === 'published' ? now : null };
  // 有版本只做条件更新；无版本只做插入，避免两位管理员互相覆盖。
  if (input.expectedUpdatedAt) {
    const [row] = await db.update(dailyEditions).set({ ...values,
      publishedAt: input.status === 'published'
        ? sql`case when ${dailyEditions.status} = 'published' then coalesce(${dailyEditions.publishedAt}, ${now}) else ${now} end`
        : null,
    })
      .where(and(eq(dailyEditions.id, id), eq(dailyEditions.updatedAt, input.expectedUpdatedAt))).returning();
    return row ?? null;
  }
  const [row] = await db.insert(dailyEditions).values({ id, date: input.date, channel: input.channel, createdAt: now, ...values })
    .onConflictDoNothing().returning();
  return row ?? null;
}

export async function retireDailyEdition(id: string, expectedUpdatedAt: string): Promise<boolean> {
  const rows = await db.update(dailyEditions).set({ status: 'draft', publishedAt: null, updatedAt: revisionAfter(expectedUpdatedAt) })
    .where(and(eq(dailyEditions.id, id), eq(dailyEditions.updatedAt, expectedUpdatedAt), eq(dailyEditions.status, 'published')))
    .returning({ id: dailyEditions.id });
  return rows.length === 1;
}

/** 采集只生成今天的内容，历史修订走管理员编辑，不将今天的来源倒填成旧刊。 */
export async function generateDailyEditions(date: string, channel?: DailyEditionChannelId): Promise<DailyEdition[]> {
  DailyDateSchema.parse(date);
  if (date !== dailyDate()) throw new Error('Only today can be generated');
  if (channel) DailyEditionChannelSchema.parse(channel);
  const existing = await listDailyEditions(date);
  const sourceRows = await db.select({ sourceKey: dailyEditions.sourceKey }).from(dailyEditions);
  const recentRows = await db.select({ content: dailyEditions.content }).from(dailyEditions)
    .where(gte(dailyEditions.date, shiftDailyDate(date, -30)));
  const usedKeys = sourceRows.flatMap(row => row.sourceKey ? [row.sourceKey] : []);
  for (const row of recentRows) {
    if (row.content && row.content.kind !== 'english') usedKeys.push(...row.content.items.map(item => item.id));
  }
  for (const id of channel ? [channel] : DAILY_EDITION_CHANNEL_IDS) {
    const previous = existing.find(row => row.channel === id);
    if (previous && (previous.status === 'published' || previous.status === 'draft')) continue;
    let now = revisionAfter(previous?.updatedAt);
    let values: Omit<typeof dailyEditions.$inferInsert, 'id' | 'date' | 'channel' | 'createdAt'>;
    try {
      const result = await loadDailyContent(id, date, usedKeys);
      const content = result.content ? DailyContentSchema.parse(result.content) : null;
      if (content && content.kind !== id) throw new Error('Generated channel mismatch');
      if (result.status !== 'empty' && !content) throw new Error('Generated content missing');
      // 发布时间取采集完成时刻，跨过 09:30 的慢请求不能倒填进晨间提醒。
      now = revisionAfter(previous?.updatedAt);
      values = { title: result.title, summary: result.summary, content, status: result.status,
        sourceKey: result.sourceKey ?? null, error: null, updatedAt: now,
        publishedAt: result.status === 'published' ? now : null };
    } catch {
      now = revisionAfter(previous?.updatedAt);
      // 不把上游错误原文（可能含请求信息）写入公开或管理页面。
      values = { title: '', summary: '', content: null, status: 'failed', sourceKey: null,
        error: 'content_unavailable', publishedAt: null, updatedAt: now };
    }
    if (previous) {
      await db.update(dailyEditions).set(values).where(and(
        eq(dailyEditions.id, previous.id), eq(dailyEditions.updatedAt, previous.updatedAt),
        inArray(dailyEditions.status, ['empty', 'failed']),
      ));
    } else {
      await db.insert(dailyEditions).values({ id: `${date}:${id}`, date, channel: id, createdAt: now, ...values })
        .onConflictDoNothing();
    }
  }
  return listDailyEditions(date);
}

export async function freezeDailyReminder(now = new Date()): Promise<{ status: 'not-due' | 'created' | 'empty' | 'duplicate'; date: string }> {
  const date = dailyDate(now);
  const cutoff = new Date(`${date}T09:30:00+08:00`).toISOString();
  if (now.toISOString() < cutoff) return { status: 'not-due', date };
  const editions = await db.select({ id: dailyEditions.id }).from(dailyEditions).where(and(
    eq(dailyEditions.date, date), eq(dailyEditions.status, 'published'), lte(dailyEditions.publishedAt, cutoff),
  ));
  const [saved] = await db.insert(dailyReminders).values({ date, editionIds: editions.map(row => row.id), publishedAt: cutoff })
    .onConflictDoNothing().returning({ date: dailyReminders.date });
  return { status: !saved ? 'duplicate' : editions.length ? 'created' : 'empty', date };
}

export async function getDailyReminder(userId: string): Promise<DailyReminder | null> {
  const preferences = await getDailyPreferences(userId);
  if (!preferences?.reminders || !preferences.channels.length) return null;
  const date = dailyDate();
  const [snapshot] = await db.select().from(dailyReminders).where(eq(dailyReminders.date, date)).limit(1);
  if (!snapshot?.editionIds.length) return null;
  // 下架后不继续从提醒暴露；补发未进入快照的栏目也不会加入。
  const editions = await db.select({ channel: dailyEditions.channel }).from(dailyEditions).where(and(
    inArray(dailyEditions.id, snapshot.editionIds), eq(dailyEditions.status, 'published'),
    inArray(dailyEditions.channel, preferences.channels.filter((channel): channel is DailyEditionChannelId => channel !== 'masters')),
  ));
  const channels = DAILY_CHANNEL_IDS.filter(channel => editions.some(row => row.channel === channel));
  return channels.length ? { date, channels, publishedAt: snapshot.publishedAt } : null;
}

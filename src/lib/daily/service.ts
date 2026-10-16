import { and, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { dailyEditions, dailyPreferences, dailyReminders } from '@/lib/db/schema';
import { loadDailyContent } from './content';
import { filterAvailableDailyOpportunities } from './opportunities';
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
  const editions = (await listDailyEditions(date)).map(publicDailyEdition);
  // 当天的机会列表随官方开放状态收缩，历史期次保留当时的来源快照。
  return date === dailyDate() ? filterAvailableDailyOpportunities(editions) : editions;
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

function validatePublication(channel: DailyEditionChannelId, title: string, summary: string, value: unknown): DailyContent {
  const content = DailyContentSchema.parse(value);
  if (content.kind !== channel) throw new Error('Content channel mismatch');
  if (!title.trim() || title.length > 300 || summary.length > 2000) throw new Error('Invalid edition text');
  if (content.kind === 'events' && content.items.some(item => item.sourceType !== 'official' || !item.phase)) {
    throw new Error('Events require an official source and phase');
  }
  if (content.kind === 'events') {
    for (const item of content.items) {
      if (item.startAt && !item.timeZone) throw new Error('Events require a confirmed timezone');
      if (item.timeZone) new Intl.DateTimeFormat('en', { timeZone: item.timeZone });
    }
  }
  if (content.kind === 'open-source' || content.kind === 'competitions' || content.kind === 'internships') {
    for (const item of content.items) {
      if (!item.verifiedAt || Date.parse(item.verifiedAt) > Date.now() || item.sourceType !== 'official') throw new Error('Opportunity requires verified official metadata');
      if (content.kind === 'internships' && (!item.organization || !item.location || !item.eligibility)) throw new Error('Internship requires location and eligibility');
      if (content.kind === 'competitions' && (!item.startAt || !item.timeZone)) throw new Error('Contest requires a confirmed start time');
      if (item.timeZone) new Intl.DateTimeFormat('en', { timeZone: item.timeZone });
    }
  }
  return content;
}

export async function saveDailyEdition(input: SaveDailyEditionInput): Promise<DailyEdition | null> {
  DailyDateSchema.parse(input.date);
  DailyEditionChannelSchema.parse(input.channel);
  const id = `${input.date}:${input.channel}`;
  if (input.id && input.id !== id) throw new Error('Edition identity mismatch');
  if (input.status !== 'draft' && input.status !== 'published') throw new Error('Invalid edition status');
  const content = validatePublication(input.channel, input.title, input.summary, input.content);
  const now = revisionAfter(input.expectedUpdatedAt);
  const values = { title: input.title.trim(), summary: input.summary.trim(), content,
    status: input.status, automationPaused: true, error: null, updatedAt: now,
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
  const rows = await db.update(dailyEditions).set({ status: 'draft', automationPaused: true, publishedAt: null, updatedAt: revisionAfter(expectedUpdatedAt) })
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
  const recentRows = await db.select({ content: dailyEditions.content, title: dailyEditions.title }).from(dailyEditions)
    .where(gte(dailyEditions.date, shiftDailyDate(date, -30)));
  const sourceKeys = sourceRows.flatMap(row => row.sourceKey ? [row.sourceKey] : []);
  for (const id of channel ? [channel] : DAILY_EDITION_CHANNEL_IDS) {
    const previous = existing.find(row => row.channel === id);
    if (previous && (previous.status === 'published' || previous.automationPaused
      || (previous.status === 'draft' && !previous.sourceKey))) continue;
    // AI 与活动允许分别选用同一官方公告，历史去重只在本栏目内执行。
    const usedKeys = [...sourceKeys, ...recentRows.flatMap(row => row.content?.kind === id && row.content.kind !== 'english'
      ? row.content.items.flatMap(item => [item.id, item.url]) : [])];
    let now = revisionAfter(previous?.updatedAt);
    let values: Omit<typeof dailyEditions.$inferInsert, 'id' | 'date' | 'channel' | 'createdAt'>;
    try {
      // 旧的机器草稿原样校验、发布；人工接管的记录由独立标记保护，不能自动复活。
      const result = previous?.status === 'draft'
        ? previous
        : await loadDailyContent(id, date, usedKeys, recentRows.filter(row => row.content?.kind === 'english').map(row => row.title));
      const content = result.content ? validatePublication(id, result.title, result.summary, result.content) : null;
      if (result.status !== 'empty' && !content) throw new Error('Generated content missing');
      // 发布时间取采集完成时刻，跨过 09:30 的慢请求不能倒填进晨间提醒。
      now = revisionAfter(previous?.updatedAt);
      values = { title: result.title, summary: result.summary, content, status: content ? 'published' : 'empty',
        sourceKey: result.sourceKey ?? null, error: null, updatedAt: now,
        automationPaused: false, publishedAt: content ? now : null };
    } catch {
      now = revisionAfter(previous?.updatedAt);
      // 不把上游错误原文（可能含请求信息）写入公开或管理页面。
      values = { title: '', summary: '', content: null, status: 'failed', sourceKey: null,
        error: 'content_unavailable', publishedAt: null, updatedAt: now };
    }
    if (dailyDate() !== date) throw new Error('Daily generation crossed midnight');
    if (previous) {
      await db.update(dailyEditions).set(values).where(and(
        eq(dailyEditions.id, previous.id), eq(dailyEditions.updatedAt, previous.updatedAt),
        eq(dailyEditions.automationPaused, false),
        inArray(dailyEditions.status, ['empty', 'failed', 'draft']),
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

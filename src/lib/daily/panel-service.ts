import { and, eq, isNull } from 'drizzle-orm';
import { db } from '@/lib/db';
import { dailyPreferences } from '@/lib/db/schema';
import { DAILY_CHANNEL_IDS } from './channels';
import { DailyPanelPreferencesResponseSchema, SaveDailyPanelPreferencesSchema, type DailyPanelPreferencesResponse, type SaveDailyPanelPreferences } from './panel-types';

const panelColumns = {
  channels: dailyPreferences.channels, panelSettings: dailyPreferences.panelSettings, panelUpdatedAt: dailyPreferences.panelUpdatedAt,
};
function response(userId: string, row?: Pick<typeof dailyPreferences.$inferSelect, 'channels' | 'panelSettings' | 'panelUpdatedAt'>): DailyPanelPreferencesResponse {
  return DailyPanelPreferencesResponseSchema.parse({
    userId, settings: row?.panelSettings ?? null, revision: row?.panelUpdatedAt ?? null, followedChannels: row?.channels ?? null,
  });
}

export async function getDailyPanelPreferences(userId: string): Promise<DailyPanelPreferencesResponse> {
  const [row] = await db.select(panelColumns).from(dailyPreferences).where(eq(dailyPreferences.userId, userId)).limit(1);
  return response(userId, row);
}

export async function saveDailyPanelPreferences(userId: string, input: SaveDailyPanelPreferences): Promise<DailyPanelPreferencesResponse | null> {
  const { settings, expectedRevision } = SaveDailyPanelPreferencesSchema.parse(input);
  const now = new Date(Math.max(Date.now(), expectedRevision ? Date.parse(expectedRevision) + 1 : 0)).toISOString();
  const values = { panelSettings: settings, panelUpdatedAt: now };
  // 首次保存也须做条件更新，不能让两台设备同时把 null 当作自己的版本。
  const [row] = expectedRevision === null
    ? await db.insert(dailyPreferences).values({ userId, channels: [...DAILY_CHANNEL_IDS], reminders: false, updatedAt: now, ...values })
      .onConflictDoUpdate({ target: dailyPreferences.userId, set: values, setWhere: isNull(dailyPreferences.panelUpdatedAt) }).returning(panelColumns)
    : await db.update(dailyPreferences).set(values).where(and(eq(dailyPreferences.userId, userId), eq(dailyPreferences.panelUpdatedAt, expectedRevision))).returning(panelColumns);
  return row ? response(userId, row) : null;
}

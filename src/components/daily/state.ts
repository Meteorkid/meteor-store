import { dailyEditionChannels, DAILY_CHANNEL_IDS, DAILY_EDITION_CHANNEL_IDS, DailyPreferencesSchema, isDailyHistoryDate, type DailyChannelId, type DailyEdition, type DailyPreferences } from '@/lib/daily/types';

export const GUEST_PREFERENCES_KEY = 'ms_daily_preferences_v1:guest';
export const DAILY_STORAGE_EVENT = 'daily-storage-changed';
export const DAILY_PREFERENCES_EVENT = 'daily-preferences-changed';
export const MAX_DAILY_READ_KEYS = DAILY_EDITION_CHANNEL_IDS.length * 30;

export function parseGuestPreferences(raw: string | null): DailyPreferences | null {
  if (!raw) return null;
  try {
    const parsed = DailyPreferencesSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function pickPreferences(userId: string | null, account: DailyPreferences | null, guest: DailyPreferences | null) {
  return userId === null ? guest : account;
}

export function parseAccountPreferences(value: unknown, userId: string): DailyPreferences | null {
  if (!value || typeof value !== 'object' || !('userId' in value) || value.userId !== userId || !('preferences' in value)) {
    throw new Error('preferences owner changed');
  }
  return value.preferences === null ? null : DailyPreferencesSchema.parse(value.preferences);
}

export function visibleChannels(view: 'all' | 'following', preferences: DailyPreferences | null) {
  return DAILY_CHANNEL_IDS.filter(id => view === 'all' || preferences === null || preferences.channels.includes(id));
}

/** 概览和正文使用同一期、同一组栏目；全年日历不参与日刊阅读进度。 */
export function getDailyEditionEntries(date: string, selected: readonly DailyChannelId[], editions: readonly DailyEdition[], readKeys: readonly string[]) {
  return dailyEditionChannels.filter(channel => selected.includes(channel.id)).map(channel => {
    const edition = editions.find(item => item.date === date && item.channel === channel.id);
    const status: 'published' | 'empty' | 'failed' | 'unpublished' = edition?.status === 'published' && edition.content !== null ? 'published'
      : edition?.status === 'empty' ? 'empty' : edition?.status === 'failed' ? 'failed' : 'unpublished';
    return { channel, edition, status, isRead: status === 'published' && readKeys.includes(`${date}:${channel.id}`) };
  });
}

export type DailyEditionEntry = ReturnType<typeof getDailyEditionEntries>[number];

export function dailyReadStorageKey(userId: string | null) {
  return `ms_daily_read_v1:${userId === null ? 'guest' : `user:${encodeURIComponent(userId)}`}`;
}

export function parseReadKeys(raw: string | null, today: string): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter((item): item is string => {
      if (typeof item !== 'string') return false;
      const [date, channel, extra] = item.split(':');
      return extra === undefined && isDailyHistoryDate(date, today)
        && DAILY_EDITION_CHANNEL_IDS.some(id => id === channel);
    }))].slice(-MAX_DAILY_READ_KEYS);
  } catch {
    return [];
  }
}

export function toggleReadKey(keys: string[], key: string): string[] {
  return keys.includes(key) ? keys.filter(item => item !== key) : [...keys, key].slice(-MAX_DAILY_READ_KEYS);
}

export function gradeAnswers(answers: Array<number | undefined>, expected: number[]): number {
  return expected.filter((answer, index) => answers[index] === answer).length;
}

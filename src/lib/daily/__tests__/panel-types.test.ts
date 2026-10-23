import { describe, expect, it } from 'vitest';
import { DAILY_EDITION_CHANNEL_IDS } from '../channels';
import { DailyPanelSettingsSchema, SaveDailyPanelPreferencesSchema, defaultDailyPanelSettings } from '../panel-types';

describe('公告面板默认设置', () => {
  it('未设置继承全部，明确空关注保持为空，硕士不混入日刊', () => {
    expect(defaultDailyPanelSettings().channels).toEqual(DAILY_EDITION_CHANNEL_IDS);
    expect(defaultDailyPanelSettings(null).channels).toEqual(DAILY_EDITION_CHANNEL_IDS);
    expect(defaultDailyPanelSettings([]).channels).toEqual([]);
    expect(defaultDailyPanelSettings(['papers', 'masters', 'english']).channels).toEqual(['papers', 'english']);
    expect(DailyPanelSettingsSchema.parse(defaultDailyPanelSettings()).itemCounts.english).toBe(3);
  });

  it('保留用户顺序和明确空选，拒绝重复栏目、未知字段及超范围条数', () => {
    const settings = defaultDailyPanelSettings(['papers', 'english']);
    expect(DailyPanelSettingsSchema.parse(settings).channels).toEqual(['papers', 'english']);
    for (const invalid of [
      { ...settings, channels: ['english', 'english'] }, { ...settings, channels: ['masters'] },
      { ...settings, version: 2 }, { ...settings, unexpected: true },
      { ...settings, itemCounts: { ...settings.itemCounts, english: 2 } },
      { ...settings, itemCounts: { ...settings.itemCounts, 'open-source': 3 } },
      { ...settings, english: { ...settings.english, unexpected: true } },
    ]) expect(DailyPanelSettingsSchema.safeParse(invalid).success).toBe(false);
    expect(SaveDailyPanelPreferencesSchema.parse({ settings: null, expectedRevision: null })).toEqual({ settings: null, expectedRevision: null });
    expect(SaveDailyPanelPreferencesSchema.safeParse({ settings, expectedRevision: 'yesterday' }).success).toBe(false);
    expect(SaveDailyPanelPreferencesSchema.safeParse({ settings, expectedRevision: null, userId: 'other' }).success).toBe(false);
  });
});

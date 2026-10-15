import { describe, expect, it } from 'vitest';
import {
  parseAccountPreferences, parseGuestPreferences, pickPreferences, visibleChannels,
  dailyReadStorageKey, parseReadKeys, toggleReadKey, gradeAnswers,
} from '../state';

describe('每日阅读偏好与本地进度', () => {
  const guest = { channels: ['english'] as const, reminders: false };

  it('未设置与明确空选保持不同含义', () => {
    expect(parseGuestPreferences(null)).toBeNull();
    expect(parseGuestPreferences('{broken')).toBeNull();
    expect(parseGuestPreferences('{"channels":[],"reminders":false}')).toEqual({ channels: [], reminders: false });
    expect(visibleChannels('following', null)).toEqual(['english', 'papers', 'ai', 'events', 'masters']);
    expect(visibleChannels('following', { channels: [], reminders: false })).toEqual([]);
  });

  it('不接受未知栏目或损坏的存储结构', () => {
    expect(parseGuestPreferences('{"channels":["other"],"reminders":false}')).toBeNull();
    expect(parseGuestPreferences('{"channels":["ai","ai"],"reminders":false}')).toBeNull();
  });

  it('已登录账号即便未设置，也不继承游客偏好', () => {
    const guestPreferences = { ...guest, channels: [...guest.channels] };
    expect(pickPreferences('user-1', null, guestPreferences)).toBeNull();
    expect(pickPreferences(null, null, guestPreferences)).toEqual(guestPreferences);
    const account = { channels: [], reminders: true };
    expect(pickPreferences('user-1', account, guestPreferences)).toEqual(account);
  });

  it('全部视图不被关注列表隐藏，关注视图保持栏目顺序', () => {
    expect(visibleChannels('all', { channels: [], reminders: false })).toHaveLength(5);
    expect(visibleChannels('following', { channels: ['events', 'english'], reminders: false }))
      .toEqual(['english', 'events']);
  });

  it('旧四栏偏好保持原选择，不自动关注新增申请栏目', () => {
    const old = parseGuestPreferences('{"channels":["english","papers","ai","events"],"reminders":false}');
    expect(visibleChannels('following', old)).toEqual(['english', 'papers', 'ai', 'events']);
    expect(visibleChannels('all', old)).toContain('masters');
    expect(parseReadKeys('["2026-10-14:masters"]', '2026-10-14')).toEqual([]);
  });

  it('游客、不同账号的已读存储互相隔离', () => {
    expect(dailyReadStorageKey(null)).not.toBe(dailyReadStorageKey('guest'));
    expect(dailyReadStorageKey('user-1')).not.toBe(dailyReadStorageKey('user-2'));
  });

  it('拒绝账号切换后返回的其他用户偏好', () => {
    expect(() => parseAccountPreferences({ userId: 'user-2', preferences: null }, 'user-1')).toThrow();
    expect(() => parseAccountPreferences({ preferences: null }, 'user-1')).toThrow();
    expect(parseAccountPreferences({ userId: 'user-1', preferences: null }, 'user-1')).toBeNull();
    expect(parseAccountPreferences({ userId: 'user-1', preferences: { channels: [], reminders: false } }, 'user-1'))
      .toEqual({ channels: [], reminders: false });
  });

  it('只读取最近30天的有效栏目已读项', () => {
    const raw = JSON.stringify(['2026-10-14:english', '2026-09-15:ai', '2026-09-14:ai', '2026-10-15:ai', '2026-10-14:other']);
    expect(parseReadKeys(raw, '2026-10-14')).toEqual(['2026-10-14:english', '2026-09-15:ai']);
    expect(parseReadKeys('{}', '2026-10-14')).toEqual([]);
    expect(toggleReadKey(['2026-10-14:ai'], '2026-10-14:ai')).toEqual([]);
    expect(toggleReadKey([], '2026-10-14:ai')).toEqual(['2026-10-14:ai']);
  });

  it('未选择的练习不计为正确', () => {
    expect(gradeAnswers([1, undefined, 0], [1, 2, 1])).toBe(1);
  });
});

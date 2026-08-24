import { describe, expect, it } from 'vitest';
import { DEFAULT_REMINDER_WINDOW_DAYS, selectReminderCandidates } from '../deadline-reminders';
import { normalizeFollowValue } from '../saves';
import { catalogItemFixture } from './fixtures';

const NOW = new Date('2026-08-24T00:00:00.000Z');
const save = (itemId: string, remindDeadline = true) => ({ userId: 'user-1', itemId, remindDeadline });

describe('截止提醒的候选筛选', () => {
  it('进入窗口且尚未截止的条目会被提醒', () => {
    const item = catalogItemFixture({ id: 'soon', deadlineDate: '2026-08-26' });
    const candidates = selectReminderCandidates([save('soon')], [item], NOW);

    expect(candidates).toHaveLength(1);
    expect(candidates[0]).toMatchObject({ userId: 'user-1', itemId: 'soon', deadline: '2026-08-26' });
    expect(candidates[0].daysLeft).toBeGreaterThan(0);
  });

  it('还没进入窗口的条目不提醒', () => {
    const item = catalogItemFixture({ id: 'far', deadlineDate: '2026-12-01' });
    expect(selectReminderCandidates([save('far')], [item], NOW)).toHaveLength(0);
  });

  it('已经截止的条目不补发提醒', () => {
    // 过期后才提醒除了让人难受没有任何用处，与 Pass 到期提醒同一条判断
    const item = catalogItemFixture({ id: 'gone', deadlineDate: '2026-08-01' });
    expect(selectReminderCandidates([save('gone')], [item], NOW)).toHaveLength(0);
  });

  it('没有截止时间的长期条目不提醒', () => {
    const item = catalogItemFixture({ id: 'evergreen', deadlineDate: null, deadlineAt: null });
    expect(selectReminderCandidates([save('evergreen')], [item], NOW)).toHaveLength(0);
  });

  it('用户关掉提醒后不再入选，但收藏仍然保留', () => {
    const item = catalogItemFixture({ id: 'muted', deadlineDate: '2026-08-26' });
    expect(selectReminderCandidates([save('muted', false)], [item], NOW)).toHaveLength(0);
  });

  it('已下架的条目不提醒', () => {
    const item = catalogItemFixture({ id: 'archived', deadlineDate: '2026-08-26', status: 'archived' });
    expect(selectReminderCandidates([save('archived')], [item], NOW)).toHaveLength(0);
  });

  it('收藏的条目已经不在目录里时安全跳过', () => {
    expect(selectReminderCandidates([save('missing')], [], NOW)).toHaveLength(0);
  });

  it('窗口边界按天计算，可以调宽', () => {
    const item = catalogItemFixture({ id: 'edge', deadlineDate: '2026-08-30' });
    expect(selectReminderCandidates([save('edge')], [item], NOW, DEFAULT_REMINDER_WINDOW_DAYS)).toHaveLength(0);
    expect(selectReminderCandidates([save('edge')], [item], NOW, 10)).toHaveLength(1);
  });

  it('去重键用截止时间原文，官方改期后可以再提醒一次', () => {
    const dateOnly = catalogItemFixture({ id: 'x', deadlineDate: '2026-08-26' });
    const exact = catalogItemFixture({ id: 'x', deadlineDate: null, deadlineAt: '2026-08-26T12:00:00.000Z' });

    expect(selectReminderCandidates([save('x')], [dateOnly], NOW)[0].deadline).toBe('2026-08-26');
    expect(selectReminderCandidates([save('x')], [exact], NOW)[0].deadline).toBe('2026-08-26T12:00:00.000Z');
  });
});

describe('关注值归一化', () => {
  it('大小写与空白不同的写法落到同一条关注', () => {
    expect(normalizeFollowValue('  OpenAI ')).toBe('openai');
    expect(normalizeFollowValue('Google  DeepMind')).toBe('google deepmind');
  });

  it('空值归一化后为空，调用方据此拒绝写入', () => {
    expect(normalizeFollowValue('   ')).toBe('');
  });
});

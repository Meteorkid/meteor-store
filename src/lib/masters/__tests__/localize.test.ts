import { describe, expect, it } from 'vitest';
import { localizeMastersRound } from '../localize';
import type { MastersRound } from '../types';

const round = {
  id: 'test-round', intakeYear: 2027, region: 'hong-kong', status: 'published',
  verifiedOn: '2026-11-01', revision: 1, dateVersion: 1, dateChangedAt: null,
  previousDeadlineText: null, createdAt: '2026-11-01T00:00:00Z', updatedAt: '2026-11-01T00:00:00Z',
  details: {
    university: '香港科技大学', programme: 'MSc in Computer Science（General Stream，无 Delta X Fellowship）',
    subject: '计算机科学', studyType: 'taught', studyMode: '全日制，1年', intakeLabel: '2027/28 秋季（2027年9月）',
    applicantGroup: '一般申请', roundName: '第2轮', eventType: 'application', opensOn: null,
    openingNote: '官方项目页明确当前入学季申请已开放。', openingState: 'open', deadlineStatus: 'confirmed',
    deadlineOn: '2027-01-10', deadlineAt: null, deadlineTimeZone: 'Asia/Hong_Kong', deadlineText: '国际申请截止',
    rolling: false, mayCloseEarly: false, officialUrl: 'https://example.edu', sourceNote: '官方项目页。',
  },
} as MastersRound;

describe('硕士项目英文展示', () => {
  it('翻译结构化字段并保留来源说明原文', () => {
    const en = localizeMastersRound(round, 'en');
    expect(en.details.university).toBe('The Hong Kong University of Science and Technology');
    expect(en.details.programme).toBe('MSc in Computer Science (General Stream, without Delta X Fellowship)');
    expect(en.details.subject).toBe('Computer Science');
    expect(en.details.intakeLabel).toBe('Fall 2027 (September 2027)');
    expect(en.details.roundName).toBe('Round 2');
    expect(en.details.openingNote).toBe(round.details.openingNote);
    expect(en.details.sourceNote).toBe(round.details.sourceNote);
  });

  it('中文页面原样返回', () => {
    expect(localizeMastersRound(round, 'zh')).toBe(round);
  });

  it('兼容主轮、补录与中文数字轮次', () => {
    const base = { ...round, details: { ...round.details } };
    expect(localizeMastersRound({ ...base, details: { ...base.details, roundName: '主轮' } }, 'en').details.roundName).toBe('Main round');
    expect(localizeMastersRound({ ...base, details: { ...base.details, roundName: '第三轮' } }, 'en').details.roundName).toBe('Round 3');
  });
});

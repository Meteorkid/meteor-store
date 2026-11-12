import { describe, expect, it } from 'vitest';
import { nationalCompetitions } from '@/data/national-competitions';
import {
  competitionFields,
  competitionStatus,
  filterNationalCompetitions,
  primaryCompetitionField,
  scheduleForYear,
} from '../national-competitions';

const now = new Date('2026-11-12T04:00:00.000Z');

describe('国家级学科竞赛规划表', () => {
  it('保留附件中的 57 个国家级 A 类赛事，并为两年建立独立窗口', () => {
    expect(nationalCompetitions).toHaveLength(57);
    expect(new Set(nationalCompetitions.map((item) => item.id)).size).toBe(57);
    expect(nationalCompetitions.filter((item) => item.schedules.some((schedule) => schedule.year === 2025))).toHaveLength(51);
    expect(nationalCompetitions.filter((item) => item.schedules.some((schedule) => schedule.year === 2026))).toHaveLength(51);
    expect(nationalCompetitions.filter((item) => item.schedules.length === 0).map((item) => item.name)).toEqual([
      '理律杯全国高校模拟法庭辩论赛', '桃李杯舞蹈比赛', '全国大学生音乐大赛',
      '全国职业技术师范院校教学能力比赛（学生组）', '田家炳杯全国师范院校师范生教学技能大赛', '世界传统武术锦标赛',
    ]);
    for (const competition of nationalCompetitions) {
      expect(competition.order).toBeGreaterThan(0);
      if (competition.officialUrl) expect(competition.officialUrl).toMatch(/^https?:\/\//);
      for (const schedule of competition.schedules) {
        expect([2025, 2026]).toContain(schedule.year);
        for (const date of [schedule.start, schedule.end]) {
          if (date) expect(date).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
        }
        expect(schedule.sourceUrl).toMatch(/^https:\/\//);
      }
    }
  });

  it('月份窗口可判断开放、即将开始、结束和待公布', () => {
    const item = nationalCompetitions.find((competition) => competition.name === '全国大学生电子设计竞赛')!;
    expect(scheduleForYear(item, 2026)).toMatchObject({ start: '2026-06', end: '2026-08' });
    expect(competitionStatus({ year: 2026, start: '2026-11', end: '2026-12', startLabel: '', endLabel: '', sourceUrl: '' }, now)).toBe('open');
    expect(competitionStatus({ year: 2026, start: '2026-12', end: '2027-01', startLabel: '', endLabel: '', sourceUrl: '' }, now)).toBe('upcoming');
    expect(competitionStatus(scheduleForYear(item, 2026), now)).toBe('ended');
    expect(competitionStatus(undefined, now)).toBe('pending');
    expect(competitionStatus({
      year: 2026, start: '2026-09', end: '2026-10', startLabel: '', endLabel: '', sourceUrl: '',
    }, new Date('2026-10-31T16:30:00.000Z'))).toBe('ended');
  });

  it('按关键词、主学科和状态筛选，并保持稳定排序', () => {
    const filters = { query: '电子设计', field: '', status: 'all' as const, sort: 'soon' as const };
    const matches = filterNationalCompetitions(nationalCompetitions, 2026, filters, now);
    expect(matches.map((item) => item.name)).toContain('全国大学生电子设计竞赛');
    expect(matches.every((item) => item.name.includes('电子设计'))).toBe(true);
    const fields = competitionFields(nationalCompetitions);
    expect(fields).toContain('计算机类');
    expect(fields).toContain('艺术类');
    const pending = filterNationalCompetitions(nationalCompetitions, 2026, { ...filters, query: '', status: 'pending' }, now);
    expect(pending).toHaveLength(6);
    expect(pending.every((item) => primaryCompetitionField(item).length > 0)).toBe(true);
  });
});

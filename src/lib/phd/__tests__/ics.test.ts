import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SITE_URL } from '@/lib/constants';
import { buildPhdCalendar } from '../ics';
import { buildMastersCalendar } from '@/lib/masters/ics';
import type { PhdRound } from '../types';

function round(overrides: Partial<PhdRound> = {}, details: Partial<PhdRound['details']> = {}): PhdRound {
  return {
    id: 'oxford-advanced-cs-2027', intakeYear: 2027, region: 'uk', status: 'published',
    verifiedOn: '2026-10-14', revision: 4, dateVersion: 2, dateChangedAt: null, previousDeadlineText: null,
    createdAt: '2026-10-14T00:00:00Z', updatedAt: '2026-10-14T00:00:00Z',
    ...overrides,
    details: {
      university: 'University of Oxford', programme: 'DPhil Computer Science', subject: '计算机科学', studyType: 'research',
      studyMode: '全日制', intakeLabel: '2027/28', applicantGroup: '国际申请者', roundName: '最终轮', eventType: 'application',
      opensOn: null, openingNote: '官方明确已开放', openingState: 'open', deadlineStatus: 'confirmed',
      deadlineOn: '2027-01-06', deadlineAt: '2027-01-06T12:00:00+00:00', deadlineTimeZone: 'Europe/London',
      deadlineText: '6 January 2027, 12:00 UK time', rolling: false, mayCloseEarly: false,
      officialUrl: 'https://www.ox.ac.uk/admissions/graduate/courses/msc-advanced-computer-science', sourceNote: '2027/28项目官方截止。',
      ...details,
    },
  };
}

function unfold(calendar: string) { return calendar.replace(/\r\n /g, ''); }

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-14T10:00:00Z')); });
afterEach(() => vi.useRealTimers());

describe('博士申请 ICS 导出', () => {
  it('相同轮次ID在两个学位中具有独立UID且保留硕士PRODID和旧UID合同', () => {
    const domain = new URL(SITE_URL).hostname;
    const value = round();
    const masters = unfold(buildMastersCalendar([value]));
    const phd = unfold(buildPhdCalendar([value]));
    expect(masters).toContain(`PRODID:-//${domain}//Masters Application Calendar//ZH\r\n`);
    expect(masters).toContain(`UID:${value.id}@${domain}\r\n`);
    expect(phd).toContain(`PRODID:-//${domain}//PhD Application Calendar//ZH\r\n`);
    expect(phd).toContain(`UID:${value.id}@phd.${domain}\r\n`);
    expect(phd).not.toContain(`UID:${value.id}@${domain}\r\n`);
  });

  it('博士导出拒绝意外进入管线的授课型轮次', () => {
    expect(buildPhdCalendar([round({}, { studyType: 'taught' })])).not.toContain('BEGIN:VEVENT');
    expect(buildMastersCalendar([round({}, { studyType: 'taught' })])).toContain('BEGIN:VEVENT');
  });

  it('精确截止转换UTC，并保留来源、入学季和原始时区', () => {
    const calendar = unfold(buildPhdCalendar([round({}, {
      deadlineOn: '2026-12-01', deadlineAt: '2026-12-01T12:00:00+08:00', deadlineTimeZone: 'Asia/Hong_Kong',
    })]));
    expect(calendar).toContain('DTSTART:20261201T040000Z\r\n');
    expect(calendar).toContain('原始时区：Asia/Hong_Kong');
    expect(calendar).toContain('入学季：2027/28');
    expect(calendar).toContain('URL:https://www.ox.ac.uk/');
    expect(calendar).not.toContain('DTSTART;TZID=');
  });

  it('仅日期导出全天事件且DTEND是次日，不虚构23:59', () => {
    const calendar = unfold(buildPhdCalendar([round({}, { deadlineAt: null, deadlineTimeZone: null })]));
    expect(calendar).toContain('DTSTART;VALUE=DATE:20270106\r\n');
    expect(calendar).toContain('DTEND;VALUE=DATE:20270107\r\n');
    expect(calendar).toContain('官方仅公布日期');
    expect(calendar).toContain('不代表可提交至午夜');
    expect(calendar).not.toContain('T235900');
  });

  it('同条目改期使用同一UID并增加SEQUENCE，重复输入不重复导出', () => {
    const first = unfold(buildPhdCalendar([round()]));
    const nextRound = round({ revision: 5 }, { deadlineOn: '2027-01-07', deadlineAt: '2027-01-07T12:00:00Z' });
    const second = unfold(buildPhdCalendar([round(), nextRound]));
    const uid = `UID:oxford-advanced-cs-2027@phd.${new URL(SITE_URL).hostname}`;
    expect(first).toContain(uid);
    expect(second).toContain(uid);
    expect(first).toContain('SEQUENCE:4');
    expect(second).toContain('SEQUENCE:5');
    expect(second.match(/BEGIN:VEVENT/g)).toHaveLength(1);
    expect(second).toContain('DTSTART:20270107T120000Z');
  });

  it('提供30/7/1天DISPLAY提醒，不包含收件人或发信动作', () => {
    const calendar = unfold(buildPhdCalendar([round()]));
    expect(calendar.match(/BEGIN:VALARM/g)).toHaveLength(3);
    for (const days of [30, 7, 1]) expect(calendar).toContain(`TRIGGER:-P${days}D\r\n`);
    expect(calendar.match(/ACTION:DISPLAY/g)).toHaveLength(3);
    expect(calendar).not.toMatch(/ATTENDEE|ACTION:EMAIL|METHOD:REQUEST/);
    expect(calendar).toContain('需重新导出');
  });

  it('逗号、分号、反斜杠和换行转义，不允许插入新的日历属性', () => {
    const calendar = unfold(buildPhdCalendar([round({}, {
      programme: 'MSc, AI;Data\\Research\nATTENDEE:attacker', sourceNote: '第一行\r\n第二行',
    })]));
    expect(calendar).toContain('MSc\\, AI\\;Data\\\\Research\\nATTENDEE:attacker');
    expect(calendar).not.toContain('\r\nATTENDEE:');
    expect(calendar).toContain('第一行\\n第二行');
  });

  it('中文与emoji按UTF-8字节折行，每行不超过75字节且不拆开字符', () => {
    const value = round({}, { programme: '人工智能与计算机研究🙂'.repeat(15) });
    const calendar = buildPhdCalendar([value]);
    expect(calendar).toContain('\r\n ');
    for (const line of calendar.split('\r\n')) expect(Buffer.byteLength(line, 'utf8')).toBeLessThanOrEqual(75);
    expect(Buffer.from(calendar, 'utf8').toString('utf8')).toBe(calendar);
    expect(unfold(calendar)).toContain(value.details.programme);
    expect(calendar.replace(/\r\n/g, '')).not.toMatch(/[\r\n]/);
    expect(calendar.endsWith('END:VCALENDAR\r\n')).toBe(true);
  });

  it('草稿、未核验、未知截止、已关闭、过期和未来核验日期不导出', () => {
    const values = [
      round({ id: 'draft', status: 'draft' }), round({ id: 'no-verification', verifiedOn: null }),
      round({ id: 'future-verification', verifiedOn: '2027-01-01' }),
      round({ id: 'unverified' }, { deadlineStatus: 'unverified', deadlineOn: null, deadlineAt: null }),
      round({ id: 'unannounced' }, { deadlineStatus: 'unannounced', deadlineOn: null, deadlineAt: null }),
      round({ id: 'closed' }, { openingState: 'closed' }),
      round({ id: 'expired' }, { deadlineOn: '2026-10-01', deadlineAt: '2026-10-01T12:00:00Z' }),
    ];
    expect(buildPhdCalendar(values)).not.toContain('BEGIN:VEVENT');
  });

  it('开放时间未知但截止已确认，可以导出截止事件而不声称已经开放', () => {
    const calendar = unfold(buildPhdCalendar([round({}, { openingState: 'unknown' })]));
    expect(calendar).toContain('BEGIN:VEVENT');
    expect(calendar).not.toContain('已经开放');
  });

  it('英国夏令时的带偏移截止正确转UTC', () => {
    const calendar = unfold(buildPhdCalendar([round({}, {
      deadlineOn: '2027-07-06', deadlineAt: '2027-07-06T12:00:00+01:00', deadlineTimeZone: 'Europe/London',
    })]));
    expect(calendar).toContain('DTSTART:20270706T110000Z');
  });
});

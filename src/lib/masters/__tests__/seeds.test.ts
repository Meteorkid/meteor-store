import { describe, expect, it } from 'vitest';
import { mastersSeeds } from '../seeds';
import { MASTERS_REGIONS, MastersRoundInputSchema } from '../types';

describe('硕士申请首批官方来源', () => {
  it('五地区均有项目，标识唯一且全部是待审草稿', () => {
    expect(new Set(mastersSeeds.map((round) => round.region))).toEqual(new Set(MASTERS_REGIONS));
    expect(new Set(mastersSeeds.map((round) => round.id)).size).toBe(mastersSeeds.length);
    for (const round of mastersSeeds) {
      expect(MastersRoundInputSchema.safeParse(round).success, round.id).toBe(true);
      expect(round.status).toBe('draft');
      expect(round.verifiedOn).toBe('2026-10-14');
      expect(round.intakeYear).toBe(2027);
      expect(round.id).toBeTruthy();
      expect(round.details.sourceNote).toBeTruthy();
    }
  });

  it('仅使用已经核实的高校官方项目页面', () => {
    const hosts = new Set(['master.cds.hku.hk', 'mimt.hkust.edu.hk', 'fof.cityu.edu.mo', 'www.comp.nus.edu.sg', 'www.ox.ac.uk', 'study.uq.edu.au']);
    expect(mastersSeeds.every((round) => hosts.has(new URL(round.details.officialUrl).hostname))).toBe(true);
  });

  it('HKUST滚动审理仍分开保留四轮截止与香港时区', () => {
    const rounds = mastersSeeds.filter((round) => round.id?.startsWith('hkust-mimt'));
    expect(rounds.map((round) => round.details.deadlineOn)).toEqual(['2026-10-11', '2026-11-29', '2027-01-10', '2027-02-28']);
    expect(rounds.every((round) => round.details.rolling && round.details.deadlineTimeZone === 'Asia/Hong_Kong')).toBe(true);
    expect(rounds.every((round) => round.details.opensOn === null)).toBe(true);
  });

  it('澳门城大和NUS仅日期的截止不补时刻时区，不套用校级截止', () => {
    const city = mastersSeeds.find((round) => round.region === 'macau')!;
    const nus = mastersSeeds.find((round) => round.region === 'singapore')!;
    expect(city.details.deadlineOn).toBe('2027-04-30');
    expect(nus.details.opensOn).toBe('2026-10-01');
    expect(nus.details.deadlineOn).toBe('2027-01-31');
    for (const round of [city, nus]) {
      expect(round.details.deadlineAt).toBeNull();
      expect(round.details.deadlineTimeZone).toBeNull();
    }
  });

  it('英国中午截止保留Europe/London，不套用其他专业一月日期', () => {
    const oxford = mastersSeeds.find((round) => round.region === 'uk')!;
    expect(oxford.details.deadlineAt).toBe('2027-01-06T12:00:00Z');
    expect(oxford.details.deadlineTimeZone).toBe('Europe/London');
  });

  it('UQ国际申请采用11月30日/5月31日，不混入本地1月31日/6月30日', () => {
    const rounds = mastersSeeds.filter((round) => round.region === 'australia');
    expect(rounds.map((round) => round.details.deadlineOn)).toEqual(['2026-11-30', '2027-05-31']);
    for (const round of rounds) {
      expect(round.details.applicantGroup).toContain('国际申请者');
      expect(round.details.officialUrl).toContain('year=2027');
      expect(round.details.sourceNote).toContain('data-student-type="international"');
      expect(round.details.deadlineAt).toBeNull();
      expect(round.details.deadlineTimeZone).toBeNull();
    }
  });
});

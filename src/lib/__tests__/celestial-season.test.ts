import { describe, expect, it } from 'vitest';
import { getCelestialSeason } from '../celestial-season';

describe('getCelestialSeason', () => {
  it.each([
    ['2026-02-03', 'winter'],
    ['2026-02-04', 'spring'],
    ['2026-05-04', 'spring'],
    ['2026-05-05', 'summer'],
    ['2026-08-06', 'summer'],
    ['2026-08-07', 'autumn'],
    ['2026-11-06', 'autumn'],
    ['2026-11-07', 'winter'],
    ['2026-12-31', 'winter'],
  ] as const)('%s 对应 %s', (date, season) => {
    expect(getCelestialSeason(date)).toBe(season);
  });

  it.each(['2026/08/07', '2026-02-30', 'not-a-date'])('拒绝非法日期 %s', (date) => {
    expect(() => getCelestialSeason(date)).toThrow('文章日期');
  });
});

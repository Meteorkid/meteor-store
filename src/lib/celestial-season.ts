export type CelestialSeason = 'spring' | 'summer' | 'autumn' | 'winter';

/**
 * 按常用节气日期近似划分四时。
 *
 * 文章 frontmatter 只保存公历日期，没有精确节气时刻；这里固定采用
 * 立春 02-04、立夏 05-05、立秋 08-07、立冬 11-07，避免为了四句落款
 * 引入农历或天文历算依赖。
 */
export function getCelestialSeason(date: string): CelestialSeason {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) throw new Error(`文章日期格式无效：${date}`);

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new Error(`文章日期无效：${date}`);
  }

  const monthDay = month * 100 + day;
  if (monthDay >= 204 && monthDay < 505) return 'spring';
  if (monthDay >= 505 && monthDay < 807) return 'summer';
  if (monthDay >= 807 && monthDay < 1107) return 'autumn';
  return 'winter';
}

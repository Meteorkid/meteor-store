import { dailyDate } from '@/lib/daily/types';

/**
 * 学习模块的日期展示工具。
 *
 * dueAt 允许两种形态：纯日期（YYYY-MM-DD）与带时区的 ISO 时刻。
 * 有明确时刻才显示时刻；纯日期不推测时间。所有「几天后」都按
 * 北京时间的日历日期计算，与复习调度同一口径。
 */

export function isDateOnly(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/** 任意形态的 dueAt → 北京时间日历日期。 */
export function studyDatePart(value: string): string {
  if (isDateOnly(value)) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value.slice(0, 10) : dailyDate(parsed);
}

/** 日历日期差（正数=未来）。无法解析时返回 null，调用方不得把 null 当 0。 */
export function studyDaysUntil(datePart: string, today = dailyDate()): number | null {
  const target = Date.parse(`${datePart}T00:00:00Z`);
  const base = Date.parse(`${today}T00:00:00Z`);
  if (!Number.isFinite(target) || !Number.isFinite(base)) return null;
  return Math.round((target - base) / 86_400_000);
}

export function formatStudyDate(value: string, locale: 'zh' | 'en'): string {
  const datePart = studyDatePart(value);
  const [year, month, day] = datePart.split('-').map(Number);
  if (!year || !month || !day) return value;
  return locale === 'zh'
    ? `${year}年${month}月${day}日`
    : new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' })
        .format(new Date(Date.UTC(year, month - 1, day)));
}

/** 有明确时刻的截止才显示时间，并统一投影到北京时间。 */
export function formatStudyDeadline(value: string, locale: 'zh' | 'en'): string {
  if (isDateOnly(value)) return formatStudyDate(value, locale);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    timeZone: 'Asia/Shanghai', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(parsed);
}

/** 相对天数文案；null 不猜测，返回空串。 */
export function studyRelativeDays(days: number | null, locale: 'zh' | 'en'): string {
  if (days === null) return '';
  if (locale === 'zh') {
    if (days < -1) return `已过期 ${-days} 天`;
    if (days === -1) return '昨天截止';
    if (days === 0) return '今天截止';
    if (days === 1) return '明天截止';
    return `${days} 天后`;
  }
  if (days < -1) return `${-days} days overdue`;
  if (days === -1) return 'Due yesterday';
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `In ${days} days`;
}

/** 复习到期文案（只用于未来日期）。 */
export function studyReviewDueLabel(dueOn: string, locale: 'zh' | 'en', today = dailyDate()): string {
  const days = studyDaysUntil(dueOn, today);
  if (days === null) return dueOn;
  if (locale === 'zh') {
    if (days <= 0) return '今天该复习';
    if (days === 1) return '明天复习';
    return `${days} 天后复习`;
  }
  if (days <= 0) return 'Review today';
  if (days === 1) return 'Review tomorrow';
  return `Review in ${days} days`;
}

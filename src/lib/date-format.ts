/**
 * 公开页面统一的日期写法：2026.11.05。
 *
 * 只在展示层调用；数据仍存 ISO 日期/时间。北京时间作为基准，
 * 避免服务器在 UTC 时把日界附近的日期显示成前一天。
 */
export function formatDotDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Shanghai',
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';

  return `${part('year')}.${part('month')}.${part('day')}`;
}

/** 日期 + 24 小时制时间，仍以北京时间为准。 */
export function formatDotDateTime(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'Asia/Shanghai',
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';

  return `${part('year')}.${part('month')}.${part('day')} ${part('hour')}:${part('minute')}`;
}

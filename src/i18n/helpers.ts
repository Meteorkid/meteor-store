import { type Locale } from './routing';

/**
 * 按 locale 取本地化文本
 * 如果传入的是 string，直接返回（向后兼容）
 * 如果传入的是 {zh, en} 对象，按 locale 取值
 */
export function pickLocale(
  text: string | { zh: string; en: string },
  locale: Locale
): string {
  if (typeof text === 'string') return text;
  return text[locale] ?? text.zh;
}

/**
 * 批量按 locale 取本地化文本数组
 */
export function pickLocaleArray(
  items: Array<string | { zh: string; en: string }>,
  locale: Locale
): string[] {
  return items.map((item) => pickLocale(item, locale));
}

/** 后台时间统一为北京时间；显式语言和时区，避免首屏与手机水合结果不同。 */
function format(value: string, locale: string, withTime: boolean): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale.startsWith('en') ? 'en-GB' : 'zh-CN', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
    ...(withTime ? { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false } as const : {}),
  }).format(date);
}
export const formatAdminDate = (value: string, locale: string) => format(value, locale, false);
export const formatAdminTimestamp = (value: string, locale: string) => format(value, locale, true);

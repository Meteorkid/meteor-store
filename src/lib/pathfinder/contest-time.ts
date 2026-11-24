export function hasContestStarted(item: { startsAt?: string | null }, now = new Date()) {
  return Boolean(item.startsAt && Date.parse(item.startsAt) <= now.getTime());
}

export function formatContestStart(value: string, locale: 'zh' | 'en'): string {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'zh-CN', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Shanghai', timeZoneName: 'shortOffset', hourCycle: 'h23',
  }).format(new Date(value));
}

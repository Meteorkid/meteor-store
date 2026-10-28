import { DAILY_CHANNEL_IDS, DAILY_EDITION_CHANNEL_IDS } from './channels';

type EditionChannel = typeof DAILY_EDITION_CHANNEL_IDS[number];

export function dailyEntryAnchor(channel: EditionChannel, id: string) {
  const token = btoa(String.fromCharCode(...new TextEncoder().encode(id)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `daily-entry-${channel}-${token}`;
}

export function dailyWordAnchor(term: string, index: number) {
  return dailyEntryAnchor('english', `word:${index}:${term.trim()}`);
}

export function isDailyEntryAnchor(value: string) {
  return DAILY_EDITION_CHANNEL_IDS.some(channel => {
    const prefix = `daily-entry-${channel}-`;
    return value.startsWith(prefix) && /^[A-Za-z0-9_-]{1,1200}$/.test(value.slice(prefix.length));
  });
}

export function dailyEntryHref(date: string, channel: EditionChannel, id: string) {
  return `/daily?date=${date}&view=all#${dailyEntryAnchor(channel, id)}`;
}

export function dailyWordHref(date: string, term: string, index: number) {
  return `/daily?date=${date}&view=all#${dailyWordAnchor(term, index)}`;
}

/** 日刊登录回跳只允许阅读日期、全部视图和已登记栏目，不接受任意跳转参数。 */
export function normalizeDailyReturn(value: string): string | null {
  if (!/^\/daily[?#]/.test(value) || value.length > 2048) return null;
  try {
    const url = new URL(value, 'https://daily.invalid');
    if (url.pathname !== '/daily') return null;
    const query = url.searchParams;
    if ([...query.keys()].some(key => !['date', 'view'].includes(key))
      || query.getAll('date').length > 1 || query.getAll('view').length > 1) return null;
    const date = query.get('date');
    if (date !== null && (!/^\d{4}-\d{2}-\d{2}$/.test(date)
      || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date)) return null;
    if (query.has('view') && query.get('view') !== 'all') return null;
    const hash = decodeURIComponent(url.hash.slice(1));
    if (hash && !DAILY_CHANNEL_IDS.some(channel => channel === hash) && !isDailyEntryAnchor(hash)) return null;
    const clean = new URLSearchParams();
    if (date) clean.set('date', date);
    if (query.has('view')) clean.set('view', 'all');
    return `/daily${clean.size ? `?${clean}` : ''}${hash ? `#${hash}` : ''}`;
  } catch { return null; }
}

export function dailyReadingReturn(date: string, viewAll: boolean, hash = '') {
  return normalizeDailyReturn(`/daily?date=${encodeURIComponent(date)}${viewAll ? '&view=all' : ''}${hash}`)
    ?? `/daily?date=${encodeURIComponent(date)}${viewAll ? '&view=all' : ''}`;
}

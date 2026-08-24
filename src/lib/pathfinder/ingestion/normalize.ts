import crypto from 'crypto';

const TRACKING_PARAMS = new Set([
  'fbclid',
  'gclid',
  'mc_cid',
  'mc_eid',
  'ref',
  'source',
]);

export function normalizeIngestionUrl(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== 'https:') return null;
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (key.startsWith('utm_') || TRACKING_PARAMS.has(key)) {
        url.searchParams.delete(key);
      }
    }
    url.hostname = url.hostname.toLowerCase();
    if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/+$/, '');
    url.searchParams.sort();
    return url.toString();
  } catch {
    return null;
  }
}

export function isAllowedHost(raw: string, allowedHosts: readonly string[]): boolean {
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && allowedHosts.some((host) => (
      url.hostname === host || url.hostname.endsWith(`.${host}`)
    ));
  } catch {
    return false;
  }
}

export function cleanExternalText(raw: string, maxLength: number): string {
  const withoutCdata = raw.replace(/^\s*<!\[CDATA\[|\]\]>\s*$/g, '');
  const withoutTags = withoutCdata.replace(/<[^>]*>/g, ' ');
  const decoded = decodeXmlEntities(withoutTags).replace(/\s+/g, ' ').trim();
  if (decoded.length <= maxLength) return decoded;
  return `${decoded.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export function toIsoDate(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function contentHash(value: unknown): string {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function decodeXmlEntities(value: string): string {
  const named: Record<string, string> = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  };
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity: string) => {
    if (entity.startsWith('#')) {
      const hex = entity[1]?.toLowerCase() === 'x';
      const code = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(code) && code >= 0 && code <= 0x10ffff
        ? String.fromCodePoint(code)
        : match;
    }
    return named[entity.toLowerCase()] ?? match;
  });
}

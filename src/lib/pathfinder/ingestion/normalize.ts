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
  const decoded = decodeXmlEntities(withoutCdata);
  const cleaned = decoded.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

/**
 * 把 GitHub issue 正文（Markdown）压成可读的一句话摘要。
 *
 * `cleanExternalText` 是给 RSS 的 HTML 正文设计的，只剥标签；issue 正文是
 * Markdown，于是模板标题、代码围栏会原样漏到卡片上——线上实际出现过
 * 「### Version v23.6.0 ### Platform ```text Linux SMP Debian…」这样的摘要。
 *
 * 处理顺序有讲究：先整段删掉代码围栏（里面是日志和堆栈，永远不该当摘要），
 * 再去掉 issue 模板的固定结构（`### 小标题`、`_No response_`），
 * 最后才做行内标记的清理。剩下的正文太短就返回空，让卡片走
 * 「官方来源未提供摘要」那条如实说明的路径，而不是硬挤一段噪音出来。
 */
export function markdownToSummary(raw: string, maxLength: number): string {
  const withoutCode = raw
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  const lines = withoutCode.split(/\r?\n/).filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    // issue 模板的骨架：小标题本身和「未填写」占位都不承载信息
    if (/^#{1,6}\s/.test(trimmed)) return false;
    if (/^_?no response_?$/i.test(trimmed)) return false;
    if (/^[-*_]{3,}$/.test(trimmed)) return false;
    if (/^\|.*\|$/.test(trimmed)) return false;
    return true;
  });

  const text = lines.join(' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/^\s*>+\s?/gm, '')
    .replace(/(\*\*|__|\*|~~)/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 剩下的还不足一句话时，宁可没有摘要
  if (text.length < 20) return '';
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 1).trimEnd()}…`;
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

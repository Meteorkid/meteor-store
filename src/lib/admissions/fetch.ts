import { SITE_URL } from '@/lib/constants';

export const ADMISSIONS_MAX_PAGE_BYTES = 2 * 1024 * 1024;
export const ADMISSIONS_FETCH_TIMEOUT_MS = 10_000;

export function allowedAdmissionsUrl(raw: string, host: string, allowedHosts: readonly string[]): URL {
  const url = new URL(raw);
  if (!allowedHosts.includes(host)
    || url.protocol !== 'https:' || url.hostname !== host || url.username || url.password
    || (url.port && url.port !== '443')) throw new Error('unsafe_source');
  url.hash = '';
  return url;
}

/** 仅受控高校主机；重定向与流式读取共享10秒预算，不执行网页脚本。 */
export async function fetchAdmissionsPage(raw: string, host: string, allowedHosts: readonly string[], calendar: 'masters' | 'phd'): Promise<{ html: string; url: string }> {
  let url = allowedAdmissionsUrl(raw, host, allowedHosts);
  const signal = AbortSignal.timeout(ADMISSIONS_FETCH_TIMEOUT_MS);
  for (let redirects = 0; redirects <= 3; redirects += 1) {
    const response = await fetch(url.toString(), {
      redirect: 'manual', cache: 'no-store', signal,
      headers: { Accept: 'text/html,application/xhtml+xml', 'User-Agent': `MeteorStore/1.0 (+${SITE_URL}/${calendar})` },
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location || redirects === 3) throw new Error('redirect_failed');
      url = allowedAdmissionsUrl(new URL(location, url).toString(), host, allowedHosts);
      continue;
    }
    if (!response.ok) throw new Error('fetch_failed');
    if (Number(response.headers.get('content-length')) > ADMISSIONS_MAX_PAGE_BYTES) throw new Error('page_too_large');
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType && !/text\/html|application\/xhtml\+xml/i.test(contentType)) throw new Error('not_html');
    if (!response.body) throw new Error('empty_page');
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const next = await reader.read();
        if (next.done) break;
        size += next.value.byteLength;
        if (size > ADMISSIONS_MAX_PAGE_BYTES) {
          await reader.cancel().catch(() => undefined);
          throw new Error('page_too_large');
        }
        chunks.push(next.value);
      }
    } finally { reader.releaseLock(); }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const html = new TextDecoder().decode(bytes);
    if (!html.trim() || /<title[^>]*>\s*(?:Just a moment|Access denied)/i.test(html)) throw new Error('blocked_page');
    return { html, url: url.toString() };
  }
  throw new Error('redirect_failed');
}

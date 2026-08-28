import type { PathfinderFetchResult, PathfinderSyncSource } from './types';
import { SITE_URL } from '@/lib/constants';
import { isAllowedHost } from './normalize';

export const PATHFINDER_MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
const MAX_REDIRECTS = 3;
const SOURCE_ATTEMPTS = 2;
const SOURCE_ATTEMPT_TIMEOUT_MS = 6_000;

/**
 * GitHub 请求之间的最小间隔。
 *
 * 搜索接口的**次级限流**比文档写的「30 次/分钟」更严：请求虽然是串行发的，
 * 但彼此间隔不到几十毫秒时会被判为突发流量直接 403。实测一次同步里 16 个
 * 策展 issue 查询连着打过去，有 8 个拿到 403，而单独手动请求同一个查询
 * 返回 200 且 `x-ratelimit-remaining` 还有 29——说明卡的不是主配额。
 *
 * 2.5 秒对应 24 次/分钟，在主配额 30 以内留了余量。代价是一次同步多花约 40 秒，
 * 对每小时跑一次的定时任务无所谓。
 */
const GITHUB_MIN_INTERVAL_MS = 2_500;

/** 上一次 GitHub 请求的时刻。模块级状态，同一进程内的所有来源共享节流。 */
let lastGithubRequestAt = 0;

async function throttleGithub(): Promise<void> {
  const wait = lastGithubRequestAt + GITHUB_MIN_INTERVAL_MS - Date.now();
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  lastGithubRequestAt = Date.now();
}

export async function fetchPathfinderSource(
  source: PathfinderSyncSource,
  conditional: { etag?: string | null; lastModified?: string | null } = {},
): Promise<PathfinderFetchResult> {
  for (let attempt = 0; attempt < SOURCE_ATTEMPTS; attempt += 1) {
    try {
      return await fetchPathfinderSourceOnce(source, conditional);
    } catch (error) {
      if (attempt === SOURCE_ATTEMPTS - 1 || !isRetryableSourceError(error)) throw error;
    }
  }
  throw new Error(`pathfinder source retry exhausted: ${source.id}`);
}

async function fetchPathfinderSourceOnce(
  source: PathfinderSyncSource,
  conditional: { etag?: string | null; lastModified?: string | null },
): Promise<PathfinderFetchResult> {
  let currentUrl = source.fetchUrl;
  // 每次尝试的全部重定向共用预算；网络失败只重试一次，避免单个坏节点拖垮整批同步。
  const signal = AbortSignal.timeout(SOURCE_ATTEMPT_TIMEOUT_MS);
  const headers: Record<string, string> = {
    Accept: source.adapterId === 'rss'
      ? 'application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9'
      : source.adapterId === 'greenhouse'
        ? 'application/json'
        : 'application/vnd.github+json',
    'User-Agent': `Meteor-Pathfinder/1.0 (+${SITE_URL}/pathfinder)`,
  };
  if (conditional.etag) headers['If-None-Match'] = conditional.etag;
  if (conditional.lastModified) headers['If-Modified-Since'] = conditional.lastModified;
  if (source.adapterId === 'github') {
    headers['X-GitHub-Api-Version'] = '2022-11-28';
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    await throttleGithub();
  }

  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    if (!isAllowedHost(currentUrl, source.allowedFetchHosts)) {
      throw new Error(`pathfinder source host is not allowed: ${source.id}`);
    }
    const response = await fetch(currentUrl, {
      cache: 'no-store',
      headers,
      redirect: 'manual',
      signal,
    });

    if (response.status === 304) {
      return {
        body: '',
        etag: response.headers.get('etag'),
        lastModified: response.headers.get('last-modified'),
        notModified: true,
      };
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location || redirects === MAX_REDIRECTS) {
        throw new Error(`pathfinder source redirect rejected: ${source.id}`);
      }
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    if (!response.ok) {
      throw new Error(`pathfinder source ${source.id} returned ${response.status}`);
    }
    const declaredLength = Number(response.headers.get('content-length') ?? 0);
    if (declaredLength > PATHFINDER_MAX_RESPONSE_BYTES) {
      throw new Error(`pathfinder source response is too large: ${source.id}`);
    }
    const bytes = await readLimitedBody(response, source.id);
    return {
      body: new TextDecoder().decode(bytes),
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
      notModified: false,
    };
  }

  throw new Error(`pathfinder source redirect limit exceeded: ${source.id}`);
}

function isRetryableSourceError(error: unknown): boolean {
  return error instanceof TypeError
    || (error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError'));
}

async function readLimitedBody(response: Response, sourceId: string): Promise<Uint8Array> {
  if (!response.body) return new Uint8Array();
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > PATHFINDER_MAX_RESPONSE_BYTES) {
        await reader.cancel('response too large').catch(() => undefined);
        throw new Error(`pathfinder source response is too large: ${sourceId}`);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

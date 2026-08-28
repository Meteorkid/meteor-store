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
 * 数值定在 6 秒（10 次/分钟）而不是贴着主配额 30 去调：次级限流看的不是单纯的
 * 频次，还看查询本身的开销，而策展 issue 用的是多 repo 限定 + `-linked:pr` 的
 * 复杂查询，属于「贵」的那一类。实测 2.5 秒仍会在第三四个请求上触发。
 *
 * 代价是 16 个桶查询一次同步多花约 96 秒，对每小时跑一次的定时任务无所谓；
 * 而触发一次次级限流的代价是**整轮剩下的来源全部跳过**（见下面的冷却），
 * 两相比较慢一点划算得多。
 */
const GITHUB_MIN_INTERVAL_MS = 6_000;

/** 上一次 GitHub 请求的时刻。模块级状态，同一进程内的所有来源共享节流。 */
let lastGithubRequestAt = 0;

/**
 * 次级限流的冷却截止时刻。
 *
 * 次级限流一旦触发，惩罚是分钟级的（GitHub 的原话是「wait a few minutes」），
 * 而且**期间继续请求会延长惩罚**。实测：第一次未节流的同步触发后，紧接着的
 * 第二次同步仍然全是 403，而主配额 `x-ratelimit-remaining` 还剩 21。
 *
 * 所以命中之后不再发请求，而是让剩下的 GitHub 来源直接失败——同步是每小时跑
 * 一次的定时任务，这一轮少几个来源，下一轮自然补上；在请求里等几分钟则会
 * 撞上网关超时，什么也拿不到还白等。
 */
let githubCooldownUntil = 0;

/** 命中次级限流后默认冷却多久（GitHub 未给 Retry-After 时使用）。 */
const GITHUB_COOLDOWN_MS = 5 * 60_000;

async function throttleGithub(sourceId: string): Promise<void> {
  if (Date.now() < githubCooldownUntil) {
    const seconds = Math.ceil((githubCooldownUntil - Date.now()) / 1000);
    throw new Error(
      `pathfinder source ${sourceId} skipped: GitHub 次级限流冷却中，还需 ${seconds} 秒`,
    );
  }
  const wait = lastGithubRequestAt + GITHUB_MIN_INTERVAL_MS - Date.now();
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  lastGithubRequestAt = Date.now();
}

/** 从 403 响应里识别次级限流，并记下冷却截止时刻。 */
function noteGithubSecondaryLimit(response: Response, body: string): void {
  if (response.status !== 403 && response.status !== 429) return;
  if (!/secondary rate limit/i.test(body)) return;
  const retryAfter = Number(response.headers.get('retry-after'));
  githubCooldownUntil = Date.now()
    + (Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : GITHUB_COOLDOWN_MS);
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
    await throttleGithub(source.id);
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
      if (source.adapterId === 'github') {
        // 读一小段正文来区分次级限流与其它 403（权限、仓库不存在等）
        const body = await response.text().catch(() => '');
        noteGithubSecondaryLimit(response, body.slice(0, 500));
      }
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

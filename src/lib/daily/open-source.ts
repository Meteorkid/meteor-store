import { createHash } from 'node:crypto';
import { z } from 'zod';
import { STATIC_PATHFINDER_ITEMS } from '@/data/pathfinder/catalog-seeds';
import { SITE_URL } from '@/lib/constants';
import { cleanExternalText, normalizeIngestionUrl } from '@/lib/pathfinder/ingestion/normalize';
import { readStaticPathfinderTombstones } from '@/lib/pathfinder/static-tombstones';
import { DailyDateSchema, DailyLinkItemSchema, dailyDate } from './types';
import type { DailyContentResult } from './content';

const MAX_BYTES = 1024 * 1024;
const MAX_CANDIDATES = 3;
const repositorySchema = z.object({
  full_name: z.string().min(1), html_url: z.string().url(),
  private: z.boolean(), visibility: z.enum(['public', 'private', 'internal']),
  archived: z.boolean(), disabled: z.boolean(),
});
let queue = Promise.resolve();
let lastRequestAt: number | null = null;
let cooldownUntil = 0;
class RepositoryNotFoundError extends Error {}

/** 只认仓库根地址，issue、子目录、伪装域名均不能变成候选项目。 */
function repositoryName(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.username || url.password || url.port || url.search || url.hash) return null;
    const match = url.pathname.match(/^\/([a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\/([a-z0-9_.-]+)\/?$/i);
    return match && !/^\.+$/.test(match[2]) ? `${match[1]}/${match[2]}`.toLowerCase() : null;
  } catch { return null; }
}

async function protection(): Promise<Set<string>> {
  try {
    const snapshot = await readStaticPathfinderTombstones();
    if (!snapshot.available) throw new Error('Unavailable');
    return new Set(snapshot.ids);
  } catch { throw new Error('无法可靠读取项目下架状态'); }
}

async function readRepository(response: Response) {
  if (Number(response.headers.get('content-length')) > MAX_BYTES) {
    await response.body?.cancel().catch(() => undefined);
    throw new Error('GitHub 核验响应超过1MiB上限');
  }
  if (!response.body) throw new Error('GitHub 核验响应不完整');
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read().catch(() => { throw new Error('GitHub 核验响应读取失败'); });
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) {
        await reader.cancel().catch(() => undefined);
        throw new Error('GitHub 核验响应超过1MiB上限');
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  let value: unknown;
  try { value = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new Error('GitHub 核验响应不是有效JSON'); }
  const parsed = repositorySchema.safeParse(value);
  if (!parsed.success) throw new Error('GitHub 核验响应缺少必要的仓库信息');
  return parsed.data;
}

/** 同进程串行、每次请求起点至少相隔一秒，限流后不继续换候选请求。 */
async function verifyRepository(name: string) {
  const request = queue.then(async () => {
    if (Date.now() < cooldownUntil) throw new Error('GitHub 核验处于限流冷却期');
    const delay = lastRequestAt === null ? 0 : Math.max(0, lastRequestAt + 1000 - Date.now());
    if (delay) await new Promise(resolve => setTimeout(resolve, delay));
    lastRequestAt = Date.now();
    const url = `https://api.github.com/repos/${name}`;
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': `Meteor-Daily/1.0 (+${SITE_URL}/daily)`,
    };
    const token = process.env.GITHUB_TOKEN?.trim();
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(url, {
      headers, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(8000),
    }).catch(() => { throw new Error('GitHub 仓库核验请求失败或超时'); });
    if (response.url && response.url !== url) {
      await response.body?.cancel().catch(() => undefined);
      throw new Error('GitHub 核验响应地址发生变化，拒绝重定向');
    }
    if (!response.ok) {
      if (response.status === 403 || response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        const seconds = Number(retryAfter);
        const retryAt = Number.isFinite(seconds) && seconds > 0
          ? Date.now() + seconds * 1000 : Date.parse(retryAfter ?? '');
        const resetAt = response.headers.get('x-ratelimit-remaining') === '0'
          ? Number(response.headers.get('x-ratelimit-reset')) * 1000 : 0;
        cooldownUntil = Math.max(Date.now() + 60_000, Number.isFinite(retryAt) ? retryAt : 0, Number.isFinite(resetAt) ? resetAt : 0);
      }
      await response.body?.cancel().catch(() => undefined);
      if (response.status === 404) throw new RepositoryNotFoundError('GitHub 仓库核验返回 HTTP 404');
      throw new Error(`GitHub 仓库核验返回 HTTP ${response.status}`);
    }
    const repository = await readRepository(response);
    const verifiedAt = new Date().toISOString();
    if (repository.full_name.toLowerCase() !== name || repositoryName(repository.html_url) !== name) {
      throw new Error('GitHub 核验响应与策展仓库不一致');
    }
    return repository.private || repository.visibility !== 'public' || repository.archived || repository.disabled
      ? null : { ...repository, verifiedAt };
  });
  queue = request.then(() => undefined, () => undefined);
  return request;
}

export async function loadDailyOpenSource(date: string, usedSourceKeys: string[]): Promise<DailyContentResult> {
  DailyDateSchema.parse(date);
  if (date !== dailyDate()) throw new Error('实时项目核验只支持北京时间今日');
  let tombstones = await protection();
  const pool = STATIC_PATHFINDER_ITEMS.flatMap(item => {
    const name = repositoryName(item.canonicalUrl);
    return item.itemType === 'open-source' && item.status === 'published' && name
      ? [{ item, name, urlHash: createHash('sha256').update(normalizeIngestionUrl(item.canonicalUrl)!).digest('hex') }] : [];
  }).sort((a, b) => a.name.localeCompare(b.name));
  const used = new Set(usedSourceKeys);
  const usedRepositories = new Set(usedSourceKeys.map(repositoryName).filter((value): value is string => value !== null));
  const hidden = (candidate: (typeof pool)[number]) => tombstones.has(candidate.item.id) || tombstones.has(`url:${candidate.urlHash}`);
  const offset = pool.length ? Math.floor(Date.parse(`${date}T00:00:00Z`) / 86_400_000) % pool.length : 0;
  const candidates = [...pool.slice(offset), ...pool.slice(0, offset)]
    .filter(candidate => !hidden(candidate) && !used.has(candidate.item.id) && !usedRepositories.has(candidate.name));
  const empty: DailyContentResult = { status: 'empty', title: '今日探索项目', summary: '当前策展池暂无尚未选用且可核验的公开项目。', content: null };
  let attempts = 0;
  let failure: unknown;
  for (const candidate of candidates) {
    if (hidden(candidate)) continue;
    if (attempts === MAX_CANDIDATES) throw new Error('本次项目候选核验预算已用尽，等待重试');
    attempts += 1;
    let repository;
    try { repository = await verifyRepository(candidate.name); }
    catch (error) {
      if (!(error instanceof RepositoryNotFoundError)) throw error;
      failure = error;
      continue;
    }
    if (!repository) continue;
    // 核验请求可能持续数秒，发布前再次确认管理员没有在此期间下架项目。
    tombstones = await protection();
    if (date !== dailyDate()) throw new Error('实时项目核验已跨越日期，不能发布到旧期次');
    if (hidden(candidate)) continue;
    const difficulty = candidate.item.difficulty === 'beginner' ? 'introductory'
      : candidate.item.difficulty === 'all' ? undefined : candidate.item.difficulty;
    const item = DailyLinkItemSchema.parse({
      id: repository.html_url, title: cleanExternalText(candidate.item.title.zh || candidate.item.title.en, 300),
      summary: `${cleanExternalText(candidate.item.summary.zh || candidate.item.summary.en, 5800)} 核验时仓库公开，未归档且未禁用。`,
      url: repository.html_url, sourceName: 'GitHub', sourceType: 'official', verifiedAt: repository.verifiedAt,
      category: candidate.item.directions.join(' · '), difficulty,
    });
    return { status: 'published', title: '今日探索项目', summary: '从策展项目池轮换选择一个项目，了解用途与入门方向，并附实时仓库状态核验。',
      content: { kind: 'open-source', items: [item] }, sourceKey: `open-source:${date}:${candidate.name}` };
  }
  if (failure) throw failure;
  return empty;
}

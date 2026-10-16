import { createHash } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { catalogItemFixture } from '@/lib/pathfinder/__tests__/fixtures';
import type { PathfinderCatalogItem } from '@/lib/pathfinder/catalog-types';
import { DailyContentSchema } from '../types';

const mocks = vi.hoisted(() => ({ items: [] as PathfinderCatalogItem[], tombstones: vi.fn() }));
vi.mock('@/data/pathfinder/catalog-seeds', () => ({ STATIC_PATHFINDER_ITEMS: mocks.items }));
vi.mock('@/lib/pathfinder/static-tombstones', () => ({ readStaticPathfinderTombstones: mocks.tombstones }));

type Client = typeof import('../open-source');
let client: Client;
let fetchMock: ReturnType<typeof vi.fn>;
const date = '2026-10-16';
const now = '2026-10-16T01:00:00.000Z';

function seed(name: string, overrides: Partial<PathfinderCatalogItem> = {}) {
  return catalogItemFixture({
    id: `static-${name}`, canonicalUrl: `https://github.com/example/${name}`, title: { zh: `${name} 项目`, en: name },
    summary: { zh: '从 README 和一个小功能开始探索这个策展项目。', en: 'Explore this curated repository.' }, ...overrides,
  });
}

function repository(url: string, overrides: Record<string, unknown> = {}) {
  const fullName = new URL(url).pathname.split('/').slice(2).join('/');
  return { full_name: fullName, html_url: `https://github.com/${fullName}`,
    private: false, visibility: 'public', archived: false, disabled: false, ...overrides };
}

/** 真实模块的节流使用受控时钟，测试不等待真实秒数，也不发网络请求。 */
async function load(day = date, used: string[] = []) {
  const settled = client.loadDailyOpenSource(day, used).then(value => ({ value }), error => ({ error }));
  await vi.runAllTimersAsync();
  const result = await settled;
  if ('error' in result) throw result.error;
  return result.value;
}

beforeEach(async () => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(now));
  vi.stubEnv('GITHUB_TOKEN', '');
  mocks.items.splice(0, mocks.items.length, seed('alpha'), seed('beta'), seed('gamma'));
  mocks.tombstones.mockResolvedValue({ ids: [], available: true });
  fetchMock = vi.fn(async (url: string) => Response.json(repository(url)));
  vi.stubGlobal('fetch', fetchMock);
  client = await import('../open-source');
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe('每日探索开源项目', () => {
  it('只从真实仓库白名单选一个，经实时GitHub核验后自动发布', async () => {
    const result = await load();
    expect(result.status).toBe('published');
    expect(result.title).toContain('探索');
    expect(`${result.title} ${result.summary}`).not.toMatch(/热榜|今日新发布|今日发布/);
    expect(DailyContentSchema.safeParse(result.content).success).toBe(true);
    if (result.content?.kind !== 'open-source') throw new Error('Expected open-source');
    expect(result.content.items).toHaveLength(1);
    expect(result.content.items[0]).toMatchObject({ sourceName: 'GitHub', sourceType: 'official', verifiedAt: now });
    expect(result.content.items[0].id).toBe(result.content.items[0].url);
    expect(result.content.items[0]).not.toHaveProperty('sourcePublishedAt');
    expect(result.content.items[0].summary).toContain('公开');
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/^https:\/\/api\.github\.com\/repos\/example\/(alpha|beta|gamma)$/);
    expect(init).toMatchObject({ cache: 'no-store', redirect: 'error', signal: expect.any(AbortSignal) });
    expect(init.headers.Authorization).toBeUndefined();
    expect(mocks.tombstones).toHaveBeenCalled();
  });

  it('代码库的真实静态池含42个仓库根地址，不依赖动态issue目录', async () => {
    const actual = await vi.importActual<typeof import('@/data/pathfinder/catalog-seeds')>('@/data/pathfinder/catalog-seeds');
    const repositories = actual.STATIC_PATHFINDER_ITEMS.filter(item => item.itemType === 'open-source' && /^https:\/\/github\.com\/[^/]+\/[^/]+$/.test(item.canonicalUrl));
    expect(repositories).toHaveLength(42);
    expect(new Set(repositories.map(item => item.canonicalUrl.toLowerCase())).size).toBe(42);
  });

  it('同日期轮转稳定，相邻日期换项目', async () => {
    const first = await load();
    const sameDate = await load();
    vi.setSystemTime(new Date('2026-10-17T01:00:00.000Z'));
    const nextDate = await load('2026-10-17');
    expect(first.sourceKey).toBe(sameDate.sourceKey);
    expect(nextDate.content).not.toEqual(first.content);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('排除近30天已选URL和条目ID，但不把全历史来源键当成永久禁用', async () => {
    const first = await load();
    if (first.content?.kind !== 'open-source') throw new Error('Expected open-source');
    const chosen = first.content.items[0];
    const byUrl = await load(date, [chosen.url.toUpperCase()]);
    const byId = await load(date, [chosen.id]);
    const onlyHistoricalKey = await load(date, [first.sourceKey!]);
    expect(byUrl.content?.kind === 'open-source' && byUrl.content.items[0].url).not.toBe(chosen.url);
    expect(byId.content?.kind === 'open-source' && byId.content.items[0].url).not.toBe(chosen.url);
    expect(onlyHistoricalKey.sourceKey).toBe(first.sourceKey);
  });

  it('相同仓库经过完整轮转可以再次精选，来源键包含期次而不会永久冲突', async () => {
    mocks.items.splice(1);
    const first = await load(date);
    vi.setSystemTime(new Date('2026-11-28T01:00:00.000Z'));
    const later = await load('2026-11-28', [first.sourceKey!]);
    expect(first.sourceKey).not.toBe(later.sourceKey);
    expect(first.sourceKey).toContain(date);
    expect(later.sourceKey).toContain('2026-11-28');
    expect(later.status).toBe('published');
  });

  it.each([
    'https://github.com/example/alpha/issues/1', 'https://github.com/example/alpha/pulls',
    'https://github.com.evil.test/example/alpha', 'http://github.com/example/alpha',
    'https://github.com@127.0.0.1/example/alpha', 'https://user:pass@github.com/example/alpha',
  ])('非仓库根地址不能进入候选：%s', async canonicalUrl => {
    mocks.items.splice(0, mocks.items.length, seed('invalid', { canonicalUrl }));
    expect(await load()).toMatchObject({ status: 'empty', content: null });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('非开源类别和静态非公开记录不进入项目池', async () => {
    mocks.items.splice(0, mocks.items.length, seed('competition', { itemType: 'competition' }), seed('archived', { status: 'archived' }));
    expect(await load()).toMatchObject({ status: 'empty', content: null });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(['id', 'url-hash'])('遵守静态下架记录：%s', async kind => {
    mocks.items.splice(1);
    const item = mocks.items[0];
    const tombstone = kind === 'id' ? item.id : `url:${createHash('sha256').update(item.canonicalUrl).digest('hex')}`;
    mocks.tombstones.mockResolvedValue({ ids: [tombstone], available: true });
    expect(await load()).toMatchObject({ status: 'empty', content: null });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('无法可靠读取下架记录时失败，不降级到静态池', async () => {
    mocks.tombstones.mockResolvedValue({ ids: [], available: false });
    await expect(load()).rejects.toThrow(/下架/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('GitHub核验期间被下架的项目也不能发布', async () => {
    mocks.items.splice(1);
    mocks.tombstones.mockResolvedValueOnce({ ids: [], available: true })
      .mockResolvedValue({ ids: [mocks.items[0].id], available: true });
    expect(await load()).toMatchObject({ status: 'empty', content: null });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('核验时间记录响应完整读取时刻，不使用后续下架检查的完成时间', async () => {
    mocks.tombstones.mockResolvedValueOnce({ ids: [], available: true })
      .mockImplementation(async () => {
        vi.setSystemTime(new Date(Date.now() + 5_000));
        return { ids: [], available: true };
      });
    const result = await load();
    expect(result.content?.kind === 'open-source' && result.content.items[0].verifiedAt).toBe(now);
  });

  it.each([{ archived: true }, { disabled: true }, { private: true, visibility: 'private' }])('确认不可用的仓库跳过，不当成核验成功：%j', async flags => {
    mocks.items.splice(1);
    fetchMock.mockImplementation(async (url: string) => Response.json(repository(url, flags)));
    expect(await load()).toMatchObject({ status: 'empty', content: null });
  });

  it('前一个仓库归档后继续核验后续候选', async () => {
    fetchMock.mockImplementationOnce(async (url: string) => Response.json(repository(url, { archived: true })));
    expect((await load()).status).toBe('published');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('404可以尝试下一候选，但全部404必须报告来源失败', async () => {
    fetchMock.mockResolvedValueOnce(new Response('', { status: 404 }));
    expect((await load()).status).toBe('published');
    fetchMock.mockImplementation(async () => new Response('', { status: 404 }));
    await expect(load()).rejects.toThrow(/404/);
  });

  it.each([403, 429])('HTTP %i立即停止，不用更多候选轰炸受限API', async status => {
    fetchMock.mockImplementation(async () => new Response('', { status, headers: { 'retry-after': '120' } }));
    await expect(load()).rejects.toThrow(String(status));
    expect(fetchMock).toHaveBeenCalledOnce();
    await expect(load()).rejects.toThrow(/冷却/);
    expect(fetchMock).toHaveBeenCalledOnce();
    vi.setSystemTime(new Date(Date.now() + 120_000));
    fetchMock.mockImplementation(async (url: string) => Response.json(repository(url)));
    expect((await load()).status).toBe('published');
  });

  it('单次最多核验三候选，预算用尽不伪称整个项目池为空', async () => {
    mocks.items.push(seed('delta'));
    fetchMock.mockImplementation(async (url: string) => Response.json(repository(url, { archived: true })));
    await expect(load()).rejects.toThrow(/候选|预算/);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('全部近期已选时正常空稿，无需访问GitHub', async () => {
    expect(await load(date, mocks.items.map(item => item.canonicalUrl))).toMatchObject({ status: 'empty', content: null });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    { full_name: 'other/project' }, { html_url: 'https://evil.test/example/alpha' },
    { private: undefined }, { archived: undefined }, { disabled: undefined }, { visibility: undefined },
  ])('响应缺关键状态或不对应白名单仓库时失败：%j', async overrides => {
    mocks.items.splice(1);
    fetchMock.mockImplementation(async (url: string) => Response.json(repository(url, overrides)));
    await expect(load()).rejects.toThrow(/核验/);
  });

  it.each([301, 302, 500])('重定向与服务端HTTP %s不作为空稿', async status => {
    fetchMock.mockImplementation(async () => new Response('', { status, headers: { Location: 'https://outside.example/redirect' } }));
    await expect(load()).rejects.toThrow(String(status));
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][1].redirect).toBe('error');
  });

  it('不接受被悄悄重定向到外部地址的响应', async () => {
    mocks.items.splice(1);
    fetchMock.mockImplementation(async (url: string) => {
      const response = Response.json(repository(url));
      Object.defineProperty(response, 'url', { value: 'https://outside.example/repository' });
      return response;
    });
    await expect(load()).rejects.toThrow(/地址|重定向/);
  });

  it.each(['declared', 'stream'])('1MiB上限覆盖%s响应大小', async mode => {
    mocks.items.splice(1);
    fetchMock.mockImplementation(async () => new Response('x'.repeat(1024 * 1024 + 1), mode === 'declared' ? { headers: { 'Content-Length': String(1024 * 1024 + 1) } } : undefined));
    await expect(load()).rejects.toThrow(/过大|上限/);
  });

  it('非JSON、网络故障和超时都失败，不伪造实时核验', async () => {
    mocks.items.splice(1);
    fetchMock.mockImplementationOnce(async () => new Response('not-json'));
    await expect(load()).rejects.toThrow(/核验/);
    fetchMock.mockRejectedValueOnce(new Error('network error with private detail'));
    await expect(load()).rejects.toThrow(/核验/);
    const timeout = vi.spyOn(AbortSignal, 'timeout');
    fetchMock.mockRejectedValueOnce(new DOMException('Timeout', 'TimeoutError'));
    await expect(load()).rejects.toThrow(/核验/);
    expect(timeout).toHaveBeenCalledWith(8000);
  });

  it('复用可选Token且响应或异常不泄露它', async () => {
    const token = 'test-github-token-do-not-log';
    vi.stubEnv('GITHUB_TOKEN', token);
    const result = await load();
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(`Bearer ${token}`);
    expect(JSON.stringify(result)).not.toContain(token);
    fetchMock.mockRejectedValueOnce(new Error(`network error ${token}`));
    mocks.items.splice(1);
    await expect(load()).rejects.not.toThrow(token);
  });

  it('并发采集串行核验，请求起点至少相隔一秒', async () => {
    const starts: number[] = [];
    fetchMock.mockImplementation(async (url: string) => { starts.push(Date.now()); return Response.json(repository(url)); });
    const results = Promise.all([client.loadDailyOpenSource(date, []), client.loadDailyOpenSource(date, [])]);
    await vi.runAllTimersAsync();
    expect((await results).every(result => result.status === 'published')).toBe(true);
    expect(starts).toHaveLength(2);
    expect(starts[1] - starts[0]).toBeGreaterThanOrEqual(1000);
  });

  it('日期不合法时不查下架状态、不请求API', async () => {
    await expect(load('2026-02-30')).rejects.toThrow();
    expect(mocks.tombstones).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(['2026-10-15', '2026-10-17'])('只核验北京时间今日，不倒填或预填%s期次', async day => {
    await expect(load(day)).rejects.toThrow(/今日|当天/);
    expect(mocks.tombstones).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('核验期间跨越北京时间午夜时不能发布旧日期', async () => {
    vi.setSystemTime(new Date('2026-10-16T15:59:59.000Z'));
    fetchMock.mockImplementation(async (url: string) => {
      vi.setSystemTime(new Date('2026-10-16T16:00:01.000Z'));
      return Response.json(repository(url));
    });
    await expect(load()).rejects.toThrow(/今日|当天|日期/);
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});

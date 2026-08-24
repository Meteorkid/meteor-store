import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { catalogItemFixture } from '@/lib/pathfinder/__tests__/fixtures';

const { listCatalogItemsMock, rateLimitMock } = vi.hoisted(() => ({
  listCatalogItemsMock: vi.fn(),
  rateLimitMock: vi.fn(),
}));

vi.mock('@/lib/pathfinder/catalog', () => ({
  listCatalogItems: listCatalogItemsMock,
}));

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '127.0.0.1',
  rateLimit: (...args: unknown[]) => rateLimitMock(...args),
}));

function request(query: string): NextRequest {
  return new NextRequest(`https://imagentx.top/api/pathfinder/items?${query}`);
}

function matchingItem(id: string) {
  const item = catalogItemFixture({
    id,
    itemType: 'competition',
    direction: 'data',
    difficulty: 'intermediate',
    remoteStatus: 'remote',
    title: { zh: `Python 数据竞赛 ${id}`, en: `Python data competition ${id}` },
  });
  return {
    ...item,
    source: {
      ...item.source,
      enabled: true,
      autoPublish: true,
      lastError: 'internal ingestion failure',
    },
  };
}

describe('Pathfinder 目录读取 API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listCatalogItemsMock.mockResolvedValue([
      matchingItem('match-1'),
      matchingItem('match-2'),
      matchingItem('match-3'),
      catalogItemFixture({
        id: 'not-a-search-match',
        title: { zh: 'Rust 系统项目', en: 'Rust systems project' },
        summary: { zh: '编译器练习', en: 'Compiler exercise' },
        organization: { zh: '系统组织', en: 'Systems Org' },
        tags: { topic: ['systems'], skill: ['rust'], career: [], format: ['project'] },
      }),
    ]);
    rateLimitMock.mockResolvedValue({ limited: false });
  });

  it('组合筛选与 limit 返回截断前匹配总数，并收窄来源字段', async () => {
    const { GET } = await import('../route');
    const response = await GET(request([
      'q=python',
      'type=competition',
      'direction=data',
      'difficulty=intermediate',
      'remote=remote',
      'learning=true',
      'deadlineBefore=2026-09-30T00%3A00%3A00.000Z',
      'limit=2',
    ].join('&')));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(listCatalogItemsMock).toHaveBeenCalledWith({
      type: 'competition',
      direction: 'data',
      difficulty: 'intermediate',
      remoteStatus: 'remote',
      learningEligible: true,
      deadlineBefore: '2026-09-30T00:00:00.000Z',
    });
    expect(data.total).toBe(3);
    expect(data.items).toHaveLength(2);
    expect(data.items[0].source).toEqual({
      id: 'source-official',
      name: { zh: '官方来源', en: 'Official source' },
      siteUrl: 'https://example.com',
      trustLevel: 'official',
    });
    expect(Object.keys(data.items[0].source).sort()).toEqual([
      'id',
      'name',
      'siteUrl',
      'trustLevel',
    ]);
    expect(JSON.stringify(data.items)).not.toContain('internal ingestion failure');
  });

  it.each([
    'type=course',
    'direction=general',
    'difficulty=expert',
    'remote=anywhere',
  ])('非法枚举返回 400：%s', async (query) => {
    const { GET } = await import('../route');
    const response = await GET(request(query));

    expect(response.status).toBe(400);
    expect(listCatalogItemsMock).not.toHaveBeenCalled();
  });

  it('可按最多 8 个目录 ID 精确校验已保存路径', async () => {
    const { GET } = await import('../route');
    const response = await GET(request('ids=match-1%2Cmatch-3&learning=true&limit=8'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.total).toBe(2);
    expect(data.items.map((item: { id: string }) => item.id)).toEqual(['match-1', 'match-3']);

    const tooMany = await GET(request(`ids=${Array.from({ length: 9 }, (_, index) => `item-${index}`).join('%2C')}`));
    expect(tooMany.status).toBe(400);
  });

  it('按 IP 温和限流，避免任意搜索持续放大数据库读取', async () => {
    rateLimitMock.mockResolvedValueOnce({ limited: true });
    const { GET } = await import('../route');
    const response = await GET(request('q=python'));

    expect(response.status).toBe(429);
    expect(listCatalogItemsMock).not.toHaveBeenCalled();
  });
});

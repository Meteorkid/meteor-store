import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const syncMock = vi.fn();
const { revalidatePathMock, revalidateTagMock } = vi.hoisted(() => ({
  revalidatePathMock: vi.fn(),
  revalidateTagMock: vi.fn(),
}));

const VALID_SECRET = 'pathfinder-cron-secret-at-least-32-bytes';

vi.mock('@/lib/pathfinder/ingestion', () => ({
  PATHFINDER_SYNC_SOURCE_MAP: new Map([
    ['openai-news', { id: 'openai-news' }],
  ]),
  syncPathfinderSources: (...args: unknown[]) => syncMock(...args),
}));

vi.mock('@/lib/pathfinder/catalog', () => ({
  PATHFINDER_CATALOG_CACHE_TAG: 'pathfinder-catalog-v2',
}));

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '127.0.0.1',
  rateLimit: async () => ({ limited: false }),
}));

vi.mock('next/cache', () => ({
  revalidatePath: revalidatePathMock,
  revalidateTag: revalidateTagMock,
}));

function request(body?: unknown, token = VALID_SECRET) {
  return new Request('https://www.imagentx.top/api/cron/pathfinder-sync', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  }) as unknown as NextRequest;
}

describe('Pathfinder 聚合 cron', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.PATHFINDER_CRON_SECRET = VALID_SECRET;
    syncMock.mockResolvedValue({
      results: [{
        sourceId: 'openai-news',
        fetched: 2,
        inserted: 2,
        updated: 0,
        skipped: 0,
        notModified: false,
      }],
      maintenanceChanged: 0,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('只有到期或陈旧维护发生时也会标记目录已变化', async () => {
    syncMock.mockResolvedValue({ results: [], maintenanceChanged: 3 });
    const { POST } = await import('../route');
    const response = await POST(request({}));

    await expect(response.json()).resolves.toMatchObject({
      success: true,
      changed: true,
      maintenanceChanged: 3,
    });
    expect(revalidateTagMock).toHaveBeenCalledWith('pathfinder-catalog-v2', { expire: 0 });
  });

  it('鉴权通过后只同步白名单来源', async () => {
    const { POST } = await import('../route');
    const response = await POST(request({ sourceIds: ['openai-news'] }));
    expect(response.status).toBe(200);
    expect(syncMock).toHaveBeenCalledWith(['openai-news']);
    await expect(response.json()).resolves.toMatchObject({ success: true, changed: true });
    expect(revalidateTagMock).toHaveBeenCalledWith('pathfinder-catalog-v2', { expire: 0 });
  });

  it('拒绝未知来源，不能借接口抓任意 URL', async () => {
    const { POST } = await import('../route');
    const response = await POST(request({ sourceIds: ['https://attacker.test/feed'] }));
    expect(response.status).toBe(400);
    expect(syncMock).not.toHaveBeenCalled();
  });

  it('错误或缺失 secret 时返回 401', async () => {
    const { POST } = await import('../route');
    expect((await POST(request({}, 'wrong'))).status).toBe(401);
    delete process.env.PATHFINDER_CRON_SECRET;
    expect((await POST(request())).status).toBe(401);
    expect(syncMock).not.toHaveBeenCalled();
  });

  it('拒绝不足 32 字节的弱 secret 配置', async () => {
    process.env.PATHFINDER_CRON_SECRET = 'too-short';
    const { POST } = await import('../route');
    expect((await POST(request({}, 'too-short'))).status).toBe(401);
    expect(syncMock).not.toHaveBeenCalled();
  });

  it('全部来源失败时返回 503 并记录结构化告警', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    syncMock.mockResolvedValue({
      results: [{
        sourceId: 'openai-news',
        fetched: 0,
        inserted: 0,
        updated: 0,
        skipped: 0,
        notModified: false,
        error: 'upstream unavailable',
      }],
      maintenanceChanged: 0,
    });

    const { POST } = await import('../route');
    const response = await POST(request({}));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ success: false, changed: false });
    expect(consoleError).toHaveBeenCalledWith(expect.objectContaining({
      event: 'pathfinder_sync_source_failures',
      failedSourceCount: 1,
      totalSourceCount: 1,
    }));
  });

  it('部分来源失败仍返回 200，并保留成功来源的写入与告警', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    syncMock.mockResolvedValue({
      results: [
        {
          sourceId: 'openai-news',
          fetched: 2,
          inserted: 1,
          updated: 0,
          skipped: 1,
          notModified: false,
        },
        {
          sourceId: 'other-source',
          fetched: 0,
          inserted: 0,
          updated: 0,
          skipped: 0,
          notModified: false,
          error: 'timeout',
        },
      ],
      maintenanceChanged: 0,
    });

    const { POST } = await import('../route');
    const response = await POST(request({}));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ success: false, changed: true });
    expect(consoleError).toHaveBeenCalledWith(expect.objectContaining({
      event: 'pathfinder_sync_source_failures',
      failedSourceCount: 1,
      totalSourceCount: 2,
    }));
    expect(revalidateTagMock).toHaveBeenCalledWith('pathfinder-catalog-v2', { expire: 0 });
  });
});

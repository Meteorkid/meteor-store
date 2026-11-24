import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const {
  archiveMock,
  listMock,
  reviewMock,
  restoreMock,
  sourceMock,
  isAdminMock,
} = vi.hoisted(() => ({
  archiveMock: vi.fn(),
  listMock: vi.fn(),
  reviewMock: vi.fn(),
  restoreMock: vi.fn(),
  sourceMock: vi.fn(),
  isAdminMock: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  getSession: async () => ({ userId: 'admin-1', email: 'admin@example.com', emailVerified: true }),
}));

vi.mock('@/lib/admin', () => ({ isAdminSession: (...args: unknown[]) => isAdminMock(...args) }));
vi.mock('@/lib/admin-audit', () => ({ logAdminAction: vi.fn() }));
vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '203.0.113.1',
  rateLimit: async () => ({ limited: false }),
}));
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: (callback: (...args: unknown[]) => unknown) => callback,
}));
vi.mock('@/lib/pathfinder/admin-catalog', () => ({
  archivePathfinderItem: (...args: unknown[]) => archiveMock(...args),
  canAutoPublishPathfinderSource: () => false,
  listPathfinderAdminData: (...args: unknown[]) => listMock(...args),
  restorePathfinderItem: (...args: unknown[]) => restoreMock(...args),
  reviewPathfinderItem: (...args: unknown[]) => reviewMock(...args),
  updatePathfinderSource: (...args: unknown[]) => sourceMock(...args),
}));

function getRequest(query = ''): NextRequest {
  return new Request(`https://imagentx.top/api/admin/pathfinder${query}`) as unknown as NextRequest;
}

function patchRequest(body: Record<string, unknown>): NextRequest {
  return new Request('https://imagentx.top/api/admin/pathfinder', {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

describe('Pathfinder 管理接口', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isAdminMock.mockReturnValue(true);
    listMock.mockResolvedValue({ sources: [], staticItems: [], items: [], nextOffset: null });
    archiveMock.mockResolvedValue({
      id: 'pf_static_tombstone',
      titleZh: '已下架条目',
      titleEn: 'Archived item',
      canonicalUrl: 'https://example.com/item',
    });
    restoreMock.mockResolvedValue({
      id: 'pf_static_tombstone',
      titleZh: '恢复待审核条目',
      titleEn: 'Restored item',
      canonicalUrl: 'https://example.com/item',
    });
  });

  it('可检索下架状态并将条目受审计地恢复到待审核', async () => {
    const { GET, PATCH } = await import('../route');
    expect((await GET(getRequest('?status=archived&q=oist'))).status).toBe(200);
    expect(listMock).toHaveBeenCalledWith(expect.objectContaining({ status: 'archived', query: 'oist' }));

    const response = await PATCH(patchRequest({ action: 'restore', id: 'pf_static_tombstone' }));
    expect(response.status).toBe(200);
    expect(restoreMock).toHaveBeenCalledWith({ id: 'pf_static_tombstone', reviewerId: 'admin-1' });
  });

  it('分页与搜索参数会下推，旧于第 100 条的公开内容仍可达', async () => {
    const { GET } = await import('../route');
    const response = await GET(getRequest('?status=published&q=legacy&offset=100&limit=25'));

    expect(response.status).toBe(200);
    expect(listMock).toHaveBeenCalledWith({
      status: 'published',
      query: 'legacy',
      offset: 100,
      limit: 25,
    });
  });

  it('静态种子 ID 也可走统一紧急下架动作', async () => {
    const { PATCH } = await import('../route');
    const response = await PATCH(patchRequest({
      action: 'archive',
      id: 'static-oist-spring-2027',
    }));

    expect(response.status).toBe(200);
    expect(archiveMock).toHaveBeenCalledWith({
      id: 'static-oist-spring-2027',
      reviewerId: 'admin-1',
    });
  });

  it('单条发布必须提交管理员实际看到的内容版本；版本过期返回冲突', async () => {
    const { PATCH } = await import('../route');
    const request = { action: 'review', id: 'test-item', decision: 'published', learningEligible: false };
    expect((await PATCH(patchRequest(request))).status).toBe(400);
    reviewMock.mockResolvedValue(null);
    expect((await PATCH(patchRequest({ ...request, contentHash: 'seen-hash' }))).status).toBe(409);
    expect(reviewMock).toHaveBeenCalledWith(expect.objectContaining({ id: 'test-item', contentHash: 'seen-hash' }));
  });

  it('批量审核逐条传递其版本，只移除成功的条目', async () => {
    const { PATCH } = await import('../route');
    reviewMock.mockResolvedValueOnce({ id: 'one' }).mockResolvedValueOnce(null);
    const response = await PATCH(patchRequest({
      action: 'review-batch', ids: ['one', 'two'], contentHashes: { one: 'a', two: 'b' },
      decision: 'published', learningEligible: false,
    }));
    expect(reviewMock).toHaveBeenNthCalledWith(2, expect.objectContaining({ id: 'two', contentHash: 'b', batch: true }));
    expect(await response.json()).toMatchObject({ done: 1, failed: 1, doneIds: ['one'] });
  });

  it('非管理员在读取与写入时都只看到 404', async () => {
    isAdminMock.mockReturnValue(false);
    const { GET, PATCH } = await import('../route');

    expect((await GET(getRequest())).status).toBe(404);
    expect((await PATCH(patchRequest({ action: 'archive', id: 'static-react' }))).status).toBe(404);
    expect(listMock).not.toHaveBeenCalled();
    expect(archiveMock).not.toHaveBeenCalled();
  });
});

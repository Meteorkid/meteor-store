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

  it('非管理员在读取与写入时都只看到 404', async () => {
    isAdminMock.mockReturnValue(false);
    const { GET, PATCH } = await import('../route');

    expect((await GET(getRequest())).status).toBe(404);
    expect((await PATCH(patchRequest({ action: 'archive', id: 'static-react' }))).status).toBe(404);
    expect(listMock).not.toHaveBeenCalled();
    expect(archiveMock).not.toHaveBeenCalled();
  });
});

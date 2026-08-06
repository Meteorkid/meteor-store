import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '127.0.0.1',
  rateLimit: async () => ({ limited: false }),
}));

const getSession = vi.fn();
vi.mock('@/lib/auth', () => ({ getSession: () => getSession() }));

const getUserEntitlements = vi.fn();
vi.mock('@/lib/entitlements', () => ({
  getUserEntitlements: (...args: unknown[]) => getUserEntitlements(...args),
}));

const createSignedReleaseUrl = vi.fn();
vi.mock('@/lib/release-storage', () => ({
  createSignedReleaseUrl: (...args: unknown[]) => createSignedReleaseUrl(...args),
  publicReleaseUrl: (key: string) => `https://cdn.example.com/${key}`,
}));

/**
 * 产品目录用夹具而不是真实数据：门控与否是逐条配置的，
 * 测试不该跟着 products.ts 的商业调整一起红。
 */
const findProduct = vi.fn();
vi.mock('@/lib/products', () => ({ findProduct: (id: string) => findProduct(id) }));

const gatedProduct = {
  id: 'xnook',
  downloads: [
    { id: 'xnook-dmg', label: {}, icon: 'dmg', r2Key: 'releases/xnook/1.0.0/XNook.dmg', gated: true },
    { id: 'public-zip', label: {}, icon: 'zip', url: 'https://example.com/x.zip' },
    { id: 'broken', label: {}, icon: 'dmg', gated: true },
  ],
};

function get(productId: string, file: string): [NextRequest, { params: Promise<{ productId: string }> }] {
  const request = new Request(
    `https://www.imagentx.top/api/download/${productId}?file=${file}`,
  ) as unknown as NextRequest;
  return [request, { params: Promise.resolve({ productId }) }];
}

describe('安装包下载', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    findProduct.mockReturnValue(gatedProduct);
    getSession.mockResolvedValue({ userId: 'u1', email: 'a@b.com' });
    getUserEntitlements.mockResolvedValue([{ productId: 'xnook' }]);
    createSignedReleaseUrl.mockResolvedValue('https://r2.example.com/signed?sig=abc');
  });

  it('产品或下载条目不存在时 404', async () => {
    const { GET } = await import('../[productId]/route');

    const response = await GET(...get('xnook', 'nope'));

    expect(response.status).toBe(404);
  });

  it('公开条目直接跳外链，不需要登录', async () => {
    getSession.mockResolvedValue(null);
    const { GET } = await import('../[productId]/route');

    const response = await GET(...get('xnook', 'public-zip'));

    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://example.com/x.zip');
  });

  it('门控条目未登录时 401，不签发任何链接', async () => {
    getSession.mockResolvedValue(null);
    const { GET } = await import('../[productId]/route');

    const response = await GET(...get('xnook', 'xnook-dmg'));

    expect(response.status).toBe(401);
    expect(createSignedReleaseUrl).not.toHaveBeenCalled();
  });

  it('登录了但没有该产品授权时 403，不签发任何链接', async () => {
    getUserEntitlements.mockResolvedValue([{ productId: 'tollow' }]);
    const { GET } = await import('../[productId]/route');

    const response = await GET(...get('xnook', 'xnook-dmg'));

    expect(response.status).toBe(403);
    expect(createSignedReleaseUrl).not.toHaveBeenCalled();
  });

  it('有授权时签发短时效链接并 302，且禁止缓存', async () => {
    const { GET } = await import('../[productId]/route');

    const response = await GET(...get('xnook', 'xnook-dmg'));

    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://r2.example.com/signed?sig=abc');
    // 签名链接短时有效，被 CDN 缓存下来就等于把门控作废
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(createSignedReleaseUrl).toHaveBeenCalledWith(
      'releases/xnook/1.0.0/XNook.dmg',
      'XNook.dmg',
    );
  });

  it('标了门控却没配 r2Key 时拒绝，不回退到公开地址', async () => {
    const { GET } = await import('../[productId]/route');

    const response = await GET(...get('xnook', 'broken'));

    // 挂在公开外链上的「门控」是自欺欺人，宁可 503 也不能放行
    expect(response.status).toBe(503);
    expect(createSignedReleaseUrl).not.toHaveBeenCalled();
  });
});

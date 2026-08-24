import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

import { catalogItemFixture, profileFixture } from '@/lib/pathfinder/__tests__/fixtures';

const { listCatalogItemsMock } = vi.hoisted(() => ({
  listCatalogItemsMock: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn().mockResolvedValue({ limited: false, remaining: 5, resetAt: Date.now() }),
  getClientIp: vi.fn().mockReturnValue('127.0.0.1'),
}));

vi.mock('@/lib/pathfinder/catalog', () => ({
  listCatalogItems: listCatalogItemsMock,
}));

function makeRequest(body: unknown, pathname = '/api/pathfinder'): NextRequest {
  return new NextRequest(`https://example.com${pathname}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('Pathfinder 确定性路径 API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listCatalogItemsMock.mockResolvedValue([catalogItemFixture()]);
  });

  it('无需模型配置即可从已发布目录生成 4–8 周路径', async () => {
    const { POST } = await import('../route');
    const response = await POST(makeRequest({ profile: profileFixture }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.kind).toBe('plan');
    expect(data.source).toBe('deterministic');
    expect(data.plan.weeks).toHaveLength(profileFixture.durationWeeks);
    expect(data.plan.weeks[0].tasks[0].itemId).toBe('item-open-source');
    expect(listCatalogItemsMock).toHaveBeenCalledWith({
      direction: profileFixture.direction,
      learningEligible: true,
    });
  });

  it('新 `/api/pathfinder/plan` 路由使用同一确定性处理器', async () => {
    const { POST } = await import('../plan/route');
    const response = await POST(makeRequest({ profile: profileFixture }, '/api/pathfinder/plan'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.source).toBe('deterministic');
  });

  it('旧地址可接受新画像的 input 包装，但不再接收 BYOK 配置', async () => {
    const { POST } = await import('../route');
    const compatible = await POST(makeRequest({ input: profileFixture }));
    expect(compatible.status).toBe(200);

    const byok = await POST(makeRequest({
      profile: profileFixture,
      modelConfig: { apiKey: 'secret', baseUrl: 'https://example.com', model: 'model' },
    }));
    expect(byok.status).toBe(400);
    expect((await byok.json()).error.code).toBe('BYOK_REMOVED');
  });

  it('危机目标优先返回本地安全引导且不读取目录', async () => {
    const { POST } = await import('../route');
    const response = await POST(makeRequest({
      profile: { goal: '我最近想自杀' },
    }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.kind).toBe('safety');
    expect(JSON.stringify(data)).toContain('12356');
    expect(listCatalogItemsMock).not.toHaveBeenCalled();
  });

  it('非法画像返回 400，不查询目录', async () => {
    const { POST } = await import('../route');
    const response = await POST(makeRequest({ profile: { goal: '学 AI' } }));

    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe('INVALID_REQUEST');
    expect(listCatalogItemsMock).not.toHaveBeenCalled();
  });

  it('在 JSON 解析前拒绝超过 32KB 的请求体', async () => {
    const { POST } = await import('../route');
    const response = await POST(new NextRequest('https://example.com/api/pathfinder', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ profile: { ...profileFixture, goal: 'x'.repeat(33 * 1024) } }),
    }));

    expect(response.status).toBe(413);
    expect((await response.json()).error.code).toBe('PAYLOAD_TOO_LARGE');
    expect(listCatalogItemsMock).not.toHaveBeenCalled();
  });

  it('目录没有合格资源时返回 422，不编造路径', async () => {
    listCatalogItemsMock.mockResolvedValue([]);
    const { POST } = await import('../route');
    const response = await POST(makeRequest({ profile: profileFixture }));

    expect(response.status).toBe(422);
    expect((await response.json()).error.code).toBe('NO_ELIGIBLE_ITEMS');
  });
});

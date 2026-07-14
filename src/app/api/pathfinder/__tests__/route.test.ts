import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// 限流模块默认 fail-open，避免依赖 Redis
vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn().mockResolvedValue({ limited: false, remaining: 5, resetAt: Date.now() }),
  getClientIp: vi.fn().mockReturnValue('127.0.0.1'),
}));

// 不发起真实网络请求
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

async function importRoute() {
  vi.resetModules();
  return await import('../route');
}

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('https://example.com/api/pathfinder', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** 构造合法的普通输入 */
function normalInput() {
  return {
    goal: '用手机学会 Python 入门，4 周做出小作品',
    stage: '高中',
    device: '仅手机',
    weeklyHours: 7,
    dailyMinutes: 30,
    budget: 0,
    hasMentor: false,
    network: '普通网络',
    constraints: ['时间碎片化'],
  };
}

function modelConfig() {
  return {
    apiKey: 'sk-user-owned-key',
    baseUrl: 'https://api.deepseek.com',
    model: 'test-model',
  };
}

describe('POST /api/pathfinder 危机优先级', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('危机输入在模型配置完全缺失时也返回本地引导结果，不调用模型', async () => {
    const { POST } = await importRoute();
    const req = makeRequest({ input: { ...normalInput(), goal: '我最近想自杀' } });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.source).toBe('fallback');
    expect(data.plan.summary).toContain('12356');
    // 不调用模型
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('危机文案不含已废弃的 400-161-9995 与"24 小时/免费/保密"承诺', async () => {
    const { POST } = await importRoute();
    const req = makeRequest({ input: { ...normalInput(), goal: '被同学霸凌不敢说' } });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    const allText = JSON.stringify(data.plan);
    expect(allText).not.toContain('400-161-9995');
    expect(allText).not.toMatch(/24 小时/);
    expect(allText).not.toMatch(/免费保密/);
    // 应包含新热线与紧急号码
    expect(allText).toContain('12356');
    expect(allText).toMatch(/110|120/);
  });

  it('普通输入缺少用户配置时返回 400，不读取服务端环境变量', async () => {
    process.env.PATHFINDER_API_KEY = 'legacy-key-should-not-be-used';
    process.env.PATHFINDER_BASE_URL = 'https://legacy.example.com/v1';
    process.env.PATHFINDER_MODEL = 'legacy-model';
    const { POST } = await importRoute();
    const req = makeRequest({ input: normalInput() });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.code).toBe('MODEL_CONFIG_REQUIRED');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('普通输入仅使用请求中提供的用户配置调用模型', async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify({
        summary: '说明',
        todaySteps: ['a', 'b', 'c'],
        weekPlan: [{ day: 1, title: '任务', minutes: 20, cost: 0, device: '手机', network: '普通', evidence: '笔记' }],
        resourceIds: ['python-docs-zh'],
        encouragement: '加油',
      }) } }],
    }), { status: 200 }));
    const { POST } = await importRoute();
    const res = await POST(makeRequest({ input: normalInput(), modelConfig: modelConfig() }));

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.deepseek.com/chat/completions',
      expect.objectContaining({
        redirect: 'error',
        headers: expect.objectContaining({ Authorization: 'Bearer sk-user-owned-key' }),
      }),
    );
  });

  it('非法输入（缺字段）返回 400，不进入危机或模型流程', async () => {
    const { POST } = await importRoute();
    const req = makeRequest({ input: { stage: '高中' } }); // 缺 goal 等字段
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

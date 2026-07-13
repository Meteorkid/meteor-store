import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  buildSystemPrompt,
  buildUserPrompt,
  parseModelOutput,
  buildFallbackPlan,
  generatePlan,
} from '../generate-plan';
import {
  PathfinderInputSchema,
  looksLikeCrisis,
} from '../schema';
import { RESOURCE_IDS } from '@/data/pathfinder-resources';

// 构造合法输入
function makeInput(overrides: Partial<Record<string, unknown>> = {}) {
  const base = {
    goal: '用手机学会 Python 入门，4 周做出小作品',
    stage: '高中',
    device: '仅手机',
    weeklyHours: 7,
    network: '流量有限',
    constraints: ['时间碎片化', '基础薄弱'],
  };
  return PathfinderInputSchema.parse({ ...base, ...overrides });
}

const validConfig = {
  apiKey: 'sk-test',
  baseUrl: 'https://api.example.com/v1',
  model: 'test-model',
};

describe('buildSystemPrompt', () => {
  it('包含资源 id 列表与危机处理规则', () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain('输出规则');
    expect(prompt).toContain('危机处理');
    // 所有资源 id 都应被列在系统提示词中
    for (const id of RESOURCE_IDS) {
      expect(prompt).toContain(id);
    }
  });
});

describe('buildUserPrompt', () => {
  it('包含用户填写的全部条件', () => {
    const input = makeInput();
    const prompt = buildUserPrompt(input);
    expect(prompt).toContain(input.goal);
    expect(prompt).toContain(input.stage);
    expect(prompt).toContain(input.device);
    expect(prompt).toContain(`${input.weeklyHours} 小时`);
    expect(prompt).toContain(input.network);
    for (const c of input.constraints) {
      expect(prompt).toContain(c);
    }
  });
});

describe('parseModelOutput', () => {
  it('解析合法 JSON 输出', () => {
    const raw = JSON.stringify({
      summary: '本周先建立学习节奏',
      todaySteps: ['步骤一', '步骤二', '步骤三'],
      weekPlan: [{ day: 1, title: '任务', minutes: 30 }],
      resourceIds: ['python-docs-zh', 'mdn-web-docs'],
      encouragement: '加油',
    });
    const result = parseModelOutput(raw);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.plan.summary).toBe('本周先建立学习节奏');
      expect(result.plan.todaySteps).toHaveLength(3);
    }
  });

  it('剥离 markdown 代码块包裹', () => {
    const raw = '```json\n' + JSON.stringify({
      summary: '说明',
      todaySteps: ['a', 'b', 'c'],
      weekPlan: [{ day: 1, title: 't', minutes: 20 }],
      resourceIds: ['python-docs-zh'],
      encouragement: '加油',
    }) + '\n```';
    const result = parseModelOutput(raw);
    expect(result.ok).toBe(true);
  });

  it('拒绝非法 JSON', () => {
    const result = parseModelOutput('not a json');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/invalid json/i);
    }
  });

  it('拒绝缺字段的结构', () => {
    const result = parseModelOutput(JSON.stringify({ summary: '缺少其他字段' }));
    expect(result.ok).toBe(false);
  });

  it('拒绝全部不存在的资源 id', () => {
    const raw = JSON.stringify({
      summary: '说明',
      todaySteps: ['a', 'b', 'c'],
      weekPlan: [{ day: 1, title: 't', minutes: 20 }],
      resourceIds: ['fake-id-1', 'fake-id-2'],
      encouragement: '加油',
    });
    const result = parseModelOutput(raw);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/no valid resource/i);
    }
  });

  it('过滤掉非法 id 但保留合法 id', () => {
    const raw = JSON.stringify({
      summary: '说明',
      todaySteps: ['a', 'b', 'c'],
      weekPlan: [{ day: 1, title: 't', minutes: 20 }],
      resourceIds: ['python-docs-zh', 'fake-id', 'mdn-web-docs'],
      encouragement: '加油',
    });
    const result = parseModelOutput(raw);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.plan.resourceIds).toEqual(['python-docs-zh', 'mdn-web-docs']);
    }
  });
});

describe('buildFallbackPlan', () => {
  it('根据设备与网络条件生成兜底路径', () => {
    const input = makeInput({ device: '仅手机', network: '流量有限' });
    const plan = buildFallbackPlan(input);
    // 兜底明确标注为"基础路径模式"
    expect(plan.summary).toContain('基础路径模式');
    expect(plan.todaySteps).toHaveLength(3);
    expect(plan.weekPlan).toHaveLength(7);
    // 流量有限应优先低带宽资源
    expect(plan.resourceIds).toContain('python-docs-zh');
  });

  it('稳定网络时包含交互式资源', () => {
    const input = makeInput({ network: '稳定网络' });
    const plan = buildFallbackPlan(input);
    expect(plan.resourceIds).toContain('w3schools');
  });

  it('每日时长随每周小时数缩放且在合理区间', () => {
    const lowInput = makeInput({ weeklyHours: 2 });
    const highInput = makeInput({ weeklyHours: 20 });
    const low = buildFallbackPlan(lowInput);
    const high = buildFallbackPlan(highInput);
    expect(low.weekPlan[0].minutes).toBeGreaterThanOrEqual(15);
    expect(high.weekPlan[0].minutes).toBeLessThanOrEqual(90);
    expect(high.weekPlan[0].minutes).toBeGreaterThanOrEqual(low.weekPlan[0].minutes);
  });
});

describe('looksLikeCrisis', () => {
  it('命中危机关键词时返回 true', () => {
    expect(looksLikeCrisis('我最近想自杀')).toBe(true);
    expect(looksLikeCrisis('被同学霸凌不敢说')).toBe(true);
  });

  it('正常学习目标返回 false', () => {
    expect(looksLikeCrisis('学 Python 入门')).toBe(false);
  });
});

describe('generatePlan', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('危机输入不调用模型，直接返回引导性结果', async () => {
    const input = makeInput({ goal: '我最近想自杀，不知道怎么办' });
    const result = await generatePlan(input, validConfig, { runtime: 'production' });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.source).toBe('fallback');
      // 应包含新热线 12356 与紧急号码
      expect(result.plan.summary).toContain('12356');
      expect(result.plan.summary).toMatch(/110|120/);
      // 不应包含已废弃热线或夸大承诺
      expect(result.plan.summary).not.toContain('400-161-9995');
      expect(result.plan.summary).not.toMatch(/24 小时|免费保密/);
      // 不应包含诊断
      expect(result.plan.summary).not.toMatch(/抑郁症|治疗方案/);
    }
  });

  it('模型解析失败时，开发环境返回兜底', async () => {
    const input = makeInput();
    const result = await generatePlan(input, {
      ...validConfig,
      baseUrl: 'https://invalid.example.invalid',
    }, { runtime: 'development' });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.source).toBe('fallback');
      expect(result.plan.summary).toContain('基础路径模式');
    }
  });

  it('模型解析失败时，生产环境返回错误', async () => {
    const input = makeInput();
    const result = await generatePlan(input, {
      ...validConfig,
      baseUrl: 'https://invalid.example.invalid',
    }, { runtime: 'production' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/模型服务|路径生成/);
    }
  });
});

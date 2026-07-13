/**
 * Meteor Pathfinder 学习路径生成核心
 *
 * 职责：
 * 1. 构建发送给模型的系统提示词与用户提示词；
 * 2. 调用兼容 OpenAI Chat Completions 的接口（仅服务端）；
 * 3. 解析模型输出为固定 JSON 结构，校验合法性；
 * 4. 模型不可用或解析失败时，在开发环境返回明确标注的"基础路径模式"兜底结果，
 *    生产环境返回错误，绝不伪装为 AI 生成。
 */

import {
  PathfinderInput,
  PathfinderPlan,
  PathfinderPlanSchema,
  looksLikeCrisis,
} from './schema';
import { RESOURCE_IDS, resolveResources } from '@/data/pathfinder-resources';

/** 模型调用需要的配置 */
export interface ModelConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

/** 生成结果：成功 */
export interface GenerateOk {
  ok: true;
  plan: PathfinderPlan;
  /** 实际产出方式：模型 or 兜底 */
  source: 'model' | 'fallback';
}

/** 生成结果：失败 */
export interface GenerateErr {
  ok: false;
  error: string;
  /** 用于排查问题但不暴露给前端的内部信息 */
  detail?: string;
}

export type GenerateResult = GenerateOk | GenerateErr;

/** 系统提示词，约束模型输出与边界 */
export function buildSystemPrompt(): string {
  return `你是一个面向资源不足学生的公益学习路径助手。

【输出规则】
1. 必须基于用户给出的现实约束（设备、时间、网络、限制）来生成路径。
2. 每项任务要小、明确、可验证，避免笼统的"努力学习"。
3. 资源只能从给定列表中选择 id，不要编造 URL、机构或政策。
4. 优先选择免费、低带宽、手机可访问的资源。
5. 不作升学、就业、医疗或心理诊断承诺。

【危机处理】
若用户输入疑似涉及伤害自己、被霸凌、心理危机或医疗问题，
不要进行诊断或建议具体治疗方案，只在 summary 与 encouragement 中
建议联系可信任的成年人、学校心理老师或当地专业服务热线。

【输出格式】
只输出一个 JSON 对象，结构如下，不要任何额外文字或代码块标记：
{
  "summary": "整体路径说明，1-3 句话",
  "todaySteps": ["今天能做的第 1 件事", "第 2 件", "第 3 件"],
  "weekPlan": [
    { "day": 1, "title": "任务标题", "minutes": 30 }
  ],
  "resourceIds": ["资源 id 列表"],
  "encouragement": "一句鼓励"
}

【可选资源 id】
${RESOURCE_IDS.join(', ')}
`;
}

/** 用户提示词，拼接用户填写的条件 */
export function buildUserPrompt(input: PathfinderInput): string {
  return `我的目标：${input.goal}
当前阶段：${input.stage}
可用设备：${input.device}
每周可投入时间：${input.weeklyHours} 小时
网络条件：${input.network}
现实限制：${input.constraints.join('、')}

请基于以上条件，为我生成一份本周可执行的学习路径。`;
}

/**
 * 调用模型并解析输出
 *
 * @param input 用户输入（已通过 schema 校验）
 * @param config 模型配置
 * @param options.runtime 运行环境，决定兜底是否可见
 */
export async function generatePlan(
  input: PathfinderInput,
  config: ModelConfig,
  options: { runtime: 'development' | 'production' } = { runtime: 'production' },
): Promise<GenerateResult> {
  // 危机输入：不调用模型，直接返回引导性结果
  if (looksLikeCrisis(input.goal)) {
    return {
      ok: true,
      source: 'fallback',
      plan: buildCrisisPlan(),
    };
  }

  try {
    const raw = await callModel(input, config);
    const parsed = parseModelOutput(raw);
    if (parsed.ok) {
      return { ok: true, source: 'model', plan: parsed.plan };
    }
    // 解析失败：开发环境给兜底，生产环境报错
    if (options.runtime === 'development') {
      return {
        ok: true,
        source: 'fallback',
        plan: buildFallbackPlan(input),
      };
    }
    return {
      ok: false,
      error: '路径生成失败，请稍后重试或调整条件后重新生成。',
      detail: parsed.error,
    };
  } catch (err) {
    if (options.runtime === 'development') {
      return {
        ok: true,
        source: 'fallback',
        plan: buildFallbackPlan(input),
      };
    }
    return {
      ok: false,
      error: err instanceof DOMException && err.name === 'TimeoutError'
        ? '模型服务响应超时，请稍后重试。'
        : '模型服务暂时不可用，请稍后再试。',
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}

/** 实际调用兼容 OpenAI Chat Completions 的接口 */
async function callModel(input: PathfinderInput, config: ModelConfig): Promise<string> {
  const url = new URL('chat/completions', `${config.baseUrl.replace(/\/+$/, '')}/`).toString();
  const res = await fetch(url, {
    method: 'POST',
    redirect: 'error',
    signal: AbortSignal.timeout(15_000),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserPrompt(input) },
      ],
      temperature: 0.6,
      max_tokens: 1200,
    }),
  });

  if (!res.ok) {
    throw new Error(`model http ${res.status}`);
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('model empty content');
  }
  return content;
}

/** 解析模型输出，校验为固定结构 */
export function parseModelOutput(raw: string): { ok: true; plan: PathfinderPlan } | { ok: false; error: string } {
  // 提取 JSON：模型可能包裹在 ```json 代码块中
  const cleaned = extractJson(raw);
  let obj: unknown;
  try {
    obj = JSON.parse(cleaned);
  } catch (e) {
    return { ok: false, error: `invalid json: ${e instanceof Error ? e.message : 'parse error'}` };
  }

  const parsed = PathfinderPlanSchema.safeParse(obj);
  if (!parsed.success) {
    return { ok: false, error: `schema: ${parsed.error.issues.map((i) => i.path.join('.') + ':' + i.message).join('; ')}` };
  }

  // 过滤资源 id：只保留本地存在的
  const validResources = resolveResources(parsed.data.resourceIds);
  if (validResources.length === 0) {
    return { ok: false, error: 'no valid resource ids' };
  }

  return {
    ok: true,
    plan: { ...parsed.data, resourceIds: validResources.map((r) => r.id) },
  };
}

/** 从可能含 markdown 代码块的内容中提取 JSON */
function extractJson(raw: string): string {
  const trimmed = raw.trim();
  // ```json ... ``` 或 ``` ... ```
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  return trimmed;
}

/**
 * 开发环境兜底结果，明确标注为"基础路径模式"
 * 不在生产环境使用，避免伪装 AI 生成
 */
export function buildFallbackPlan(input: PathfinderInput): PathfinderPlan {
  const minutesPerDay = Math.max(15, Math.min(90, Math.round((input.weeklyHours * 60) / 7)));
  const isLowBandwidth = input.network === '流量有限';

  const todaySteps = [
    `打开手机浏览器，搜索与"${input.goal.slice(0, 12)}"相关的免费入门资料`,
    `用 10 分钟阅读第一篇文档的开头部分，记下一个不懂的词`,
    `把今天学到的 1 个新概念写在备忘录里，作为第一份学习记录`,
  ];

  const weekPlan = Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    title: `第 ${i + 1} 天：${input.goal.slice(0, 10)} 的入门练习`,
    minutes: minutesPerDay,
  }));

  // 兜底资源：优先低带宽
  const fallbackResourceIds = isLowBandwidth
    ? ['python-docs-zh', 'mdn-web-docs', 'free-programming-books']
    : ['python-docs-zh', 'w3schools', 'chinese-mooc'];

  return {
    summary: `[基础路径模式] 基于你每周 ${input.weeklyHours} 小时、${input.device} 的条件，先从免费入门资料开始，建立稳定的学习节奏。`,
    todaySteps,
    weekPlan,
    resourceIds: fallbackResourceIds.filter((id) => RESOURCE_IDS.includes(id)),
    encouragement: '资源有限也能开始第一步，今天写下的每行字都是路径的一部分。',
  };
}

/** 危机输入的引导性结果，不进行诊断 */
export function buildCrisisPlan(): PathfinderPlan {
  return {
    summary: `我在这里不做任何判断或诊断。如你正感到可能伤害自己，或面临即时危险，请立即联系身边可信任的成年人；紧急情况拨打 110 或 120。也可拨打全国统一心理援助热线 12356。`,
    todaySteps: [
      '现在找一个让你感到安全的人，告诉他你现在的感受',
      '如处于即时危险中，立即拨打 110 或 120',
      '今天尽量不独处，找一个能陪伴你的人或环境',
    ],
    weekPlan: [
      { day: 1, title: '联系一位信任的成年人，告诉他你的处境', minutes: 15 },
      { day: 2, title: '前往或联系学校心理咨询中心', minutes: 30 },
      { day: 3, title: '保持每天与可信任的人至少沟通一次', minutes: 15 },
    ],
    resourceIds: [],
    encouragement: '你不是一个人，向信任的成年人开口是最重要的一步。',
  };
}

export { resolveResources };

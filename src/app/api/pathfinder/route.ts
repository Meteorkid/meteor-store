import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import {
  PathfinderGenerateRequestSchema,
  looksLikeCrisis,
} from '@/lib/pathfinder/schema';
import { generatePlan, buildCrisisPlan } from '@/lib/pathfinder/generate-plan';
import { resolveResources } from '@/data/pathfinder-resources';

export const runtime = 'nodejs';

/**
 * POST /api/pathfinder
 * 接收表单输入，调用模型生成学习路径
 * 不记录用户完整输入到日志，仅记录错误摘要
 */
export async function POST(request: NextRequest) {
  // 限流：每 IP 每分钟最多 5 次生成请求
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`pathfinder:${ip}`, 5, 60_000, { fallback: 'memory' });
  if (limited) {
    return NextResponse.json(
      { error: '请求过于频繁，请稍后再试' },
      { status: 429 },
    );
  }

  // 解析与校验输入
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: '请求格式不正确' },
      { status: 400 },
    );
  }

  const parsed = PathfinderGenerateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  // 危机优先级最高：Zod 校验通过后立即识别危机关键词，
  // 即使模型配置缺失也返回本地安全引导结果，绝不调用模型
  if (looksLikeCrisis(parsed.data.input.goal)) {
    const plan = buildCrisisPlan();
    return NextResponse.json({
      plan,
      resources: resolveResources(plan.resourceIds),
      source: 'fallback' as const,
    });
  }

  // 普通输入必须使用用户本次提交的模型配置；不读取服务端环境变量。
  if (!parsed.data.modelConfig) {
    return NextResponse.json(
      {
        error: '请先在“模型配置”页面填写自己的 API Key、Base URL 和模型名称。',
        code: 'MODEL_CONFIG_REQUIRED',
      },
      { status: 400 },
    );
  }

  const runtime = process.env.NODE_ENV === 'production' ? 'production' : 'development';
  const result = await generatePlan(parsed.data.input, parsed.data.modelConfig, { runtime });

  if (!result.ok) {
    // 仅记录错误摘要，不写入用户输入
    console.error('pathfinder generate failed:', result.error);
    return NextResponse.json(
      { error: result.error },
      { status: 500 },
    );
  }

  // 将资源 id 映射为完整资源对象，再返回前端
  const resources = resolveResources(result.plan.resourceIds);
  return NextResponse.json({
    plan: result.plan,
    resources,
    source: result.source,
  });
}

import { NextRequest, NextResponse } from 'next/server';

import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { listCatalogItems } from './catalog';
import { buildPath } from './build-path';
import {
  buildSafetyResponse,
  looksLikeCrisis,
  PathfinderPlanRequestSchema,
  type PathfinderPlanResponse,
} from './schema';

type JsonObject = Record<string, unknown>;
const MAX_PLAN_REQUEST_BYTES = 32 * 1024;

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizedRequestBody(body: unknown): unknown {
  if (!isObject(body) || 'profile' in body) return body;

  // `/api/pathfinder` 的旧地址可继续接受 `input` 包装，但 input 本身必须符合新画像契约。
  if (isObject(body.input)) {
    return {
      profile: body.input,
      preferredItemId: body.preferredItemId,
      locale: body.locale,
    };
  }
  return body;
}

function extractGoal(body: unknown): string | null {
  if (!isObject(body)) return null;
  if (isObject(body.profile) && typeof body.profile.goal === 'string') {
    return body.profile.goal;
  }
  if (isObject(body.input) && typeof body.input.goal === 'string') {
    return body.input.goal;
  }
  return null;
}

function extractLocale(body: unknown): 'zh' | 'en' {
  return isObject(body) && body.locale === 'en' ? 'en' : 'zh';
}

async function readLimitedJson(request: Request): Promise<
  | { ok: true; value: unknown }
  | { ok: false; reason: 'invalid' | 'too_large' }
> {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_PLAN_REQUEST_BYTES) {
    return { ok: false, reason: 'too_large' };
  }
  if (!request.body) return { ok: false, reason: 'invalid' };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_PLAN_REQUEST_BYTES) {
        await reader.cancel().catch(() => undefined);
        return { ok: false, reason: 'too_large' };
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return { ok: true, value: JSON.parse(new TextDecoder().decode(bytes)) as unknown };
  } catch {
    return { ok: false, reason: 'invalid' };
  }
}

export async function handlePathfinderPlanPost(request: NextRequest) {
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`pathfinder-plan:${ip}`, 5, 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json(
      { error: { code: 'RATE_LIMITED', message: '请求过于频繁，请稍后再试' } },
      { status: 429 },
    );
  }

  const parsedBody = await readLimitedJson(request);
  if (!parsedBody.ok) {
    if (parsedBody.reason === 'too_large') {
      return NextResponse.json(
        { error: { code: 'PAYLOAD_TOO_LARGE', message: '请求内容过大' } },
        { status: 413 },
      );
    }
    return NextResponse.json(
      { error: { code: 'INVALID_JSON', message: '请求格式不正确' } },
      { status: 400 },
    );
  }
  const body = parsedBody.value;

  const locale = extractLocale(body);
  const goal = extractGoal(body);
  if (goal && looksLikeCrisis(goal)) {
    return NextResponse.json(buildSafetyResponse(locale));
  }

  if (isObject(body) && 'modelConfig' in body) {
    return NextResponse.json(
      {
        error: {
          code: 'BYOK_REMOVED',
          message: locale === 'zh'
            ? '路径生成已不再接收 API Key 或模型配置。'
            : 'Path generation no longer accepts API keys or model configuration.',
        },
      },
      { status: 400 },
    );
  }

  const parsed = PathfinderPlanRequestSchema.safeParse(normalizedRequestBody(body));
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: 'INVALID_REQUEST',
          message: locale === 'zh'
            ? parsed.error.issues[0]?.message ?? '请求参数不正确'
            : 'The student profile is incomplete or invalid.',
        },
      },
      { status: 400 },
    );
  }

  try {
    const items = await listCatalogItems({
      direction: parsed.data.profile.direction,
      learningEligible: true,
    });
    const result = buildPath(parsed.data.profile, items, {
      now: new Date(),
      locale: parsed.data.locale,
      preferredItemId: parsed.data.preferredItemId,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: { code: result.code, message: result.message } },
        { status: 422 },
      );
    }

    const response: PathfinderPlanResponse = {
      kind: 'plan' as const,
      source: 'deterministic' as const,
      plan: result.plan,
    };
    return NextResponse.json(response);
  } catch (error) {
    // 不记录用户画像或目标文本，只保留内部错误摘要。
    console.error('[pathfinder] 构建确定性路径失败', error);
    return NextResponse.json(
      {
        error: {
          code: 'PLAN_BUILD_FAILED',
          message: locale === 'zh'
            ? '路径暂时无法生成，请稍后再试。'
            : 'The path could not be generated right now. Please try again later.',
        },
      },
      { status: 500 },
    );
  }
}

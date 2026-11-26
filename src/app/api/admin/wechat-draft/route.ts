import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdminSession } from '@/lib/admin';
import { logAdminAction } from '@/lib/admin-audit';
import { getSession } from '@/lib/auth';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { WechatMpConfigError, WechatMpError } from '@/lib/wechat-mp/client';
import { createWechatDraft } from '@/lib/wechat-mp/draft';

/**
 * 把站内内容同步到微信公众号草稿箱。
 *
 * 只创建草稿，不调用 freepublish/submit：个人主体订阅号自 2025 年 7 月起
 * 已被回收发布接口权限，最后一步必须人工在公众号后台点「发表」。
 * 请求从应用服务器发出，因此只需把服务器固定公网 IP 加进一次白名单。
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_BODY_BYTES = 128 * 1024;

const SourceSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('post'), postId: z.string().min(1).max(200) }).strict(),
  z.object({
    kind: z.literal('markdown'),
    markdown: z.string().min(1).max(100_000),
    title: z.string().max(200).optional(),
    author: z.string().max(100).optional(),
    digest: z.string().max(500).optional(),
    sourceUrl: z.string().max(2000).optional(),
  }).strict(),
  z.object({ kind: z.literal('daily'), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }).strict(),
]);

const OverridesSchema = z.object({
  title: z.string().max(200).optional(),
  author: z.string().max(100).optional(),
  digest: z.string().max(500).optional(),
  sourceUrl: z.string().max(2000).optional(),
}).strict();

const BodySchema = z.object({
  source: SourceSchema,
  dryRun: z.boolean().default(false),
  cover: z.string().max(2000).optional(),
  overrides: OverridesSchema.optional(),
}).strict();

function privateJson(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

/** 解析前流式计数，避免超长 Markdown 被无上限缓冲 */
async function readBody(request: Request): Promise<unknown> {
  if (!request.body) return null;
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return privateJson({ error: 'Not found' }, 404);

  const csrf = assertMatchingOrigin(request);
  if (csrf) return csrf;

  const ip = getClientIp(request);
  const { limited } = await rateLimit(`admin-wechat-draft:${session.userId}:${ip}`, 10, 60_000, {
    fallback: 'memory',
  });
  if (limited) return privateJson({ error: '操作过于频繁，请稍后再试' }, 429);

  const parsed = BodySchema.safeParse(await readBody(request));
  if (!parsed.success) return privateJson({ error: '参数无效或正文过长' }, 400);

  try {
    const result = await createWechatDraft({
      source: parsed.data.source,
      dryRun: parsed.data.dryRun,
      publish: false,
      cover: parsed.data.cover,
      overrides: parsed.data.overrides,
    });
    await logAdminAction(session, {
      action: result.mode === 'created' ? 'wechat-draft.create' : 'wechat-draft.preview',
      targetType: 'wechat-draft',
      targetId: result.mediaId ?? parsed.data.source.kind,
      detail: {
        source: parsed.data.source.kind,
        sourceKey: parsed.data.source.kind === 'daily' ? `daily:${parsed.data.source.date}` : null,
        title: result.title,
        imageCount: result.imageSources.length,
        dryRun: result.mode === 'preview',
      },
      ip,
    });
    return privateJson({ result }, result.mode === 'created' ? 201 : 200);
  } catch (error) {
    if (error instanceof WechatMpError) {
      return privateJson(
        {
          error: error.message,
          errorCode: String(error.code),
          hint: error.hint ?? null,
        },
        error instanceof WechatMpConfigError ? 503 : 400,
      );
    }
    console.error('wechat draft failed:', error);
    return privateJson({ error: '创建草稿失败，请稍后重试' }, 500);
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { isAdminSession } from '@/lib/admin';
import { logAdminAction } from '@/lib/admin-audit';
import { getSession } from '@/lib/auth';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import {
  composeXiaohongshuNote,
  XiaohongshuSourceError,
} from '@/lib/xiaohongshu/compose';
import {
  normalizeXhsTags,
  validateXhsNote,
  hasBlockingIssues,
  XHS_BODY_LIMIT,
  XHS_IMAGE_LIMIT,
  XHS_TAG_LIMIT,
  XHS_TITLE_LIMIT,
} from '@/lib/xiaohongshu/limits';
import {
  createXiaohongshuNote,
  deleteXiaohongshuNote,
  listXiaohongshuNotes,
  updateXiaohongshuNote,
} from '@/lib/xiaohongshu/service';
import type { XiaohongshuNoteInput } from '@/lib/xiaohongshu/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_BODY_BYTES = 128 * 1024;

const GenerateSourceSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('daily'), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }).strict(),
  z.object({ kind: z.literal('post'), postId: z.string().min(1).max(200) }).strict(),
  z.object({ kind: z.literal('manual') }).strict(),
]);

const GenerateSchema = z.object({
  action: z.literal('generate'),
  source: GenerateSourceSchema,
}).strict();

const NoteSchema = z.object({
  title: z.string().refine((value) => Array.from(value).length <= XHS_TITLE_LIMIT, `标题需在 ${XHS_TITLE_LIMIT} 字以内`),
  body: z.string().refine((value) => Array.from(value).length <= XHS_BODY_LIMIT, `正文需在 ${XHS_BODY_LIMIT} 字以内`),
  tags: z.array(z.string().max(24)).max(XHS_TAG_LIMIT),
  images: z.array(z.string().max(2000)).max(XHS_IMAGE_LIMIT),
  sourceKind: z.enum(['daily', 'post', 'manual']),
  sourceRef: z.string().max(300).nullable(),
  sourceUrl: z.string().max(2000).nullable(),
  status: z.enum(['draft', 'ready', 'published']),
  publishedUrl: z.string().max(2000).nullable().default(null),
}).strict();

const SaveSchema = z.object({
  action: z.literal('save'),
  id: z.string().min(1).max(100).optional(),
  expectedUpdatedAt: z.string().datetime({ offset: true }).optional(),
  note: NoteSchema,
}).strict().superRefine((value, context) => {
  if (value.id && !value.expectedUpdatedAt) {
    context.addIssue({
      code: 'custom',
      path: ['expectedUpdatedAt'],
      message: '更新已有笔记时必须带版本时间',
    });
  }
  if (value.note.sourceKind === 'daily' && value.note.sourceRef && !/^\d{4}-\d{2}-\d{2}$/.test(value.note.sourceRef)) {
    context.addIssue({ code: 'custom', path: ['note', 'sourceRef'], message: '日刊来源日期格式不正确' });
  }
});

const DeleteSchema = z.object({
  action: z.literal('delete'),
  id: z.string().min(1).max(100),
  expectedUpdatedAt: z.string().datetime({ offset: true }),
}).strict();

const ActionSchema = z.discriminatedUnion('action', [GenerateSchema, SaveSchema, DeleteSchema]);

function privateJson(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function failure(code: string, status: number, extra?: Record<string, unknown>): NextResponse {
  return privateJson({
    error: code === 'not_found' ? 'Not found' : code,
    errorCode: code,
    ...(extra ?? {}),
  }, status);
}

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

function isAllowedImageUrl(value: string): boolean {
  return value.startsWith('https://') || value.startsWith('/');
}

/** 发布链接只接受 https，避免 javascript: / data: 进入可点击链接。 */
function normalizePublishedUrl(value: string | null | undefined): string | null | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return /^https:\/\/[^\s]+$/i.test(trimmed) ? trimmed : undefined;
}

function auditDetail(note: XiaohongshuNoteInput, id?: string) {
  return {
    id: id ?? null,
    status: note.status,
    sourceKind: note.sourceKind,
    sourceRef: note.sourceRef,
    title: note.title,
    tagCount: note.tags.length,
    imageCount: note.images.length,
    hasPublishedUrl: Boolean(note.publishedUrl),
  };
}

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return failure('not_found', 404);
  try {
    return privateJson({ notes: await listXiaohongshuNotes() });
  } catch (error) {
    console.error('xiaohongshu note list failed:', error);
    if (isMissingTable(error)) return failure('schema_missing', 503);
    return failure('load_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return failure('not_found', 404);

  const csrf = assertMatchingOrigin(request);
  if (csrf) return csrf;

  const ip = getClientIp(request);
  const parsed = ActionSchema.safeParse(await readBody(request));
  if (!parsed.success) return failure('invalid', 400);

  const action = parsed.data.action;
  const limit = action === 'generate' ? 10 : action === 'save' ? 30 : 10;
  const { limited } = await rateLimit(
    `admin-xiaohongshu:${action}:${session.userId}:${ip}`,
    limit,
    60_000,
    { fallback: 'memory' },
  );
  if (limited) return failure('rate_limited', 429);

  try {
    if (parsed.data.action === 'generate') {
      const draft = await composeXiaohongshuNote(parsed.data.source);
      const issues = validateXhsNote({ ...draft, status: 'draft' });
      await logAdminAction(session, {
        action: 'xiaohongshu.generate',
        targetType: 'xiaohongshu-note',
        targetId: parsed.data.source.kind === 'daily' ? parsed.data.source.date : parsed.data.source.kind === 'post' ? parsed.data.source.postId : 'manual',
        detail: auditDetail(draft),
        ip,
      });
      return privateJson({ draft, issues });
    }

    if (parsed.data.action === 'delete') {
      const deleted = await deleteXiaohongshuNote(parsed.data.id, parsed.data.expectedUpdatedAt);
      if (!deleted) return failure('conflict', 409);
      await logAdminAction(session, {
        action: 'xiaohongshu.delete',
        targetType: 'xiaohongshu-note',
        targetId: parsed.data.id,
        detail: { id: parsed.data.id },
        ip,
      });
      return privateJson({ success: true });
    }

    const tags = normalizeXhsTags(parsed.data.note.tags);
    const publishedUrl = normalizePublishedUrl(parsed.data.note.publishedUrl);
    if (publishedUrl === undefined) return failure('invalid_published_url', 400);
    const note: XiaohongshuNoteInput = {
      ...parsed.data.note,
      tags,
      publishedUrl: parsed.data.note.status === 'published' ? publishedUrl : null,
    };
    const imagesValid = note.images.every(isAllowedImageUrl);
    if (!imagesValid) return failure('invalid_image', 400);

    const issues = validateXhsNote({ ...note, status: note.status });
    if (hasBlockingIssues(issues)) {
      return failure('invalid_note', 400, { issues });
    }

    const saved = parsed.data.id
      ? await updateXiaohongshuNote(parsed.data.id, parsed.data.expectedUpdatedAt!, note)
      : await createXiaohongshuNote(note);
    if (!saved) return failure('conflict', 409);
    await logAdminAction(session, {
      action: 'xiaohongshu.save',
      targetType: 'xiaohongshu-note',
      targetId: saved.id,
      detail: auditDetail(note, saved.id),
      ip,
    });
    return privateJson({ note: saved, issues }, parsed.data.id ? 200 : 201);
  } catch (error) {
    if (error instanceof XiaohongshuSourceError) {
      return failure(error.code, 400, { message: error.message });
    }
    console.error('xiaohongshu action failed:', error);
    if (isMissingTable(error)) return failure('schema_missing', 503);
    return failure('action_failed', 500);
  }
}

function isMissingTable(error: unknown): boolean {
  return Boolean(
    error
    && typeof error === 'object'
    && 'code' in error
    && (error as { code?: string }).code === '42P01',
  );
}

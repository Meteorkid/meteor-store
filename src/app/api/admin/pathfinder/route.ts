import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { logAdminAction } from '@/lib/admin-audit';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import {
  archivePathfinderItem,
  canAutoPublishPathfinderSource,
  listPathfinderAdminData,
  restorePathfinderItem,
  reviewPathfinderItem,
  updatePathfinderSource,
} from '@/lib/pathfinder/admin-catalog';
import { PATHFINDER_CATALOG_CACHE_TAG } from '@/lib/pathfinder/catalog';

const ReviewSchema = z.object({
  action: z.literal('review'),
  id: z.string().min(1).max(100),
  decision: z.enum(['published', 'rejected']),
  learningEligible: z.boolean(),
});

/**
 * 批量审核。
 *
 * 逐条点在几十条待办面前不现实——一次同步就可能带进来几十条新条目。
 * 上限 50：请求要在网关超时前返回，而且一次批太多会让「人工过一眼」
 * 退化成走过场，那正是这条流程要防的事。
 */
const ReviewBatchSchema = z.object({
  action: z.literal('review-batch'),
  ids: z.array(z.string().min(1).max(100)).min(1).max(50),
  decision: z.enum(['published', 'rejected']),
  learningEligible: z.boolean(),
});

const SourceSchema = z.object({
  action: z.literal('source'),
  id: z.string().min(1).max(100),
  enabled: z.boolean().optional(),
  autoPublish: z.boolean().optional(),
});

const ArchiveSchema = z.object({
  action: z.literal('archive'),
  id: z.string().min(1).max(160),
});

const RestoreSchema = z.object({
  action: z.literal('restore'),
  id: z.string().min(1).max(160),
});

const ListQuerySchema = z.object({
  status: z.enum(['pending', 'published', 'stale', 'expired', 'archived']).default('pending'),
  q: z.string().trim().max(160).optional(),
  offset: z.coerce.number().int().min(0).max(100_000).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(30),
});

const PatchSchema = z.discriminatedUnion('action', [ReviewSchema, ReviewBatchSchema, SourceSchema, ArchiveSchema, RestoreSchema]).superRefine((value, context) => {
  if (value.action === 'source' && value.enabled === undefined && value.autoPublish === undefined) {
    context.addIssue({ code: 'custom', message: '没有需要更新的字段' });
  }
});

function notFound() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return notFound();
  const parsed = ListQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return NextResponse.json({ error: '查询参数无效' }, { status: 400 });
  try {
    return NextResponse.json(await listPathfinderAdminData({
      status: parsed.data.status,
      query: parsed.data.q,
      offset: parsed.data.offset,
      limit: parsed.data.limit,
    }));
  } catch (error) {
    console.error('Pathfinder admin list failed:', error);
    return NextResponse.json({ error: '读取目录失败' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return notFound();
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`admin-pathfinder:${ip}`, 40, 60_000, { fallback: 'memory' });
  if (limited) return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
  const parsed = PatchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? '参数无效' }, { status: 400 });
  }

  if (
    parsed.data.action === 'source'
    && parsed.data.autoPublish === true
    && !canAutoPublishPathfinderSource(parsed.data.id)
  ) {
    return NextResponse.json({ error: '该来源必须人工审核，不能开启自动发布' }, { status: 400 });
  }

  if (parsed.data.action === 'review') {
    const item = await reviewPathfinderItem({
      id: parsed.data.id,
      reviewerId: session.userId,
      decision: parsed.data.decision,
      learningEligible: parsed.data.learningEligible,
    });
    if (!item) {
      return NextResponse.json({ error: '条目已被处理或不存在' }, { status: 409 });
    }
    await logAdminAction(session, {
      action: `pathfinder.item.${parsed.data.decision}`,
      targetType: 'pathfinder-item',
      targetId: item.id,
      detail: {
        title: item.titleZh || item.titleEn,
        learningEligible: item.learningEligible,
        canonicalUrl: item.canonicalUrl,
      },
      ip,
    });
    invalidatePathfinderCatalog();
    return NextResponse.json({ item });
  }

  if (parsed.data.action === 'review-batch') {
    const done: string[] = [];
    const failed: string[] = [];
    // 串行、逐条走与单条审核完全相同的路径：条件更新防并发、每条都写审计日志。
    // 图省事直接写一条批量 UPDATE 的话，两个管理员同时点会重复处理，
    // 而且审计里只剩一条「批量」记录，事后查不出具体动了哪些条目
    for (const id of parsed.data.ids) {
      const item = await reviewPathfinderItem({
        id,
        reviewerId: session.userId,
        decision: parsed.data.decision,
        learningEligible: parsed.data.learningEligible,
      });
      if (!item) { failed.push(id); continue; }
      await logAdminAction(session, {
        action: `pathfinder.item.${parsed.data.decision}`,
        targetType: 'pathfinder-item',
        targetId: item.id,
        detail: {
          title: item.titleZh || item.titleEn,
          learningEligible: item.learningEligible,
          canonicalUrl: item.canonicalUrl,
          batch: true,
        },
        ip,
      });
      done.push(item.id);
    }
    if (done.length > 0) invalidatePathfinderCatalog();
    // 部分失败要如实返回：全成功才 ok，否则界面要说清楚少了几条
    return NextResponse.json({ done: done.length, failed: failed.length });
  }

  if (parsed.data.action === 'archive') {
    const item = await archivePathfinderItem({ id: parsed.data.id, reviewerId: session.userId });
    if (!item) return NextResponse.json({ error: '条目已被处理或不存在' }, { status: 409 });
    await logAdminAction(session, {
      action: 'pathfinder.item.archived',
      targetType: 'pathfinder-item',
      targetId: item.id,
      detail: { title: item.titleZh || item.titleEn, canonicalUrl: item.canonicalUrl },
      ip,
    });
    invalidatePathfinderCatalog();
    return NextResponse.json({ item });
  }

  if (parsed.data.action === 'restore') {
    const item = await restorePathfinderItem({ id: parsed.data.id, reviewerId: session.userId });
    if (!item) return NextResponse.json({ error: '条目不在可恢复状态或不存在' }, { status: 409 });
    await logAdminAction(session, {
      action: 'pathfinder.item.restored-to-pending',
      targetType: 'pathfinder-item',
      targetId: item.id,
      detail: { title: item.titleZh || item.titleEn, canonicalUrl: item.canonicalUrl },
      ip,
    });
    invalidatePathfinderCatalog();
    return NextResponse.json({ item });
  }

  const source = await updatePathfinderSource(parsed.data);
  if (!source) return NextResponse.json({ error: '来源不存在' }, { status: 404 });
  await logAdminAction(session, {
    action: 'pathfinder.source.update',
    targetType: 'pathfinder-source',
    targetId: source.id,
    detail: { enabled: source.enabled, autoPublish: source.autoPublish },
    ip,
  });
  return NextResponse.json({ source });
}

function invalidatePathfinderCatalog() {
  revalidateTag(PATHFINDER_CATALOG_CACHE_TAG, { expire: 0 });
  revalidatePath('/[locale]/pathfinder', 'layout');
  revalidatePath('/api/pathfinder/items');
  revalidatePath('/sitemap.xml');
}

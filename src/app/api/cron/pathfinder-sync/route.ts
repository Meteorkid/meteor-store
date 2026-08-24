import crypto from 'crypto';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import {
  PATHFINDER_SYNC_SOURCE_MAP,
  syncPathfinderSources,
} from '@/lib/pathfinder/ingestion';
import { PATHFINDER_CATALOG_CACHE_TAG } from '@/lib/pathfinder/catalog';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SyncRequestSchema = z.object({
  sourceIds: z.array(z.string().min(1).max(80)).max(10).optional(),
});

/**
 * 由阿里云 crontab 调用的 Pathfinder 聚合任务。
 * Header: Authorization: Bearer <PATHFINDER_CRON_SECRET>
 */
export async function POST(request: NextRequest) {
  if (!hasValidSecret(request.headers.get('authorization'))) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  const ip = getClientIp(request);
  const { limited } = await rateLimit(`pathfinder-sync:${ip}`, 4, 60_000, { failClosed: true });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
  }

  const rawBody = await request.text();
  let body: unknown = {};
  if (rawBody.trim()) {
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: '请求格式不正确' }, { status: 400 });
    }
  }
  const parsed = SyncRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: '参数无效' }, { status: 400 });
  }
  const unknownSource = parsed.data.sourceIds?.find((id) => !PATHFINDER_SYNC_SOURCE_MAP.has(id));
  if (unknownSource) {
    return NextResponse.json({ error: `未知来源：${unknownSource}` }, { status: 400 });
  }

  try {
    const batch = await syncPathfinderSources(parsed.data.sourceIds);
    const { results, maintenanceChanged } = batch;
    const changed = maintenanceChanged > 0
      || results.some((result) => result.inserted > 0 || result.updated > 0);
    if (changed) {
      revalidateTag(PATHFINDER_CATALOG_CACHE_TAG, { expire: 0 });
      revalidatePath('/[locale]/pathfinder', 'layout');
      revalidatePath('/api/pathfinder/items');
      revalidatePath('/sitemap.xml');
    }

    const failedResults = results.filter((result) => result.error);
    if (failedResults.length > 0) {
      console.error({
        event: 'pathfinder_sync_source_failures',
        failedSourceCount: failedResults.length,
        totalSourceCount: results.length,
        failures: failedResults.map(({ sourceId, error }) => ({ sourceId, error })),
      });
    }

    const allSourcesFailed = results.length > 0 && failedResults.length === results.length;
    const status = allSourcesFailed ? 503 : 200;
    return NextResponse.json({
      success: failedResults.length === 0,
      changed,
      maintenanceChanged,
      results,
    }, { status });
  } catch (error) {
    console.error('Pathfinder sync failed:', error);
    return NextResponse.json({ error: '同步任务失败' }, { status: 500 });
  }
}

function hasValidSecret(authorization: string | null): boolean {
  const secret = process.env.PATHFINDER_CRON_SECRET;
  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) return false;
  const supplied = Buffer.from(authorization ?? '');
  const expected = Buffer.from(`Bearer ${secret}`);
  return supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { listCatalogItems } from '@/lib/pathfinder/catalog';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import {
  PATHFINDER_DIFFICULTIES,
  PATHFINDER_DIRECTIONS,
  PATHFINDER_ITEM_TYPES,
  PATHFINDER_REMOTE_STATUSES,
} from '@/lib/pathfinder/catalog-types';

const QuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  ids: z.string().trim().max(1_300).optional(),
  type: z.enum(PATHFINDER_ITEM_TYPES).optional(),
  direction: z.enum(PATHFINDER_DIRECTIONS).optional(),
  difficulty: z.enum(PATHFINDER_DIFFICULTIES).optional(),
  remote: z.enum(PATHFINDER_REMOTE_STATUSES).optional(),
  learning: z.enum(['true', 'false']).optional(),
  deadlineBefore: z.string().datetime().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(40),
});

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const parsed = QuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: '查询参数无效' }, { status: 400 });
  }
  try {
    const ip = getClientIp(request);
    const { limited } = await rateLimit(`pathfinder-items:${ip}`, 120, 60_000, { fallback: 'memory' });
    if (limited) {
      return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
    }
    const { q, ids: rawIds, limit, learning, remote, ...filters } = parsed.data;
    const ids = rawIds
      ? [...new Set(rawIds.split(',').map((id) => id.trim()).filter(Boolean))]
      : [];
    if (ids.length > 8 || ids.some((id) => id.length > 160)) {
      return NextResponse.json({ error: '查询参数无效' }, { status: 400 });
    }
    const catalog = await listCatalogItems({
      ...filters,
      remoteStatus: remote,
      learningEligible: learning === undefined ? undefined : learning === 'true',
    });
    const needle = q?.toLocaleLowerCase();
    const scoped = ids.length > 0
      ? catalog.filter((item) => ids.includes(item.id))
      : catalog;
    const matching = needle
      ? scoped.filter((item) => [
          item.title.zh,
          item.title.en,
          item.summary.zh,
          item.summary.en,
          item.organization.zh,
          item.organization.en,
          ...Object.values(item.tags).flat(),
        ].some((value) => value.toLocaleLowerCase().includes(needle)))
      : scoped;
    return NextResponse.json({
      items: matching.slice(0, limit).map((item) => ({
        ...item,
        source: {
          id: item.source.id,
          name: item.source.name,
          siteUrl: item.source.siteUrl,
          trustLevel: item.source.trustLevel,
        },
      })),
      total: matching.length,
    }, {
      headers: { 'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (error) {
    console.error('Pathfinder catalog API failed:', error);
    return NextResponse.json({ error: '目录暂时不可用' }, { status: 500 });
  }
}

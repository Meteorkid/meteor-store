import { NextRequest, NextResponse } from 'next/server';
import {
  PATHFINDER_DIRECTIONS,
  PATHFINDER_ITEM_TYPES,
  type PathfinderCatalogItem,
} from '@/lib/pathfinder/catalog-types';
import { listCatalogItems } from '@/lib/pathfinder/catalog';
import {
  CATALOG_SORTS,
  filterCatalogItems,
  isActionableTask,
  parseCatalogFilters,
  sortCatalogItems,
  type CatalogSort,
} from '@/lib/pathfinder/catalog-view';
import { SITE_URL } from '@/lib/constants';

/**
 * Pathfinder 机会库的机器可读接口。
 *
 * 只读、公开、无需鉴权：这里输出的内容与网页上任何人都能看到的完全一致，
 * 加鉴权只会让「可信来源可被复核」这件事更难做到。
 *
 * 不复用 `/api/pathfinder`（那是网页自己的内部接口，形状可以随页面改）——
 * v1 是对外契约，字段一旦发布就不能悄悄改名或改语义。
 */
export const dynamic = 'force-dynamic';

const MAX_LIMIT = 100;

function serialize(item: PathfinderCatalogItem) {
  return {
    id: item.id,
    type: item.itemType,
    title: item.title,
    summary: item.summary,
    organization: item.organization,
    directions: item.directions,
    difficulty: item.difficulty,
    // 具体 issue / 具体岗位与「整仓库、招聘门户」的区别，对调用方同样重要
    actionable: isActionableTask(item),
    learningEligible: item.learningEligible,
    requiresManualEligibilityCheck: item.requiresManualEligibilityCheck,
    cost: item.cost,
    remoteStatus: item.remoteStatus,
    region: item.region,
    deadline: {
      at: item.deadlineAt,
      date: item.deadlineDate,
      text: item.deadlineText,
    },
    source: {
      id: item.source.id,
      name: item.source.name,
      trustLevel: item.source.trustLevel,
      siteUrl: item.source.siteUrl,
    },
    canonicalUrl: item.canonicalUrl,
    publishedAt: item.publishedAt,
    discoveredAt: item.discoveredAt,
    verifiedAt: item.verifiedAt,
    url: `${SITE_URL}/zh/pathfinder/items/${item.id}`,
  };
}

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const type = params.type;
  const direction = params.direction;

  // 枚举值写错时直接报错而不是静默忽略：调用方拿到「全部条目」还以为筛过了
  if (type && !PATHFINDER_ITEM_TYPES.includes(type as never)) {
    return badRequest('invalid_type', `type must be one of: ${PATHFINDER_ITEM_TYPES.join(', ')}`);
  }
  if (direction && !PATHFINDER_DIRECTIONS.includes(direction as never)) {
    return badRequest('invalid_direction', `direction must be one of: ${PATHFINDER_DIRECTIONS.join(', ')}`);
  }
  if (params.sort && !CATALOG_SORTS.includes(params.sort as CatalogSort)) {
    return badRequest('invalid_sort', `sort must be one of: ${CATALOG_SORTS.join(', ')}`);
  }

  const parsedLimit = Number.parseInt(params.limit ?? '', 10);
  if (params.limit && (!Number.isFinite(parsedLimit) || parsedLimit < 1)) {
    return badRequest('invalid_limit', 'limit must be a positive integer');
  }
  const limit = Math.min(Number.isFinite(parsedLimit) ? parsedLimit : 50, MAX_LIMIT);

  const filters = parseCatalogFilters(params);
  const items = sortCatalogItems(
    filterCatalogItems(await listCatalogItems(), filters),
    filters.sort,
  );

  return NextResponse.json(
    {
      items: items.slice(0, limit).map(serialize),
      total: items.length,
      limit,
      generatedAt: new Date().toISOString(),
    },
    {
      headers: {
        // 公开内容，允许 CDN 与调用方缓存；同步任务按小时级运行，1 分钟足够新鲜
        'Cache-Control': 'public, max-age=60, s-maxage=60',
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
}

function badRequest(code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status: 400 });
}

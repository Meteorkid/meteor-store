import type { NextRequest } from 'next/server';

import { handlePathfinderPlanPost } from '@/lib/pathfinder/plan-api';

export const runtime = 'nodejs';

/** 兼容旧地址；新前端与第三方调用也可使用 `/api/pathfinder/plan`。 */
export function POST(request: NextRequest) {
  return handlePathfinderPlanPost(request);
}

import type { NextRequest } from 'next/server';

import { handlePathfinderPlanPost } from '@/lib/pathfinder/plan-api';

export const runtime = 'nodejs';

export function POST(request: NextRequest) {
  return handlePathfinderPlanPost(request);
}

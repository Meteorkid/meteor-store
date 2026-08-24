import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { requireTollowPro } from '@/lib/tollow-access';
import {
  TOLLOW_ANALYTICS_RANGES,
  buildTollowAnalytics,
  isValidTimeZone,
} from '@/lib/tollow-analytics';
import { listAllTollowPracticeSessions } from '@/lib/tollow';

const querySchema = z.object({
  range: z.enum(TOLLOW_ANALYTICS_RANGES).default('30d'),
  timeZone: z.string().min(1).max(100).refine(isValidTimeZone, '时区无效').default('Asia/Shanghai'),
});

export async function GET(req: NextRequest) {
  const auth = await requireTollowPro();
  if (!auth.ok) return auth.response;

  const { limited } = await rateLimit(
    `tollow-analytics:${auth.session.userId}:${getClientIp(req)}`,
    60,
    60_000,
    { fallback: 'memory' },
  );
  if (limited) return NextResponse.json({ error: '查询太频繁，请稍后再试' }, { status: 429 });

  const parsed = querySchema.safeParse(Object.fromEntries(req.nextUrl.searchParams.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const sessions = await listAllTollowPracticeSessions(auth.session.userId);
  return NextResponse.json(
    buildTollowAnalytics(sessions, parsed.data.range, parsed.data.timeZone),
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}

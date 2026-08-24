import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { requireTollowPro } from '@/lib/tollow-access';
import { buildTollowSessionsCsv } from '@/lib/tollow-csv';
import { listAllTollowPracticeSessions } from '@/lib/tollow';

export async function GET(req: NextRequest) {
  const auth = await requireTollowPro();
  if (!auth.ok) return auth.response;

  const { limited } = await rateLimit(
    `tollow-export:${auth.session.userId}:${getClientIp(req)}`,
    10,
    60_000,
    { fallback: 'memory' },
  );
  if (limited) return NextResponse.json({ error: '导出太频繁，请稍后再试' }, { status: 429 });

  const sessions = await listAllTollowPracticeSessions(auth.session.userId);
  const filename = `tollow-practice-sessions-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(buildTollowSessionsCsv(sessions), {
    headers: {
      'Cache-Control': 'private, no-store',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': 'text/csv; charset=utf-8',
    },
  });
}

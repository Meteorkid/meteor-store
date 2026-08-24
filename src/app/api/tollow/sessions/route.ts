import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { createTollowPracticeSession, listTollowPracticeSessions } from '@/lib/tollow';
import { tollowPracticeSessionSchema, tollowSessionsQuerySchema } from '@/lib/tollow-contract';
import { requireTollowPro } from '@/lib/tollow-access';

export async function GET(req: NextRequest) {
  const auth = await requireTollowPro();
  if (!auth.ok) return auth.response;

  const parsed = tollowSessionsQuerySchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams.entries()),
  );
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  return NextResponse.json(await listTollowPracticeSessions(auth.session.userId, parsed.data));
}

export async function POST(req: NextRequest) {
  const auth = await requireTollowPro();
  if (!auth.ok) return auth.response;

  const { limited } = await rateLimit(
    `tollow-session:${auth.session.userId}:${getClientIp(req)}`,
    30,
    60_000,
    { fallback: 'memory' },
  );
  if (limited) return NextResponse.json({ error: '记录太频繁，请稍后再试' }, { status: 429 });

  const parsed = tollowPracticeSessionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const result = await createTollowPracticeSession(auth.session.userId, parsed.data);
  return NextResponse.json(result, { status: result.created ? 201 : 200 });
}

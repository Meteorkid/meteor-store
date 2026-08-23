import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { listTollowBookProgress, upsertTollowBookProgress } from '@/lib/tollow';
import { tollowProgressSchema } from '@/lib/tollow-contract';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: '请先登录' }, { status: 401 });

  const items = await listTollowBookProgress(session.userId);
  return NextResponse.json({ items });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: '请先登录' }, { status: 401 });

  const { limited } = await rateLimit(
    `tollow-progress:${session.userId}:${getClientIp(req)}`,
    120,
    60_000,
    { fallback: 'memory' },
  );
  if (limited) return NextResponse.json({ error: '同步太频繁，请稍后再试' }, { status: 429 });

  const parsed = tollowProgressSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const progress = await upsertTollowBookProgress(session.userId, parsed.data);
  return NextResponse.json({ progress });
}

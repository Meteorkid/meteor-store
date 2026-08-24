import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { listTollowBookProgress, upsertTollowBookProgress } from '@/lib/tollow';
import { tollowProgressSchema } from '@/lib/tollow-contract';
import { requireTollowPro } from '@/lib/tollow-access';

export async function GET() {
  const auth = await requireTollowPro();
  if (!auth.ok) return auth.response;

  const items = await listTollowBookProgress(auth.session.userId);
  return NextResponse.json({ items });
}

export async function PUT(req: NextRequest) {
  const auth = await requireTollowPro();
  if (!auth.ok) return auth.response;

  const { limited } = await rateLimit(
    `tollow-progress:${auth.session.userId}:${getClientIp(req)}`,
    120,
    60_000,
    { fallback: 'memory' },
  );
  if (limited) return NextResponse.json({ error: '同步太频繁，请稍后再试' }, { status: 429 });

  const parsed = tollowProgressSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const progress = await upsertTollowBookProgress(auth.session.userId, parsed.data);
  return NextResponse.json({ progress });
}

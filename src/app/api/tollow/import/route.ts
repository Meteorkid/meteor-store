import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { importTollowData } from '@/lib/tollow';
import { tollowImportSchema } from '@/lib/tollow-contract';
import { requireTollowPro } from '@/lib/tollow-access';

export async function POST(req: NextRequest) {
  const auth = await requireTollowPro();
  if (!auth.ok) return auth.response;

  const { limited } = await rateLimit(
    `tollow-import:${auth.session.userId}:${getClientIp(req)}`,
    5,
    60_000,
    { fallback: 'memory' },
  );
  if (limited) return NextResponse.json({ error: '导入太频繁，请稍后再试' }, { status: 429 });

  const parsed = tollowImportSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  return NextResponse.json(await importTollowData(auth.session.userId, parsed.data));
}

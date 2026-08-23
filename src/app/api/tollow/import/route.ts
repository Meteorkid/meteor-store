import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { importTollowData } from '@/lib/tollow';
import { tollowImportSchema } from '@/lib/tollow-contract';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: '请先登录' }, { status: 401 });

  const { limited } = await rateLimit(
    `tollow-import:${session.userId}:${getClientIp(req)}`,
    5,
    60_000,
    { fallback: 'memory' },
  );
  if (limited) return NextResponse.json({ error: '导入太频繁，请稍后再试' }, { status: 429 });

  const parsed = tollowImportSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  return NextResponse.json(await importTollowData(session.userId, parsed.data));
}

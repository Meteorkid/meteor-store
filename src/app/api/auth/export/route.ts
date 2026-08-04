import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { exportUserData } from '@/lib/user-data-export';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const { limited } = await rateLimit(`data-export:user:${session.userId}`, 3, 60 * 60_000, {
    failClosed: true,
  });
  if (limited) {
    return NextResponse.json({ error: '导出过于频繁，请稍后再试' }, { status: 429 });
  }

  const data = await exportUserData(session.userId, session.email);
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Disposition': 'attachment; filename="meteor-store-data.json"',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

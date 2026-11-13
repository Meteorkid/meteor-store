import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getStudySummary } from '@/lib/study/service';

const headers = { 'Cache-Control': 'no-store' };

/** 铃铛「提醒」标签的学习分区：只读计数，不产生未读状态。 */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
  try {
    return NextResponse.json({ userId: session.userId, ...await getStudySummary(session.userId) }, { headers });
  } catch {
    return NextResponse.json({ error: 'Summary unavailable' }, { status: 503, headers });
  }
}

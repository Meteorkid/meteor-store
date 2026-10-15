import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDailyReminder } from '@/lib/daily/service';

export async function GET() {
  const headers = { 'Cache-Control': 'no-store' };
  const session = await getSession();
  if (!session) return NextResponse.json({ reminder: null }, { headers });
  try {
    return NextResponse.json({ userId: session.userId, reminder: await getDailyReminder(session.userId) }, { headers });
  } catch {
    return NextResponse.json({ error: 'Reminder unavailable' }, { status: 503, headers });
  }
}

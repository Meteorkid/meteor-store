import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { readMonitoringSnapshot } from '@/lib/monitoring';

export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'no-store' };

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminSession(session)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers });
  }
  try {
    const monitoring = await readMonitoringSnapshot();
    return NextResponse.json({ userId: session.userId, monitoring }, { headers });
  } catch {
    return NextResponse.json({ error: 'Monitoring unavailable' }, { status: 503, headers });
  }
}

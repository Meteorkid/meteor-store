import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { readMonitoringSnapshot } from '@/lib/monitoring';
import { readRecheckSnapshot } from '@/lib/task-monitoring';

export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'no-store' };

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminSession(session)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers });
  }
  try {
    const [monitoring, task] = await Promise.all([readMonitoringSnapshot(), readRecheckSnapshot()]);
    return NextResponse.json({ userId: session.userId, monitoring, task }, { headers });
  } catch {
    return NextResponse.json({ error: 'Monitoring unavailable' }, { status: 503, headers });
  }
}

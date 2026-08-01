import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { getAdminStats } from '@/lib/admin-stats';

function forbidden() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminEmail(session.email)) return forbidden();

  const stats = await getAdminStats();
  return NextResponse.json({ stats });
}
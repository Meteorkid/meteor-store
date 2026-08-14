import { NextResponse } from 'next/server';
import { getOnlineCount } from '@/lib/online-presence';

export async function GET() {
  const count = await getOnlineCount();
  return NextResponse.json({ count });
}

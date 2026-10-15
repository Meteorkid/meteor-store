import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { defaultMastersYear } from '@/lib/masters/types';
import { listMastersRounds } from '@/lib/masters/service';

export async function GET(request: NextRequest) {
  const year = z.coerce.number().int().min(2020).max(2100).safeParse(request.nextUrl.searchParams.get('year') ?? defaultMastersYear());
  if (!year.success) return NextResponse.json({ error: 'Invalid year' }, { status: 400 });
  try {
    return NextResponse.json({ rounds: await listMastersRounds(year.data) }, { headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=30' } });
  } catch {
    return NextResponse.json({ error: 'Calendar unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}

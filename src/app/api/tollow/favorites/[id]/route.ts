import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import {
  deleteTollowFavorite,
  TollowNotFoundError,
  updateTollowFavorite,
} from '@/lib/tollow';
import { tollowFavoritePatchSchema } from '@/lib/tollow-contract';
import { requireTollowPro } from '@/lib/tollow-access';

const idSchema = z.string().min(1).max(128);
type RouteContext = { params: Promise<{ id: string }> };

async function authorizeWrite(req: NextRequest): Promise<
  | { ok: true; userId: string }
  | { ok: false; response: NextResponse }
> {
  const auth = await requireTollowPro();
  if (!auth.ok) return auth;

  const { limited } = await rateLimit(
    `tollow-favorite:${auth.session.userId}:${getClientIp(req)}`,
    30,
    60_000,
    { fallback: 'memory' },
  );
  if (limited) {
    return { ok: false, response: NextResponse.json({ error: '收藏操作太频繁，请稍后再试' }, { status: 429 }) };
  }
  return { ok: true, userId: auth.session.userId };
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const auth = await authorizeWrite(req);
  if (!auth.ok) return auth.response;

  const idResult = idSchema.safeParse((await params).id);
  const inputResult = tollowFavoritePatchSchema.safeParse(await req.json().catch(() => null));
  if (!idResult.success || !inputResult.success) {
    const error = !idResult.success
      ? idResult.error.issues[0].message
      : !inputResult.success
        ? inputResult.error.issues[0].message
        : '请求无效';
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const favorite = await updateTollowFavorite(auth.userId, idResult.data, inputResult.data);
    return NextResponse.json({ favorite });
  } catch (error) {
    if (error instanceof TollowNotFoundError) {
      return NextResponse.json({ error: '收藏不存在' }, { status: 404 });
    }
    throw error;
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const auth = await authorizeWrite(req);
  if (!auth.ok) return auth.response;

  const idResult = idSchema.safeParse((await params).id);
  if (!idResult.success) {
    return NextResponse.json({ error: idResult.error.issues[0].message }, { status: 400 });
  }

  try {
    await deleteTollowFavorite(auth.userId, idResult.data);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof TollowNotFoundError) {
      return NextResponse.json({ error: '收藏不存在' }, { status: 404 });
    }
    throw error;
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { getSession } from '@/lib/auth';
import { assertMatchingOrigin } from '@/lib/csrf';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

/**
 * 解绑微信：仅清除绑定关系，不影响会话与其他登录方式。
 * 解绑后重新扫码会再次进入绑定流程。
 */
export async function POST(req: NextRequest) {
  const forbidden = assertMatchingOrigin(req);
  if (forbidden) return forbidden;

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const ip = getClientIp(req);
  const { limited } = await rateLimit(`wechat-unbind:ip:${ip}`, 5, 900_000, { failClosed: true });
  if (limited) {
    return NextResponse.json({ error: '操作过于频繁，请稍后再试' }, { status: 429 });
  }

  await db
    .update(users)
    .set({ wechatOpenid: null, wechatUnionid: null })
    .where(eq(users.id, session.userId));

  return NextResponse.json({ success: true });
}

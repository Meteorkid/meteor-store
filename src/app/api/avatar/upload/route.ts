import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { getSession } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { uploadAvatar, isR2Configured, keyFromUrl, deleteAvatar } from '@/lib/avatar-storage';

const MAX_DATAURL_BYTES = 200_000; // base64 后约 200KB，对应原图 ~150KB

/**
 * 把客户端缩放后的头像 data URL 上传到 R2。
 * 仅在 R2 已配置时启用；未配置时调用方应继续走 data URL 入库（见 profile 路由）。
 *
 * 写完新对象后，会把当前 users.avatarUrl 指向的旧对象删掉，避免孤儿堆积。
 */
export async function POST(req: NextRequest) {
  if (!isR2Configured()) {
    return NextResponse.json(
      { error: '对象存储未配置，请联系管理员' },
      { status: 503 },
    );
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  // 头像上传限流：每用户每分钟 5 次。失败的不消耗额度，但频繁切换头像的脚本仍要挡
  const ip = getClientIp(req);
  const { limited } = await rateLimit(`avatar-upload:${session.userId}:${ip}`, 5, 60_000, {
    fallback: 'memory',
  });
  if (limited) {
    return NextResponse.json({ error: '操作太频繁，请稍后再试' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const dataUrl = typeof body?.dataUrl === 'string' ? body.dataUrl : '';

  // 解析 data URL
  const match = /^data:(image\/(webp|jpeg|png));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!match) {
    return NextResponse.json({ error: '头像格式不正确' }, { status: 400 });
  }
  const mime = match[1] as 'image/webp' | 'image/jpeg' | 'image/png';
  const base64 = match[3];
  if (base64.length > MAX_DATAURL_BYTES) {
    return NextResponse.json({ error: '头像文件过大' }, { status: 400 });
  }

  // base64 → Uint8Array
  const bytes = Buffer.from(base64, 'base64');

  let result;
  try {
    result = await uploadAvatar(session.userId, bytes, mime);
  } catch (err) {
    console.error('avatar upload failed:', err);
    return NextResponse.json({ error: '头像上传失败，请稍后重试' }, { status: 500 });
  }

  // 删除旧头像对象（如果有）
  const [row] = await db
    .select({ avatarUrl: users.avatarUrl })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);
  if (row?.avatarUrl) {
    const oldKey = keyFromUrl(row.avatarUrl);
    if (oldKey) await deleteAvatar(oldKey);
  }

  return NextResponse.json({ url: result.url });
}

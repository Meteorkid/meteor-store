import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import {
  getPathfinderSaveCounts,
  listPathfinderSaves,
  setPathfinderSaveReminder,
  togglePathfinderSave,
} from '@/lib/pathfinder/saves';

const ToggleSchema = z.object({
  itemId: z.string().min(1).max(200),
  /** 省略为切换收藏；带上时只改这条收藏的提醒开关 */
  remindDeadline: z.boolean().optional(),
});

/**
 * 查收藏状态。
 * `?itemIds=a,b,c` 返回这批条目的收藏数，登录用户还会拿到自己收藏了哪些。
 * 不带参数则返回当前用户的全部收藏记录。
 */
export async function GET(req: NextRequest) {
  const session = await getSession();
  const raw = req.nextUrl.searchParams.get('itemIds');

  if (raw) {
    const ids = raw.split(',').map((value) => value.trim()).filter(Boolean).slice(0, 100);
    const counts = await getPathfinderSaveCounts(ids);
    const saved = session
      ? (await listPathfinderSaves(session.userId))
          .filter((save) => ids.includes(save.itemId))
          .map((save) => save.itemId)
      : [];
    return NextResponse.json({
      counts: Object.fromEntries(ids.map((id) => [id, counts[id] ?? 0])),
      saved,
    });
  }

  if (!session) return NextResponse.json({ saves: [] });
  return NextResponse.json({ saves: await listPathfinderSaves(session.userId) });
}

/** 切换收藏，或改这条收藏的截止提醒开关。 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: '请先登录' }, { status: 401 });

  const ip = getClientIp(req);
  const { limited } = await rateLimit(`pathfinder-save:${session.userId}:${ip}`, 30, 60_000, {
    fallback: 'memory',
  });
  if (limited) return NextResponse.json({ error: '操作太频繁，稍后再试' }, { status: 429 });

  const parsed = ToggleSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  if (parsed.data.remindDeadline !== undefined) {
    const updated = await setPathfinderSaveReminder(
      parsed.data.itemId,
      session.userId,
      parsed.data.remindDeadline,
    );
    // 未收藏的条目不隐式创建收藏：那会让「关掉提醒」变成「悄悄收藏」
    if (!updated) return NextResponse.json({ error: '尚未收藏该条目' }, { status: 404 });
    return NextResponse.json({ saved: true, remindDeadline: parsed.data.remindDeadline });
  }

  const { saved, count } = await togglePathfinderSave(parsed.data.itemId, session.userId);
  return NextResponse.json({ saved, count });
}

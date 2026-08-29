import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { listCatalogItems } from '@/lib/pathfinder/catalog';
import {
  canGenerateEditorialNote,
  generateEditorialNote,
  isEditorialEnabled,
} from '@/lib/pathfinder/editorial';
import { listEditorialNotes, saveEditorialDraft } from '@/lib/pathfinder/editorial-store';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

// 每条都是一次 LLM 调用，显式延长函数超时时间
export const maxDuration = 300;

/**
 * 批量补齐 AI 动态的解读**初稿**。
 * 用法：POST /api/cron/pathfinder-notes  {"limit": 20}
 * Header: Authorization: Bearer <PATHFINDER_CRON_SECRET>
 *
 * 存在的理由是补齐存量：实测 152 条 AI 动态里只有 9 条有解读。后台的批量生成
 * 一次 8 条，靠人点要点十九轮。
 *
 * **只生成草稿，绝不发布。** 人工确认那一步是这条流程的全部意义所在——
 * 一个把「生成」和「发布」并成一步的接口，等于取消了它。要发布仍然走
 * /admin/pathfinder 的确认按钮（那里可以批量确认）。
 *
 * 复用与其它 Pathfinder 维护任务相同的密钥：都是同一台调度器上的后台任务。
 */
export async function POST(request: NextRequest) {
  // 常数时间比较，防时序侧信道
  const authHeader = request.headers.get('authorization') || '';
  const secret = process.env.PATHFINDER_CRON_SECRET;
  const expected = `Bearer ${secret}`;
  const provided = Buffer.from(authHeader);
  const wanted = Buffer.from(expected);
  if (!secret || provided.length !== wanted.length || !crypto.timingSafeEqual(provided, wanted)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  // 每次调用都花钱，Redis 异常时 fail-closed
  const { limited } = await rateLimit(`cron-pf-notes:${getClientIp(request)}`, 20, 60_000, {
    failClosed: true,
  });
  if (limited) return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });

  if (!isEditorialEnabled()) {
    return NextResponse.json({ error: 'DEEPSEEK_API_KEY 未配置' }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  // 单次上限：请求要在函数超时前返回，而每条大约几秒
  const limit = Math.min(30, Math.max(1, Number((body as { limit?: unknown }).limit) || 10));

  const [items, notes] = await Promise.all([
    listCatalogItems({ type: 'ai-update' }),
    listEditorialNotes(),
  ]);
  const covered = new Set(notes.map((note) => note.itemId));
  const pending = items
    .filter((item) => item.status === 'published' && !covered.has(item.id))
    // 无摘要的条目材料不足，生成出来只会是一句「暂无法评估」的免责声明
    .filter((item) => canGenerateEditorialNote(item))
    // 新的先来：解读的价值随时间衰减
    .sort((a, b) => String(b.publishedAt ?? '').localeCompare(String(a.publishedAt ?? '')))
    .slice(0, limit);

  let generated = 0;
  let failed = 0;
  // 串行：并发打同一个供应商容易触发限流，一旦限流整批都白花钱
  for (const item of pending) {
    try {
      const note = await generateEditorialNote(item);
      const result = await saveEditorialDraft(item.id, note);
      if (result.saved) generated += 1;
      else failed += 1;
    } catch (error) {
      // 单条失败不终止整批：一次网络抖动不该让前面几条的花费白付
      console.error('Editorial draft generation failed:', item.id, error);
      failed += 1;
    }
  }

  /*
   * remaining 只数**还能生成**的条目。
   *
   * 早先减的是全部已发布条目，于是把无摘要、永远生成不了的那批也算了进去，
   * 报出 remaining:44 而实际一条都排不上——看着像没跑完，其实已经到头了。
   */
  const eligible = items.filter((item) => (
    item.status === 'published' && canGenerateEditorialNote(item)
  ));
  const remaining = eligible.filter((item) => !covered.has(item.id)).length - generated;
  return NextResponse.json({ generated, failed, remaining: Math.max(0, remaining) });
}

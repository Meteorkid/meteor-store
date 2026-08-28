import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdminSession } from '@/lib/admin';
import { logAdminAction } from '@/lib/admin-audit';
import { getSession } from '@/lib/auth';
import { getCatalogItem } from '@/lib/pathfinder/catalog';
import {
  editorialNoteSchema,
  generateEditorialNote,
  isEditorialEnabled,
} from '@/lib/pathfinder/editorial';
import {
  approveEditorialNote,
  deleteEditorialNote,
  editEditorialDraft,
  listEditorialNotes,
  revertEditorialNote,
  saveEditorialDraft,
} from '@/lib/pathfinder/editorial-store';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

/**
 * AI 动态解读的后台接口。
 *
 * 生成走模型、要花钱，所以限流比其它后台接口更严；确认发布是这套流程的关键动作，
 * 全部写审计日志——「谁在什么时候放行了哪条模型产出」必须可追溯。
 */
export const dynamic = 'force-dynamic';

const ActionSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('generate'), itemId: z.string().min(1).max(200) }),
  /*
   * 批量生成初稿。
   *
   * 逐条点「生成」在 100+ 条待办面前不现实——实测 109 条 AI 动态里只有 1 条
   * 走完了流程。上限刻意留得很小（一次最多 8 条）：每条都是一次 LLM 调用，
   * 请求要在网关超时前返回，而且一次生成太多会让「人工逐条确认」这一步
   * 重新变成走过场。
   */
  z.object({
    action: z.literal('generate-batch'),
    itemIds: z.array(z.string().min(1).max(200)).min(1).max(8),
  }),
  z.object({ action: z.literal('approve'), itemId: z.string().min(1).max(200) }),
  z.object({ action: z.literal('revert'), itemId: z.string().min(1).max(200) }),
  z.object({ action: z.literal('delete'), itemId: z.string().min(1).max(200) }),
  z.object({
    action: z.literal('edit'),
    itemId: z.string().min(1).max(200),
    note: editorialNoteSchema,
  }),
]);

export async function GET(request: NextRequest) {
  const session = await getSession();
  // 后台对非管理员一律 404，不暴露这里有个接口
  if (!session || !isAdminSession(session)) return NextResponse.json({ error: '未找到' }, { status: 404 });

  const status = request.nextUrl.searchParams.get('status');
  const notes = await listEditorialNotes(
    status === 'draft' || status === 'approved' ? status : undefined,
  );
  return NextResponse.json({ notes, enabled: isEditorialEnabled() });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return NextResponse.json({ error: '未找到' }, { status: 404 });

  const parsed = ActionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { action } = parsed.data;
  const itemId = 'itemId' in parsed.data ? parsed.data.itemId : '';

  // 生成要调模型、按 token 计费，限得比其它管理动作更紧
  const ip = getClientIp(request);
  // 批量一次就是好几次 LLM 调用，配额比单条更严
  const quota = action === 'generate-batch' ? 3 : action === 'generate' ? 10 : 60;
  const { limited } = await rateLimit(`pf-notes:${action}:${session.userId}:${ip}`, quota, 60_000, {
    fallback: 'memory',
  });
  if (limited) return NextResponse.json({ error: '操作太频繁，稍后再试' }, { status: 429 });

  switch (action) {
    case 'generate': {
      if (!isEditorialEnabled()) {
        return NextResponse.json({ error: '未配置 DEEPSEEK_API_KEY，解读功能未启用' }, { status: 503 });
      }
      const item = await getCatalogItem(itemId);
      if (!item) return NextResponse.json({ error: '条目不存在' }, { status: 404 });
      if (item.itemType !== 'ai-update') {
        return NextResponse.json({ error: '只为 AI 动态生成解读' }, { status: 400 });
      }

      try {
        const note = await generateEditorialNote(item);
        const result = await saveEditorialDraft(itemId, note);
        if (!result.saved) {
          return NextResponse.json(
            { error: '该条目已有人工确认的解读，请先退回草稿' },
            { status: 409 },
          );
        }
        await logAdminAction(session, {
          action: 'pathfinder.note.generate',
          targetType: 'pathfinder_item',
          targetId: itemId,
          detail: { title: item.title.zh },
        });
        return NextResponse.json({ note });
      } catch (error) {
        console.error('Editorial note generation failed:', error);
        return NextResponse.json({ error: '生成失败，请稍后重试' }, { status: 502 });
      }
    }

    case 'generate-batch': {
      if (!isEditorialEnabled()) {
        return NextResponse.json({ error: '未配置 DEEPSEEK_API_KEY，解读功能未启用' }, { status: 503 });
      }

      const results: Array<{ itemId: string; ok: boolean; error?: string }> = [];
      // 串行：并发打同一个供应商容易触发限流，一旦限流整批都白跑
      for (const id of parsed.data.itemIds) {
        const item = await getCatalogItem(id);
        if (!item || item.itemType !== 'ai-update') {
          results.push({ itemId: id, ok: false, error: '条目不存在或不是 AI 动态' });
          continue;
        }
        try {
          const note = await generateEditorialNote(item);
          const saved = await saveEditorialDraft(id, note);
          if (!saved.saved) {
            results.push({ itemId: id, ok: false, error: '已有人工确认的解读' });
            continue;
          }
          await logAdminAction(session, {
            action: 'pathfinder.note.generate',
            targetType: 'pathfinder_item',
            targetId: id,
            detail: { title: item.title.zh, batch: true },
          });
          results.push({ itemId: id, ok: true });
        } catch (error) {
          // 单条失败不终止整批：一次网络抖动不该让前面几条的花费白付
          console.error('Editorial note generation failed:', id, error);
          results.push({ itemId: id, ok: false, error: '生成失败' });
        }
      }
      return NextResponse.json({ results });
    }

    case 'edit': {
      const ok = await editEditorialDraft(itemId, parsed.data.note);
      if (!ok) return NextResponse.json({ error: '解读不存在' }, { status: 404 });
      await logAdminAction(session, {
        action: 'pathfinder.note.edit',
        targetType: 'pathfinder_item',
        targetId: itemId,
      });
      return NextResponse.json({ ok: true });
    }

    case 'approve': {
      const ok = await approveEditorialNote(itemId, session.userId);
      // 条件更新没命中：要么不存在，要么已被另一个管理员确认
      if (!ok) return NextResponse.json({ error: '解读不存在或已被确认' }, { status: 409 });
      await logAdminAction(session, {
        action: 'pathfinder.note.approve',
        targetType: 'pathfinder_item',
        targetId: itemId,
      });
      return NextResponse.json({ ok: true });
    }

    case 'revert': {
      const ok = await revertEditorialNote(itemId);
      if (!ok) return NextResponse.json({ error: '解读不存在' }, { status: 404 });
      await logAdminAction(session, {
        action: 'pathfinder.note.revert',
        targetType: 'pathfinder_item',
        targetId: itemId,
      });
      return NextResponse.json({ ok: true });
    }

    case 'delete': {
      const ok = await deleteEditorialNote(itemId);
      if (!ok) return NextResponse.json({ error: '解读不存在' }, { status: 404 });
      await logAdminAction(session, {
        action: 'pathfinder.note.delete',
        targetType: 'pathfinder_item',
        targetId: itemId,
      });
      return NextResponse.json({ ok: true });
    }
  }
}

import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { pathfinderItemNotes } from '@/lib/db/schema';
import {
  EDITORIAL_MODEL,
  EDITORIAL_PROMPT_VERSION,
  normalizeEditorialNote,
  type EditorialNote,
} from './editorial';

/**
 * 解读的读写层。
 *
 * 渲染层只读 approved；draft 只在后台可见。这条边界要在数据层就守住，
 * 而不是指望每个调用方记得加过滤——漏一处就是把模型初稿直接公开出去。
 */

export interface StoredEditorialNote extends EditorialNote {
  itemId: string;
  status: 'draft' | 'approved';
  model: string;
  promptVersion: string;
  generatedAt: string;
  editedByHuman: boolean;
  reviewerId: string | null;
  reviewedAt: string | null;
}

function toNote(row: typeof pathfinderItemNotes.$inferSelect): StoredEditorialNote {
  let skills: string[] = [];
  try {
    const parsed: unknown = JSON.parse(row.skills);
    if (Array.isArray(parsed)) skills = parsed.filter((s): s is string => typeof s === 'string');
  } catch {
    // 手工改库或历史脏数据不该让整页 500，退化为没有技能标签
  }
  return {
    itemId: row.itemId,
    status: row.status === 'approved' ? 'approved' : 'draft',
    whatHappened: row.whatHappened,
    whyItMatters: row.whyItMatters,
    skills,
    suggestedAction: row.suggestedAction,
    model: row.model,
    promptVersion: row.promptVersion,
    generatedAt: row.generatedAt,
    editedByHuman: row.editedByHuman,
    reviewerId: row.reviewerId,
    reviewedAt: row.reviewedAt,
  };
}

/**
 * 写入模型初稿。
 *
 * **已确认的解读不会被覆盖**：那是人看过并署名的内容，重新生成不该把它冲掉。
 * 想重做已确认的解读，要先在后台退回草稿。
 */
export async function saveEditorialDraft(
  itemId: string,
  note: EditorialNote,
): Promise<{ saved: boolean; reason?: 'already-approved' }> {
  const normalized = normalizeEditorialNote(note);
  const now = new Date().toISOString();
  const values = {
    itemId,
    status: 'draft' as const,
    whatHappened: normalized.whatHappened,
    whyItMatters: normalized.whyItMatters,
    skills: JSON.stringify(normalized.skills),
    suggestedAction: normalized.suggestedAction,
    model: EDITORIAL_MODEL,
    promptVersion: EDITORIAL_PROMPT_VERSION,
    generatedAt: now,
    editedByHuman: false,
    reviewerId: null,
    reviewedAt: null,
  };

  const rows = await db
    .insert(pathfinderItemNotes)
    .values(values)
    .onConflictDoUpdate({
      target: pathfinderItemNotes.itemId,
      set: values,
      // 条件更新：已确认的记录原样保留
      where: eq(pathfinderItemNotes.status, 'draft'),
    })
    .returning({ itemId: pathfinderItemNotes.itemId });

  return rows.length > 0 ? { saved: true } : { saved: false, reason: 'already-approved' };
}

/** 人工编辑正文。编辑后仍是草稿，需要再点确认才公开。 */
export async function editEditorialDraft(
  itemId: string,
  note: EditorialNote,
): Promise<boolean> {
  const normalized = normalizeEditorialNote(note);
  const rows = await db
    .update(pathfinderItemNotes)
    .set({
      whatHappened: normalized.whatHappened,
      whyItMatters: normalized.whyItMatters,
      skills: JSON.stringify(normalized.skills),
      suggestedAction: normalized.suggestedAction,
      editedByHuman: true,
    })
    .where(eq(pathfinderItemNotes.itemId, itemId))
    .returning({ itemId: pathfinderItemNotes.itemId });
  return rows.length > 0;
}

/**
 * 人工确认发布。
 *
 * 条件更新（`status='draft'`）：两个管理员同时点确认时，第二次命中不到、返回 false，
 * 而不是把 reviewerId 覆盖成后点的那个人——署名要落在真正审过的人身上。
 */
export async function approveEditorialNote(
  itemId: string,
  reviewerId: string,
): Promise<boolean> {
  const rows = await db
    .update(pathfinderItemNotes)
    .set({ status: 'approved', reviewerId, reviewedAt: new Date().toISOString() })
    .where(and(eq(pathfinderItemNotes.itemId, itemId), eq(pathfinderItemNotes.status, 'draft')))
    .returning({ itemId: pathfinderItemNotes.itemId });
  return rows.length > 0;
}

/** 退回草稿，用于重做已确认的解读。 */
export async function revertEditorialNote(itemId: string): Promise<boolean> {
  const rows = await db
    .update(pathfinderItemNotes)
    .set({ status: 'draft', reviewerId: null, reviewedAt: null })
    .where(eq(pathfinderItemNotes.itemId, itemId))
    .returning({ itemId: pathfinderItemNotes.itemId });
  return rows.length > 0;
}

export async function deleteEditorialNote(itemId: string): Promise<boolean> {
  const rows = await db
    .delete(pathfinderItemNotes)
    .where(eq(pathfinderItemNotes.itemId, itemId))
    .returning({ itemId: pathfinderItemNotes.itemId });
  return rows.length > 0;
}

/** 已确认的解读，供详情页渲染。draft 永远不会从这里出去。 */
export async function getApprovedEditorialNote(
  itemId: string,
): Promise<StoredEditorialNote | null> {
  const [row] = await db
    .select()
    .from(pathfinderItemNotes)
    .where(and(eq(pathfinderItemNotes.itemId, itemId), eq(pathfinderItemNotes.status, 'approved')));
  return row ? toNote(row) : null;
}


/** 后台用：按状态列出解读。 */
export async function listEditorialNotes(
  status?: 'draft' | 'approved',
): Promise<StoredEditorialNote[]> {
  const rows = status
    ? await db.select().from(pathfinderItemNotes).where(eq(pathfinderItemNotes.status, status))
    : await db.select().from(pathfinderItemNotes);
  return rows.map(toNote).sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
}

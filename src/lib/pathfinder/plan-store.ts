import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { pathfinderPlans } from '@/lib/db/schema';
import { pruneTaskIds } from './plan-edit';
import { PathfinderPlanSchema, type PathfinderPlan } from './schema';

/**
 * 学习路径的账号存储。
 *
 * 一个账号一份（userId 主键）。读写都在这一层做校验和清理，
 * 让上层拿到的永远是「结构合法、id 不残留」的状态——手工改库、
 * 旧版本遗留数据、以及并发编辑都可能破坏这两点。
 */

export interface StoredPlanState {
  plan: PathfinderPlan;
  completedTaskIds: string[];
  pinnedTaskIds: string[];
  /** 生成时用的画像，供「重新生成某一周」复用；旧数据可能没有 */
  profile: unknown | null;
  updatedAt: string;
}

function parseIdList(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    // 脏数据不该让整页 500，退化为空列表
    return [];
  }
}

/**
 * 读取路径。
 *
 * 结构不合法时返回 null 而不是抛错：路径 schema 会随功能演进收紧
 * （比如将来把每周任务上限从 4 改成 3），旧数据不该让用户的整个页面打不开，
 * 而应表现为「没有已保存的路径」，重新生成一份即可。
 */
export async function getUserPlan(userId: string): Promise<StoredPlanState | null> {
  const [row] = await db
    .select()
    .from(pathfinderPlans)
    .where(eq(pathfinderPlans.userId, userId));
  if (!row) return null;

  let payload: unknown;
  try {
    payload = JSON.parse(row.plan);
  } catch {
    return null;
  }

  const parsed = PathfinderPlanSchema.safeParse(payload);
  if (!parsed.success) return null;

  // 读的时候也清一次残留 id：写入路径与清理逻辑将来可能分头演进，
  // 只在写入侧清理会让历史数据一直带着失效 id
  let profile: unknown = null;
  if (row.profile) {
    try { profile = JSON.parse(row.profile); } catch { profile = null; }
  }

  return {
    plan: parsed.data,
    completedTaskIds: pruneTaskIds(parsed.data, parseIdList(row.completedTaskIds)),
    pinnedTaskIds: pruneTaskIds(parsed.data, parseIdList(row.pinnedTaskIds)),
    profile,
    updatedAt: row.updatedAt,
  };
}

/**
 * 保存路径（整份覆盖）。
 *
 * 路径写入前必过 schema：客户端传来的内容不可信，而一份不合法的路径存进去后
 * 会让读取端一直返回 null，用户表现为「路径莫名其妙没了」。
 */
export async function saveUserPlan(
  userId: string,
  input: { plan: unknown; completedTaskIds: unknown; pinnedTaskIds: unknown; profile?: unknown },
): Promise<{ ok: true; state: StoredPlanState } | { ok: false; reason: string }> {
  const parsed = PathfinderPlanSchema.safeParse(input.plan);
  if (!parsed.success) {
    return { ok: false, reason: parsed.error.issues[0]?.message ?? '路径结构不合法' };
  }

  const toIds = (value: unknown) => (Array.isArray(value)
    ? value.filter((id): id is string => typeof id === 'string').slice(0, 200)
    : []);
  const completedTaskIds = pruneTaskIds(parsed.data, toIds(input.completedTaskIds));
  const pinnedTaskIds = pruneTaskIds(parsed.data, toIds(input.pinnedTaskIds));

  // 画像整体透传，不在这里解读结构：它的 schema 由生成接口负责，
  // 这里只负责原样存回去供重新生成时使用
  const profile = input.profile === undefined ? null : JSON.stringify(input.profile);
  const now = new Date().toISOString();
  await db
    .insert(pathfinderPlans)
    .values({
      userId,
      plan: JSON.stringify(parsed.data),
      completedTaskIds: JSON.stringify(completedTaskIds),
      pinnedTaskIds: JSON.stringify(pinnedTaskIds),
      profile,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: pathfinderPlans.userId,
      set: {
        plan: JSON.stringify(parsed.data),
        completedTaskIds: JSON.stringify(completedTaskIds),
        pinnedTaskIds: JSON.stringify(pinnedTaskIds),
        // 只在本次带了画像时更新，避免一次普通的勾选完成把画像抹成 null
        ...(profile === null ? {} : { profile }),
        updatedAt: now,
      },
    });

  return {
    ok: true,
    state: {
      plan: parsed.data,
      completedTaskIds,
      pinnedTaskIds,
      profile: input.profile ?? null,
      updatedAt: now,
    },
  };
}

export async function deleteUserPlan(userId: string): Promise<boolean> {
  const rows = await db
    .delete(pathfinderPlans)
    .where(eq(pathfinderPlans.userId, userId))
    .returning({ userId: pathfinderPlans.userId });
  return rows.length > 0;
}

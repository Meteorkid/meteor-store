import { desc } from 'drizzle-orm';
import { db } from './db';
import { adminAuditLogs } from './db/schema';
import type { SessionPayload } from './auth';

export interface AdminAuditInput {
  action: string;
  targetType?: string;
  targetId?: string;
  /** 简短摘要（不含密钥/密码/正文全文），会以 JSON 序列化落库 */
  detail?: Record<string, unknown>;
  ip?: string;
}

/** 审计日志条目（detail 已反序列化为对象，反序列化失败时为 null）。 */
export interface AdminAuditEntry {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  detail: Record<string, unknown> | null;
  ip: string | null;
  createdAt: string;
}

/**
 * 记录一条管理员操作审计日志。
 *
 * 设计取舍：
 * - 在业务写成功**之后**调用，失败只 console.error 不抛出——
 *   审计表故障不应让管理操作回滚（Neon HTTP 无事务，回滚不了），
 *   但会留下 PM2/Sentry 告警，可事后补账。
 * - 管理员身份从 session 现取（email 快照），管理员注销后记录保留作留痕。
 */
export async function logAdminAction(
  session: SessionPayload,
  input: AdminAuditInput,
): Promise<void> {
  try {
    await db.insert(adminAuditLogs).values({
      id: crypto.randomUUID(),
      adminId: session.userId,
      adminEmail: session.email,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      detail: input.detail ? JSON.stringify(input.detail) : null,
      ip: input.ip,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('admin audit log write failed:', err);
  }
}

/**
 * 审计日志页一次展示的条数。页面文案里的数字也由它插值，
 * 别把数字同时写死在这里、页面和 messages/*.json 三处——改一处漏两处就会说谎。
 */
export const AUDIT_LOG_PAGE_SIZE = 200;

/** 查询最近的审计日志（只读、按时间倒序）。 */
export async function listAdminAuditLogs(
  limit = AUDIT_LOG_PAGE_SIZE,
): Promise<AdminAuditEntry[]> {
  const rows = await db
    .select()
    .from(adminAuditLogs)
    .orderBy(desc(adminAuditLogs.createdAt))
    .limit(Math.min(Math.max(limit, 1), 500));

  return rows.map((row) => {
    let detail: Record<string, unknown> | null = null;
    if (row.detail) {
      try {
        detail = JSON.parse(row.detail) as Record<string, unknown>;
      } catch {
        detail = null;
      }
    }
    return { ...row, detail };
  });
}

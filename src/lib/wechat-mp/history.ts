import { and, desc, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { adminAuditLogs } from '@/lib/db/schema';
import type { WechatDraftHistoryItem } from './types';

function parseDetail(value: string | null): Record<string, unknown> | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * 从管理员审计日志里还原最近的「日刊草稿已创建」记录。
 *
 * 这只是一份轻量工作台状态，不替代公众号后台的草稿箱：管理员删掉草稿后，
 * 这里仍会显示已创建，需要重新生成时仍可在下方表单里手动提交。
 * 查询失败返回空列表，不能让历史状态把整个管理页带崩。
 */
export async function listDailyDraftHistory(limit = 30): Promise<WechatDraftHistoryItem[]> {
  try {
    const rows = await db
      .select({
        targetId: adminAuditLogs.targetId,
        detail: adminAuditLogs.detail,
        createdAt: adminAuditLogs.createdAt,
      })
      .from(adminAuditLogs)
      .where(and(
        eq(adminAuditLogs.action, 'wechat-draft.create'),
        eq(adminAuditLogs.targetType, 'wechat-draft'),
      ))
      .orderBy(desc(adminAuditLogs.createdAt))
      .limit(Math.min(Math.max(limit * 4, 50), 500));

    return rows.flatMap((row) => {
      if (!row.targetId) return [];
      const detail = parseDetail(row.detail);
      const sourceKey = typeof detail?.sourceKey === 'string' ? detail.sourceKey : '';
      if (!sourceKey.startsWith('daily:')) return [];
      return [{
        mediaId: row.targetId,
        sourceKey,
        title: typeof detail?.title === 'string' ? detail.title : '',
        createdAt: row.createdAt,
      }];
    }).slice(0, Math.min(Math.max(limit, 1), 100));
  } catch (error) {
    console.error('wechat daily draft history read failed:', error);
    return [];
  }
}

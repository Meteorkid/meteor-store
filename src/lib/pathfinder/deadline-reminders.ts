import crypto from 'crypto';
import { eq, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { pathfinderDeadlineReminders, pathfinderSaves, users } from '@/lib/db/schema';
import { sendPathfinderDeadlineReminder } from '@/lib/email';
import { listCatalogItems } from './catalog';
import { catalogDeadlineTimestamp, localizedText } from './catalog-view';
import type { PathfinderCatalogItem } from './catalog-types';

/**
 * 收藏条目的截止提醒。
 *
 * 收藏解决「我以后要看」，但机会本身有时效——竞赛报名会关闭、岗位会下架。
 * 一条收藏如果只是躺在列表里，到期那天用户多半正忙别的事，这份收藏就白收了。
 *
 * 只提醒「还没截止、且进入提醒窗口」的条目：已经过期的不补发，
 * 那时候提醒除了让人难受没有任何用处（与 Pass 到期提醒同一条判断）。
 *
 * 幂等由 pathfinder_deadline_reminders 的 (user_id, item_id, deadline) 唯一索引保证。
 * 官方改期后 deadline 变化，才会对新日期再发一次——这正是想要的：延期是新信息。
 */

/** 默认提醒窗口：截止前 3 天内。 */
export const DEFAULT_REMINDER_WINDOW_DAYS = 3;

export interface PathfinderReminderCandidate {
  userId: string;
  itemId: string;
  /** 去重键用的截止时间原文，改期后会变化 */
  deadline: string;
  daysLeft: number;
}

export interface PathfinderDeadlineReminderResult {
  checked: number;
  reminded: number;
  skipped: number;
}

/**
 * 从收藏记录和条目里挑出该提醒的组合。
 *
 * 纯函数，不碰数据库——提醒窗口的边界（刚好过期、正好还剩窗口最后一天、
 * 用户关掉了提醒、条目没有截止时间）都是这里判断的，必须能单测。
 */
export function selectReminderCandidates(
  saves: ReadonlyArray<{ userId: string; itemId: string; remindDeadline: boolean }>,
  items: ReadonlyArray<PathfinderCatalogItem>,
  now: Date,
  windowDays = DEFAULT_REMINDER_WINDOW_DAYS,
): PathfinderReminderCandidate[] {
  const itemsById = new Map(items.map((item) => [item.id, item]));
  const windowMs = windowDays * 86_400_000;
  const nowTime = now.getTime();
  const candidates: PathfinderReminderCandidate[] = [];

  for (const save of saves) {
    if (!save.remindDeadline) continue;
    const item = itemsById.get(save.itemId);
    if (!item || item.status !== 'published') continue;

    // 用保守的日末口径判断是否已过期，与列表页的过期判断保持一致，
    // 避免出现「列表还显示可报名，提醒却认为已经结束」
    const expiry = catalogDeadlineTimestamp(item, true);
    const deadline = catalogDeadlineTimestamp(item);
    if (expiry === null || deadline === null) continue;
    if (expiry <= nowTime) continue;
    if (deadline > nowTime + windowMs) continue;

    candidates.push({
      userId: save.userId,
      itemId: save.itemId,
      // 去重键用原始字段而不是时间戳：官方从「只有日期」改成「精确到时刻」时
      // 时间戳可能不变，但那确实是一次值得再提醒的改期
      deadline: item.deadlineAt ?? item.deadlineDate ?? '',
      daysLeft: Math.max(0, Math.ceil((expiry - nowTime) / 86_400_000)),
    });
  }

  return candidates;
}

/** 发送所有到窗口的截止提醒。由 cron 调用。 */
export async function notifyPathfinderDeadlines(
  now = new Date(),
  windowDays = DEFAULT_REMINDER_WINDOW_DAYS,
): Promise<PathfinderDeadlineReminderResult> {
  const saves = await db
    .select({
      userId: pathfinderSaves.userId,
      itemId: pathfinderSaves.itemId,
      remindDeadline: pathfinderSaves.remindDeadline,
    })
    .from(pathfinderSaves);

  if (saves.length === 0) return { checked: 0, reminded: 0, skipped: 0 };

  const catalog = await listCatalogItems();
  const candidates = selectReminderCandidates(saves, catalog, now, windowDays);
  if (candidates.length === 0) return { checked: saves.length, reminded: 0, skipped: 0 };

  const itemsById = new Map(catalog.map((item) => [item.id, item]));
  const recipients = await db
    .select({ id: users.id, email: users.email, emailVerified: users.emailVerified })
    .from(users)
    .where(inArray(users.id, [...new Set(candidates.map((candidate) => candidate.userId))]));
  const emailByUser = new Map(
    recipients
      // 未验证邮箱不发信：这类地址可能根本不属于注册者
      .filter((row) => row.emailVerified && row.email)
      .map((row) => [row.id, row.email]),
  );

  let reminded = 0;
  let skipped = 0;

  for (const candidate of candidates) {
    const email = emailByUser.get(candidate.userId);
    const item = itemsById.get(candidate.itemId);
    if (!email || !item) {
      skipped += 1;
      continue;
    }

    // 先占位再发信：唯一索引冲突说明这条已经提醒过，直接跳过。
    // 反过来「先发信再记录」会在写入失败时重复轰炸用户。
    const inserted = await db
      .insert(pathfinderDeadlineReminders)
      .values({
        id: crypto.randomUUID(),
        userId: candidate.userId,
        itemId: candidate.itemId,
        deadline: candidate.deadline,
        sentAt: now.toISOString(),
      })
      .onConflictDoNothing()
      .returning({ id: pathfinderDeadlineReminders.id });

    if (inserted.length === 0) {
      skipped += 1;
      continue;
    }

    try {
      await sendPathfinderDeadlineReminder({
        email,
        title: localizedText(item.title, 'zh'),
        organization: localizedText(item.organization, 'zh'),
        daysLeft: candidate.daysLeft,
        itemUrl: `/pathfinder/items/${item.id}`,
      });
      reminded += 1;
    } catch (error) {
      // 发信失败就撤回占位，让下一轮 cron 重试；留着占位等于永久吞掉这条提醒
      await db
        .delete(pathfinderDeadlineReminders)
        .where(eq(pathfinderDeadlineReminders.id, inserted[0].id));
      console.error('Pathfinder deadline reminder failed:', error);
      skipped += 1;
    }
  }

  return { checked: saves.length, reminded, skipped };
}

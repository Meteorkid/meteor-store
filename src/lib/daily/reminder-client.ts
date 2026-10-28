'use client';

import type { DailyReminder } from './types';

interface ReminderState { reminder: DailyReminder | null; readDate: string; failed: boolean }
export const EMPTY_REMINDER_STATE: ReminderState = { reminder: null, readDate: '', failed: false };
const states = new Map<string, ReminderState>();
const pending = new Map<string, { controller: AbortController; timer: ReturnType<typeof setTimeout> }>();
const fetchedAt = new Map<string, number>();
const versions = new Map<string, number>();
const invalidating = new Set<string>();
const volatileReadDates = new Map<string, string>();
const listeners = new Set<() => void>();
const keyFor = (userId: string) => `ms_daily_reminder_read:${userId}`;

export function subscribeDailyReminder(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function getReminderState(userId: string | null) {
  return userId ? states.get(userId) ?? EMPTY_REMINDER_STATE : EMPTY_REMINDER_STATE;
}
function update(userId: string, value: ReminderState) {
  states.set(userId, value);
  listeners.forEach(listener => listener());
}
function readDate(userId: string) {
  const dates = [volatileReadDates.get(userId), states.get(userId)?.readDate];
  try { dates.push(localStorage.getItem(keyFor(userId)) ?? ''); } catch { /* 保留本页的已读进度。 */ }
  return dates.filter((date): date is string => typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)).sort().at(-1) ?? '';
}

/** 两处铃铛共享请求；账号切换和偏好修改后，旧请求不能覆盖新状态。 */
export function ensureDailyReminder(userId: string, force = false) {
  if (force) {
    // 同一偏好事件会被桌面、移动铃铛同时收到，只允许本轮事件失效一次。
    if (invalidating.has(userId)) return;
    invalidating.add(userId);
    queueMicrotask(() => invalidating.delete(userId));
    versions.set(userId, (versions.get(userId) ?? 0) + 1);
    const previous = pending.get(userId);
    previous?.controller.abort();
    if (previous) clearTimeout(previous.timer);
    pending.delete(userId);
    fetchedAt.delete(userId);
    update(userId, { reminder: null, readDate: readDate(userId), failed: false });
  }
  if (pending.has(userId) || Date.now() - (fetchedAt.get(userId) ?? 0) < 60_000) return;
  const version = versions.get(userId) ?? 0;
  const controller = new AbortController();
  const timer = setTimeout(() => {
    if (version !== (versions.get(userId) ?? 0)) return;
    // 即使底层请求忽略取消，超时也必须解除占位并拒收迟到响应。
    versions.set(userId, version + 1);
    pending.delete(userId);
    controller.abort();
    update(userId, { reminder: null, readDate: readDate(userId), failed: true });
  }, 15_000);
  pending.set(userId, { controller, timer });
  void fetch('/api/daily/reminder', { cache: 'no-store', signal: controller.signal })
    .then(async response => {
      if (!response.ok) throw new Error('Reminder unavailable');
      const data = await response.json() as { userId?: string; reminder?: DailyReminder | null };
      if (data.userId !== userId) throw new Error('Account changed');
      if (version !== (versions.get(userId) ?? 0)) return;
      update(userId, { reminder: data.reminder ?? null, readDate: readDate(userId), failed: false });
      fetchedAt.set(userId, Date.now());
    }).catch(() => {
      if (version === (versions.get(userId) ?? 0)) {
        update(userId, { reminder: null, readDate: readDate(userId), failed: true });
      }
    }).finally(() => {
      clearTimeout(timer);
      if (version === (versions.get(userId) ?? 0)) pending.delete(userId);
    });
}

export function markDailyReminderRead(userId: string) {
  const state = getReminderState(userId);
  if (!state.reminder) return;
  const date = [state.reminder.date, readDate(userId)].sort().at(-1)!;
  try {
    localStorage.setItem(keyFor(userId), date);
    volatileReadDates.delete(userId);
  } catch { volatileReadDates.set(userId, date); }
  update(userId, { ...state, readDate: date });
}

export function syncDailyReminderRead(userId: string) {
  update(userId, { ...getReminderState(userId), readDate: readDate(userId) });
}

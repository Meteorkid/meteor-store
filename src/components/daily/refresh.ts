import type { DailyEdition } from '@/lib/daily/types';

export const DAILY_REFRESH_INTERVAL = 60_000;

export async function fetchDailyEditions(date: string, signal?: AbortSignal): Promise<DailyEdition[]> {
  const response = await fetch(`/api/daily?date=${encodeURIComponent(date)}`, { cache: 'no-store', signal });
  if (!response.ok) throw new Error('Daily content unavailable');
  const value = await response.json();
  if (value.date !== date || !Array.isArray(value.editions)) throw new Error('Daily edition changed');
  return value.editions;
}

/** 恢复阅读时只更新这一期公共内容；focus 和 visibilitychange 合并为一次请求。 */
export function subscribeDailyRefresh(date: string, onEditions: (editions: DailyEdition[]) => void, onFailure: () => void) {
  let lastAttempt = Date.now();
  let request: AbortController | null = null;
  let disposed = false;
  const resume = async () => {
    if (document.visibilityState !== 'visible' || request || Date.now() - lastAttempt < DAILY_REFRESH_INTERVAL) return;
    lastAttempt = Date.now();
    const controller = new AbortController();
    request = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    try {
      const editions = await fetchDailyEditions(date, controller.signal);
      if (!disposed) onEditions(editions);
    } catch {
      if (!disposed) onFailure();
    } finally {
      window.clearTimeout(timeout);
      request = null;
    }
  };
  window.addEventListener('focus', resume);
  document.addEventListener('visibilitychange', resume);
  return () => {
    disposed = true;
    request?.abort();
    window.removeEventListener('focus', resume);
    document.removeEventListener('visibilitychange', resume);
  };
}

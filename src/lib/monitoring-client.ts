'use client';

import { parseMonitoringResponse, type MonitoringSnapshot } from './monitoring-types';

interface MonitoringState { snapshot: MonitoringSnapshot | null; readEventId: string; failed: boolean }
export const EMPTY_MONITORING_STATE: MonitoringState = { snapshot: null, readEventId: '', failed: false };
const states = new Map<string, MonitoringState>();
const listeners = new Set<() => void>();
const active = new Map<string, {
  consumers: number;
  lastAttempt: number;
  pending: AbortController | null;
  stop: () => void;
}>();
const readKey = (userId: string) => `ms_monitoring_read_v1:${encodeURIComponent(userId)}`;
const volatileReads = new Map<string, string>();

export function subscribeMonitoring(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function getMonitoringState(userId: string | null) {
  return userId ? states.get(userId) ?? EMPTY_MONITORING_STATE : EMPTY_MONITORING_STATE;
}
function update(userId: string, state: MonitoringState) {
  states.set(userId, state);
  listeners.forEach(listener => listener());
}
function readEventId(userId: string) {
  if (volatileReads.has(userId)) return volatileReads.get(userId)!;
  try { return window.localStorage.getItem(readKey(userId)) ?? ''; }
  catch { return states.get(userId)?.readEventId ?? ''; }
}

export function ensureMonitoring(userId: string) {
  const watcher = active.get(userId);
  if (!watcher || watcher.pending || Date.now() - watcher.lastAttempt < 55_000) return;
  // 按开始时间节流，避免慢响应使下一分钟检查再次被60秒缓存挡住。
  watcher.lastAttempt = Date.now();
  const controller = new AbortController();
  watcher.pending = controller;
  const timeout = window.setTimeout(() => controller.abort(), 10_000);
  const current = () => active.get(userId) === watcher && watcher.pending === controller;
  void fetch('/api/admin/monitoring', { cache: 'no-store', signal: controller.signal })
    .then(async response => {
      if (!response.ok) throw new Error('Monitoring unavailable');
      const snapshot = parseMonitoringResponse(await response.json(), userId);
      if (!current() || controller.signal.aborted) return;
      update(userId, { snapshot, readEventId: readEventId(userId), failed: false });
    }).catch(() => {
      if (current()) update(userId, { snapshot: null, readEventId: readEventId(userId), failed: true });
    }).finally(() => {
      window.clearTimeout(timeout);
      if (current()) watcher.pending = null;
    });
}

/** 桌面、手机铃铛共用一次轮询；最后一个消费者离开时作废该身份的全部响应和缓存。 */
export function watchMonitoring(userId: string) {
  let watcher = active.get(userId);
  if (watcher) {
    watcher.consumers += 1;
  } else {
    const refresh = () => ensureMonitoring(userId);
    const visible = () => { if (document.visibilityState === 'visible') refresh(); };
    const syncRead = (event: StorageEvent) => {
      if (event.key === readKey(userId) || event.key === null) {
        update(userId, { ...getMonitoringState(userId), readEventId: readEventId(userId) });
      }
    };
    const timer = window.setInterval(refresh, 60_000);
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', syncRead);
    document.addEventListener('visibilitychange', visible);
    watcher = {
      consumers: 1, lastAttempt: -Infinity, pending: null,
      stop: () => {
        window.clearInterval(timer);
        window.removeEventListener('focus', refresh);
        window.removeEventListener('storage', syncRead);
        document.removeEventListener('visibilitychange', visible);
      },
    };
    active.set(userId, watcher);
    ensureMonitoring(userId);
  }
  const ownedWatcher = watcher;
  return () => {
    if (active.get(userId) !== ownedWatcher || --ownedWatcher.consumers > 0) return;
    active.delete(userId);
    ownedWatcher.stop();
    ownedWatcher.pending?.abort();
    states.delete(userId);
    listeners.forEach(listener => listener());
  };
}

export function hasUnreadMonitoring(userId: string | null) {
  const state = getMonitoringState(userId);
  const latest = state.snapshot?.events[0];
  return Boolean(latest && latest.id !== state.readEventId);
}

export function markMonitoringRead(userId: string) {
  const state = getMonitoringState(userId);
  const latest = state.snapshot?.events[0];
  if (!latest || !active.has(userId)) return;
  try {
    window.localStorage.setItem(readKey(userId), latest.id);
    volatileReads.delete(userId);
  } catch { volatileReads.set(userId, latest.id); }
  update(userId, { ...state, readEventId: latest.id });
}

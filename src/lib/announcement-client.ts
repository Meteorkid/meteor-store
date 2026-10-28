'use client';

import type { Announcement } from './announcement-text';

export interface AnnouncementState {
  items: Announcement[] | null;
  loading: boolean;
  failed: boolean;
  readAt: string;
}

export const EMPTY_ANNOUNCEMENT_STATE: AnnouncementState = { items: null, loading: false, failed: false, readAt: '' };
const STORAGE_KEY = 'ms_announcements_read_at';
const CACHE_TTL = 60_000;
const REQUEST_TIMEOUT = 15_000;
let state = EMPTY_ANNOUNCEMENT_STATE;
let fetchedAt = 0;
let watchers = 0;
let stopWatching: (() => void) | null = null;
const listeners = new Set<() => void>();
type PendingRequest = { controller: AbortController; cancel: () => void; timer: ReturnType<typeof setTimeout> | null; promise: Promise<void> };
let pending: PendingRequest | null = null;

function update(next: Partial<AnnouncementState>) {
  state = { ...state, ...next };
  listeners.forEach(listener => listener());
}

export function subscribeAnnouncements(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function getAnnouncementState() { return state; }

function normalizedTimestamp(value: unknown): string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(value)) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

export function announcementTimestamp(item: Announcement): string {
  return normalizedTimestamp(item.publishedAt ?? item.createdAt);
}

function parseAnnouncements(data: unknown): Announcement[] {
  const items = data && typeof data === 'object' && 'announcements' in data ? data.announcements : null;
  if (!Array.isArray(items)) throw new Error('Invalid announcements response');
  return items.map(value => {
    if (!value || typeof value !== 'object' || typeof value.id !== 'string' || !value.id || value.published !== true
      || !['titleZh', 'titleEn', 'bodyZh', 'bodyEn'].every(key => value[key] === null || typeof value[key] === 'string')
      || !normalizedTimestamp(value.createdAt) || !normalizedTimestamp(value.updatedAt)
      || (value.publishedAt !== null && !normalizedTimestamp(value.publishedAt))) {
      throw new Error('Invalid announcement');
    }
    return { id: value.id, titleZh: value.titleZh, titleEn: value.titleEn, bodyZh: value.bodyZh, bodyEn: value.bodyEn,
      published: true, publishedAt: value.publishedAt, createdAt: value.createdAt, updatedAt: value.updatedAt };
  });
}

function storedReadAt() {
  try { return normalizedTimestamp(window.localStorage.getItem(STORAGE_KEY)); }
  catch { return ''; }
}

export function syncAnnouncementsRead(incoming?: string | null) {
  const stored = storedReadAt();
  const readAt = [state.readAt, stored, normalizedTimestamp(incoming)].sort().at(-1)!;
  // 另一标签页的旧快照可能后写入；结合事件值恢复较新的边界，避免新标签页回退。
  if (readAt > stored) {
    try { window.localStorage.setItem(STORAGE_KEY, readAt); }
    catch { /* 存储失败不撤回当前标签页已确认的边界。 */ }
  }
  if (readAt > state.readAt) update({ readAt });
}

/** 只确认点击时已渲染的服务器公告；后台新到的一批不能被浏览器当前时间提前读掉。 */
export function markAnnouncementsRead(items: readonly Announcement[]) {
  const latest = items.reduce((timestamp, item) => {
    const publishedAt = announcementTimestamp(item);
    return publishedAt > timestamp ? publishedAt : timestamp;
  }, '');
  if (!latest) return;
  const readAt = [state.readAt, storedReadAt(), latest].sort().at(-1)!;
  try { window.localStorage.setItem(STORAGE_KEY, readAt); }
  catch { /* 存储不可用时保留当前标签页的已读状态。 */ }
  if (readAt !== state.readAt) update({ readAt });
}

export function hasUnreadAnnouncements() {
  return state.items?.some(item => announcementTimestamp(item) > state.readAt) ?? false;
}

/** 两个铃铛共用请求；失败不伪装成空列表，也不永久占住 pending。 */
export function ensureAnnouncements(force = false): Promise<void> {
  if (pending) return pending.promise;
  if (!force && !state.failed && state.items !== null && Date.now() - fetchedAt < CACHE_TTL) return Promise.resolve();
  const request: PendingRequest = { controller: new AbortController(), cancel: () => {}, timer: null, promise: Promise.resolve() };
  pending = request;
  update({ loading: true, failed: false });
  const cancelled = new Promise<never>((_, reject) => {
    request.cancel = () => { request.controller.abort(); reject(new Error('Announcements request cancelled')); };
    request.timer = setTimeout(request.cancel, REQUEST_TIMEOUT);
  });
  const response = (async () => {
    const result = await fetch('/api/announcements', { cache: 'no-store', signal: request.controller.signal });
    if (!result.ok) throw new Error('Announcements unavailable');
    return parseAnnouncements(await result.json());
  })();
  request.promise = Promise.race([response, cancelled]).then(items => {
    if (pending !== request || request.controller.signal.aborted) return;
    fetchedAt = Date.now();
    update({ items, failed: false });
  }).catch(() => {
    if (pending === request) update({ failed: true });
  }).finally(() => {
    if (request.timer !== null) clearTimeout(request.timer);
    if (pending === request) { pending = null; update({ loading: false }); }
  });
  return request.promise;
}

export function watchAnnouncements() {
  watchers += 1;
  if (watchers === 1) {
    syncAnnouncementsRead();
    const focus = () => { syncAnnouncementsRead(); if (document.visibilityState === 'visible') void ensureAnnouncements(); };
    const storage = (event: StorageEvent) => { if (event.key === STORAGE_KEY || event.key === null) syncAnnouncementsRead(event.newValue); };
    window.addEventListener('focus', focus);
    window.addEventListener('storage', storage);
    document.addEventListener('visibilitychange', focus);
    stopWatching = () => {
      window.removeEventListener('focus', focus);
      window.removeEventListener('storage', storage);
      document.removeEventListener('visibilitychange', focus);
    };
  }
  void ensureAnnouncements();
  let stopped = false;
  return () => {
    if (stopped) return;
    stopped = true;
    watchers -= 1;
    if (watchers > 0) return;
    stopWatching?.(); stopWatching = null;
    if (pending) {
      const request = pending;
      pending = null;
      request.cancel();
      update({ loading: false });
    }
  };
}

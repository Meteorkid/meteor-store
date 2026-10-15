'use client';

import type { MastersNotice } from './types';

interface NoticeState { notices: MastersNotice[]; failed: boolean; marking: boolean }
export const EMPTY_MASTERS_NOTICES: NoticeState = { notices: [], failed: false, marking: false };
const states = new Map<string, NoticeState>();
const pending = new Map<string, Promise<void>>();
const fetchedAt = new Map<string, number>();
const versions = new Map<string, number>();
const invalidating = new Set<string>();
const listeners = new Set<() => void>();

export function subscribeMastersNotices(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function getMastersNoticeState(userId: string | null) {
  return userId ? states.get(userId) ?? EMPTY_MASTERS_NOTICES : EMPTY_MASTERS_NOTICES;
}
function update(userId: string, state: NoticeState) {
  states.set(userId, state);
  listeners.forEach(listener => listener());
}
export function ensureMastersNotices(userId: string, force = false) {
  if (force) {
    if (invalidating.has(userId)) return;
    invalidating.add(userId);
    queueMicrotask(() => invalidating.delete(userId));
    versions.set(userId, (versions.get(userId) ?? 0) + 1);
    pending.delete(userId); fetchedAt.delete(userId);
    update(userId, EMPTY_MASTERS_NOTICES);
  }
  if (pending.has(userId) || Date.now() - (fetchedAt.get(userId) ?? 0) < 60_000) return;
  const version = versions.get(userId) ?? 0;
  const request = fetch('/api/masters/notices', { cache: 'no-store' }).then(async response => {
    if (!response.ok) throw new Error('Reminders unavailable');
    const data = await response.json() as { userId?: string; notices?: MastersNotice[] };
    if (data.userId !== userId || !Array.isArray(data.notices)) throw new Error('Account changed');
    if (version !== (versions.get(userId) ?? 0)) return;
    update(userId, { notices: data.notices, failed: false, marking: false });
    fetchedAt.set(userId, Date.now());
  }).catch(() => {
    if (version === (versions.get(userId) ?? 0)) update(userId, { notices: [], failed: true, marking: false });
  }).finally(() => {
    if (version === (versions.get(userId) ?? 0)) pending.delete(userId);
  });
  pending.set(userId, request);
}

export async function markMastersRead(userId: string, ids: string[]) {
  const state = getMastersNoticeState(userId);
  if (!ids.length || state.marking) return;
  update(userId, { ...state, marking: true, failed: false });
  try {
    const response = await fetch('/api/masters/notices', { method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-Masters-User': userId }, body: JSON.stringify({ ids }) });
    const data = await response.json();
    if (!response.ok || data.userId !== userId) throw new Error('Could not mark reminders read');
    ensureMastersNotices(userId, true);
  } catch { update(userId, { ...getMastersNoticeState(userId), marking: false, failed: true }); }
}

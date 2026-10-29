'use client';

import type { MastersNotice } from '@/lib/masters/types';
import { admissionsConfig, type AdmissionsKind } from './config';

export interface AdmissionsNoticeState { notices: MastersNotice[]; failed: boolean; marking: boolean }

/** 每个学位独立实例，账号缓存、请求版本和已读操作不会跨表共用。 */
export function createAdmissionsNoticeClient(kind: AdmissionsKind) {
  const config = admissionsConfig[kind];
  const EMPTY_NOTICES: AdmissionsNoticeState = { notices: [], failed: false, marking: false };
  const states = new Map<string, AdmissionsNoticeState>();
  const pending = new Map<string, Promise<void>>();
  const fetchedAt = new Map<string, number>();
  const versions = new Map<string, number>();
  const invalidating = new Set<string>();
  const listeners = new Set<() => void>();

  function subscribeNotices(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }
  function getNoticeState(userId: string | null) {
    return userId ? states.get(userId) ?? EMPTY_NOTICES : EMPTY_NOTICES;
  }
  function update(userId: string, state: AdmissionsNoticeState) {
    states.set(userId, state);
    listeners.forEach(listener => listener());
  }
  function ensureNotices(userId: string, force = false) {
    if (force) {
      if (invalidating.has(userId)) return;
      invalidating.add(userId);
      queueMicrotask(() => invalidating.delete(userId));
      versions.set(userId, (versions.get(userId) ?? 0) + 1);
      pending.delete(userId); fetchedAt.delete(userId);
      update(userId, EMPTY_NOTICES);
    }
    if (pending.has(userId) || Date.now() - (fetchedAt.get(userId) ?? 0) < 60_000) return;
    const version = versions.get(userId) ?? 0;
    const request = fetch(`${config.apiBase}/notices`, { cache: 'no-store' }).then(async response => {
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

  async function markRead(userId: string, ids: string[]) {
    const state = getNoticeState(userId);
    if (!ids.length || state.marking) return;
    update(userId, { ...state, marking: true, failed: false });
    try {
      const response = await fetch(`${config.apiBase}/notices`, { method: 'PATCH',
        headers: { 'Content-Type': 'application/json', [config.ownerHeader]: userId }, body: JSON.stringify({ ids }) });
      const data = await response.json();
      if (!response.ok || data.userId !== userId) throw new Error('Could not mark reminders read');
      ensureNotices(userId, true);
    } catch { update(userId, { ...getNoticeState(userId), marking: false, failed: true }); }
  }
  return { EMPTY_NOTICES, subscribeNotices, getNoticeState, ensureNotices, markRead };
}

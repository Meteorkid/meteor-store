'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { dailyDate, type DailyChannelId } from './types';
import {
  DailyPanelSettingsSchema, DailyPanelPreferencesResponseSchema, DailyPreviewResponseSchema,
  defaultDailyPanelSettings, type DailyPanelSettings, type DailyPreviewResponse,
} from './panel-types';
import { DAILY_PREFERENCES_EVENT, DAILY_STORAGE_EVENT, GUEST_PREFERENCES_KEY, parseGuestPreferences } from '@/components/daily/state';

export const GUEST_PANEL_SETTINGS_KEY = 'ms_daily_panel_settings_v1:guest';
const SETTINGS_EVENT = 'daily-panel-settings-changed';
const CACHE_MS = 60_000;
const TIMEOUT_MS = 15_000;
export type DailyPanelSaveError = 'login' | 'changed' | 'conflict' | 'failed' | 'storage' | null;
interface PreviewState { data: DailyPreviewResponse | null; loading: boolean; failed: boolean }
interface PreferencesState {
  settings: DailyPanelSettings | null; revision: string | null; followedChannels: DailyChannelId[] | null;
  loaded: boolean; loading: boolean; failed: boolean; changed: boolean; saving: boolean; saveError: DailyPanelSaveError;
}
interface PendingRead { controller: AbortController; promise: Promise<void> }
export const EMPTY_PANEL_PREVIEW: PreviewState = { data: null, loading: false, failed: false };
export const EMPTY_PANEL_PREFERENCES: PreferencesState = {
  settings: null, revision: null, followedChannels: null, loaded: false, loading: false,
  failed: false, changed: false, saving: false, saveError: null,
};
const listeners = new Set<() => void>();
const preferences = new Map<string, PreferencesState>();
const preferenceReads = new Map<string, PendingRead>();
const preferenceFetchedAt = new Map<string, number>();
const saves = new Map<string, Promise<boolean>>();
const forced = new Set<string>();
let preview = EMPTY_PANEL_PREVIEW;
let previewDay = '';
let previewFetchedAt = 0;
let previewRead: PendingRead | null = null;
const keyFor = (owner: string | null) => owner === null ? 'guest' : `user:${owner}`;
const emit = () => listeners.forEach(listener => listener());
export function subscribeDailyPanel(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export function getDailyPanelPreviewState() { return previewDay === dailyDate() ? preview : EMPTY_PANEL_PREVIEW; }
export function getDailyPanelPreferencesState(owner: string | null) { return preferences.get(keyFor(owner)) ?? EMPTY_PANEL_PREFERENCES; }
function updatePreferences(owner: string | null, change: Partial<PreferencesState>) {
  preferences.set(keyFor(owner), { ...getDailyPanelPreferencesState(owner), ...change }); emit();
}
function forceOnce(key: string, force: boolean) {
  if (!force || forced.has(key)) return false;
  forced.add(key); queueMicrotask(() => forced.delete(key)); return true;
}

/** 两处铃铛共用公开预览，私有设置不进入这份缓存。 */
export function ensureDailyPanelPreview(force = false): Promise<void> {
  const day = dailyDate();
  const refresh = forceOnce('preview', force);
  if (previewRead && !refresh && previewDay === day) return previewRead.promise;
  if (!refresh && previewDay === day && preview.data && Date.now() - previewFetchedAt < CACHE_MS) return Promise.resolve();
  previewRead?.controller.abort();
  const request: PendingRead = { controller: new AbortController(), promise: Promise.resolve() };
  previewRead = request;
  preview = { data: previewDay === day ? preview.data : null, loading: true, failed: false };
  previewDay = day; emit();
  request.promise = (async () => {
    const timeout = setTimeout(() => {
      request.controller.abort();
      if (previewRead === request && day === dailyDate()) { preview = { ...preview, loading: false, failed: true }; emit(); }
    }, TIMEOUT_MS);
    try {
      const response = await fetch(`/api/daily/preview?date=${day}&recent=1`, { cache: 'no-store', signal: request.controller.signal });
      if (!response.ok) throw new Error('Daily preview unavailable');
      const data = DailyPreviewResponseSchema.parse(await response.json());
      if (previewRead !== request || request.controller.signal.aborted || day !== dailyDate()) return;
      if (data.date !== day) throw new Error('Daily preview date changed');
      preview = { data, loading: false, failed: false }; previewFetchedAt = Date.now(); emit();
    } catch {
      if (previewRead === request && day === dailyDate()) {
        preview = { ...preview, loading: false, failed: true }; emit();
      }
    } finally {
      clearTimeout(timeout);
      if (previewRead === request) {
        previewRead = null;
        if (day !== dailyDate()) { preview = EMPTY_PANEL_PREVIEW; emit(); }
      }
    }
  })();
  return request.promise;
}

function readGuest() {
  const followedChannels = parseGuestPreferences(localStorage.getItem(GUEST_PREFERENCES_KEY))?.channels ?? null;
  const raw = localStorage.getItem(GUEST_PANEL_SETTINGS_KEY);
  if (!raw) return { settings: null, revision: null, followedChannels };
  try {
    const value = JSON.parse(raw);
    const settings = value.settings === null ? null : DailyPanelSettingsSchema.parse(value.settings);
    if (typeof value.revision !== 'string' || !Number.isFinite(Date.parse(value.revision))) throw new Error('Invalid local revision');
    return { settings, revision: value.revision, followedChannels };
  } catch { return { settings: null, revision: null, followedChannels }; }
}
export function syncGuestDailyPanelPreferences() {
  try { updatePreferences(null, { ...readGuest(), loaded: true, loading: false, failed: false, changed: false }); }
  catch {
    // 隐私模式仍能阅读默认内容，只有实际保存失败时才报告无法持久化。
    updatePreferences(null, { loaded: true, loading: false });
  }
}

export function ensureDailyPanelPreferences(owner: string | null, force = false): Promise<void> {
  if (owner === null) { syncGuestDailyPanelPreferences(); return Promise.resolve(); }
  const key = keyFor(owner);
  if (saves.has(key)) return saves.get(key)!.then(() => {});
  const refresh = forceOnce(key, force);
  const currentRead = preferenceReads.get(key);
  if (currentRead && !refresh) return currentRead.promise;
  if (!refresh && getDailyPanelPreferencesState(owner).loaded && Date.now() - (preferenceFetchedAt.get(key) ?? 0) < CACHE_MS) return Promise.resolve();
  currentRead?.controller.abort();
  const request: PendingRead = { controller: new AbortController(), promise: Promise.resolve() };
  preferenceReads.set(key, request);
  updatePreferences(owner, { loading: true, failed: false, changed: false });
  request.promise = (async () => {
    const timeout = setTimeout(() => {
      request.controller.abort();
      if (preferenceReads.get(key) === request) updatePreferences(owner, { loading: false, failed: true });
    }, TIMEOUT_MS);
    try {
      const response = await fetch('/api/daily/panel-preferences', { cache: 'no-store', signal: request.controller.signal });
      if (response.status === 401) {
        if (preferenceReads.get(key) === request) updatePreferences(owner, { ...EMPTY_PANEL_PREFERENCES, failed: true, changed: true });
        return;
      }
      if (!response.ok) throw new Error('Daily panel preferences unavailable');
      const data = DailyPanelPreferencesResponseSchema.parse(await response.json());
      if (preferenceReads.get(key) !== request || request.controller.signal.aborted) return;
      if (data.userId !== owner) {
        updatePreferences(owner, { ...EMPTY_PANEL_PREFERENCES, failed: true, changed: true }); return;
      }
      updatePreferences(owner, { settings: data.settings, revision: data.revision, followedChannels: data.followedChannels,
        loaded: true, loading: false, failed: false, changed: false });
      preferenceFetchedAt.set(key, Date.now());
    } catch {
      if (preferenceReads.get(key) === request) updatePreferences(owner, { loading: false, failed: true });
    } finally {
      clearTimeout(timeout);
      if (preferenceReads.get(key) === request) preferenceReads.delete(key);
    }
  })();
  return request.promise;
}

/** expectedRevision必须来自开始编辑时；后台刷新不能替用户更新这一版号。 */
export function saveDailyPanelPreferences(owner: string | null, settings: DailyPanelSettings | null, expectedRevision: string | null): Promise<boolean> {
  const key = keyFor(owner);
  if (saves.has(key)) return saves.get(key)!;
  const parsed = settings === null ? null : DailyPanelSettingsSchema.parse(settings);
  preferenceReads.get(key)?.controller.abort(); preferenceReads.delete(key);
  updatePreferences(owner, { saving: true, saveError: null });
  const request = (async () => {
    if (owner === null) {
      try {
        if (readGuest().revision !== expectedRevision) { updatePreferences(null, { saveError: 'conflict' }); return false; }
        const revision = new Date(Math.max(Date.now(), expectedRevision ? Date.parse(expectedRevision) + 1 : 0)).toISOString();
        localStorage.setItem(GUEST_PANEL_SETTINGS_KEY, JSON.stringify({ settings: parsed, revision }));
        syncGuestDailyPanelPreferences();
        window.dispatchEvent(new Event(SETTINGS_EVENT));
        return true;
      } catch { updatePreferences(null, { saveError: 'storage' }); return false; }
      finally { updatePreferences(null, { saving: false }); }
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch('/api/daily/panel-preferences', {
        method: 'PUT', cache: 'no-store', signal: controller.signal,
        headers: { 'Content-Type': 'application/json', 'X-Daily-User': owner },
        body: JSON.stringify({ settings: parsed, expectedRevision }),
      });
      if (controller.signal.aborted) throw new Error('Save confirmation timed out');
      if (response.status === 401) { updatePreferences(owner, { saveError: 'login' }); return false; }
      if (response.status === 409) {
        const body = await response.json();
        updatePreferences(owner, { saveError: body?.code === 'account_changed' ? 'changed' : 'conflict' }); return false;
      }
      if (!response.ok) throw new Error('Daily panel save failed');
      const data = DailyPanelPreferencesResponseSchema.parse(await response.json());
      if (controller.signal.aborted) throw new Error('Save confirmation timed out');
      if (data.userId !== owner) { updatePreferences(owner, { saveError: 'changed' }); return false; }
      updatePreferences(owner, { settings: data.settings, revision: data.revision, followedChannels: data.followedChannels,
        loaded: true, failed: false, loading: false, changed: false, saveError: null });
      preferenceFetchedAt.set(key, Date.now());
      window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: owner }));
      return true;
    } catch { updatePreferences(owner, { saveError: 'failed' }); return false; }
    finally { clearTimeout(timeout); updatePreferences(owner, { saving: false }); }
  })();
  saves.set(key, request);
  void request.finally(() => { if (saves.get(key) === request) saves.delete(key); });
  return request;
}

export function useDailyPanel(userId: string | null, authLoading = false, active = true) {
  const subscribe = useCallback((listener: () => void) => active ? subscribeDailyPanel(listener) : () => {}, [active]);
  const content = useSyncExternalStore(subscribe, getDailyPanelPreviewState, () => EMPTY_PANEL_PREVIEW);
  const account = useSyncExternalStore(subscribe, useCallback(() => getDailyPanelPreferencesState(userId), [userId]), () => EMPTY_PANEL_PREFERENCES);
  useEffect(() => {
    if (!active) return;
    void ensureDailyPanelPreview();
    // 再次打开时确认云端版本，避免另一设备刚保存仍被本机一分钟缓存遮住。
    if (!authLoading) void ensureDailyPanelPreferences(userId, userId !== null);
    const refresh = () => {
      if (document.visibilityState === 'hidden') return;
      void ensureDailyPanelPreview();
      if (!authLoading) void ensureDailyPanelPreferences(userId);
    };
    const preferencesChanged = () => { if (!authLoading) void ensureDailyPanelPreferences(userId, true); };
    const storageChanged = (event: StorageEvent) => {
      if (!userId && (event.key === null || event.key === GUEST_PANEL_SETTINGS_KEY || event.key === GUEST_PREFERENCES_KEY)) syncGuestDailyPanelPreferences();
    };
    const panelChanged = (event: Event) => {
      if (!userId) syncGuestDailyPanelPreferences();
      else if ((event as CustomEvent).detail === userId) emit();
    };
    const timer = window.setInterval(refresh, CACHE_MS);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener(DAILY_PREFERENCES_EVENT, preferencesChanged);
    window.addEventListener(DAILY_STORAGE_EVENT, preferencesChanged);
    window.addEventListener('storage', storageChanged);
    window.addEventListener(SETTINGS_EVENT, panelChanged);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener(DAILY_PREFERENCES_EVENT, preferencesChanged);
      window.removeEventListener(DAILY_STORAGE_EVENT, preferencesChanged);
      window.removeEventListener('storage', storageChanged);
      window.removeEventListener(SETTINGS_EVENT, panelChanged);
    };
  }, [userId, authLoading, active]);
  const defaultSettings = defaultDailyPanelSettings(account.followedChannels);
  return {
    preview: content.data, contentLoading: content.loading || !content.data && !content.failed, contentFailed: content.failed,
    settings: account.settings, effectiveSettings: account.changed ? defaultDailyPanelSettings() : account.settings ?? defaultSettings, defaultSettings,
    preferencesLoading: authLoading || account.loading || !account.loaded && !account.failed,
    preferencesFailed: account.failed, preferencesChanged: account.changed,
    preferencesReady: !authLoading && account.loaded && !account.failed && !account.changed,
    revision: account.revision, saving: account.saving, saveError: account.saveError,
    refresh: () => ensureDailyPanelPreview(true), reload: () => ensureDailyPanelPreferences(userId, true),
    clearSaveError: () => updatePreferences(userId, { saveError: null }),
    save: (settings: DailyPanelSettings | null, expectedRevision: string | null) => saveDailyPanelPreferences(userId, settings, expectedRevision),
  };
}

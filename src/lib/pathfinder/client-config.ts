'use client';

import { useSyncExternalStore } from 'react';
import {
  PathfinderModelConfig,
  PathfinderModelConfigSchema,
} from './schema';

const STORAGE_KEY = 'meteor-pathfinder:model-config';
const CHANGE_EVENT = 'meteor-pathfinder:model-config-changed';

interface StoredModelConfig extends PathfinderModelConfig {
  savedAt: number;
}

let cachedRaw: string | null | undefined;
let cachedValue: StoredModelConfig | null = null;

function readModelConfig(): StoredModelConfig | null {
  if (typeof window === 'undefined') return null;

  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedValue;

  cachedRaw = raw;
  if (!raw) {
    cachedValue = null;
    return cachedValue;
  }

  try {
    const stored = JSON.parse(raw) as { savedAt?: unknown };
    const parsed = PathfinderModelConfigSchema.safeParse(stored);
    cachedValue = parsed.success
      ? { ...parsed.data, savedAt: Number(stored.savedAt) || Date.now() }
      : null;
  } catch {
    cachedValue = null;
  }

  return cachedValue;
}

function subscribe(listener: () => void) {
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener('storage', listener);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
}

function notifyConfigChange() {
  cachedRaw = undefined;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** 保存至当前浏览器会话；关闭浏览器标签页后失效。 */
export function savePathfinderModelConfig(config: PathfinderModelConfig) {
  window.sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...config, savedAt: Date.now() }),
  );
  notifyConfigChange();
}

/** 清除当前浏览器会话中的 API Key 与模型配置。 */
export function clearPathfinderModelConfig() {
  window.sessionStorage.removeItem(STORAGE_KEY);
  notifyConfigChange();
}

/** 订阅当前浏览器会话中的模型配置，不在服务端渲染时读取任何密钥。 */
export function usePathfinderModelConfig(): StoredModelConfig | null {
  return useSyncExternalStore(subscribe, readModelConfig, () => null);
}

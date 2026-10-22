import { open } from 'node:fs/promises';
import { join } from 'node:path';
import { MonitoringFileSchema, type MonitoringSnapshot } from './monitoring-types';

const MAX_STATE_BYTES = 128 * 1024;
export const MONITORING_STALE_MS = 3 * 60_000;

function emptySnapshot(status: 'not-configured' | 'unavailable'): MonitoringSnapshot {
  return { status, checkedAt: null, consecutiveFailures: 0, latencyMs: null, reason: null, incidentOpenedAt: null, events: [] };
}

/** 只返回受限字段；健康接口的原始错误、请求地址及本机文件路径不进入客户端。 */
export async function readMonitoringSnapshot(options: { stateFile?: string; now?: number } = {}): Promise<MonitoringSnapshot> {
  const stateFile = options.stateFile ?? process.env.HEALTH_CHECK_STATE_FILE ?? join(process.cwd(), 'data', 'monitoring', 'health.json');
  let file;
  try {
    file = await open(stateFile, 'r');
    const stat = await file.stat();
    if (!stat.isFile() || stat.size > MAX_STATE_BYTES) return emptySnapshot('unavailable');
    const parsed = MonitoringFileSchema.safeParse(JSON.parse(await file.readFile('utf8')));
    if (!parsed.success) return emptySnapshot('unavailable');
    const state = parsed.data;
    const age = (options.now ?? Date.now()) - Date.parse(state.checkedAt);
    return {
      status: age > MONITORING_STALE_MS || age < -60_000 ? 'stale' : state.status,
      checkedAt: state.checkedAt,
      consecutiveFailures: state.consecutiveFailures,
      latencyMs: state.lastResult.latencyMs,
      reason: state.lastResult.reason,
      incidentOpenedAt: state.incident?.openedAt ?? null,
      events: state.events,
    };
  } catch (error) {
    return emptySnapshot((error as NodeJS.ErrnoException).code === 'ENOENT' ? 'not-configured' : 'unavailable');
  } finally {
    await file?.close();
  }
}

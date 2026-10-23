import { open } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { RecheckFileSchema, type RecheckSnapshot } from './task-monitoring-types';

const EMPTY = { taskId: 'pathfinder-recheck' as const, lastAttemptAt: null, finishedAt: null, lastSuccessAt: null, dataUpdatedAt: null, consecutiveAnomalies: 0, result: null };

/** 与服务健康独立读取，缺失或损坏任务记录不会被解释为服务宕机。 */
export async function readRecheckSnapshot(options: { stateFile?: string; now?: number } = {}): Promise<RecheckSnapshot> {
  const stateFile = options.stateFile ?? process.env.PATHFINDER_RECHECK_STATE_FILE ?? join(
    process.env.HEALTH_CHECK_STATE_FILE ? dirname(process.env.HEALTH_CHECK_STATE_FILE) : join(process.cwd(), 'data', 'monitoring'),
    'pathfinder-recheck.json',
  );
  let file;
  try {
    file = await open(stateFile, 'r');
    const stat = await file.stat();
    if (!stat.isFile() || stat.size > 128 * 1024) return { ...EMPTY, status: 'unavailable' };
    const parsed = RecheckFileSchema.safeParse(JSON.parse(await file.readFile('utf8')));
    if (!parsed.success) return { ...EMPTY, status: 'unavailable' };
    const state = parsed.data;
    const now = options.now ?? Date.now();
    const age = now - Date.parse(state.lastAttemptAt);
    const futureTime = [state.finishedAt, state.lastSuccessAt, state.dataUpdatedAt].some(value => value !== null && Date.parse(value) > now + 60_000);
    return {
      taskId: state.taskId, lastAttemptAt: state.lastAttemptAt, finishedAt: state.finishedAt,
      lastSuccessAt: state.lastSuccessAt, dataUpdatedAt: state.dataUpdatedAt,
      consecutiveAnomalies: state.consecutiveAnomalies, result: state.result,
      status: age < -60_000 || futureTime || age > (state.status === 'running' ? 1 : 30) * 60 * 60_000 ? 'stale' : state.status,
    };
  } catch (error) {
    return { ...EMPTY, status: (error as NodeJS.ErrnoException).code === 'ENOENT' ? 'not-configured' : 'unavailable' };
  } finally { await file?.close(); }
}

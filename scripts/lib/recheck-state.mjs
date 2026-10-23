import { randomUUID } from 'node:crypto';
import { chmod, lstat, mkdir, open, rename, rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import { RecheckFileSchema } from '../../src/lib/task-monitoring-types.ts';

export class InvalidRecheckStateError extends Error {}

export async function readRecheckState(stateFile) {
  let file;
  try {
    file = await open(stateFile, 'r');
    const stat = await file.stat();
    if (!stat.isFile()) throw new Error('Task state is not a file');
    if (stat.size > 128 * 1024) throw new InvalidRecheckStateError('Invalid task state');
    const content = await file.readFile('utf8');
    try { return RecheckFileSchema.parse(JSON.parse(content)); }
    catch { throw new InvalidRecheckStateError('Invalid task state'); }
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  } finally { await file?.close(); }
}

/** 仅隔离这个任务自己的普通状态文件，不跟随符号链接改动其它数据。 */
export async function quarantineRecheckState(stateFile) {
  if (!(await lstat(stateFile)).isFile()) throw new Error('Task state is not a regular file');
  await chmod(dirname(stateFile), 0o700);
  await chmod(stateFile, 0o600);
  await rename(stateFile, `${stateFile}.${randomUUID()}.corrupt`);
}

/** 同目录临时文件 + rename，读者只能看到完整的新旧快照。 */
export async function saveRecheckState(stateFile, state) {
  const value = RecheckFileSchema.parse(state);
  await mkdir(dirname(stateFile), { recursive: true, mode: 0o700 });
  await chmod(dirname(stateFile), 0o700);
  const temporary = `${stateFile}.${randomUUID()}.tmp`;
  let file;
  try {
    file = await open(temporary, 'wx', 0o600);
    await file.writeFile(`${JSON.stringify(value)}\n`, 'utf8');
    await file.sync();
    await file.close(); file = undefined;
    await rename(temporary, stateFile);
  } finally {
    await file?.close();
    await rm(temporary, { force: true });
  }
}

export function beginRecheck(previous, at) {
  return {
    version: 1, taskId: 'pathfinder-recheck', status: 'running', lastAttemptAt: at, finishedAt: null,
    lastSuccessAt: previous?.lastSuccessAt ?? null, dataUpdatedAt: previous?.dataUpdatedAt ?? null,
    // 上一轮未完成也计入异常；新一轮完整完成后归零。
    consecutiveAnomalies: Math.min((previous?.consecutiveAnomalies ?? 0) + (previous?.status === 'running' ? 1 : 0), Number.MAX_SAFE_INTEGER),
    result: null,
  };
}

export function finishRecheck(started, result, at) {
  const status = result.reason || result.failed > 0 && result.verified === 0 ? 'failed' : result.failed > 0 ? 'partial' : 'ok';
  return {
    ...started, status, finishedAt: at, result,
    lastSuccessAt: status === 'ok' ? at : started.lastSuccessAt,
    dataUpdatedAt: result.archived > 0 ? at : started.dataUpdatedAt,
    consecutiveAnomalies: status === 'ok' ? 0 : Math.min(started.consecutiveAnomalies + 1, Number.MAX_SAFE_INTEGER),
  };
}

import { randomUUID } from 'node:crypto';
import { mkdir, open, readFile, rename, rm, stat, chmod } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REASONS = new Set(['network', 'http', 'invalid-response', 'degraded']);
const MAX_STATE_BYTES = 128 * 1024;
const MAX_RESPONSE_BYTES = 64 * 1024;
const isTime = value => typeof value === 'string' && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
const isId = value => typeof value === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(value);

function validState(value) {
  if (!value || value.version !== 1 || !isTime(value.checkedAt)
    || !['healthy', 'suspect', 'down'].includes(value.status)
    || !Number.isSafeInteger(value.consecutiveFailures) || value.consecutiveFailures < 0
    || !value.lastResult || typeof value.lastResult.healthy !== 'boolean'
    || !Number.isFinite(value.lastResult.latencyMs) || value.lastResult.latencyMs < 0
    || !Array.isArray(value.events) || value.events.length > 40) return false;
  if (value.status === 'healthy') {
    if (!value.lastResult.healthy || value.lastResult.reason !== null || value.consecutiveFailures !== 0 || value.incident !== null) return false;
  } else if (value.lastResult.healthy || !REASONS.has(value.lastResult.reason) || value.consecutiveFailures === 0
    || (value.status === 'suspect' ? value.incident !== null : !value.incident)) return false;
  if (value.incident && (!isId(value.incident.id) || !isTime(value.incident.openedAt) || !REASONS.has(value.incident.reason))) return false;
  return value.events.every(event => event && isId(event.id) && isId(event.incidentId) && isTime(event.at)
    && ['failure', 'recovery'].includes(event.kind)
    && (event.kind === 'recovery' ? event.reason === null : REASONS.has(event.reason)));
}

/** 不保留健康接口的error正文或URL，只存稳定的错误分类。 */
export function healthReason(httpStatus, payload, now = Date.now()) {
  if (httpStatus !== 200) return 'http';
  if (!payload || typeof payload !== 'object' || !isTime(payload.timestamp)
    || Math.abs(now - Date.parse(payload.timestamp)) > 5 * 60_000
    || !['healthy', 'degraded'].includes(payload.status)
    || !payload.checks || typeof payload.checks !== 'object' || Array.isArray(payload.checks)
    || !['self', 'database', 'redis'].every(name => payload.checks[name] && ['ok', 'error'].includes(payload.checks[name].status))
    || !Object.values(payload.checks).every(check => check && ['ok', 'error'].includes(check.status))) return 'invalid-response';
  return payload.status === 'healthy' && Object.values(payload.checks).every(check => check.status === 'ok') ? null : 'degraded';
}

export function advanceState(previous, result, threshold = 3, now = new Date().toISOString()) {
  const events = previous?.events ?? [];
  const consecutiveFailures = result.healthy ? 0 : Math.min((previous?.consecutiveFailures ?? 0) + 1, Number.MAX_SAFE_INTEGER);
  let incident = previous?.incident ?? null;
  let event = null;
  if (result.healthy && incident) {
    event = { id: randomUUID(), kind: 'recovery', at: now, incidentId: incident.id, reason: null };
    incident = null;
  } else if (!result.healthy && !incident && consecutiveFailures >= threshold) {
    incident = { id: randomUUID(), openedAt: now, reason: result.reason };
    event = { id: randomUUID(), kind: 'failure', at: now, incidentId: incident.id, reason: result.reason };
  }
  return {
    version: 1, checkedAt: now,
    status: result.healthy ? 'healthy' : incident ? 'down' : 'suspect',
    consecutiveFailures, lastResult: result, incident,
    events: (event ? [event, ...events] : events).slice(0, 40),
  };
}

async function checkHealth(url) {
  const started = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  let reason = 'network';
  try {
    const response = await fetch(url, { method: 'GET', cache: 'no-store', redirect: 'error', signal: controller.signal });
    if (response.status !== 200) {
      reason = 'http';
      await response.body?.cancel();
    } else {
      const reader = response.body?.getReader();
      const chunks = [];
      let size = 0;
      if (!reader) throw new Error('empty response');
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_RESPONSE_BYTES) {
          await reader.cancel();
          reason = 'invalid-response';
          break;
        }
        chunks.push(value);
      }
      if (size <= MAX_RESPONSE_BYTES) {
        try { reason = healthReason(response.status, JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
        catch { reason = 'invalid-response'; }
      }
    }
  } catch {
    reason = 'network';
  } finally { clearTimeout(timeout); }
  return { healthy: reason === null, reason, latencyMs: Math.round(performance.now() - started) };
}

async function readState(stateFile) {
  try {
    const info = await stat(stateFile);
    if (!info.isFile() || info.size > MAX_STATE_BYTES) throw new Error('invalid state');
    const state = JSON.parse(await readFile(stateFile, 'utf8'));
    if (!validState(state)) throw new Error('invalid state');
    // 即使旧文件有额外字段，重写时也只保留契约内的字段。
    return {
      ...state,
      incident: state.incident ? { id: state.incident.id, openedAt: state.incident.openedAt, reason: state.incident.reason } : null,
      events: state.events.map(({ id, kind, at, incidentId, reason }) => ({ id, kind, at, incidentId, reason })),
    };
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function saveState(stateFile, state) {
  await mkdir(dirname(stateFile), { recursive: true, mode: 0o700 });
  await chmod(dirname(stateFile), 0o700);
  const temporary = `${stateFile}.${randomUUID()}.tmp`;
  let handle;
  try {
    handle = await open(temporary, 'wx', 0o600);
    await handle.writeFile(`${JSON.stringify(state)}\n`, 'utf8');
    await handle.sync();
    await handle.close(); handle = undefined;
    await rename(temporary, stateFile);
  } finally {
    await handle?.close();
    await rm(temporary, { force: true });
  }
}

export async function main() {
  try {
    const baseUrl = process.argv[2];
    const endpoint = process.env.HEALTH_CHECK_URL ?? (baseUrl ? `${baseUrl.replace(/\/+$/, '')}/api/health` : 'https://www.imagentx.top/api/health');
    const url = new URL(endpoint);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('invalid URL');
    const threshold = Number(process.env.HEALTH_CHECK_FAILURE_THRESHOLD ?? 3);
    if (!Number.isInteger(threshold) || threshold < 1 || threshold > 10) throw new Error('invalid threshold');
    const stateFile = process.env.HEALTH_CHECK_STATE_FILE ?? fileURLToPath(new URL('../data/monitoring/health.json', import.meta.url));
    const previous = await readState(stateFile);
    const result = await checkHealth(url);
    const state = advanceState(previous, result, threshold);
    await saveState(stateFile, state);
    console.log(JSON.stringify({ status: state.status, checkedAt: state.checkedAt, consecutiveFailures: state.consecutiveFailures, reason: result.reason }));
    return result.healthy ? 0 : 1;
  } catch {
    console.error('{"error":"monitoring-check-unavailable"}');
    return 2;
  }
}

// 正常入口是health-check.sh；生产cron直接运行本文件时必须用flock包住。
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = await main();

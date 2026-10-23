import { execFileSync } from 'node:child_process';
import { readFile, writeFile, realpath, readdir, readlink } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const appName = 'meteor-store';
const node = '/usr/local/bin/node';

function pm2(args) {
  try {
    return execFileSync(node, ['/usr/local/bin/pm2', ...args], {
      cwd: appDir, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024,
      env: { ...process.env, PATH: `/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:${process.env.PATH ?? ''}` },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch { throw new Error(`pm2-${args[0]}-failed`); }
}

export function selectManagedApp(list) {
  if (!Array.isArray(list)) throw new Error('invalid-pm2-process-list');
  const matches = list.filter(app => app.name === appName);
  if (matches.length > 1) throw new Error('ambiguous-pm2-process');
  return matches[0] ?? null;
}

/** 备份含进程环境，调用方必须放在700目录；不打印原始jlist或env。 */
export function rollbackConfig(app) {
  if (!app) return { apps: [] };
  const previous = app.pm2_env;
  const config = { name: appName, script: previous.pm_exec_path, cwd: previous.pm_cwd,
    interpreter: previous.exec_interpreter, out_file: previous.pm_out_log_path, error_file: previous.pm_err_log_path };
  for (const key of ['args', 'node_args', 'env', 'exec_mode', 'instances', 'max_memory_restart', 'autorestart',
    'log_date_format', 'merge_logs', 'kill_timeout', 'listen_timeout', 'restart_delay', 'max_restarts', 'min_uptime', 'treekill']) {
    if (previous[key] !== undefined) config[key] = previous[key];
  }
  return { apps: [config] };
}

export async function activateConfig({ configFile, expectedScript, current, run = pm2 }) {
  // PM2 7的配置restart会保留旧pm_exec_path；只有迁移旧包装入口时重建这一条注册。
  const needsMigration = current && await realpath(current.pm2_env.pm_exec_path) !== await realpath(expectedScript);
  if (needsMigration) await run(['delete', String(current.pm_id)]);
  await run([!current || needsMigration ? 'start' : 'restart', configFile, '--only', appName, '--update-env']);
  return { migrated: Boolean(needsMigration) };
}

async function inspect() {
  let list;
  try { list = JSON.parse(pm2(['jlist'])); } catch { throw new Error('pm2-inspection-failed'); }
  return selectManagedApp(list);
}

async function ownsLoopbackListener(pid) {
  const entries = (await readFile('/proc/net/tcp', 'utf8')).split('\n').map(line => line.trim().split(/\s+/));
  const sockets = new Set(entries.filter(fields => fields[1] === '0100007F:0BB8' && fields[3] === '0A').map(fields => `socket:[${fields[9]}]`));
  for (const fd of await readdir(`/proc/${pid}/fd`)) {
    try { if (sockets.has(await readlink(`/proc/${pid}/fd/${fd}`))) return true; }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  return false;
}

async function verify(config, requireDirect = true) {
  const deadline = Date.now() + 30_000;
  let reason = 'runtime-not-ready';
  while (Date.now() < deadline) {
    try {
      const app = await inspect();
      if (!app || app.pm2_env.status !== 'online' || !app.pid) throw new Error('runtime-not-online');
      if (await realpath(app.pm2_env.pm_exec_path) !== await realpath(config.script)) throw new Error('runtime-script-mismatch');
      if (app.pm2_env.pm_cwd !== config.cwd) throw new Error('runtime-cwd-mismatch');
      if (await realpath(app.pm2_env.exec_interpreter) !== await realpath(config.interpreter)) throw new Error('runtime-interpreter-mismatch');
      for (const key of ['NODE_ENV', 'NODE_OPTIONS', 'HOSTNAME', 'PORT', 'TRUST_NGINX_PROXY']) {
        if (config.env?.[key] !== undefined && String(app.pm2_env[key]) !== String(config.env[key])) throw new Error('runtime-environment-mismatch');
      }
      if (process.platform !== 'linux') throw new Error('linux-runtime-verification-required');
      if (await realpath(`/proc/${app.pid}/exe`) !== await realpath(config.interpreter)) throw new Error('runtime-executable-mismatch');
      if (requireDirect && !await ownsLoopbackListener(app.pid)) throw new Error('managed-pid-does-not-own-loopback-listener');
      const response = await fetch('http://127.0.0.1:3000/api/health', { signal: AbortSignal.timeout(2000), redirect: 'error' });
      const body = await response.json();
      if (!response.ok || body.status !== 'healthy' || !['self', 'database', 'redis'].every(key => body.checks?.[key]?.status === 'ok')) throw new Error('runtime-health-unavailable');
      return { pid: app.pid, scriptMatches: true, loopbackOwnedByManagedPid: requireDirect ? true : null, memoryBytes: app.monit?.memory ?? null };
    } catch (error) {
      reason = /^[a-z-]+$/.test(error.message) ? error.message : 'runtime-validation-failed';
      await delay(500);
    }
  }
  throw new Error(reason);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [action, snapshot] = process.argv.slice(2);
    if (!['snapshot', 'stop', 'activate', 'verify', 'restore'].includes(action)) throw new Error('invalid-runtime-action');
    if (action === 'snapshot') {
      if (!snapshot?.startsWith('/')) throw new Error('private-snapshot-path-required');
      await writeFile(snapshot, JSON.stringify(rollbackConfig(await inspect())), { mode: 0o600, flag: 'wx' });
      console.log(JSON.stringify({ event: 'pm2_runtime_snapshot', saved: true }));
    } else if (action === 'stop') {
      const current = await inspect();
      if (current) pm2(['stop', String(current.pm_id)]);
    } else if (action === 'restore') {
      const saved = JSON.parse(await readFile(snapshot, 'utf8'));
      if (!Array.isArray(saved.apps) || saved.apps.length > 1 || (saved.apps[0] && saved.apps[0].name !== appName)) throw new Error('invalid-runtime-snapshot');
      const current = await inspect();
      if (current) pm2(['delete', String(current.pm_id)]);
      if (saved.apps.length) {
        pm2(['start', snapshot, '--only', appName]);
        await verify(saved.apps[0], false);
      }
      pm2(['save']);
      console.log(JSON.stringify({ event: 'pm2_runtime_restore', restored: true }));
    } else {
      const configFile = join(appDir, 'ecosystem.config.cjs');
      const config = createRequire(import.meta.url)(configFile).apps.find(app => app.name === appName);
      let migration = {};
      if (action === 'activate') {
        const version = execFileSync(config.interpreter, ['--version'], { encoding: 'utf8' }).trim();
        if (!/^v22\./.test(version)) throw new Error('production-node22-required');
        migration = await activateConfig({ configFile, expectedScript: config.script, current: await inspect() });
      }
      const result = await verify(config);
      if (action === 'activate') pm2(['save']);
      console.log(JSON.stringify({ event: 'pm2_runtime_verified', ...migration, ...result }));
    }
  } catch (error) {
    // 进程快照含环境变量，异常只输出固定类别，不能回显子进程输出。
    console.error(`运行进程操作失败：${/^[a-z0-9-]+$/.test(error.message) ? error.message : 'runtime-operation-failed'}`);
    process.exitCode = 1;
  }
}

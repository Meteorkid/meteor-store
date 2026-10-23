import { lstat, realpath, readdir, mkdir, open, link, unlink, readFile, writeFile, rename } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const LEGACY_NAME = /^imagentx\.top\.(?:access|error)\.log(?:-\d{8}(?:\.gz)?|\.\d+(?:\.gz)?|\.gz)?$/;
async function info(path) { try { return await lstat(path); } catch (error) { if (error.code === 'ENOENT') return null; throw error; } }
async function assertDirectory(path) {
  const value = await lstat(path);
  if (!value.isDirectory() || value.isSymbolicLink() || await realpath(path) !== resolve(path)) throw new Error('log-directory-must-be-real');
}
async function save(path, value) {
  const temporary = path + '.tmp';
  await writeFile(temporary, JSON.stringify(value, null, 2) + '\n', { mode: 0o600, flag: 'w' });
  await rename(temporary, path);
}
async function snapshot(source, target, bytes) {
  const input = await open(source, 'r');
  const output = await open(target, 'wx', 0o600);
  const hash = createHash('sha256');
  try {
    const buffer = Buffer.alloc(64 * 1024);
    let copied = 0;
    while (copied < bytes) {
      const { bytesRead } = await input.read(buffer, 0, Math.min(buffer.length, bytes - copied), copied);
      if (!bytesRead) throw new Error('source-shrank-during-backup');
      const data = buffer.subarray(0, bytesRead);
      await output.write(data); hash.update(data); copied += bytesRead;
    }
    await output.sync();
    return hash.digest('hex');
  } finally { await input.close(); await output.close(); }
}

/** 只允许本站两类日志；硬链接再unlink保留活动文件inode且原子拒绝目标覆盖。 */
export async function migrateLogs({ sourceDir, targetDir, backupDir, manifestPath, beforeMove }) {
  if (targetDir !== join(sourceDir, 'meteor-store')) throw new Error('invalid-log-target');
  await assertDirectory(sourceDir);
  await mkdir(targetDir, { recursive: true, mode: 0o755 });
  await assertDirectory(targetDir);
  await mkdir(backupDir, { recursive: true, mode: 0o700 });
  await assertDirectory(backupDir);
  if (dirname(manifestPath) !== backupDir) throw new Error('manifest-must-be-in-private-backup');
  const existing = await info(manifestPath);
  if (existing) {
    const previous = JSON.parse(await readFile(manifestPath, 'utf8'));
    if (previous.sourceDir !== sourceDir || previous.targetDir !== targetDir || previous.status !== 'moved') throw new Error('migration-needs-explicit-recovery');
    for (const file of previous.files) {
      const current = await info(join(targetDir, file.name));
      if (await info(join(sourceDir, file.name)) || !current || current.ino !== file.ino || current.dev !== file.dev) throw new Error('completed-migration-drifted');
    }
    return { moved: 0, reusedManifest: true };
  }
  const names = (await readdir(sourceDir)).filter(name => LEGACY_NAME.test(name)).sort();
  const files = [];
  for (const name of names) {
    const source = await lstat(join(sourceDir, name));
    if (!source.isFile() || source.isSymbolicLink() || source.nlink !== 1) throw new Error('legacy-log-must-be-owned-regular-file');
    if (await info(join(targetDir, name))) throw new Error('target-conflict');
    files.push({ name, ino: source.ino, dev: source.dev, mode: source.mode & 0o777, uid: source.uid, gid: source.gid,
      snapshotBytes: source.size, snapshotSha256: null, moved: false });
  }
  const manifest = { version: 1, sourceDir, targetDir, backupDir, status: 'preparing', files };
  await save(manifestPath, manifest);
  for (const file of files) file.snapshotSha256 = await snapshot(join(sourceDir, file.name), join(backupDir, file.name), file.snapshotBytes);
  manifest.status = 'moving'; await save(manifestPath, manifest);
  for (const file of files) {
    const source = join(sourceDir, file.name); const target = join(targetDir, file.name);
    const current = await lstat(source);
    if (current.ino !== file.ino || current.dev !== file.dev || current.isSymbolicLink()) throw new Error('source-changed-before-move');
    await beforeMove?.(file.name);
    await link(source, target); // EEXIST/EXDEV均保留原文件并停止，绝不覆盖。
    await unlink(source);
    file.moved = true; await save(manifestPath, manifest);
  }
  manifest.status = 'moved'; await save(manifestPath, manifest);
  return { moved: files.length, reusedManifest: false };
}

/** 在旧Nginx配置重新加载前回退路径，活动FD仍指向同一inode，不回灌旧内容。 */
export async function rollbackLogs(manifestPath, { checkOnly = false } = {}) {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (manifest.version !== 1 || !['preparing', 'moving', 'moved', 'rolled-back'].includes(manifest.status)
    || manifest.targetDir !== join(manifest.sourceDir, 'meteor-store')) throw new Error('invalid-rollback-manifest');
  await assertDirectory(manifest.sourceDir); await assertDirectory(manifest.targetDir);
  if (manifest.status === 'rolled-back') return { restored: 0 };
  const moves = [];
  for (const file of [...manifest.files].reverse()) {
    if (!LEGACY_NAME.test(file.name)) throw new Error('invalid-manifest-file');
    const source = join(manifest.sourceDir, file.name); const target = join(manifest.targetDir, file.name);
    const old = await info(source); const current = await info(target);
    if (!current && old?.ino === file.ino && old?.dev === file.dev) continue;
    if (!current || current.ino !== file.ino || current.dev !== file.dev) throw new Error('rollback-target-changed');
    if (old && (old.ino !== current.ino || old.dev !== current.dev)) throw new Error('rollback-source-conflict');
    moves.push({ source, target, old });
  }
  if (checkOnly) return { restored: 0, pending: moves.length };
  let restored = 0;
  for (const { source, target, old } of moves) {
    if (!old) await link(target, source);
    await unlink(target); restored += 1;
  }
  manifest.status = 'rolled-back'; await save(manifestPath, manifest);
  return { restored };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [action, backupDir] = process.argv.slice(2);
    if (!backupDir || !backupDir.startsWith('/') || !['apply', 'check', 'rollback'].includes(action)) throw new Error('invalid-migration-arguments');
    const manifestPath = join(backupDir, 'nginx-log-migration.json');
    const result = action === 'apply'
      ? await migrateLogs({ sourceDir: '/var/log/nginx', targetDir: '/var/log/nginx/meteor-store', backupDir, manifestPath })
      : await rollbackLogs(manifestPath, { checkOnly: action === 'check' });
    console.log(JSON.stringify({ event: 'nginx_log_migration', action, ...result }));
  } catch (error) {
    console.error(`Nginx日志迁移失败：${error.code ?? error.message}`);
    process.exitCode = 1;
  }
}

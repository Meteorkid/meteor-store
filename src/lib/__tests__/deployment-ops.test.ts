import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, writeFile, readFile, readdir, lstat, realpath, symlink, open, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

interface MigrationPaths {
  sourceDir: string; targetDir: string; backupDir: string; manifestPath: string;
  beforeMove?: (name: string) => Promise<void>;
}
const migrationUrl = pathToFileURL(resolve('deploy/migrate-nginx-logs.mjs')).href;
const runtimeUrl = pathToFileURL(resolve('deploy/pm2-runtime.mjs')).href;
const migration = await import(/* @vite-ignore */ migrationUrl) as {
  migrateLogs(paths: MigrationPaths): Promise<{ moved: number }>;
  rollbackLogs(path: string, options?: { checkOnly: boolean }): Promise<{ restored: number; pending?: number }>;
};
const runtime = await import(/* @vite-ignore */ runtimeUrl) as {
  selectManagedApp(list: unknown): unknown;
  rollbackConfig(app: unknown): { apps: Array<Record<string, unknown>> };
  activateConfig(input: { configFile: string; expectedScript: string; current: unknown; run: (args: string[]) => void }): Promise<{ migrated: boolean }>;
};
const guardUrl = pathToFileURL(resolve('deploy/assert-idle-product-updates.mjs')).href;
const guard = await import(/* @vite-ignore */ guardUrl) as {
  assertIdleProductUpdates(record: unknown, identity?: (pid: number) => Promise<string | undefined>, alive?: (pid: number) => boolean): Promise<void>;
};
const temporary: string[] = [];
afterEach(async () => { await Promise.all(temporary.splice(0).map(path => rm(path, { recursive: true, force: true }))); });

async function fixture(): Promise<MigrationPaths> {
  const dir = await realpath(await mkdtemp(join(tmpdir(), 'meteor-deploy-test-')));
  temporary.push(dir);
  const sourceDir = join(dir, 'nginx');
  await mkdir(sourceDir);
  return { sourceDir, targetDir: join(sourceDir, 'meteor-store'), backupDir: join(dir, 'backup'), manifestPath: join(dir, 'backup', 'manifest.json') };
}
const access = 'imagentx.top.access.log';

describe('本站日志迁移与回滚', () => {
  it('仅移动白名单文件，保留活动inode、权限和迁移后的新写入', async () => {
    const paths = await fixture();
    for (const name of [access, 'imagentx.top.error.log', 'imagentx.top.access.log-20261022.gz', 'imagentx.top.error.log.1', 'other.log', `${access}.unrelated`]) {
      await writeFile(join(paths.sourceDir, name), name + '\n', { mode: 0o640 });
    }
    const original = await lstat(join(paths.sourceDir, access));
    const handle = await open(join(paths.sourceDir, access), 'a');
    try {
      expect((await migration.migrateLogs(paths)).moved).toBe(4);
      await handle.write('after-migration\n');
    } finally { await handle.close(); }
    const current = await lstat(join(paths.targetDir, access));
    expect(current.ino).toBe(original.ino);
    expect(current.mode).toBe(original.mode);
    expect((await readdir(paths.sourceDir)).sort()).toEqual([`${access}.unrelated`, 'meteor-store', 'other.log']);
    expect((await migration.migrateLogs(paths)).moved).toBe(0);
    const beforeCheck = await readFile(paths.manifestPath, 'utf8');
    expect(await migration.rollbackLogs(paths.manifestPath, { checkOnly: true })).toMatchObject({ restored: 0, pending: 4 });
    expect(await readFile(paths.manifestPath, 'utf8')).toBe(beforeCheck);
    expect((await lstat(join(paths.targetDir, access))).ino).toBe(original.ino);
    await migration.rollbackLogs(paths.manifestPath);
    expect(await readFile(join(paths.sourceDir, access), 'utf8')).toContain('after-migration\n');
    expect((await migration.rollbackLogs(paths.manifestPath)).restored).toBe(0);
  });

  it('私有快照逐文件记录哈希，活动日志备份按采样前缀说明边界', async () => {
    const paths = await fixture();
    await writeFile(join(paths.sourceDir, access), '日志前缀\n');
    await migration.migrateLogs(paths);
    const manifest = JSON.parse(await readFile(paths.manifestPath, 'utf8'));
    const backup = await readFile(join(paths.backupDir, access));
    expect(manifest.files[0].snapshotBytes).toBe(backup.length);
    expect(manifest.files[0].snapshotSha256).toBe(createHash('sha256').update(backup).digest('hex'));
    expect((await lstat(paths.backupDir)).mode & 0o777).toBe(0o700);
    expect((await lstat(paths.manifestPath)).mode & 0o777).toBe(0o600);
  });

  it('目标冲突时不覆盖任一边文件', async () => {
    const paths = await fixture();
    await mkdir(paths.targetDir);
    await writeFile(join(paths.sourceDir, access), 'source');
    await writeFile(join(paths.targetDir, access), 'target');
    await expect(migration.migrateLogs(paths)).rejects.toThrow('target-conflict');
    expect(await readFile(join(paths.sourceDir, access), 'utf8')).toBe('source');
    expect(await readFile(join(paths.targetDir, access), 'utf8')).toBe('target');
  });

  it('拒绝符号链接，不追随本站日志名覆盖其它文件', async () => {
    const paths = await fixture();
    await writeFile(join(paths.sourceDir, 'other.log'), 'keep');
    await symlink(join(paths.sourceDir, 'other.log'), join(paths.sourceDir, access));
    await expect(migration.migrateLogs(paths)).rejects.toThrow('regular-file');
    expect(await readFile(join(paths.sourceDir, 'other.log'), 'utf8')).toBe('keep');
  });

  it('中途失败的清单能回滚已经移动的文件', async () => {
    const paths = await fixture();
    await writeFile(join(paths.sourceDir, access), 'first');
    await writeFile(join(paths.sourceDir, 'imagentx.top.error.log'), 'second');
    await expect(migration.migrateLogs({ ...paths, beforeMove: async name => { if (name.includes('.error.')) throw new Error('fixture-interrupted'); } })).rejects.toThrow('fixture-interrupted');
    await migration.rollbackLogs(paths.manifestPath);
    expect(await readFile(join(paths.sourceDir, access), 'utf8')).toBe('first');
    expect(await readFile(join(paths.sourceDir, 'imagentx.top.error.log'), 'utf8')).toBe('second');
  });

  it('迁移后原路径被新文件占用时拒绝回滚，不覆盖新增日志', async () => {
    const paths = await fixture();
    await writeFile(join(paths.sourceDir, access), 'original');
    await migration.migrateLogs(paths);
    await writeFile(join(paths.sourceDir, access), 'new-file');
    await expect(migration.rollbackLogs(paths.manifestPath)).rejects.toThrow('rollback-source-conflict');
    expect(await readFile(join(paths.sourceDir, access), 'utf8')).toBe('new-file');
    expect(await readFile(join(paths.targetDir, access), 'utf8')).toBe('original');
  });
});

describe('PM2旧入口迁移', () => {
  it('只选择本站，存在重复注册时拒绝猜测', () => {
    expect(runtime.selectManagedApp([{ name: 'other' }])).toBeNull();
    expect(() => runtime.selectManagedApp([{ name: 'meteor-store' }, { name: 'meteor-store' }])).toThrow('ambiguous');
  });

  it('旧包装路径只删除匹配ID并从新配置启动，后续按配置重启', async () => {
    const paths = await fixture();
    const oldScript = join(paths.sourceDir, 'wrapper.cjs'); const nextScript = join(paths.sourceDir, 'next.cjs');
    await writeFile(oldScript, ''); await writeFile(nextScript, '');
    const calls: string[][] = [];
    const input = { configFile: '/fixture/ecosystem.config.cjs', expectedScript: nextScript, run: (args: string[]) => { calls.push(args); } };
    expect((await runtime.activateConfig({ ...input, current: { pm_id: 42, pm2_env: { pm_exec_path: oldScript } } })).migrated).toBe(true);
    expect(calls).toEqual([['delete', '42'], ['start', input.configFile, '--only', 'meteor-store', '--update-env']]);
    calls.length = 0;
    expect((await runtime.activateConfig({ ...input, current: { pm_id: 43, pm2_env: { pm_exec_path: nextScript } } })).migrated).toBe(false);
    expect(calls).toEqual([['restart', input.configFile, '--only', 'meteor-store', '--update-env']]);
  });

  it('回滚配置显式保存旧执行路径、cwd和环境，不依赖备份文件所在目录', () => {
    const saved = runtime.rollbackConfig({ pm2_env: { pm_exec_path: '/usr/local/bin/pnpm', pm_cwd: '/var/www/meteor-store', exec_interpreter: '/usr/local/bin/node', args: 'start', env: { NODE_OPTIONS: '--dns-result-order=ipv4first' }, max_memory_restart: 1073741824 } });
    expect(saved.apps[0]).toMatchObject({ script: '/usr/local/bin/pnpm', cwd: '/var/www/meteor-store', interpreter: '/usr/local/bin/node', args: 'start', env: { NODE_OPTIONS: '--dns-result-order=ipv4first' }, max_memory_restart: 1073741824 });
  });
});

describe('产品同步只读部署守卫', () => {
  it.each(['queued', 'running'])('拒绝%s任务，不因旧时间或PID已退出而改写记录', async status => {
    const record = { job: { status, updatedAt: '2020-01-01' }, pid: null };
    await expect(guard.assertIdleProductUpdates(record)).rejects.toThrow('active');
    expect(record.job.status).toBe(status);
  });

  it('完成状态的真实worker仍存活时拒绝，无法确认身份时也拒绝', async () => {
    const record = { job: { status: 'completed' }, pid: 123, processIdentity: 'boot:42' };
    await expect(guard.assertIdleProductUpdates(record, async () => 'boot:42', () => true)).rejects.toThrow('worker-alive');
    await expect(guard.assertIdleProductUpdates(record, async () => undefined, () => true)).rejects.toThrow('worker-alive');
  });

  it('确认worker退出或PID已被复用后允许已结束任务，缺失任务正常', async () => {
    const record = { job: { status: 'completed' }, pid: 123, processIdentity: 'boot:42' };
    await expect(guard.assertIdleProductUpdates(record, async () => 'boot:42', () => false)).resolves.toBeUndefined();
    await expect(guard.assertIdleProductUpdates(record, async () => 'boot:43', () => true)).resolves.toBeUndefined();
    await expect(guard.assertIdleProductUpdates(null)).resolves.toBeUndefined();
  });

  it('损坏记录拒绝部署而不是当作空闲', async () => {
    await expect(guard.assertIdleProductUpdates({})).rejects.toThrow('state-invalid');
  });
});

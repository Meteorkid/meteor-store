import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const directories: string[] = [];
afterEach(() => { for (const dir of directories.splice(0)) rmSync(dir, { recursive: true, force: true }); });

function build(output: string, exit = 0, extra: Record<string, string> = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'meteor-build-guard-'));
  directories.push(dir);
  const bin = join(dir, 'bin'); mkdirSync(bin);
  // 此夹具不连接数据库；真实只读设置由每次发布预检核验。
  writeFileSync(join(bin, 'node'), `#!/usr/bin/env bash
set -eu
test "$METEOR_BUILD_DB_POOL_SIZE" = 2
test "$PGAPPNAME" = meteor-store-build
[[ "$PGOPTIONS" == *default_transaction_read_only=on* ]]
[[ "$PGOPTIONS" == *transaction_read_only=on* ]]
exit "$FAKE_PREFLIGHT_EXIT"
`, { mode: 0o700 });
  writeFileSync(join(bin, 'pnpm'), `#!/usr/bin/env bash
set -eu
mkdir -p .next/server/app
printf build > .next/BUILD_ID
printf sitemap > .next/server/app/sitemap.xml.body
printf '%s\n' "$FAKE_BUILD_OUTPUT"
exit "$FAKE_BUILD_EXIT"
`, { mode: 0o700 });
  const execute = () => spawnSync('bash', [resolve('deploy/build-verified.sh')], {
    cwd: dir, encoding: 'utf8',
    env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, TMPDIR: dir,
      DATABASE_URL: 'postgresql://fixture.invalid/test', FAKE_BUILD_OUTPUT: output, FAKE_BUILD_EXIT: String(exit), FAKE_PREFLIGHT_EXIT: '0', ...extra },
  });
  return { ...execute(), repeat: execute, directory: dir };
}

describe('发布构建拒绝错误与内容降级', () => {
  it('干净构建通过，普通警告不当成数据错误', () => {
    expect(build('Warning: Custom Cache-Control headers\nCompiled successfully').status).toBe(0);
  });
  it('同一临时目录重复构建仍创建独立日志并保留旧日志', () => {
    const first = build('clean build');
    expect(first.status).toBe(0);
    expect(first.repeat().status).toBe(0);
    expect(readdirSync(first.directory).filter(name => name.startsWith('meteor-store-build-'))).toHaveLength(2);
  });
  it('即便已有BUILD_ID和sitemap，构建非零也拒绝', () => {
    expect(build('failed after writing artifacts', 1).status).not.toBe(0);
  });
  it.each(['读取投稿失败，本次只展示文件文章', 'error: remaining connection slots are reserved', 'Error: Failed query: select', '雅思对照读取失败，退回精选内容'])('退出0但出现%s时拒绝', message => {
    expect(build(message).status).not.toBe(0);
  });
  it('缺少数据库或只读预检失败时不运行构建', () => {
    const missing = build('SHOULD_NOT_RUN', 0, { DATABASE_URL: '' });
    const unavailable = build('SHOULD_NOT_RUN', 0, { FAKE_PREFLIGHT_EXIT: '1' });
    expect(missing.status).not.toBe(0); expect(unavailable.status).not.toBe(0);
    expect(missing.stdout).not.toContain('SHOULD_NOT_RUN');
    expect(unavailable.stdout).not.toContain('SHOULD_NOT_RUN');
  });
  it('两条发布入口都在打包上传前经过门禁', () => {
    for (const file of ['deploy/deploy-local.sh', '.github/workflows/deploy.yml']) {
      const source = readFileSync(resolve(file), 'utf8');
      expect(source.indexOf('bash deploy/build-verified.sh')).toBeGreaterThan(0);
      expect(source.indexOf('bash deploy/build-verified.sh')).toBeLessThan(source.indexOf('tar -czf'));
    }
  });
});

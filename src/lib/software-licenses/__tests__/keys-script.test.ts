import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';

const script = join(process.cwd(), 'scripts/software-license-keys.mjs');

describe('授权密钥工具', () => {
  it('仓库外生成600文件，public输出一致且拒绝覆盖', () => {
    const root = mkdtempSync(join(tmpdir(), 'meteor-software-key-test-'));
    try {
      const path = join(root, 'key.pem');
      const output = execFileSync(process.execPath, [script, 'generate', path], { encoding: 'utf8' });
      expect(output).toMatch(/^SOFTWARE_LICENSE_PUBLIC_KEY=[A-Za-z0-9+/]{43}=\n$/);
      expect(output).not.toContain('PRIVATE');
      expect(statSync(path).mode & 0o777).toBe(0o600);
      const original = readFileSync(path, 'utf8');
      expect(execFileSync(process.execPath, [script, 'public', path], { encoding: 'utf8' })).toBe(output);
      expect(spawnSync(process.execPath, [script, 'generate', path]).status).not.toBe(0);
      expect(readFileSync(path, 'utf8')).toBe(original);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('拒绝相对路径和指向仓库的符号链接父目录', () => {
    const root = mkdtempSync(join(tmpdir(), 'meteor-software-key-test-'));
    const name = `software-key-denied-${randomUUID()}.pem`;
    const repositoryPath = join(process.cwd(), name);
    try {
      expect(spawnSync(process.execPath, [script, 'generate', 'relative.pem'], { cwd: root }).status).not.toBe(0);
      expect(existsSync(join(root, 'relative.pem'))).toBe(false);
      expect(spawnSync(process.execPath, [script, 'generate', repositoryPath]).status).not.toBe(0);
      symlinkSync(process.cwd(), join(root, 'repository'));
      expect(spawnSync(process.execPath, [script, 'generate', join(root, 'repository', name)]).status).not.toBe(0);
      expect(existsSync(repositoryPath)).toBe(false);
    } finally {
      rmSync(repositoryPath, { force: true });
      rmSync(root, { recursive: true, force: true });
    }
  });
});

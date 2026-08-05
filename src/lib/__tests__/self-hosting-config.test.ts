import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

describe('阿里云自托管配置', () => {
  it('仅在回环地址监听时启用可信 Nginx 代理', () => {
    const config = require('../../../ecosystem.config.cjs') as {
      apps: Array<{ env?: Record<string, string | number> }>;
    };
    const env = config.apps[0]?.env;

    expect(env?.TRUST_NGINX_PROXY).toBe('1');
    expect(env?.HOSTNAME).toBe('127.0.0.1');

    const packageJson = require('../../../package.json') as {
      scripts?: Record<string, string>;
    };
    expect(packageJson.scripts?.start).toContain('--hostname 127.0.0.1');
  });

  it('防止重叠部署并在构建失败时恢复旧产物', () => {
    const deployScript = readFileSync(resolve(process.cwd(), 'deploy/deploy.sh'), 'utf8');

    expect(deployScript).toContain('flock -n 9');
    expect(deployScript).toContain('ROLLBACK_DIR');
    expect(deployScript).toContain('trap restore_previous_build EXIT INT TERM');
  });
});

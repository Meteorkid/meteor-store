import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

describe('阿里云自托管配置', () => {
  it('仅在回环地址监听时启用可信 Nginx 代理', () => {
    const config = require('../../../ecosystem.config.cjs') as {
      apps: Array<{ script: string; args: string[]; interpreter: string; env?: Record<string, string | number> }>;
    };
    const env = config.apps[0]?.env;

    expect(env?.TRUST_NGINX_PROXY).toBe('1');
    expect(env?.HOSTNAME).toBe('127.0.0.1');
    expect(config.apps[0].script).toBe(resolve('node_modules/next/dist/bin/next'));
    expect(config.apps[0].args).toEqual(['start', '--hostname', '127.0.0.1', '--port', '3000']);
    expect(config.apps[0].interpreter).toBe('/usr/local/bin/node');
    expect(env?.NODE_OPTIONS).toBe('--dns-result-order=ipv4first');

    const packageJson = require('../../../package.json') as {
      scripts?: Record<string, string>;
    };
    expect(packageJson.scripts?.start).toContain('--hostname 127.0.0.1');
  });

  it('正式上传入口共用真实进程激活，日志重开不重启服务', () => {
    const local = readFileSync(resolve('deploy/deploy-local.sh'), 'utf8');
    const workflow = readFileSync(resolve('.github/workflows/deploy.yml'), 'utf8');
    const logrotate = readFileSync(resolve('deploy/logrotate.conf'), 'utf8');
    const nginx = readFileSync(resolve('deploy/nginx.conf'), 'utf8');
    expect(local).toContain('bash deploy/activate-release.sh .next.tar.gz');
    expect(workflow).toContain('bash deploy/activate-release.sh meteor-store-next.tar.gz');
    expect(local.indexOf('PREFLIGHT_SCRIPT=')).toBeLessThan(local.indexOf('if git pull'));
    expect(workflow.indexOf('PREFLIGHT_SCRIPT=')).toBeLessThan(workflow.indexOf('if git pull'));
    const preflight = readFileSync(resolve('deploy/preflight-runtime.sh'), 'utf8');
    expect(preflight).toContain('worker.lock');
    expect(preflight).toContain('flock -n 8');
    expect(preflight).toContain('fstatSync');
    expect(preflight).not.toContain('readlink /proc/$$/fd');
    expect(preflight).not.toContain('readJob(');
    expect(logrotate).toContain('/usr/local/bin/pm2 reloadLogs');
    expect(logrotate).not.toContain('pm2 reload meteor-store');
    expect(logrotate).not.toContain('|| true');
    for (const type of ['access', 'error']) {
      const path = `/var/log/nginx/meteor-store/imagentx.top.${type}.log`;
      expect(logrotate).toContain(path);
      expect(nginx).toContain(path);
    }
  });

  it('防止重叠部署并在构建失败时恢复旧产物', () => {
    const deployScript = readFileSync(resolve(process.cwd(), 'deploy/deploy.sh'), 'utf8');

    expect(deployScript).toContain('flock -n 9');
    expect(deployScript).toContain('ROLLBACK_DIR');
    expect(deployScript).toContain('trap restore_previous_build EXIT INT TERM');
  });
});

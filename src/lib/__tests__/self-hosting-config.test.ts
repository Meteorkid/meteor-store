import { createRequire } from 'node:module';
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
  });
});

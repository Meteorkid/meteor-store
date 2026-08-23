import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const nextConfig = readFileSync(resolve(process.cwd(), 'next.config.ts'), 'utf8');

describe('在线体验摄像头权限策略', () => {
  it('全站默认禁用摄像头', () => {
    expect(nextConfig).toContain('camera=(), microphone=(), geolocation=()');
  });

  it('只在独立试用路由允许同源摄像头', () => {
    const start = nextConfig.indexOf('source: "/:locale/apps/:id/trial"');
    const end = nextConfig.indexOf('},\n    ];', start);
    const trialHeaders = nextConfig.slice(start, end);

    expect(start).toBeGreaterThan(-1);
    expect(trialHeaders).toContain('camera=(self), microphone=(), geolocation=()');
  });

  it('只在 Ex-Memory 体验路由允许同源本地网络访问', () => {
    const start = nextConfig.indexOf('source: "/:locale/apps/ex-memory"');
    const end = nextConfig.indexOf('},\n      },', start);
    const experienceHeaders = nextConfig.slice(start, end);

    expect(start).toBeGreaterThan(-1);
    expect(experienceHeaders).toContain('local-network-access=(self)');
  });
});

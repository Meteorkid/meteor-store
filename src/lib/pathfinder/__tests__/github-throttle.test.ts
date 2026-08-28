import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * GitHub 节流是一次真实故障的修复，而它「有没有生效」不会在类型或单测里暴露——
 * 少了它只表现为同步日志里几个来源 403。对着源码钉住。
 */
const source = readFileSync(
  path.join(__dirname, '..', 'ingestion', 'fetch-source.ts'),
  'utf-8',
);

describe('GitHub 请求节流', () => {
  it('github 适配器发请求前必须先节流', () => {
    /*
     * 起因：一次同步里 16 个策展 issue 查询连着打过去，8 个拿到 403；
     * 而单独手动请求同一查询返回 200 且 x-ratelimit-remaining 还有 29，
     * 说明卡的是次级限流（突发流量）而不是主配额。请求本来就是串行的，
     * 缺的只是间隔。
     */
    const branch = source.slice(
      source.indexOf("if (source.adapterId === 'github')"),
      source.indexOf("for (let redirects"),
    );
    expect(branch).toContain('await throttleGithub()');
  });

  it('间隔换算下来要低于主配额 30 次/分钟', () => {
    const ms = Number(source.match(/GITHUB_MIN_INTERVAL_MS = ([\d_]+)/)?.[1]?.replace(/_/g, ''));
    expect(Number.isFinite(ms)).toBe(true);
    expect(60_000 / ms).toBeLessThan(30);
  });
});

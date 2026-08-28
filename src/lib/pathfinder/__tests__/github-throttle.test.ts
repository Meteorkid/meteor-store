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
  it('节流必须发生在超时信号创建之前', () => {
    /*
     * AbortSignal.timeout 从创建那一刻开始计时，而节流最长会睡满一个间隔
     * （6 秒），恰好等于超时预算 SOURCE_ATTEMPT_TIMEOUT_MS。顺序反了的话，
     * 等真正发请求时预算已经耗尽，每个需要等待的 GitHub 请求都会立刻 abort，
     * 表现为「fetch failed」——类型检查和单测都发现不了，只在真实同步里冒出来。
     */
    const throttleAt = source.indexOf('await throttleGithub(source.id)');
    const signalAt = source.indexOf('AbortSignal.timeout(SOURCE_ATTEMPT_TIMEOUT_MS)');
    expect(throttleAt).toBeGreaterThan(0);
    expect(signalAt).toBeGreaterThan(0);
    expect(throttleAt).toBeLessThan(signalAt);
  });

  it('节流间隔不能长到吃掉整个超时预算', () => {
    const interval = Number(source.match(/GITHUB_MIN_INTERVAL_MS = ([\d_]+)/)?.[1]?.replace(/_/g, ''));
    const timeout = Number(source.match(/SOURCE_ATTEMPT_TIMEOUT_MS = ([\d_]+)/)?.[1]?.replace(/_/g, ''));
    // 即使顺序正确，两者相等也说明配置很危险：任何一处改动都可能让请求没有时间跑完
    expect(interval).toBeLessThanOrEqual(timeout);
  });

  it('github 适配器发请求前必须先节流', () => {
    /*
     * 起因：一次同步里 16 个策展 issue 查询连着打过去，8 个拿到 403；
     * 而单独手动请求同一查询返回 200 且 x-ratelimit-remaining 还有 29，
     * 说明卡的是次级限流（突发流量）而不是主配额。请求本来就是串行的，
     * 缺的只是间隔。
     */
    expect(source).toMatch(/if \(source\.adapterId === 'github'\) await throttleGithub\(/);
  });

  it('间隔换算下来要低于主配额 30 次/分钟', () => {
    const ms = Number(source.match(/GITHUB_MIN_INTERVAL_MS = ([\d_]+)/)?.[1]?.replace(/_/g, ''));
    expect(Number.isFinite(ms)).toBe(true);
    expect(60_000 / ms).toBeLessThan(30);
  });
});

describe('次级限流的冷却', () => {
  it('命中后不再发请求，而是让剩下的来源直接失败', () => {
    /*
     * 次级限流的惩罚是分钟级的，且期间继续请求会延长惩罚。实测：第一次未节流的
     * 同步触发后，紧接着的第二次同步仍然全是 403，而主配额还剩 21。
     *
     * 在请求里等几分钟会撞上网关超时，什么也拿不到还白等；同步是每小时一次的
     * 定时任务，这一轮少几个来源，下一轮自然补上。
     */
    expect(source).toContain('githubCooldownUntil');
    const fn = source.slice(
      source.indexOf('async function throttleGithub'),
      source.indexOf('function noteGithubSecondaryLimit'),
    );
    expect(fn).toMatch(/if \(Date\.now\(\) < githubCooldownUntil\)/);
    expect(fn).toContain('throw new Error');
  });

  it('只把「secondary rate limit」当成冷却信号', () => {
    // 403 也可能是权限不足或仓库不存在，那些重试没有意义但也不该拖累其它来源
    const fn = source.slice(source.indexOf('function noteGithubSecondaryLimit'));
    expect(fn).toMatch(/secondary rate limit/i);
    expect(fn).toContain("retry-after");
  });
});

import { describe, expect, it } from 'vitest';
import { judgeSourceHealth } from '../source-health';

const NOW = new Date('2026-08-28T00:00:00.000Z');
const hoursAgo = (n: number) => new Date(NOW.getTime() - n * 3_600_000).toISOString();

const source = (over: Partial<Parameters<typeof judgeSourceHealth>[0]> = {}) => ({
  id: 's', name: '来源', enabled: true,
  consecutiveFailures: 0, lastSuccessAt: hoursAgo(2), lastError: null, enabledInCode: true,
  ...over,
});

describe('来源健康度', () => {
  it('从未成功过是严重问题，哪怕失败计数只有 1', () => {
    /*
     * 这正是当初漏掉的那种情况：hugging-face-blog 的 consecutiveFailures 只有 1，
     * 光看计数完全不显眼，但它 last_success_at 是 null——一条内容都没进来过。
     */
    const health = judgeSourceHealth(source({ lastSuccessAt: null, consecutiveFailures: 1 }), NOW);
    expect(health.level).toBe('critical');
    expect(health.reason).toContain('从未');
  });

  it('连续失败达到 3 次算严重', () => {
    expect(judgeSourceHealth(source({ consecutiveFailures: 3 }), NOW).level).toBe('critical');
    // 偶发抖动通常一两次内自愈，不该在首屏刷红
    expect(judgeSourceHealth(source({ consecutiveFailures: 1 }), NOW).level).toBe('warning');
  });

  it('长时间没有成功同步算警告', () => {
    expect(judgeSourceHealth(source({ lastSuccessAt: hoursAgo(72) }), NOW).level).toBe('warning');
    expect(judgeSourceHealth(source({ lastSuccessAt: hoursAgo(12) }), NOW).level).toBe('ok');
  });

  it('代码与后台一致的关闭不算故障', () => {
    // 关闭是一个明确的决定，不该混在故障里让人分不清哪些需要处理
    const health = judgeSourceHealth(
      source({ enabled: false, enabledInCode: false, lastSuccessAt: null }), NOW);
    expect(health.level).toBe('ok');
    expect(health.reason).toContain('关闭');
  });

  it('代码配置为启用但后台关着，要报出来', () => {
    /*
     * ensureSourceRows 的 upsert 写的是 `enabled AND excluded.enabled`：
     * 数据库一旦是 false，代码怎么改都变不回 true。hugging-face-blog 就栽在这里——
     * 它在库里被关着，于是换镜像地址、改 allowedFetchHosts 全是空转，
     * 而后台只显示「已手动关闭」，看不出「代码以为它开着」。
     */
    const health = judgeSourceHealth(
      source({ enabled: false, enabledInCode: true, lastSuccessAt: null }), NOW);
    expect(health.level).toBe('warning');
    expect(health.reason).toContain('代码配置为启用');
  });

  it('时间戳非法时不误报', () => {
    expect(judgeSourceHealth(source({ lastSuccessAt: '不是时间' }), NOW).level).toBe('ok');
  });
});

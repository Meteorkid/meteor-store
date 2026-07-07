import { describe, it, expect, vi } from 'vitest';
import { isLateNight, createKonamiMatcher, createFrameGuard } from '../motion';

describe('isLateNight', () => {
  it('凌晨 0 点到 5 点为深夜', () => {
    expect(isLateNight(new Date('2026-07-07T00:00:00'))).toBe(true);
    expect(isLateNight(new Date('2026-07-07T03:30:00'))).toBe(true);
    expect(isLateNight(new Date('2026-07-07T04:59:59'))).toBe(true);
  });

  it('5 点及白天不算深夜', () => {
    expect(isLateNight(new Date('2026-07-07T05:00:00'))).toBe(false);
    expect(isLateNight(new Date('2026-07-07T12:00:00'))).toBe(false);
    expect(isLateNight(new Date('2026-07-07T23:59:59'))).toBe(false);
  });
});

describe('createKonamiMatcher', () => {
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  it('完整序列命中返回 true', () => {
    const feed = createKonamiMatcher();
    const results = KONAMI.map(k => feed(k));
    expect(results[results.length - 1]).toBe(true);
    expect(results.slice(0, -1).every(r => r === false)).toBe(true);
  });

  it('大写 B/A 也能命中', () => {
    const feed = createKonamiMatcher();
    const keys = [...KONAMI.slice(0, 8), 'B', 'A'];
    expect(keys.map(k => feed(k)).pop()).toBe(true);
  });

  it('中途打断后需重新开始', () => {
    const feed = createKonamiMatcher();
    feed('ArrowUp');
    feed('ArrowUp');
    feed('x'); // 打断
    // 从头再来完整一遍应命中
    expect(KONAMI.map(k => feed(k)).pop()).toBe(true);
  });

  it('打断键恰好是序列开头时从第 1 位重新计数', () => {
    const feed = createKonamiMatcher();
    feed('ArrowUp');
    feed('ArrowUp');
    feed('ArrowUp'); // 第三个 up：失配但算新序列的第 1 位
    // 接上剩余 9 个键应命中
    expect(KONAMI.slice(1).map(k => feed(k)).pop()).toBe(true);
  });

  it('命中后计数复位，可再次触发', () => {
    const feed = createKonamiMatcher();
    KONAMI.forEach(k => feed(k));
    expect(KONAMI.map(k => feed(k)).pop()).toBe(true);
  });
});

describe('createFrameGuard', () => {
  it('持续低帧率时触发降级回调（仅一次）', () => {
    const onDegrade = vi.fn();
    const tick = createFrameGuard(onDegrade, 25, 10);
    // 模拟 15fps（每帧 66ms），需要 10 个坏帧
    let now = 0;
    for (let i = 0; i < 15; i++) {
      tick(now);
      now += 66;
    }
    expect(onDegrade).toHaveBeenCalledTimes(1);
  });

  it('帧率正常时不降级', () => {
    const onDegrade = vi.fn();
    const tick = createFrameGuard(onDegrade, 25, 10);
    let now = 0;
    for (let i = 0; i < 100; i++) {
      tick(now);
      now += 16; // 60fps
    }
    expect(onDegrade).not.toHaveBeenCalled();
  });
});

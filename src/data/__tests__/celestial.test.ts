import { describe, expect, it } from 'vitest';
import { FOUR_SYMBOLS, MANSION_GROUPS, SEVEN_LUMINARIES } from '../celestial';

describe('中国星象数据', () => {
  it('二十八宿按四象分成四组七宿，且不重复', () => {
    expect(MANSION_GROUPS).toHaveLength(4);
    MANSION_GROUPS.forEach((group) => expect(group.mansions).toHaveLength(7));

    const mansions = MANSION_GROUPS.flatMap((group) => group.mansions);
    expect(mansions).toHaveLength(28);
    expect(new Set(mansions).size).toBe(28);
  });

  it('四象都有双语标签与边框色', () => {
    MANSION_GROUPS.forEach(({ symbolId }) => {
      expect(FOUR_SYMBOLS[symbolId].label.zh).toBeTruthy();
      expect(FOUR_SYMBOLS[symbolId].label.en).toBeTruthy();
      expect(FOUR_SYMBOLS[symbolId].rgb).toMatch(/^\d+ \d+ \d+$/);
    });
  });

  it('时间轴使用七曜且每曜有双语名与视觉', () => {
    expect(SEVEN_LUMINARIES).toHaveLength(7);
    SEVEN_LUMINARIES.forEach((luminary) => {
      expect(luminary.label.zh).toBeTruthy();
      expect(luminary.label.en).toBeTruthy();
      expect(luminary.gradient).toContain('radial-gradient');
    });
  });

  it('七曜顺序对应星期天至星期六', () => {
    const expectedIds = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];
    SEVEN_LUMINARIES.forEach((luminary, i) => {
      expect(luminary.id).toBe(expectedIds[i]);
    });
  });

  it('斗宿属于北方玄武七宿之首', () => {
    const blackTortoiseGroup = MANSION_GROUPS.find((g) => g.symbolId === 'blackTortoise');
    expect(blackTortoiseGroup).toBeDefined();
    expect(blackTortoiseGroup!.mansions[0]).toBe('斗');

    // 验证斗宿恰好出现一次，且只在玄武组
    const allMansions = MANSION_GROUPS.flatMap((g) => g.mansions);
    expect(allMansions.filter((m) => m === '斗').length).toBe(1);
  });

});

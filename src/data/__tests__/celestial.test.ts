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
});

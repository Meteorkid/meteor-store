import { describe, expect, it } from 'vitest';
import { PRESET_CASES } from '../preset-cases';
import { toRealityConstraints, validate } from '@/lib/pathfinder/contract';

describe('Pathfinder 典型场景演示', () => {
  it('所有预置案例都已通过 Reality Contract 验证', () => {
    for (const preset of PRESET_CASES) {
      expect(validate(preset.result.plan.weekPlan, toRealityConstraints(preset.input))).toEqual([]);
    }
  });

  it('所有预置案例都显式标注为静态演示结果', () => {
    expect(PRESET_CASES).toHaveLength(3);
    for (const preset of PRESET_CASES) {
      expect(preset.isPreset).toBe(true);
      expect(preset.result.source).toBe('preset');
      expect(preset.result.plan.todaySteps).toHaveLength(3);
    }
  });
});

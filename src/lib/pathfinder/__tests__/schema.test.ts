import { describe, expect, it } from 'vitest';

import {
  buildSafetyResponse,
  looksLikeCrisis,
  PathfinderPlanRequestSchema,
  PathfinderProfileSchema,
} from '../schema';
import { profileFixture } from './fixtures';

describe('PathfinderProfileSchema', () => {
  it('补齐默认 6 周路径和空现实限制', () => {
    const parsed = PathfinderProfileSchema.parse({
      ...profileFixture,
      durationWeeks: undefined,
      constraints: undefined,
    });

    expect(parsed.durationWeeks).toBe(6);
    expect(parsed.constraints).toEqual([]);
  });

  it('只接受 4–8 周并校验预算', () => {
    expect(PathfinderProfileSchema.safeParse({ ...profileFixture, durationWeeks: 3 }).success).toBe(false);
    expect(PathfinderProfileSchema.safeParse({ ...profileFixture, durationWeeks: 9 }).success).toBe(false);
    expect(PathfinderProfileSchema.safeParse({ ...profileFixture, budgetCny: -1 }).success).toBe(false);
  });

  it('请求体不需要任何模型或 API Key 配置', () => {
    const parsed = PathfinderPlanRequestSchema.parse({ profile: profileFixture });
    expect(parsed.locale).toBe('zh');
    expect(parsed).not.toHaveProperty('modelConfig');
  });
});

describe('危机保护', () => {
  it('中英文危机词都在本地命中', () => {
    expect(looksLikeCrisis('我最近想自杀')).toBe(true);
    expect(looksLikeCrisis('I might hurt myself')).toBe(true);
  });

  it('安全引导包含 12356、110/120，且不做 24 小时或免费保密承诺', () => {
    const text = JSON.stringify(buildSafetyResponse('zh'));
    expect(text).toContain('12356');
    expect(text).toMatch(/110|120/);
    expect(text).not.toContain('400-161-9995');
    expect(text).not.toMatch(/24 小时|免费保密/);
  });
});

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('feature-flags', () => {
  const origEnv = { ...process.env };

  beforeEach(() => {
    // 清理环境变量
    for (const key of Object.keys(process.env)) {
      if (key.startsWith('FEATURE_')) {
        delete process.env[key];
      }
    }
  });

  afterEach(() => {
    process.env = { ...origEnv };
  });

  it('环境变量 true 覆盖默认值', async () => {
    process.env.FEATURE_ENABLE_NEW_HOMEPAGE = 'true';
    // 动态 import 以拿到新的 process.env
    const { isFeatureEnabled } = await import('../feature-flags');
    expect(isFeatureEnabled('enableNewHomepage')).toBe(true);
  });

  it('环境变量 false 覆盖默认值', async () => {
    process.env.FEATURE_ENABLE_PRICING = 'false';
    const { isFeatureEnabled } = await import('../feature-flags');
    expect(isFeatureEnabled('enablePricing')).toBe(false);
  });

  it('未知 flag 返回 false', async () => {
    const { isFeatureEnabled } = await import('../feature-flags');
    expect(isFeatureEnabled('nonexistent' as any)).toBe(false);
  });

  it('getAllFlags 返回所有 flag 状态', async () => {
    const { getAllFlags } = await import('../feature-flags');
    const all = getAllFlags();
    expect(all).toHaveProperty('enablePricing');
    expect(all).toHaveProperty('enableBlogSubmit');
    expect(typeof all.enablePricing).toBe('boolean');
  });
});

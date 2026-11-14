import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getDatabasePoolSize } from '../db/pool-size';

const { poolOptions, select } = vi.hoisted(() => ({
  poolOptions: vi.fn(),
  select: vi.fn(),
}));

vi.mock('pg', () => ({
  Pool: class {
    constructor(options: unknown) { poolOptions(options); }
    on = vi.fn();
  },
}));
vi.mock('drizzle-orm/node-postgres', () => ({ drizzle: () => ({ select }) }));
vi.mock('@sentry/nextjs', () => ({ withSentryConfig: (config: unknown) => config }));
vi.mock('next-intl/plugin', () => ({ default: () => (config: unknown) => config }));

describe('构建数据库连接预算', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.stubEnv('DATABASE_URL', 'postgresql://localhost/isolated_pool_test');
    vi.stubEnv('METEOR_BUILD_DB_POOL_SIZE', undefined);
  });
  afterEach(() => vi.unstubAllEnvs());

  it('未配置构建限额时保持生产默认10连接', async () => {
    expect(getDatabasePoolSize(undefined)).toBe(10);
    const { db } = await import('../db');
    db.select();
    expect(poolOptions).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ max: 10 }));
  });

  it('显式构建限额用于实际连接池，重复读取不创建额外池', async () => {
    vi.stubEnv('METEOR_BUILD_DB_POOL_SIZE', '2');
    const { db } = await import('../db');
    db.select();
    db.select();
    expect(poolOptions).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ max: 2 }));
    expect(select).toHaveBeenCalledTimes(2);
  });

  it.each(['1', '2', '10'])('接受有界整数 %s', value => {
    expect(getDatabasePoolSize(value)).toBe(Number(value));
  });

  it.each(['', ' ', '0', '11', '-1', '1.5', '2.0', '2e0', 'Infinity', 'NaN', '02', '+2', '2x', ' 2', '2\n', '2\r\n'])('拒绝非法限额 %j', value => {
    expect(() => getDatabasePoolSize(value)).toThrow('METEOR_BUILD_DB_POOL_SIZE');
  });

  it('非法配置在创建连接池前失败', async () => {
    vi.stubEnv('METEOR_BUILD_DB_POOL_SIZE', '0');
    const { db } = await import('../db');
    expect(() => db.select()).toThrow('METEOR_BUILD_DB_POOL_SIZE');
    expect(poolOptions).not.toHaveBeenCalled();
  });

  it('一构建worker只并行生成一页', async () => {
    const { default: config } = await import('../../../next.config');
    expect(config.experimental?.cpus).toBe(1);
    expect(config.experimental?.staticGenerationMaxConcurrency).toBe(1);
  });
});

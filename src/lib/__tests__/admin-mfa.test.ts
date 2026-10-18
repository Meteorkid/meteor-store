import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PgDialect } from 'drizzle-orm/pg-core';
import type { SQL } from 'drizzle-orm';

const state = vi.hoisted(() => ({ codes: '', enabled: true, updates: [] as Array<{ sql: string; params: unknown[] }> }));
vi.mock('../totp', () => ({
  decryptTotpSecret: () => 'SECRET', verifyTotp: (_secret: string, code: string) => code === '123456',
  hashRecoveryCode: (code: string) => `hash:${code}`, encryptTotpSecret: vi.fn(), generateRecoveryCodes: vi.fn(), generateTotpSecret: vi.fn(),
}));
vi.mock('../db', () => ({ db: {
  select: () => ({ from: () => ({ where: () => ({ limit: async () => [{ totpEnabled: state.enabled, totpSecretEnc: 'encrypted', totpRecoveryCodes: state.codes }] }) }) }),
  update: () => ({ set: (values: { totpRecoveryCodes: string }) => ({ where: (condition: SQL) => {
    const query = new PgDialect().sqlToQuery(condition);
    const execute = () => {
      state.updates.push(query);
      const hasCas = query.sql.includes('"totp_recovery_codes"');
      if (hasCas && (!query.params.includes(state.codes) || !state.enabled)) return [];
      state.codes = values.totpRecoveryCodes;
      return [{ id: 'U1' }];
    };
    return { then: (resolve: (value: unknown) => unknown) => Promise.resolve(execute()).then(resolve), returning: async () => execute() };
  } }) }),
} }));
import { verifyUserTotpOrRecoveryCode } from '../admin-mfa';

beforeEach(() => { state.codes = JSON.stringify(['hash:ABCD-EF23', 'hash:GHJK-LM45']); state.enabled = true; state.updates.length = 0; });

describe('恢复码原子消费', () => {
  it('同一恢复码并发只能一个成功', async () => {
    const results = await Promise.all([verifyUserTotpOrRecoveryCode('U1', 'ABCD-EF23'), verifyUserTotpOrRecoveryCode('U1', 'abcdef23')]);
    expect(results.filter(Boolean)).toHaveLength(1);
    expect(JSON.parse(state.codes)).toEqual(['hash:GHJK-LM45']);
    expect(await verifyUserTotpOrRecoveryCode('U1', 'ABCD-EF23')).toBe(false);
  });
  it('不同恢复码并发不能把已消费的码写回来，竞争失败的请求可重试', async () => {
    const results = await Promise.all([verifyUserTotpOrRecoveryCode('U1', 'ABCD-EF23'), verifyUserTotpOrRecoveryCode('U1', 'GHJK-LM45')]);
    expect(results.filter(Boolean)).toHaveLength(1);
    const retry = results[0] ? 'GHJK-LM45' : 'ABCD-EF23';
    expect(await verifyUserTotpOrRecoveryCode('U1', retry)).toBe(true);
    expect(JSON.parse(state.codes)).toEqual([]);
    expect(await verifyUserTotpOrRecoveryCode('U1', 'ABCD-EF23')).toBe(false);
    expect(await verifyUserTotpOrRecoveryCode('U1', 'GHJK-LM45')).toBe(false);
  });
  it('消费 SQL 同时绑定用户、旧完整数组、仍启用的原 secret', async () => {
    const original = state.codes;
    expect(await verifyUserTotpOrRecoveryCode('U1', 'ABCD-EF23')).toBe(true);
    expect(state.updates[0].sql).toContain('"users"."totp_recovery_codes"');
    expect(state.updates[0].sql).toContain('"users"."totp_enabled"');
    expect(state.updates[0].sql).toContain('"users"."totp_secret_enc"');
    expect(state.updates[0].params).toEqual(expect.arrayContaining(['U1', original, true, 'encrypted']));
  });
  it('正常 TOTP 仍有效且不消费恢复码；错误恢复码无写入', async () => {
    expect(await verifyUserTotpOrRecoveryCode('U1', '123456')).toBe(true);
    expect(await verifyUserTotpOrRecoveryCode('U1', 'ZZZZ-ZZZZ')).toBe(false);
    expect(state.updates).toHaveLength(0);
  });
});

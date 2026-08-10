import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SQL } from 'drizzle-orm';
import { PgDialect } from 'drizzle-orm/pg-core';
import {
  createPersonalAccessToken,
  deriveTokenStatus,
  hashPersonalAccessToken,
  listPersonalAccessTokens,
  PersonalAccessTokenError,
  revokePersonalAccessToken,
  touchPersonalAccessToken,
} from '../personal-access-tokens';

const dbState = vi.hoisted(() => ({
  executedQueries: [] as unknown[],
  executeRowsByCall: [[{ outcome: 'created' }]] as Record<string, unknown>[][],
  executeCalls: 0,
  tokenRows: [] as Record<string, unknown>[],
  updateRowCount: 1,
  updateCalls: 0,
  updateSets: [] as Record<string, unknown>[],
  updateConditions: [] as unknown[],
}));

vi.mock('../db', () => ({
  db: {
    select: (selection: Record<string, unknown>) => ({
      from: () => ({
        where: () => {
          void selection;
          return {
            orderBy: async () => dbState.tokenRows,
          };
        },
      }),
    }),
    execute: async (query: unknown) => {
      dbState.executeCalls += 1;
      dbState.executedQueries.push(query);
      return { rows: dbState.executeRowsByCall.shift() ?? [] };
    },
    update: () => ({
      set: (values: Record<string, unknown>) => {
        dbState.updateSets.push(values);
        return {
          where: async (condition: unknown) => {
            dbState.updateConditions.push(condition);
            dbState.updateCalls += 1;
            return { rowCount: dbState.updateRowCount };
          },
        };
      },
    }),
  },
}));

describe('博客个人访问令牌', () => {
  beforeEach(() => {
    dbState.executedQueries = [];
    dbState.executeRowsByCall = [[{ outcome: 'created' }]];
    dbState.executeCalls = 0;
    dbState.tokenRows = [];
    dbState.updateRowCount = 1;
    dbState.updateCalls = 0;
    dbState.updateSets = [];
    dbState.updateConditions = [];
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-10T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('按撤销、过期、版本失效、可用的顺序推导状态', () => {
    const now = new Date('2026-08-10T00:00:00.000Z');

    expect(deriveTokenStatus({
      revokedAt: '2026-08-09T00:00:00.000Z',
      expiresAt: '2026-08-01T00:00:00.000Z',
      tokenVersion: 1,
    }, 2, now)).toBe('revoked');
    expect(deriveTokenStatus({
      revokedAt: null,
      expiresAt: '2026-08-10T00:00:00.000Z',
      tokenVersion: 1,
    }, 2, now)).toBe('expired');
    expect(deriveTokenStatus({
      revokedAt: null,
      expiresAt: '2026-08-11T00:00:00.000Z',
      tokenVersion: 1,
    }, 2, now)).toBe('invalidated');
    expect(deriveTokenStatus({
      revokedAt: null,
      expiresAt: '2026-08-11T00:00:00.000Z',
      tokenVersion: 2,
    }, 2, now)).toBe('active');
    expect(deriveTokenStatus({
      revokedAt: null,
      expiresAt: 'not-a-date',
      tokenVersion: 2,
    }, 2, now)).toBe('expired');
  });

  it('创建时只返回一次 msb_ 明文并且数据库只保存哈希', async () => {
    const result = await createPersonalAccessToken({
      userId: 'U1',
      name: ' MacBook Codex ',
      scopes: ['blog:write', 'blog:read', 'blog:write'],
      expiresInDays: 90,
      tokenVersion: 3,
    });

    expect(result.token).toMatch(/^msb_[A-Za-z0-9_-]{43}$/);
    expect(result.metadata).toEqual({
      id: expect.any(String),
      name: 'MacBook Codex',
      tokenPrefix: result.token.slice(0, 12),
      scopes: ['blog:read', 'blog:write'],
      status: 'active',
      expiresAt: '2026-11-08T00:00:00.000Z',
      lastUsedAt: null,
      revokedAt: null,
      createdAt: '2026-08-10T00:00:00.000Z',
    });
    expect(result.metadata).not.toHaveProperty('tokenHash');
    expect(result.metadata).not.toHaveProperty('slot');

    expect(dbState.updateCalls).toBe(1);
    expect(dbState.updateSets[0]).toEqual({ slot: null });
    const cleanup = new PgDialect().sqlToQuery(dbState.updateConditions[0] as SQL);
    const normalizedCleanupSql = cleanup.sql.replace(/\s+/g, ' ').trim().toLowerCase();
    expect(normalizedCleanupSql).toContain('"personal_access_tokens"."user_id" =');
    expect(normalizedCleanupSql).toContain('"personal_access_tokens"."slot" is not null');
    expect(normalizedCleanupSql).toContain('"personal_access_tokens"."revoked_at" is not null');
    expect(normalizedCleanupSql).toContain('"personal_access_tokens"."expires_at" <=');
    expect(normalizedCleanupSql).toContain('"personal_access_tokens"."token_version" <>');
    expect(normalizedCleanupSql).toContain('select "users"."token_version" from "users"');
    expect(normalizedCleanupSql).toContain(
      '"users"."id" = "personal_access_tokens"."user_id"',
    );
    expect(cleanup.params).toEqual(['U1', '2026-08-10T00:00:00.000Z']);

    const compiled = new PgDialect().sqlToQuery(dbState.executedQueries[0] as SQL);
    const normalizedSql = compiled.sql.replace(/\s+/g, ' ').trim().toLowerCase();
    expect(normalizedSql).toContain('with "owner" as materialized');
    expect(normalizedSql).toContain('from "users"');
    expect(normalizedSql).toContain('"users"."email_verified" = true');
    expect(normalizedSql).toContain('"users"."token_version" =');
    expect(normalizedSql).toContain('for update');
    expect(normalizedSql).toContain('insert into "personal_access_tokens"');
    expect(normalizedSql).toContain('generate_series(1, 10) as "candidate"("slot")');
    expect(normalizedSql).toContain('where not exists');
    expect(normalizedSql).toContain('order by "candidate"."slot"');
    expect(normalizedSql).toContain('limit 1');
    expect(normalizedSql).toMatch(
      /on conflict \(\s*"user_id", "slot"\s*\) do nothing/,
    );
    expect(normalizedSql).toContain('returning "personal_access_tokens"."id"');
    expect(normalizedSql).not.toContain('pg_advisory');
    expect(normalizedSql).not.toContain('count(*)');
    expect(dbState.executeCalls).toBe(1);
    expect(compiled.params.some((param) => String(param).includes(result.token))).toBe(false);
    expect(compiled.params).toContain(hashPersonalAccessToken(result.token));
    expect(compiled.params).toContain('{"blog:read","blog:write"}');
    expect(compiled.params.some(Array.isArray)).toBe(false);
  });

  it('列表只返回当前用户可展示的元数据并派生状态', async () => {
    dbState.tokenRows = [{
      id: 'T1',
      name: 'Codex',
      tokenHash: '不能泄漏',
      tokenPrefix: 'msb_example',
      scopes: ['blog:read'],
      tokenVersion: 1,
      expiresAt: '2026-08-11T00:00:00.000Z',
      lastUsedAt: null,
      revokedAt: null,
      createdAt: '2026-08-01T00:00:00.000Z',
    }];

    const tokens = await listPersonalAccessTokens('U1', 2);

    expect(tokens).toEqual([{
      id: 'T1',
      name: 'Codex',
      tokenPrefix: 'msb_example',
      scopes: ['blog:read'],
      status: 'invalidated',
      expiresAt: '2026-08-11T00:00:00.000Z',
      lastUsedAt: null,
      revokedAt: null,
      createdAt: '2026-08-01T00:00:00.000Z',
    }]);
    expect(tokens[0]).not.toHaveProperty('tokenHash');
  });

  it('撤销只认当前用户且重复调用保持成功', async () => {
    await expect(revokePersonalAccessToken({ tokenId: 'T1', userId: 'U1' }))
      .resolves.toBe(true);
    await expect(revokePersonalAccessToken({ tokenId: 'T1', userId: 'U1' }))
      .resolves.toBe(true);

    dbState.updateRowCount = 0;
    await expect(revokePersonalAccessToken({ tokenId: 'T1', userId: 'U2' }))
      .resolves.toBe(false);
    expect(dbState.updateSets).toHaveLength(3);
    expect(dbState.updateSets.every((values) => values.slot === null)).toBe(true);
  });

  it('最近一小时使用过时不重复写 lastUsedAt', async () => {
    const now = new Date('2026-08-10T00:00:00.000Z');

    await expect(touchPersonalAccessToken({
      tokenId: 'T1',
      lastUsedAt: '2026-08-09T23:30:00.000Z',
    }, now)).resolves.toBe(false);
    expect(dbState.updateCalls).toBe(0);

    await expect(touchPersonalAccessToken({
      tokenId: 'T1',
      lastUsedAt: '2026-08-09T22:59:59.999Z',
    }, now)).resolves.toBe(true);
    expect(dbState.updateCalls).toBe(1);
  });

  it('拒绝非法 scope、有效期和名称', async () => {
    const create = (overrides: Record<string, unknown>) => createPersonalAccessToken({
      userId: 'U1',
      name: 'Codex',
      scopes: ['blog:read'],
      expiresInDays: 90,
      tokenVersion: 1,
      ...overrides,
    } as never);

    await expect(create({ scopes: [] })).rejects.toMatchObject({ code: 'invalid_scopes' });
    await expect(create({ scopes: ['admin:all'] })).rejects.toMatchObject({ code: 'invalid_scopes' });
    await expect(create({ expiresInDays: 60 })).rejects.toMatchObject({ code: 'invalid_expiry' });
    await expect(create({ name: ' ' })).rejects.toMatchObject({ code: 'invalid_name' });
    expect(dbState.executedQueries).toEqual([]);
    expect(dbState.updateCalls).toBe(0);
  });

  it('槽位并发冲突时使用新语句快照重试直至插入成功', async () => {
    dbState.executeRowsByCall = [
      [{ outcome: 'slot_conflict' }],
      [{ outcome: 'slot_conflict' }],
      [{ outcome: 'created' }],
    ];

    await expect(createPersonalAccessToken({
      userId: 'U1',
      name: 'Codex',
      scopes: ['blog:read'],
      expiresInDays: 90,
      tokenVersion: 1,
    })).resolves.toMatchObject({
      metadata: { status: 'active' },
    });
    expect(dbState.updateCalls).toBe(1);
    expect(dbState.executeCalls).toBe(3);
  });

  it('创建期间账户版本或验证状态变化时返回 account_changed', async () => {
    dbState.executeRowsByCall = [
      [{ outcome: 'slot_conflict' }],
      [{ outcome: 'account_changed' }],
    ];

    await expect(createPersonalAccessToken({
      userId: 'U1',
      name: 'Codex',
      scopes: ['blog:read'],
      expiresInDays: 90,
      tokenVersion: 1,
    })).rejects.toEqual(expect.objectContaining<Partial<PersonalAccessTokenError>>({
      code: 'account_changed',
    }));
    expect(dbState.updateCalls).toBe(1);
    expect(dbState.executeCalls).toBe(2);
  });

  it('达到 10 枚当前可用令牌后拒绝继续创建', async () => {
    dbState.executeRowsByCall = [[{ outcome: 'active_token_limit' }]];

    await expect(createPersonalAccessToken({
      userId: 'U1',
      name: 'Codex',
      scopes: ['blog:read'],
      expiresInDays: 90,
      tokenVersion: 1,
    })).rejects.toEqual(expect.objectContaining<Partial<PersonalAccessTokenError>>({
      code: 'active_token_limit',
    }));
    expect(dbState.updateCalls).toBe(1);
    expect(dbState.executeCalls).toBe(1);
  });
});

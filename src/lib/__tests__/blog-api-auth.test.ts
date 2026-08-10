import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authenticateBlogApiRequest } from '../blog-api-auth';

const dbState = vi.hoisted(() => ({
  row: null as null | Record<string, unknown>,
  touchCount: 0,
  selectCount: 0,
  selectedFields: [] as string[],
  throws: false,
}));

vi.mock('../db', () => ({
  db: {
    select: (fields: Record<string, unknown>) => {
      dbState.selectedFields = Object.keys(fields);
      return {
        from: () => ({
          innerJoin: () => ({
            where: () => ({
              limit: async () => {
                dbState.selectCount += 1;
                if (dbState.throws) throw new Error('database unavailable');
                return dbState.row ? [dbState.row] : [];
              },
            }),
          }),
        }),
      };
    },
    update: () => ({
      set: () => ({
        where: async () => {
          dbState.touchCount += 1;
          return { rowCount: 1 };
        },
      }),
    }),
  },
}));

const VALID_TOKEN = `msb_${'a'.repeat(43)}`;

function request(token = VALID_TOKEN): Request {
  return new Request('https://imagentx.top/api/v1/blog/posts', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

describe('博客 API Bearer 鉴权', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-10T00:00:00.000Z'));
    process.env.ADMIN_EMAILS = 'admin@example.com';
    dbState.touchCount = 0;
    dbState.selectCount = 0;
    dbState.selectedFields = [];
    dbState.throws = false;
    dbState.row = {
      tokenId: 'T1',
      scopes: ['blog:read', 'blog:write'],
      tokenVersion: 2,
      expiresAt: '2026-08-11T00:00:00.000Z',
      lastUsedAt: null,
      revokedAt: null,
      slot: 1,
      userId: 'U1',
      email: 'admin@example.com',
      name: 'Meteor',
      emailVerified: true,
      userTokenVersion: 2,
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    delete process.env.ADMIN_EMAILS;
  });

  it('有效令牌形成当前用户主体并动态识别管理员', async () => {
    const result = await authenticateBlogApiRequest(request(), 'blog:read');

    expect(result).toEqual({
      ok: true,
      actor: {
        userId: 'U1',
        email: 'admin@example.com',
        name: 'Meteor',
        scopes: ['blog:read', 'blog:write'],
        tokenId: 'T1',
        isAdmin: true,
      },
    });
    expect(dbState.touchCount).toBe(1);
    expect(dbState.selectedFields).toContain('slot');
  });

  it('只接受格式严格的 Bearer msb_ 请求头', async () => {
    const requests = [
      new Request('https://imagentx.top/api/v1/blog/posts'),
      new Request('https://imagentx.top/api/v1/blog/posts', {
        headers: { Authorization: `Basic ${VALID_TOKEN}` },
      }),
      new Request('https://imagentx.top/api/v1/blog/posts', {
        headers: { Authorization: `bearer ${VALID_TOKEN}` },
      }),
      new Request(`https://imagentx.top/api/v1/blog/posts?token=${VALID_TOKEN}`),
    ];

    for (const value of requests) {
      await expect(authenticateBlogApiRequest(value, 'blog:read'))
        .resolves.toEqual({ ok: false, reason: 'invalid_token' });
    }
    expect(dbState.selectCount).toBe(0);
  });

  it('撤销、过期、改密、未验证和损坏 scope 都统一视为无效令牌', async () => {
    const base = { ...dbState.row! };
    const invalidRows = [
      null,
      { ...base, revokedAt: '2026-08-09T00:00:00.000Z' },
      { ...base, expiresAt: '2026-08-10T00:00:00.000Z' },
      { ...base, tokenVersion: 1 },
      { ...base, emailVerified: false },
      { ...base, scopes: ['blog:read', 'admin:all'] },
    ];

    for (const row of invalidRows) {
      dbState.row = row;
      await expect(authenticateBlogApiRequest(request(), 'blog:read'))
        .resolves.toEqual({ ok: false, reason: 'invalid_token' });
    }
    expect(dbState.touchCount).toBe(0);
  });

  it.each([
    ['null', null],
    ['0', 0],
    ['11', 11],
    ['非整数', 1.5],
  ])('slot 为 %s 时拒绝令牌', async (_label, slot) => {
    dbState.row = { ...dbState.row!, slot };

    await expect(authenticateBlogApiRequest(request(), 'blog:read'))
      .resolves.toEqual({ ok: false, reason: 'invalid_token' });
    expect(dbState.touchCount).toBe(0);
  });

  it('slot 上界 10 仍可正常鉴权', async () => {
    dbState.row = { ...dbState.row!, slot: 10 };

    await expect(authenticateBlogApiRequest(request(), 'blog:read'))
      .resolves.toMatchObject({ ok: true });
    expect(dbState.touchCount).toBe(1);
  });

  it('有效令牌缺少端点 scope 时返回 insufficient_scope', async () => {
    await expect(authenticateBlogApiRequest(request(), 'blog:image'))
      .resolves.toEqual({ ok: false, reason: 'insufficient_scope' });
    expect(dbState.touchCount).toBe(0);
  });

  it('数据库异常时鉴权关闭失败且不泄漏底层错误', async () => {
    dbState.throws = true;

    await expect(authenticateBlogApiRequest(request(), 'blog:read'))
      .resolves.toEqual({ ok: false, reason: 'invalid_token' });
    expect(dbState.touchCount).toBe(0);
  });

  it('管理员资格随 ADMIN_EMAILS 实时收回', async () => {
    const before = await authenticateBlogApiRequest(request(), 'blog:read');
    process.env.ADMIN_EMAILS = '';
    const after = await authenticateBlogApiRequest(request(), 'blog:read');

    expect(before.ok && before.actor.isAdmin).toBe(true);
    expect(after.ok && after.actor.isAdmin).toBe(false);
  });
});

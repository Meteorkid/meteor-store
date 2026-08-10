import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { and, desc, eq, isNotNull, isNull, lte, ne, or, sql } from 'drizzle-orm';
import {
  BLOG_API_SCOPES,
  BLOG_API_TOKEN_EXPIRY_DAYS,
  type BlogApiScope,
  type BlogApiTokenExpiryDays,
  type PersonalAccessTokenStatus,
  type TokenMetadata,
} from './blog-api-contract';
import { db } from './db';
import { personalAccessTokens, users } from './db/schema';

export {
  BLOG_API_SCOPES,
  BLOG_API_TOKEN_EXPIRY_DAYS,
  type BlogApiScope,
  type BlogApiTokenExpiryDays,
  type PersonalAccessTokenStatus,
  type TokenMetadata,
} from './blog-api-contract';

const MAX_ACTIVE_TOKENS = 10;
const TOKEN_PREFIX = 'msb_';

export class PersonalAccessTokenError extends Error {
  constructor(
    public readonly code:
      | 'invalid_name'
      | 'invalid_scopes'
      | 'invalid_expiry'
      | 'active_token_limit'
      | 'account_changed',
    message: string,
  ) {
    super(message);
    this.name = 'PersonalAccessTokenError';
  }
}

export interface TokenStatusInput {
  revokedAt: string | null;
  expiresAt: string;
  tokenVersion: number;
}

export function deriveTokenStatus(
  input: TokenStatusInput,
  currentTokenVersion: number,
  now = new Date(),
): PersonalAccessTokenStatus {
  if (input.revokedAt) return 'revoked';
  const expiresAt = Date.parse(input.expiresAt);
  if (!Number.isFinite(expiresAt) || expiresAt <= now.getTime()) return 'expired';
  if (input.tokenVersion !== currentTokenVersion) return 'invalidated';
  return 'active';
}

export function hashPersonalAccessToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function normalizeScopes(scopes: readonly string[]): BlogApiScope[] {
  if (
    scopes.length === 0
    || scopes.some((scope) => !BLOG_API_SCOPES.includes(scope as BlogApiScope))
  ) {
    throw new PersonalAccessTokenError('invalid_scopes', '令牌权限范围无效');
  }

  return BLOG_API_SCOPES.filter((scope) => scopes.includes(scope));
}

export async function createPersonalAccessToken(input: {
  userId: string;
  name: string;
  scopes: readonly string[];
  expiresInDays: BlogApiTokenExpiryDays;
  tokenVersion: number;
}): Promise<{ token: string; metadata: TokenMetadata }> {
  const name = input.name.trim();
  if (!name || name.length > 50) {
    throw new PersonalAccessTokenError('invalid_name', '令牌名称需为 1–50 个字');
  }
  if (!BLOG_API_TOKEN_EXPIRY_DAYS.includes(input.expiresInDays)) {
    throw new PersonalAccessTokenError('invalid_expiry', '令牌有效期无效');
  }
  const scopes = normalizeScopes(input.scopes);
  const now = new Date();
  const createdAt = now.toISOString();
  const token = `${TOKEN_PREFIX}${randomBytes(32).toString('base64url')}`;
  const id = randomUUID();
  const tokenPrefix = token.slice(0, 12);
  const tokenHash = hashPersonalAccessToken(token);
  const expiresAt = new Date(
    now.getTime() + input.expiresInDays * 24 * 60 * 60 * 1000,
  ).toISOString();

  // 失效令牌不再占用活跃槽位；随后由唯一索引严格限制每个用户最多 10 个非空槽位。
  await db
    .update(personalAccessTokens)
    .set({ slot: null })
    .where(and(
      eq(personalAccessTokens.userId, input.userId),
      isNotNull(personalAccessTokens.slot),
      or(
        isNotNull(personalAccessTokens.revokedAt),
        lte(personalAccessTokens.expiresAt, createdAt),
        ne(
          personalAccessTokens.tokenVersion,
          sql<number>`(
            SELECT ${users.tokenVersion}
            FROM ${users}
            WHERE ${users.id} = ${personalAccessTokens.userId}
          )`,
        ),
      ),
    ));

  const ownerUserId = sql`${sql.identifier('owner')}.${sql.identifier('user_id')}`;
  const ownerTokenVersion = sql`${sql.identifier('owner')}.${sql.identifier('token_version')}`;
  const candidateSlot = sql`${sql.identifier('candidate')}.${sql.identifier('slot')}`;
  const selectedUserId = sql`${sql.identifier('candidate_slot')}.${sql.identifier('user_id')}`;
  const selectedTokenVersion = sql`${sql.identifier('candidate_slot')}.${sql.identifier('token_version')}`;
  const selectedSlot = sql`${sql.identifier('candidate_slot')}.${sql.identifier('slot')}`;
  const occupiedUserId = sql`${sql.identifier('occupied')}.${sql.identifier(personalAccessTokens.userId.name)}`;
  const occupiedSlot = sql`${sql.identifier('occupied')}.${sql.identifier(personalAccessTokens.slot.name)}`;
  const createQuery = sql`
    WITH ${sql.identifier('owner')} AS MATERIALIZED (
      SELECT
        ${users.id} AS ${sql.identifier('user_id')},
        ${users.tokenVersion} AS ${sql.identifier('token_version')}
      FROM ${users}
      WHERE ${users.id} = ${sql.param(input.userId, users.id)}
        AND ${users.emailVerified} = TRUE
        AND ${users.tokenVersion} = ${sql.param(input.tokenVersion, users.tokenVersion)}
      FOR UPDATE
    ),
    ${sql.identifier('candidate_slot')} AS MATERIALIZED (
      SELECT
        ${ownerUserId} AS ${sql.identifier('user_id')},
        ${ownerTokenVersion} AS ${sql.identifier('token_version')},
        ${candidateSlot} AS ${sql.identifier('slot')}
      FROM ${sql.identifier('owner')}
      CROSS JOIN generate_series(1, 10) AS ${sql.identifier('candidate')}(${sql.identifier('slot')})
      WHERE NOT EXISTS (
        SELECT 1
        FROM ${personalAccessTokens} AS ${sql.identifier('occupied')}
        WHERE ${occupiedUserId} = ${ownerUserId}
          AND ${occupiedSlot} = ${candidateSlot}
      )
      ORDER BY ${candidateSlot}
      LIMIT 1
    ),
    ${sql.identifier('inserted')} AS (
      INSERT INTO ${personalAccessTokens} (
        ${sql.identifier(personalAccessTokens.id.name)},
        ${sql.identifier(personalAccessTokens.userId.name)},
        ${sql.identifier(personalAccessTokens.name.name)},
        ${sql.identifier(personalAccessTokens.tokenHash.name)},
        ${sql.identifier(personalAccessTokens.tokenPrefix.name)},
        ${sql.identifier(personalAccessTokens.scopes.name)},
        ${sql.identifier(personalAccessTokens.tokenVersion.name)},
        ${sql.identifier(personalAccessTokens.slot.name)},
        ${sql.identifier(personalAccessTokens.expiresAt.name)},
        ${sql.identifier(personalAccessTokens.lastUsedAt.name)},
        ${sql.identifier(personalAccessTokens.revokedAt.name)},
        ${sql.identifier(personalAccessTokens.createdAt.name)}
      )
      SELECT
        ${sql.param(id, personalAccessTokens.id)},
        ${selectedUserId},
        ${sql.param(name, personalAccessTokens.name)},
        ${sql.param(tokenHash, personalAccessTokens.tokenHash)},
        ${sql.param(tokenPrefix, personalAccessTokens.tokenPrefix)},
        ${sql.param(scopes, personalAccessTokens.scopes)},
        ${selectedTokenVersion},
        ${selectedSlot},
        ${sql.param(expiresAt, personalAccessTokens.expiresAt)},
        NULL,
        NULL,
        ${sql.param(createdAt, personalAccessTokens.createdAt)}
      FROM ${sql.identifier('candidate_slot')}
      ON CONFLICT (
        ${sql.identifier(personalAccessTokens.userId.name)},
        ${sql.identifier(personalAccessTokens.slot.name)}
      ) DO NOTHING
      RETURNING ${personalAccessTokens.id}, ${personalAccessTokens.slot}
    )
    SELECT CASE
      WHEN EXISTS (SELECT 1 FROM ${sql.identifier('inserted')}) THEN 'created'
      WHEN NOT EXISTS (SELECT 1 FROM ${sql.identifier('owner')}) THEN 'account_changed'
      WHEN NOT EXISTS (SELECT 1 FROM ${sql.identifier('candidate_slot')}) THEN 'active_token_limit'
      ELSE 'slot_conflict'
    END AS ${sql.identifier('outcome')}
  `;
  let created = false;
  for (let attempt = 0; attempt < MAX_ACTIVE_TOKENS; attempt += 1) {
    const result = await db.execute<{
      outcome: 'created' | 'account_changed' | 'active_token_limit' | 'slot_conflict';
    }>(createQuery);
    switch (result.rows[0]?.outcome) {
      case 'created':
        created = true;
        break;
      case 'account_changed':
        throw new PersonalAccessTokenError(
          'account_changed',
          '账户状态已变化，请重新登录后再试',
        );
      case 'active_token_limit':
        throw new PersonalAccessTokenError(
          'active_token_limit',
          '当前可用令牌已达到 10 枚上限',
        );
      case 'slot_conflict':
        break;
      default:
        throw new Error('创建博客令牌时数据库返回了无效状态');
    }
    if (created) break;
  }
  if (!created) {
    throw new PersonalAccessTokenError('active_token_limit', '当前可用令牌已达到 10 枚上限');
  }

  return {
    token,
    metadata: {
      id,
      name,
      tokenPrefix,
      scopes,
      status: 'active',
      expiresAt,
      lastUsedAt: null,
      revokedAt: null,
      createdAt,
    },
  };
}

export async function listPersonalAccessTokens(
  userId: string,
  currentTokenVersion: number,
  now = new Date(),
): Promise<TokenMetadata[]> {
  const rows = await db
    .select({
      id: personalAccessTokens.id,
      name: personalAccessTokens.name,
      tokenPrefix: personalAccessTokens.tokenPrefix,
      scopes: personalAccessTokens.scopes,
      tokenVersion: personalAccessTokens.tokenVersion,
      expiresAt: personalAccessTokens.expiresAt,
      lastUsedAt: personalAccessTokens.lastUsedAt,
      revokedAt: personalAccessTokens.revokedAt,
      createdAt: personalAccessTokens.createdAt,
    })
    .from(personalAccessTokens)
    .where(eq(personalAccessTokens.userId, userId))
    .orderBy(desc(personalAccessTokens.createdAt));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    tokenPrefix: row.tokenPrefix,
    scopes: row.scopes.filter((scope): scope is BlogApiScope => (
      BLOG_API_SCOPES.includes(scope as BlogApiScope)
    )),
    status: deriveTokenStatus(row, currentTokenVersion, now),
    expiresAt: row.expiresAt,
    lastUsedAt: row.lastUsedAt,
    revokedAt: row.revokedAt,
    createdAt: row.createdAt,
  }));
}

export async function revokePersonalAccessToken(input: {
  tokenId: string;
  userId: string;
}): Promise<boolean> {
  const revokedAt = new Date().toISOString();
  const result = await db
    .update(personalAccessTokens)
    .set({
      revokedAt: sql<string>`coalesce(${personalAccessTokens.revokedAt}, ${revokedAt})`,
      slot: null,
    })
    .where(and(
      eq(personalAccessTokens.id, input.tokenId),
      eq(personalAccessTokens.userId, input.userId),
    ));

  return (result.rowCount ?? 0) > 0;
}

export async function touchPersonalAccessToken(
  input: { tokenId: string; lastUsedAt: string | null },
  now = new Date(),
): Promise<boolean> {
  const lastUsedTime = input.lastUsedAt ? Date.parse(input.lastUsedAt) : Number.NaN;
  const oneHour = 60 * 60 * 1000;
  if (Number.isFinite(lastUsedTime) && now.getTime() - lastUsedTime < oneHour) {
    return false;
  }

  const threshold = new Date(now.getTime() - oneHour).toISOString();
  const result = await db
    .update(personalAccessTokens)
    .set({ lastUsedAt: now.toISOString() })
    .where(and(
      eq(personalAccessTokens.id, input.tokenId),
      or(
        isNull(personalAccessTokens.lastUsedAt),
        lte(personalAccessTokens.lastUsedAt, threshold),
      ),
    ));

  return (result.rowCount ?? 0) > 0;
}

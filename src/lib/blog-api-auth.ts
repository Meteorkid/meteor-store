import { eq } from 'drizzle-orm';
import { isAdminSession } from './admin';
import { BLOG_API_SCOPES, type BlogApiScope } from './blog-api-contract';
import { db } from './db';
import { personalAccessTokens, users } from './db/schema';
import {
  hashPersonalAccessToken,
  touchPersonalAccessToken,
} from './personal-access-tokens';

const BEARER_PATTERN = /^Bearer (msb_[A-Za-z0-9_-]{43})$/;

export interface BlogApiActor {
  userId: string;
  email: string;
  name: string | null;
  scopes: BlogApiScope[];
  tokenId: string;
  isAdmin: boolean;
}

export type BlogApiAuthFailureReason = 'invalid_token' | 'insufficient_scope';

export type BlogApiAuthResult =
  | { ok: true; actor: BlogApiActor }
  | { ok: false; reason: BlogApiAuthFailureReason };

function readBearerToken(request: Request): string | null {
  const authorization = request.headers.get('authorization');
  if (!authorization) return null;
  return BEARER_PATTERN.exec(authorization)?.[1] ?? null;
}

export async function authenticateBlogApiRequest(
  request: Request,
  requiredScope: BlogApiScope,
): Promise<BlogApiAuthResult> {
  const token = readBearerToken(request);
  if (!token) return { ok: false, reason: 'invalid_token' };

  try {
    const [row] = await db
      .select({
        tokenId: personalAccessTokens.id,
        scopes: personalAccessTokens.scopes,
        tokenVersion: personalAccessTokens.tokenVersion,
        expiresAt: personalAccessTokens.expiresAt,
        lastUsedAt: personalAccessTokens.lastUsedAt,
        revokedAt: personalAccessTokens.revokedAt,
        slot: personalAccessTokens.slot,
        userId: users.id,
        email: users.email,
        name: users.name,
        emailVerified: users.emailVerified,
        userTokenVersion: users.tokenVersion,
      })
      .from(personalAccessTokens)
      .innerJoin(users, eq(personalAccessTokens.userId, users.id))
      .where(eq(personalAccessTokens.tokenHash, hashPersonalAccessToken(token)))
      .limit(1);

    const expiresAt = row ? Date.parse(row.expiresAt) : Number.NaN;
    if (
      !row
      || row.emailVerified !== true
      || row.revokedAt !== null
      || !Number.isFinite(expiresAt)
      || expiresAt <= Date.now()
      || row.tokenVersion !== row.userTokenVersion
      || typeof row.slot !== 'number'
      || !Number.isInteger(row.slot)
      || row.slot < 1
      || row.slot > 10
      || row.scopes.some((scope) => !BLOG_API_SCOPES.includes(scope as BlogApiScope))
    ) {
      return { ok: false, reason: 'invalid_token' };
    }

    const scopes = row.scopes as BlogApiScope[];
    if (!scopes.includes(requiredScope)) {
      return { ok: false, reason: 'insufficient_scope' };
    }

    await touchPersonalAccessToken({
      tokenId: row.tokenId,
      lastUsedAt: row.lastUsedAt,
    }).catch(() => undefined);

    return {
      ok: true,
      actor: {
        userId: row.userId,
        email: row.email,
        name: row.name,
        scopes,
        tokenId: row.tokenId,
        isAdmin: isAdminSession({ email: row.email, emailVerified: true }),
      },
    };
  } catch {
    return { ok: false, reason: 'invalid_token' };
  }
}

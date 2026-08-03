import { SignJWT, jwtVerify } from 'jose';

const ISSUER = 'meteor-store';
const AUDIENCE = 'password-reset';
const EXPIRY_SECONDS = 60 * 60;

export interface PasswordResetIdentity {
  userId: string;
  email: string;
  tokenVersion: number;
}

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(`${secret}:password-reset`);
}

function normalizeIdentity(identity: PasswordResetIdentity): PasswordResetIdentity {
  return {
    userId: identity.userId,
    email: identity.email.trim().toLowerCase(),
    tokenVersion: identity.tokenVersion,
  };
}

export async function createPasswordResetToken(
  identity: PasswordResetIdentity,
): Promise<string> {
  const normalized = normalizeIdentity(identity);
  return new SignJWT({
    email: normalized.email,
    tokenVersion: normalized.tokenVersion,
    typ: AUDIENCE,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setSubject(normalized.userId)
    .setIssuedAt()
    .setExpirationTime(`${EXPIRY_SECONDS}s`)
    .sign(getSecret());
}

export async function readPasswordResetToken(
  token: string,
): Promise<PasswordResetIdentity | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (
      payload.typ !== AUDIENCE ||
      typeof payload.sub !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.tokenVersion !== 'number' ||
      !Number.isSafeInteger(payload.tokenVersion) ||
      payload.tokenVersion < 0
    ) {
      return null;
    }
    return normalizeIdentity({
      userId: payload.sub,
      email: payload.email,
      tokenVersion: payload.tokenVersion,
    });
  } catch {
    return null;
  }
}

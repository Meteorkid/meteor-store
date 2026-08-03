import { SignJWT, jwtVerify } from 'jose';
import { and, eq } from 'drizzle-orm';
import { db } from './db';
import { users } from './db/schema';

const ISSUER = 'meteor-store';
const VERIFICATION_AUDIENCE = 'email-verification';
const VERIFICATION_EXPIRY = 24 * 60 * 60;
const RESEND_AUDIENCE = 'email-verification-resend';
const RESEND_EXPIRY = 15 * 60;

export interface EmailVerificationIdentity {
  userId: string;
  email: string;
}

export interface EmailVerificationResendIdentity extends EmailVerificationIdentity {
  locale: 'zh' | 'en';
}

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(`${secret}:email-verification`);
}

function normalizeIdentity(identity: EmailVerificationIdentity): EmailVerificationIdentity {
  return {
    userId: identity.userId,
    email: identity.email.trim().toLowerCase(),
  };
}

async function createIdentityToken(
  identity: EmailVerificationIdentity,
  audience: string,
  expiresInSeconds: number,
): Promise<string> {
  const normalized = normalizeIdentity(identity);
  return new SignJWT({ email: normalized.email, typ: audience })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ISSUER)
    .setAudience(audience)
    .setSubject(normalized.userId)
    .setIssuedAt()
    .setExpirationTime(`${expiresInSeconds}s`)
    .sign(getSecret());
}

async function readIdentityToken(
  token: string,
  audience: string,
): Promise<EmailVerificationIdentity | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISSUER,
      audience,
    });
    if (
      payload.typ !== audience ||
      typeof payload.sub !== 'string' ||
      typeof payload.email !== 'string'
    ) {
      return null;
    }
    return normalizeIdentity({ userId: payload.sub, email: payload.email });
  } catch {
    return null;
  }
}

export function createEmailVerificationToken(
  identity: EmailVerificationIdentity,
): Promise<string> {
  return createIdentityToken(identity, VERIFICATION_AUDIENCE, VERIFICATION_EXPIRY);
}

export function readEmailVerificationToken(
  token: string,
): Promise<EmailVerificationIdentity | null> {
  return readIdentityToken(token, VERIFICATION_AUDIENCE);
}

export async function createEmailVerificationResendTicket(
  identity: EmailVerificationResendIdentity,
): Promise<string> {
  const normalized = normalizeIdentity(identity);
  return new SignJWT({
    email: normalized.email,
    locale: identity.locale,
    typ: RESEND_AUDIENCE,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ISSUER)
    .setAudience(RESEND_AUDIENCE)
    .setSubject(normalized.userId)
    .setIssuedAt()
    .setExpirationTime(`${RESEND_EXPIRY}s`)
    .sign(getSecret());
}

export async function readEmailVerificationResendTicket(
  token: string,
): Promise<EmailVerificationResendIdentity | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISSUER,
      audience: RESEND_AUDIENCE,
    });
    if (
      payload.typ !== RESEND_AUDIENCE ||
      typeof payload.sub !== 'string' ||
      typeof payload.email !== 'string' ||
      (payload.locale !== 'zh' && payload.locale !== 'en')
    ) {
      return null;
    }
    return {
      ...normalizeIdentity({ userId: payload.sub, email: payload.email }),
      locale: payload.locale,
    };
  } catch {
    return null;
  }
}

export async function verifyEmailAddress(token: string): Promise<boolean> {
  const identity = await readEmailVerificationToken(token);
  if (!identity) return false;

  const [user] = await db
    .select({
      email: users.email,
      emailVerified: users.emailVerified,
    })
    .from(users)
    .where(and(eq(users.id, identity.userId), eq(users.email, identity.email)))
    .limit(1);

  if (!user) return false;
  if (user.emailVerified) return true;

  await db
    .update(users)
    .set({ emailVerified: true })
    .where(
      and(
        eq(users.id, identity.userId),
        eq(users.email, identity.email),
        eq(users.emailVerified, false),
      ),
    );

  return true;
}

import { SignJWT, jwtVerify } from 'jose';

const ISSUER = 'meteor-store';
const AUDIENCE = 'newsletter-unsubscribe';
const EXPIRY_SECONDS = 60 * 60;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(`${secret}:newsletter-unsubscribe`);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function createNewsletterUnsubscribeToken(email: string): Promise<string> {
  const normalizedEmail = normalizeEmail(email);
  return new SignJWT({ email: normalizedEmail, typ: AUDIENCE })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setSubject(normalizedEmail)
    .setIssuedAt()
    .setExpirationTime(`${EXPIRY_SECONDS}s`)
    .sign(getSecret());
}

export async function readNewsletterUnsubscribeToken(
  token: string,
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (
      payload.typ !== AUDIENCE ||
      typeof payload.email !== 'string' ||
      payload.sub !== payload.email
    ) {
      return null;
    }
    return { email: normalizeEmail(payload.email) };
  } catch {
    return null;
  }
}

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'ms_order_access';
const ISSUER = 'meteor-store';
const AUDIENCE = 'order-access';
const MAX_AGE = 60 * 60;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(`${secret}:order-access`);
}

export async function createOrderAccess(orderId: string): Promise<void> {
  if (!UUID_PATTERN.test(orderId)) throw new Error('Invalid order ID');

  const token = await new SignJWT({ typ: AUDIENCE })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setSubject(orderId)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  });
}

export async function getOrderAccess(): Promise<{ orderId: string } | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (
      payload.typ !== AUDIENCE ||
      typeof payload.sub !== 'string' ||
      !UUID_PATTERN.test(payload.sub)
    ) {
      return null;
    }
    return { orderId: payload.sub };
  } catch {
    return null;
  }
}

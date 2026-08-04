import { SignJWT, jwtVerify } from 'jose';

const ISSUER = 'meteor-store';
const AUDIENCE = 'student-verification';
const EXPIRY_SECONDS = 24 * 60 * 60;

export interface StudentVerificationIdentity {
  userId: string;
  email: string;
  studentEmail: string;
  tokenVersion: number;
}

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(`${secret}:student-verification`);
}

function normalizeIdentity(identity: StudentVerificationIdentity): StudentVerificationIdentity {
  return {
    ...identity,
    email: identity.email.trim().toLowerCase(),
    studentEmail: identity.studentEmail.trim().toLowerCase(),
  };
}

export async function createStudentVerificationToken(
  identity: StudentVerificationIdentity,
): Promise<string> {
  const normalized = normalizeIdentity(identity);
  return new SignJWT({
    email: normalized.email,
    studentEmail: normalized.studentEmail,
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

export async function readStudentVerificationToken(
  token: string,
): Promise<StudentVerificationIdentity | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (
      payload.typ !== AUDIENCE ||
      typeof payload.sub !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.studentEmail !== 'string' ||
      typeof payload.tokenVersion !== 'number' ||
      !Number.isSafeInteger(payload.tokenVersion) ||
      payload.tokenVersion < 0
    ) {
      return null;
    }
    return normalizeIdentity({
      userId: payload.sub,
      email: payload.email,
      studentEmail: payload.studentEmail,
      tokenVersion: payload.tokenVersion,
    });
  } catch {
    return null;
  }
}

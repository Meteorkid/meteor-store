import { SignJWT, jwtVerify } from 'jose';
import { randomUUID } from 'crypto';

const CAPTCHA_EXPIRY = 120;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(secret + ':captcha');
}

export interface CaptchaChallenge {
  token: string;
  targetX: number;
  targetY: number;
  bgSeed: number;
}

export async function createCaptchaChallenge(): Promise<CaptchaChallenge> {
  const targetX = 60 + Math.floor(Math.random() * 170);
  const targetY = 20 + Math.floor(Math.random() * 70);
  const bgSeed = Math.floor(Math.random() * 2147483647);

  const token = await new SignJWT({
    x: targetX,
    y: targetY,
    s: bgSeed,
    typ: 'captcha',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${CAPTCHA_EXPIRY}s`)
    .setJti(randomUUID())
    .sign(getSecret());

  return { token, targetX, targetY, bgSeed };
}

export async function verifyCaptcha(token: string, userX: number): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.typ !== 'captcha') return false;
    const targetX = payload.x as number;
    return Math.abs(userX - targetX) <= 5;
  } catch {
    return false;
  }
}

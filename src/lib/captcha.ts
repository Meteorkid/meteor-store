import { randomBytes, randomUUID } from 'crypto';
import { SignJWT, jwtVerify } from 'jose';
import sharp from 'sharp';
import { getRedis } from './redis';

const CAPTCHA_EXPIRY = 120;
const WIDTH = 300;
const HEIGHT = 150;
const PIECE_SIZE = 42;
const TOLERANCE = 5;
const CLEANUP_THRESHOLD = 5_000;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(`${secret}:captcha-proof`);
}

export interface CaptchaChallenge {
  /** 服务端保存答案的一次性随机 ID，本身不承载任何坐标。 */
  token: string;
  /** 拼图块的 Y 坐标，客户端定位图片所需，不是验证答案。 */
  targetY: number;
  /** 已在服务端栅格化、挖去缺口的背景。 */
  backgroundImage: string;
  /** 已在服务端栅格化的拼图块。 */
  pieceImage: string;
}

interface LocalChallenge {
  targetX: number;
  expiresAt: number;
}

const localChallenges = new Map<string, LocalChallenge>();
const consumedProofs = new Map<string, number>();

function cleanupLocalState() {
  if (localChallenges.size < CLEANUP_THRESHOLD && consumedProofs.size < CLEANUP_THRESHOLD) return;
  const now = Date.now();
  for (const [key, value] of localChallenges) {
    if (value.expiresAt <= now) localChallenges.delete(key);
  }
  for (const [key, expiresAt] of consumedProofs) {
    if (expiresAt <= now) consumedProofs.delete(key);
  }
}

function createBackgroundPixels(): Buffer {
  const base = randomBytes(3);
  const pixels = Buffer.alloc(WIDTH * HEIGHT * 3);
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const offset = (y * WIDTH + x) * 3;
      const pattern = ((x * 17) ^ (y * 29) ^ ((x + y) * 7)) & 63;
      pixels[offset] = (base[0] + Math.floor((x / WIDTH) * 80) + pattern) & 255;
      pixels[offset + 1] = (base[1] + Math.floor((y / HEIGHT) * 90) + pattern / 2) & 255;
      pixels[offset + 2] = (base[2] + Math.floor(((x + y) / (WIDTH + HEIGHT)) * 100) + pattern) & 255;
    }
  }
  return pixels;
}

async function renderChallengeImages(targetX: number, targetY: number) {
  const original = createBackgroundPixels();
  const background = Buffer.from(original);
  const pieceWidth = PIECE_SIZE + 4;
  const piece = Buffer.alloc(pieceWidth * pieceWidth * 4);

  for (let y = 0; y < PIECE_SIZE; y++) {
    for (let x = 0; x < PIECE_SIZE; x++) {
      const source = ((targetY + y) * WIDTH + targetX + x) * 3;
      const pieceOffset = ((y + 2) * pieceWidth + x + 2) * 4;
      piece[pieceOffset] = original[source];
      piece[pieceOffset + 1] = original[source + 1];
      piece[pieceOffset + 2] = original[source + 2];
      piece[pieceOffset + 3] = 255;

      const backgroundOffset = ((targetY + y) * WIDTH + targetX + x) * 3;
      const border = x < 2 || y < 2 || x >= PIECE_SIZE - 2 || y >= PIECE_SIZE - 2;
      if (border) {
        background[backgroundOffset] = 190;
        background[backgroundOffset + 1] = 190;
        background[backgroundOffset + 2] = 200;
      } else {
        background[backgroundOffset] = Math.floor(background[backgroundOffset] * 0.35);
        background[backgroundOffset + 1] = Math.floor(background[backgroundOffset + 1] * 0.35);
        background[backgroundOffset + 2] = Math.floor(background[backgroundOffset + 2] * 0.35);
      }
    }
  }

  for (let position = 1; position < pieceWidth - 1; position++) {
    for (const [x, y] of [
      [position, 1],
      [position, pieceWidth - 2],
      [1, position],
      [pieceWidth - 2, position],
    ]) {
      const offset = (y * pieceWidth + x) * 4;
      piece[offset] = 255;
      piece[offset + 1] = 255;
      piece[offset + 2] = 255;
      piece[offset + 3] = 210;
    }
  }

  const [backgroundPng, piecePng] = await Promise.all([
    sharp(background, { raw: { width: WIDTH, height: HEIGHT, channels: 3 } })
      .png({ compressionLevel: 9 })
      .toBuffer(),
    sharp(piece, { raw: { width: pieceWidth, height: pieceWidth, channels: 4 } })
      .png({ compressionLevel: 9 })
      .toBuffer(),
  ]);

  return {
    backgroundImage: `data:image/png;base64,${backgroundPng.toString('base64')}`,
    pieceImage: `data:image/png;base64,${piecePng.toString('base64')}`,
  };
}

async function storeChallenge(token: string, targetX: number): Promise<boolean> {
  const redis = getRedis();
  if (redis) {
    try {
      const result = await redis.set(`captcha:challenge:${token}`, String(targetX), {
        ex: CAPTCHA_EXPIRY,
      });
      return result === 'OK';
    } catch (error) {
      console.error('captcha challenge store failed (Redis):', error);
      return false;
    }
  }

  cleanupLocalState();
  localChallenges.set(token, {
    targetX,
    expiresAt: Date.now() + CAPTCHA_EXPIRY * 1000,
  });
  return true;
}

export async function createCaptchaChallenge(): Promise<CaptchaChallenge> {
  const targetX = 60 + Math.floor(Math.random() * 170);
  const targetY = 20 + Math.floor(Math.random() * 70);
  const token = randomUUID();
  const images = await renderChallengeImages(targetX, targetY);
  if (!(await storeChallenge(token, targetX))) {
    throw new Error('Captcha challenge storage unavailable');
  }
  return { token, targetY, ...images };
}

async function readChallengeTarget(token: string): Promise<number | null> {
  const redis = getRedis();
  if (redis) {
    try {
      const value = await redis.get<string | number>(`captcha:challenge:${token}`);
      const targetX = Number(value);
      return value === null || !Number.isFinite(targetX) ? null : targetX;
    } catch (error) {
      console.error('captcha challenge read failed (Redis):', error);
      return null;
    }
  }

  const challenge = localChallenges.get(token);
  if (!challenge) return null;
  if (challenge.expiresAt <= Date.now()) {
    localChallenges.delete(token);
    return null;
  }
  return challenge.targetX;
}

async function claimChallenge(token: string, expectedTargetX: number): Promise<boolean> {
  const redis = getRedis();
  if (redis) {
    try {
      const value = await redis.getdel<string | number>(`captcha:challenge:${token}`);
      return value !== null && Number(value) === expectedTargetX;
    } catch (error) {
      console.error('captcha challenge consume failed (Redis):', error);
      return false;
    }
  }

  const challenge = localChallenges.get(token);
  if (!challenge || challenge.expiresAt <= Date.now() || challenge.targetX !== expectedTargetX) {
    return false;
  }
  localChallenges.delete(token);
  return true;
}

export async function verifyCaptchaChallenge(token: string, userX: number): Promise<boolean> {
  if (!token || !Number.isFinite(userX)) return false;
  const targetX = await readChallengeTarget(token);
  if (targetX === null || Math.abs(userX - targetX) > TOLERANCE) return false;
  return claimChallenge(token, targetX);
}

export async function createCaptchaProof(): Promise<string> {
  return new SignJWT({ typ: 'captcha-proof' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${CAPTCHA_EXPIRY}s`)
    .setJti(randomUUID())
    .sign(getSecret());
}

async function tryConsumeProofJti(jti: string): Promise<boolean> {
  const redis = getRedis();
  if (redis) {
    try {
      const result = await redis.set(`captcha:proof:${jti}`, '1', {
        ex: CAPTCHA_EXPIRY + 60,
        nx: true,
      });
      return result === 'OK';
    } catch (error) {
      console.error('captcha proof consume failed (Redis):', error);
      return false;
    }
  }

  cleanupLocalState();
  const now = Date.now();
  const expiresAt = consumedProofs.get(jti);
  if (expiresAt !== undefined && expiresAt > now) return false;
  consumedProofs.set(jti, now + (CAPTCHA_EXPIRY + 60) * 1000);
  return true;
}

export async function consumeCaptchaProof(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.typ !== 'captcha-proof' || typeof payload.jti !== 'string') return false;
    return tryConsumeProofJti(payload.jti);
  } catch {
    return false;
  }
}

/** 注册入口的兼容名称：现在验证的是服务端签发的一次性 proof，而不是坐标答案。 */
export function verifyCaptcha(token: string): Promise<boolean> {
  return consumeCaptchaProof(token);
}

/** 测试用：重置本地状态。仅在 vitest 内使用。 */
export function __resetCaptchaStateForTests() {
  localChallenges.clear();
  consumedProofs.clear();
}

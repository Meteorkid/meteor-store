import { SignJWT, jwtVerify } from 'jose';
import { randomUUID } from 'crypto';
import { getRedis } from './redis';

const CAPTCHA_EXPIRY = 120;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(secret + ':captcha');
}

export interface CaptchaChallenge {
  /** 一次性 JWT，包含目标位置，客户端不应解读 */
  token: string;
  /** 拼图缺口的 Y 坐标，客户端绘图必需 */
  targetY: number;
  /** 拼图缺口的 X 坐标，客户端绘图必需
   *  注意：targetX 必须返回给客户端才能绘制拼图块与缺口，安全保证来自下方的一次性消费 + 注册限流，
   *  而不是把 targetX 藏起来 */
  targetX: number;
  /** 背景种子，客户端据此重绘同一张随机背景 */
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
    // JTI：每个挑战唯一标识，验证后立即标记已用，阻止同一 token 反复通过
    .setJti(randomUUID())
    .sign(getSecret());

  return { token, targetX, targetY, bgSeed };
}

/**
 * 单实例兜底：Redis 不可用时（开发环境或未配置）用进程内 Map。
 * 生产环境应配置 Redis，确保多实例下严格一次性消费。
 */
const consumedJtis = new Map<string, number>();
const CLEANUP_THRESHOLD = 5_000;

function isJtiConsumedLocal(jti: string): boolean {
  const now = Date.now();
  const expireAt = consumedJtis.get(jti);
  if (expireAt === undefined) return false;
  if (expireAt <= now) {
    consumedJtis.delete(jti);
    return false;
  }
  return true;
}

function markJtiConsumedLocal(jti: string) {
  const now = Date.now();
  if (consumedJtis.size >= CLEANUP_THRESHOLD) {
    for (const [k, v] of consumedJtis) {
      if (v <= now) consumedJtis.delete(k);
    }
  }
  consumedJtis.set(jti, now + (CAPTCHA_EXPIRY + 60) * 1000);
}

/**
 * 标记 JTI 已消费。
 *
 * Redis 可用时用 SET NX EX，原子地"不存在则写入"，跨 Vercel 实例一致：
 *   - 返回 OK：抢到，本次验证是首次消费
 *   - 返回 null：已被另一个实例抢先消费，本次是重放
 *
 * Redis 不可用时降级到进程内 Map（开发环境已足够，register 限流提供二次防御）。
 * 返回 true 表示这是首次消费可以放行；false 表示是重放或 Redis 出错时保守拒绝。
 */
async function tryConsumeJti(jti: string): Promise<boolean> {
  const redis = getRedis();
  if (redis) {
    try {
      // SET key value NX EX seconds —— 只在 key 不存在时写入，过期后自动清理
      const result = await redis.set(
        `captcha:jti:${jti}`,
        '1',
        { ex: CAPTCHA_EXPIRY + 60, nx: true },
      );
      return result === 'OK';
    } catch (err) {
      console.error('captcha jti consume failed (Redis), rejecting conservatively:', err);
      return false;
    }
  }

  // 单实例降级
  if (isJtiConsumedLocal(jti)) return false;
  markJtiConsumedLocal(jti);
  return true;
}

export async function verifyCaptcha(token: string, userX: number): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.typ !== 'captcha') return false;

    const jti = payload.jti;
    if (!jti || typeof jti !== 'string') return false;

    const targetX = payload.x as number;
    const ok = Math.abs(userX - targetX) <= 5;
    if (!ok) return false;

    // 位置对了才消费 JTI：失败的尝试不烧掉 token，让前端可以展示
    // 同一拼图让用户再试（前端拿不到失败信号会强制刷新挑战，体验差）。
    // 一旦位置通过，立即原子抢占 JTI——同一 token 第二次进来必拒绝。
    return await tryConsumeJti(jti);
  } catch {
    return false;
  }
}

/** 测试用：重置本地 Map 状态。仅在 vitest 内使用 */
export function __resetCaptchaStateForTests() {
  consumedJtis.clear();
}

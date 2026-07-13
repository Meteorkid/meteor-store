// 基于 Redis 的速率限制器（适用于 Vercel Serverless）
// 使用 @upstash/ratelimit + @upstash/redis，支持分布式限流

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Redis 客户端（惰性初始化，全局单例）
let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}

// 按 (limit, windowMs) 组合缓存 Ratelimit 实例，
// 否则所有调用方共享同一限流器会导致各路由声明的阈值互相覆盖失效
const limiters = new Map<string, Ratelimit>();
const memoryWindows = new Map<string, { count: number; resetAt: number }>();

function getLimiter(limit: number, windowMs: number): Ratelimit | null {
  const redisClient = getRedis();
  if (!redisClient) {
    console.warn('UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not configured, rate limiting disabled');
    return null;
  }

  const cacheKey = `${limit}:${windowMs}`;
  let limiter = limiters.get(cacheKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
      ephemeralCache: new Map(),
    });
    limiters.set(cacheKey, limiter);
  }
  return limiter;
}

/**
 * 检查是否超过速率限制
 * @param key 限流键（如 IP + 路由）
 * @param limit 时间窗口内允许的最大请求数
 * @param windowMs 时间窗口（毫秒）
 * @param options.failClosed Redis 配置了但请求异常（网络抖动等）时，是否拒绝请求而非放行。
 *   用于支付、发货重试等资金/成本敏感接口；默认 false（fail-open）。
 * @param options.fallback Redis 不可用时的降级策略。`memory` 在单个运行实例内保留固定窗口限流，
 *   适合成本或资源敏感的公开接口；默认 `none` 保持既有 fail-open 行为。
 * @returns { limited: boolean, remaining: number, resetAt: number }
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  options: { failClosed?: boolean; fallback?: 'none' | 'memory' } = {},
): Promise<{ limited: boolean; remaining: number; resetAt: number }> {
  const limiterInstance = getLimiter(limit, windowMs);

  // Redis 未配置时按调用方要求使用进程内降级限流，或保持既有不限制行为。
  if (!limiterInstance) {
    if (options.fallback === 'memory') return memoryRateLimit(key, limit, windowMs);
    return { limited: false, remaining: limit, resetAt: Date.now() + windowMs };
  }

  try {
    const result = await limiterInstance.limit(key);

    return {
      limited: !result.success,
      remaining: result.remaining,
      resetAt: result.reset,
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    if (options.failClosed) {
      // 敏感接口：Redis 异常时拒绝请求，避免限流失效期间被刷单/刷量
      return { limited: true, remaining: 0, resetAt: Date.now() + windowMs };
    }
    if (options.fallback === 'memory') return memoryRateLimit(key, limit, windowMs);
    // 低风险接口：Redis 出错时降级为不限制，避免影响正常请求
    return { limited: false, remaining: limit, resetAt: Date.now() + windowMs };
  }
}

/** 无 Redis 时的实例内固定窗口限流；实例重启会自然清空。 */
function memoryRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { limited: boolean; remaining: number; resetAt: number } {
  const now = Date.now();

  if (memoryWindows.size >= 10_000) {
    for (const [windowKey, value] of memoryWindows) {
      if (value.resetAt <= now) memoryWindows.delete(windowKey);
    }
    // 活跃键过多时淘汰最早的窗口，避免恶意伪造 key 导致内存持续增长。
    const oldestKey = memoryWindows.keys().next().value;
    if (memoryWindows.size >= 10_000 && oldestKey) memoryWindows.delete(oldestKey);
  }

  const windowKey = `${key}:${limit}:${windowMs}`;
  const existing = memoryWindows.get(windowKey);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    memoryWindows.set(windowKey, { count: 1, resetAt });
    return { limited: false, remaining: Math.max(0, limit - 1), resetAt };
  }

  if (existing.count >= limit) {
    return { limited: true, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { limited: false, remaining: Math.max(0, limit - existing.count), resetAt: existing.resetAt };
}

/**
 * 判断是否为内网/私有 IP
 */
function isPrivateIp(ip: string): boolean {
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'unknown') return true;
  if (ip.startsWith('10.')) return true;
  if (ip.startsWith('192.168.')) return true;
  // 172.16.0.0/12
  if (ip.startsWith('172.')) {
    const second = parseInt(ip.split('.')[1], 10);
    return second >= 16 && second <= 31;
  }
  return false;
}

/**
 * 验证 IP 格式是否合法
 */
function isValidIp(ip: string): boolean {
  // IPv4 格式校验
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Regex.test(ip)) return false;
  return ip.split('.').every(part => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
}

/**
 * 从请求中提取客户端 IP
 * 优先使用 Vercel 注入的 x-forwarded-for，但会校验格式防止伪造
 */
export function getClientIp(request: Request): string {
  const isVercel = process.env.VERCEL === '1';

  // 仅在 Vercel 环境信任代理头
  if (isVercel) {
    const xff = request.headers.get('x-forwarded-for');
    if (xff) {
      // 取链中最后一个非内网 IP（Vercel 代理链尾端是客户端真实 IP）
      const ips = xff.split(',').map(ip => ip.trim());
      for (let i = ips.length - 1; i >= 0; i--) {
        if (!isPrivateIp(ips[i]) && isValidIp(ips[i])) return ips[i];
      }
    }
    const real = request.headers.get('x-real-ip');
    if (real && !isPrivateIp(real) && isValidIp(real)) return real;
  }

  // 非 Vercel 环境或无代理头时，返回 unknown（限流效果减弱但安全）
  return 'unknown';
}

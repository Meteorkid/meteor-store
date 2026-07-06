// 基于 Redis 的速率限制器（适用于 Vercel Serverless）
// 使用 @upstash/ratelimit + @upstash/redis，支持分布式限流

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Redis 客户端（惰性初始化）
let redis: Redis | null = null;
let limiter: Ratelimit | null = null;

function getLimiter(): Ratelimit | null {
  // 如果环境变量未配置，返回 null（降级为无限制）
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not configured, rate limiting disabled');
    return null;
  }

  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      // 滑动窗口限流：60 秒内最多 10 次请求
      limiter: Ratelimit.slidingWindow(10, '60 s'),
      // 保留限流结果 120 秒
      ephemeralCache: new Map(),
    });
  }

  return limiter;
}

/**
 * 检查是否超过速率限制
 * @param key 限流键（如 IP + 路由）
 * @param limit 时间窗口内允许的最大请求数（仅作为 fallback）
 * @param windowMs 时间窗口（毫秒）（仅作为 fallback）
 * @returns { limited: boolean, remaining: number, resetAt: number }
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ limited: boolean; remaining: number; resetAt: number }> {
  const limiterInstance = getLimiter();

  // 降级：如果 Redis 未配置，返回不限制
  if (!limiterInstance) {
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
    // Redis 出错时降级为不限制，避免影响正常请求
    console.error('Rate limit error:', error);
    return { limited: false, remaining: limit, resetAt: Date.now() + windowMs };
  }
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

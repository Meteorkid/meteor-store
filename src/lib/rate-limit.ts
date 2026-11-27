// 基于本机 Redis 的滑动窗口速率限制器。
// 客户端从 ./redis 取；生产环境是 127.0.0.1 上的 redis-server，不再使用 Upstash REST。

import { randomUUID } from 'node:crypto';
import { isIP } from 'node:net';
import { getRedis } from './redis';

// 每个限流键用一个 sorted set 保存窗口内的请求时间戳。
// 脚本在 Redis 内原子完成「清理过期成员 → 计数 → 写入/拒绝」，避免并发竞态。
// TIME 由 Redis 提供，多个应用进程即使时钟有偏差也按同一时间轴计算。
const SLIDING_WINDOW_SCRIPT = `
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local member = ARGV[3]

local now_parts = redis.call('TIME')
local now_ms = tonumber(now_parts[1]) * 1000 + math.floor(tonumber(now_parts[2]) / 1000)

redis.call('ZREMRANGEBYSCORE', key, 0, now_ms - window)
local count = redis.call('ZCARD', key)

local allowed = 0
local remaining = 0
local reset_at = now_ms + window

if count < limit then
  redis.call('ZADD', key, now_ms, member)
  redis.call('PEXPIRE', key, window)
  allowed = 1
  remaining = limit - count - 1
  if count > 0 then
    local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
    reset_at = tonumber(oldest[2]) + window
  end
else
  local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
  reset_at = tonumber(oldest[2]) + window
end

return { allowed, remaining, reset_at }
`;

const memoryWindows = new Map<string, { count: number; resetAt: number }>();
let warnedMissingRedis = false;

/**
 * 检查是否超过速率限制
 * @param key 限流键（如 IP + 路由）
 * @param limit 时间窗口内允许的最大请求数
 * @param windowMs 时间窗口（毫秒）
 * @param options.failClosed Redis 配置了但请求异常（网络抖动等）时，是否拒绝请求而非放行。
 *   用于支付、发货重试等资金/成本敏感接口；默认 false（fail-open）。
 * @param options.fallback Redis 不可用时的降级策略。`memory` 在单个运行实例内保留固定窗口限流，
 *   适合成本或资源敏感的公开接口；默认 `none` 保持既有 fail-open 行为。
 * @param options.store 强制使用 `memory` 时完全不访问 Redis，适合在线心跳这类低价值高频写入。
 *   当前生产是单个 PM2 fork，进程内限流足够；扩容成多进程前必须改回 `auto`。
 * @returns { limited: boolean, remaining: number, resetAt: number }
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  options: { failClosed?: boolean; fallback?: 'none' | 'memory'; store?: 'auto' | 'memory' } = {},
): Promise<{ limited: boolean; remaining: number; resetAt: number }> {
  if (options.store === 'memory') return memoryRateLimit(key, limit, windowMs);

  const redis = getRedis();
  if (!redis) {
    if (!warnedMissingRedis) {
      warnedMissingRedis = true;
      console.warn('REDIS_URL not configured, rate limiting uses the requested fallback');
    }
    if (options.fallback === 'memory') return memoryRateLimit(key, limit, windowMs);
    return { limited: false, remaining: limit, resetAt: Date.now() + windowMs };
  }

  const normalizedLimit = Math.max(1, Math.trunc(limit));
  const normalizedWindow = Math.max(1, Math.trunc(windowMs));
  const member = `${Date.now()}-${randomUUID()}`;

  try {
    const raw = await redis.eval(
      SLIDING_WINDOW_SCRIPT,
      1,
      key,
      String(normalizedLimit),
      String(normalizedWindow),
      member,
    );
    if (!Array.isArray(raw) || raw.length < 3) throw new Error('Unexpected rate limit response');
    const allowed = Number(raw[0]);
    const remaining = Number(raw[1]);
    const resetAt = Number(raw[2]);
    if (!Number.isFinite(allowed) || !Number.isFinite(remaining) || !Number.isFinite(resetAt)) {
      throw new Error('Invalid rate limit response');
    }
    return { limited: allowed !== 1, remaining: Math.max(0, remaining), resetAt };
  } catch (error) {
    console.error('Rate limit error:', error);
    if (options.failClosed) {
      // 敏感接口：Redis 异常时拒绝请求，避免限流失效期间被刷单/刷量
      return { limited: true, remaining: 0, resetAt: Date.now() + normalizedWindow };
    }
    if (options.fallback === 'memory') return memoryRateLimit(key, normalizedLimit, normalizedWindow);
    // 低风险接口：Redis 出错时降级为不限制，避免影响正常请求
    return { limited: false, remaining: normalizedLimit, resetAt: Date.now() + normalizedWindow };
  }
}

/** 实例内固定窗口限流；实例重启会自然清空。 */
function memoryRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { limited: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const windowKey = `${key}:${limit}:${windowMs}`;
  const existing = memoryWindows.get(windowKey);

  if (existing && existing.resetAt > now) {
    if (existing.count >= limit) {
      return { limited: true, remaining: 0, resetAt: existing.resetAt };
    }
    existing.count += 1;
    return { limited: false, remaining: Math.max(0, limit - existing.count), resetAt: existing.resetAt };
  }

  if (!existing && memoryWindows.size >= 10_000) {
    let nextResetAt = Infinity;
    for (const [storedKey, value] of memoryWindows) {
      if (value.resetAt <= now) memoryWindows.delete(storedKey);
      else nextResetAt = Math.min(nextResetAt, value.resetAt);
    }
    // 不能淘汰尚有效的窗口：填充新 key 否则能重置目标账号已耗尽的预算。
    // 容量满时只拒绝新 key，已有窗口仍正常计数；过期后自动释放容量。
    if (memoryWindows.size >= 10_000) {
      return { limited: true, remaining: 0, resetAt: nextResetAt };
    }
  }

  const resetAt = now + windowMs;
  memoryWindows.set(windowKey, { count: 1, resetAt });
  return { limited: false, remaining: Math.max(0, limit - 1), resetAt };
}

/**
 * 判断是否为内网/私有 IP
 */
function isPrivateIp(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === '127.0.0.1' || normalized === '::1' || normalized === '::' || normalized === 'unknown') return true;
  if (normalized.startsWith('fc') || normalized.startsWith('fd') || /^fe[89ab]/.test(normalized)) return true;
  if (normalized.startsWith('::ffff:')) {
    return isPrivateIp(normalized.slice('::ffff:'.length));
  }
  if (ip.startsWith('10.')) return true;
  if (ip.startsWith('192.168.')) return true;
  if (ip.startsWith('169.254.')) return true;
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
  return isIP(ip) !== 0;
}

/**
 * 从请求中提取客户端 IP
 * 优先使用 Vercel 注入的 x-forwarded-for，但会校验格式防止伪造
 */
export function getClientIp(request: Request): string {
  const isVercel = process.env.VERCEL === '1';
  const trustsNginxProxy = process.env.TRUST_NGINX_PROXY === '1';

  // 自托管部署只信任由本机 Nginx 覆盖的 X-Real-IP。
  // Next 进程必须仅监听回环地址，避免客户端绕过 Nginx 直接伪造该请求头。
  if (trustsNginxProxy) {
    const real = request.headers.get('x-real-ip');
    if (real && !isPrivateIp(real) && isValidIp(real)) return real;
    return 'unknown';
  }

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

// 简易内存速率限制器（适用于单实例 serverless）
// 生产环境建议换用 @upstash/ratelimit + Redis

const hits = new Map<string, { count: number; resetAt: number }>();

// 每 5 分钟清理一次过期条目，避免内存泄漏
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of hits) {
    if (value.resetAt <= now) hits.delete(key);
  }
}, 5 * 60 * 1000);

/**
 * 检查是否超过速率限制
 * @param key 限流键（如 IP + 路由）
 * @param limit 时间窗口内允许的最大请求数
 * @param windowMs 时间窗口（毫秒）
 * @returns { limited: boolean, remaining: number, resetAt: number }
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { limited: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: limit - 1, resetAt: now + windowMs };
  }

  entry.count++;
  const remaining = Math.max(0, limit - entry.count);

  if (entry.count > limit) {
    return { limited: true, remaining: 0, resetAt: entry.resetAt };
  }

  return { limited: false, remaining, resetAt: entry.resetAt };
}

/**
 * 从请求中提取客户端 IP
 */
export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real;
  return '127.0.0.1';
}

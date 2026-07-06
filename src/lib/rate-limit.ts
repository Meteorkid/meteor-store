// 简易内存速率限制器（适用于单实例 serverless）
// 注意：Vercel Serverless 冷启动会重置计数器，生产环境建议换用 @upstash/ratelimit + Redis

const hits = new Map<string, { count: number; resetAt: number }>();

let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 分钟

/** 惰性清理过期条目，避免 setInterval 在 serverless 环境中失效 */
function lazyCleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, value] of hits) {
    if (value.resetAt <= now) hits.delete(key);
  }
}

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
  lazyCleanup();

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

import { Redis } from '@upstash/redis';

/**
 * 全站共享的 Upstash Redis 客户端。
 *
 * 限流、CAPTCHA 防重放等需要跨 Vercel 实例一致的功能都从这里取连接，
 * 避免各自 new Redis() 导致连接信息散落多处。
 *
 * 连接信息的取值顺序：先认 @upstash/redis 的约定名，再认 Vercel Marketplace
 * 集成注入的名字（前缀 UPSTASH_REDIS + 它自己的 _KV_REST_API_* 后缀）。
 *
 * 不把集成注入的值手抄成约定名，是因为那些变量由集成托管：Upstash 侧轮换 token
 * 时集成会自动更新，手抄的副本不会，限流会拿着作废 token 静默失效。
 */

let redis: Redis | null = null;

function readCredentials(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_KV_REST_API_URL;
  // 必须是可写 token，READ_ONLY 那个无法记录计数
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

/** 返回共享 Redis 客户端；未配置时返回 null（调用方各自降级）。 */
export function getRedis(): Redis | null {
  const credentials = readCredentials();
  if (!credentials) return null;
  if (!redis) redis = new Redis(credentials);
  return redis;
}

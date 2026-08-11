import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

/**
 * 健康检查接口
 * 用于负载均衡器、监控系统和 cron 定时探活
 * GET /api/health
 */
export async function GET() {
  const checks: Record<string, { status: 'ok' | 'error'; latency_ms?: number; error?: string }> = {};

  // 1. 自身可达
  checks.self = { status: 'ok' };

  // 2. 数据库连通性
  try {
    const start = Date.now();
    const { db } = await import('@/lib/db');
    await db.select({ one: sql`1` }).from(sql`(values (1)) as t(one)`).limit(1);
    checks.database = { status: 'ok', latency_ms: Date.now() - start };
  } catch (e) {
    checks.database = { status: 'error', error: String(e) };
  }

  // 3. Redis 连通性
  try {
    const start = Date.now();
    const { Redis } = await import('@upstash/redis');
    const redis = Redis.fromEnv();
    await redis.ping();
    checks.redis = { status: 'ok', latency_ms: Date.now() - start };
  } catch (e) {
    checks.redis = { status: 'error', error: String(e) };
  }

  const allOk = Object.values(checks).every((c) => c.status === 'ok');
  const statusCode = allOk ? 200 : 503;

  return NextResponse.json(
    {
      status: allOk ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: statusCode }
  );
}

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { orders, licenseKeys, feedbacks, users, personalAccessTokens, blogImages, topicProposals, posts, postTags, comments, pageViews, likes, postFavorites, passReminders, announcements, tollowBookProgress, tollowPracticeSessions, tollowTextFavorites, pathfinderSources, pathfinderItems, pathfinderItemTags } from './schema';

type DrizzleDB = ReturnType<typeof drizzle>;

const schema = { orders, licenseKeys, feedbacks, users, personalAccessTokens, blogImages, topicProposals, posts, postTags, comments, pageViews, likes, postFavorites, passReminders, announcements, tollowBookProgress, tollowPracticeSessions, tollowTextFavorites, pathfinderSources, pathfinderItems, pathfinderItemTags };

// 延迟初始化，避免 build 时因缺少 DATABASE_URL 而崩溃
let _db: DrizzleDB | null = null;
let _pool: Pool | null = null;

/**
 * 数据库连接。
 *
 * **驱动是 node-postgres（`pg`），不是 `@neondatabase/serverless`。**
 * 2026-09-02 从 Neon 迁到同机自建 PostgreSQL 18 之后换的：neon-http 是走
 * HTTP 的专用驱动，只能连 Neon，连不了普通 Postgres。换驱动带来两点变化：
 *
 * 1. **事务可用了**。此前代码里大量「复合主键兜底并发」「条件更新防竞态」
 *    「单条 CTE 原子写入」的写法，是为了绕开 Neon HTTP 不支持事务而设计的。
 *    那些写法现在依然正确、依然保留——它们本身就是更稳的做法，不要因为
 *    「现在有事务了」去重写，那是没有收益的大面积改动。
 * 2. **每次查询不再是一次网络往返**。数据库就在本机 unix 网络栈上，延迟从
 *    毫秒级降到微秒级。同样地，那些「把多个 count 压成单条子查询」的优化
 *    仍然有效，只是不再是性能关键。
 *
 * 连接池上限设 10：PM2 以 fork 模式跑单进程，10 条足够；服务端
 * `max_connections = 30`，留出余量给 pg_dump 备份和手工 psql。
 */
function getDb(): DrizzleDB {
  if (!_db) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    _pool = new Pool({
      connectionString: url,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });
    // 池里的空闲连接被服务端切断时，pg 会在池上抛错。不监听的话
    // 这是个未捕获异常，会直接带崩整个 Node 进程
    _pool.on('error', (err) => {
      console.error('数据库连接池错误（空闲连接被断开）', err);
    });
    _db = drizzle(_pool, { schema });
  }
  return _db;
}

// 导出代理对象，所有调用会延迟到实际使用时
export const db = new Proxy({} as DrizzleDB, {
  get(_target, prop) {
    const instance = getDb();
    const value = (instance as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
});

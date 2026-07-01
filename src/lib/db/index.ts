import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { orders, licenseKeys, feedbacks } from './schema';

type DrizzleDB = ReturnType<typeof drizzle>;

// 延迟初始化，避免 build 时因缺少 DATABASE_URL 而崩溃
let _db: DrizzleDB | null = null;

function getDb(): DrizzleDB {
  if (!_db) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    const sql = neon(url);
    _db = drizzle(sql, { schema: { orders, licenseKeys, feedbacks } });
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

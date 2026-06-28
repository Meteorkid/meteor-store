import { mkdirSync } from 'fs';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { orders } from './schema';

// 确保 data 目录存在，必须在 Database 构造之前
mkdirSync('data', { recursive: true });

const sqlite = new Database('data/meteor-store.db');
export const db = drizzle(sqlite, { schema: { orders } });

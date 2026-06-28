import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { orders } from './schema';

const sqlite = new Database('data/meteor-store.db');
export const db = drizzle(sqlite, { schema: { orders } });

// 确保 data 目录存在
import { mkdirSync } from 'fs';
try { mkdirSync('data', { recursive: true }); } catch {}

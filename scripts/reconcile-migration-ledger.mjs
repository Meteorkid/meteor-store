#!/usr/bin/env node

/**
 * 迁移账本（drizzle.__drizzle_migrations）对账。
 *
 * 背景：账本与 drizzle/meta/_journal.json 长期不一致。历史上做过一次对账
 * （见 0017_reconcile_migration_history），但那次**只补了 journal，没补账本**，
 * 于是残留至今；后来又有人往账本里手工插过两行，hash 列写的是标签名而不是 sha256。
 *
 * 为什么要修：drizzle 的判定逻辑是「取账本里 created_at 最大的一行，执行所有
 * when 比它大的 journal 条目」（见 drizzle-orm 的 pg-core/dialect.js），
 * hash 列只写不读。所以漂移**不会**让 db:migrate 去重跑老迁移——
 * 真正的后果是账本不再是「哪些迁移已执行」的可信记录：
 * when 小于最大值的条目会被永远跳过，出问题时也查不出是漏执行还是没记账。
 *
 * 安全前提：只有当一条迁移创建的对象**确实都已存在于库中**时，才为它补记账本。
 * 否则补记等于把「真的没执行」永久藏起来。这条检查是硬性的，
 * 有任何一条对不上就拒绝 --apply。
 *
 * 用法：
 *   node scripts/reconcile-migration-ledger.mjs            # dry-run，只读
 *   node scripts/reconcile-migration-ledger.mjs --apply    # 写账本
 *
 * 只增删账本行，**不执行任何迁移 SQL、不改业务表**。
 */

import { neon } from '@neondatabase/serverless';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DRIZZLE_DIR = join(ROOT, 'drizzle');

function parseCliArgs(args) {
  const supported = new Set(['--apply', '--dry-run']);
  const unknown = args.find((arg) => !supported.has(arg));
  if (unknown) throw new Error(`未知参数：${unknown}`);
  if (args.includes('--apply') && args.includes('--dry-run')) {
    throw new Error('不能同时使用 --apply 与 --dry-run');
  }
  return { apply: args.includes('--apply') };
}

/** 读取 journal，并为每条算出 drizzle 用的 hash（迁移 SQL 原文的 sha256）。 */
function readJournal() {
  const journal = JSON.parse(readFileSync(join(DRIZZLE_DIR, 'meta/_journal.json'), 'utf8'));
  return journal.entries.map((entry) => {
    const sql = readFileSync(join(DRIZZLE_DIR, `${entry.tag}.sql`), 'utf8');
    return {
      tag: entry.tag,
      when: entry.when,
      hash: createHash('sha256').update(sql).digest('hex'),
      sql,
    };
  });
}

/**
 * 剥掉 SQL 注释再做解析。
 *
 * **必须先剥**：本仓库的迁移习惯在注释里写回滚提示，例如
 * `-- 回滚：DROP TABLE IF EXISTS "invite_codes";`。不剥的话这些提示会被当成真的
 * DROP 语句，于是 invite_codes、users.bio 这些**至今仍在库里**的对象被误判成
 * 「已被后续迁移删除」而豁免检查——校验会静默放宽，等于没做。
 */
function stripSqlComments(sql) {
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, ' ')   // 块注释
    .replace(/--[^\n]*/g, ' ');            // 行注释
}

/**
 * 从迁移 SQL 里提取它创建的对象名。
 *
 * 只认 CREATE TABLE / CREATE INDEX / ADD COLUMN 三类——这是本仓库迁移的全部写法。
 * 提取不到对象的迁移（如纯注释的对账标记）返回空数组，由调用方按「无可验证对象」处理。
 */
function extractObjects(rawSql) {
  const sql = stripSqlComments(rawSql);
  const tables = [...sql.matchAll(/CREATE TABLE (?:IF NOT EXISTS )?"([^"]+)"/gi)].map((m) => m[1]);
  const indexes = [...sql.matchAll(/CREATE (?:UNIQUE )?INDEX (?:IF NOT EXISTS )?"([^"]+)"/gi)].map((m) => m[1]);
  const columns = [...sql.matchAll(/ALTER TABLE "([^"]+)"[^;]*?ADD COLUMN (?:IF NOT EXISTS )?"([^"]+)"/gis)]
    .map((m) => `${m[1]}.${m[2]}`);
  return { tables, indexes, columns };
}

/**
 * 从迁移 SQL 里提取它**删除**的对象名。
 *
 * 少了这一步会误判：一条迁移创建的索引，可能被后来的迁移显式 DROP 掉
 * （0027_dusty_firebird 就把 comments_status_idx / reports_status_idx 换成了
 * 带 _created 的复合索引）。只问「对象现在在不在」的话，
 * 0008 / 0009 / 0014 会被判成「没执行过」，而它们其实执行了。
 */
function extractDroppedObjects(rawSql) {
  const sql = stripSqlComments(rawSql);
  const tables = [...sql.matchAll(/DROP TABLE (?:IF EXISTS )?"([^"]+)"/gi)].map((m) => m[1]);
  const indexes = [...sql.matchAll(/DROP INDEX (?:IF EXISTS )?"([^"]+)"/gi)].map((m) => m[1]);
  const columns = [...sql.matchAll(/ALTER TABLE "([^"]+)"[^;]*?DROP COLUMN (?:IF EXISTS )?"([^"]+)"/gis)]
    .map((m) => `${m[1]}.${m[2]}`);
  return { tables, indexes, columns };
}

async function readDatabaseShape(sql) {
  const [tables, columns, indexes] = await Promise.all([
    sql`select table_name from information_schema.tables where table_schema = 'public'`,
    sql`select table_name || '.' || column_name as name from information_schema.columns where table_schema = 'public'`,
    sql`select indexname from pg_indexes where schemaname = 'public'`,
  ]);
  return {
    tables: new Set(tables.map((r) => r.table_name)),
    columns: new Set(columns.map((r) => r.name)),
    indexes: new Set(indexes.map((r) => r.indexname)),
  };
}

/**
 * 一条迁移的对象是否都已存在于库中。
 *
 * `droppedLater` 是所有 when 更大的迁移删掉的对象集合——落在里面的对象
 * 本来就不该存在，不计入缺失。
 */
function verifyApplied(entry, shape, droppedLater) {
  const { tables, indexes, columns } = extractObjects(entry.sql);
  const alive = {
    tables: tables.filter((t) => !droppedLater.tables.has(t)),
    indexes: indexes.filter((i) => !droppedLater.indexes.has(i)),
    columns: columns.filter((c) => !droppedLater.columns.has(c)),
  };
  const missing = [
    ...alive.tables.filter((t) => !shape.tables.has(t)).map((t) => `表 ${t}`),
    ...alive.indexes.filter((i) => !shape.indexes.has(i)).map((i) => `索引 ${i}`),
    ...alive.columns.filter((c) => !shape.columns.has(c)).map((c) => `列 ${c}`),
  ];
  const total = alive.tables.length + alive.indexes.length + alive.columns.length;
  const superseded = (tables.length + indexes.length + columns.length) - total;
  return { missing, total, superseded };
}

/** 收集所有 when 大于给定时刻的迁移删掉的对象。 */
function collectDroppedAfter(entries, when) {
  const acc = { tables: new Set(), indexes: new Set(), columns: new Set() };
  for (const e of entries) {
    if (e.when <= when) continue;
    const dropped = extractDroppedObjects(e.sql);
    for (const t of dropped.tables) acc.tables.add(t);
    for (const i of dropped.indexes) acc.indexes.add(i);
    for (const c of dropped.columns) acc.columns.add(c);
  }
  return acc;
}

async function main() {
  const { apply } = parseCliArgs(process.argv.slice(2));
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('缺少必要环境变量：DATABASE_URL');

  const sql = neon(databaseUrl);
  const entries = readJournal();
  const validHashes = new Set(entries.map((e) => e.hash));

  const rows = await sql`select id, hash, created_at from drizzle.__drizzle_migrations order by id`;
  const shape = await readDatabaseShape(sql);

  console.log(apply
    ? '[apply] 将增删账本行；不执行任何迁移 SQL，不改业务表'
    : '[dry-run] 只读检查；不写任何内容');
  console.log(`账本现有 ${rows.length} 行，journal 有 ${entries.length} 条\n`);

  // 1) hash 不是任何 journal 文件 sha256 的行 —— 历史人工插入的残留
  const bogus = rows.filter((r) => !validHashes.has(r.hash));
  const recorded = new Set(rows.filter((r) => validHashes.has(r.hash)).map((r) => r.hash));
  const missing = entries.filter((e) => !recorded.has(e.hash));

  if (bogus.length > 0) {
    console.log(`【无效行】hash 列不是有效 sha256，共 ${bogus.length} 行：`);
    for (const r of bogus) console.log(`  id=${r.id} created_at=${r.created_at} hash=${JSON.stringify(r.hash)}`);
    console.log();
  }

  // 2) 补记前逐条验证效果确实在库
  console.log(`【账本缺失】共 ${missing.length} 条，逐条核对其对象是否已存在于库中：`);
  let blocked = 0;
  for (const entry of missing) {
    const droppedLater = collectDroppedAfter(entries, entry.when);
    const { missing: gaps, total, superseded } = verifyApplied(entry, shape, droppedLater);
    const note = superseded > 0 ? `，另有 ${superseded} 个已被后续迁移删除` : '';
    if (gaps.length > 0) {
      blocked += 1;
      console.log(`  ✗ ${entry.tag} —— 缺 ${gaps.join('、')}`);
    } else {
      console.log(`  ✓ ${entry.tag}${total === 0 ? '（无存活对象可验证）' : `（${total} 个对象已就位${note}）`}`);
    }
  }
  console.log();

  if (blocked > 0) {
    console.error(
      `拒绝对账：有 ${blocked} 条迁移的对象在库中不存在，说明它们是真的没执行过，\n` +
      '不能靠补账本掩盖。请先手工执行这些迁移，确认无误后再重跑本脚本。',
    );
    process.exitCode = 1;
    return;
  }

  const maxAfter = Math.max(...entries.map((e) => e.when));
  const maxNow = rows.length > 0 ? Math.max(...rows.map((r) => Number(r.created_at))) : 0;
  console.log(`对账前 max(created_at)=${maxNow}，对账后=${maxAfter}`);
  console.log(`（drizzle 只比较 created_at 最大值，对账后 db:migrate 的待执行条目应为 0）\n`);

  if (!apply) {
    console.log('dry-run 结束。确认无误后加 --apply 执行。');
    return;
  }

  // 3) 落盘备份，再动账本
  const backupPath = join(ROOT, `drizzle-ledger-backup-${Date.now()}.json`);
  writeFileSync(backupPath, JSON.stringify(rows, null, 2));
  console.log(`已备份原账本 → ${backupPath}`);

  for (const r of bogus) {
    await sql`delete from drizzle.__drizzle_migrations where id = ${r.id}`;
    console.log(`  删除 id=${r.id}`);
  }
  for (const entry of missing) {
    await sql`insert into drizzle.__drizzle_migrations (hash, created_at) values (${entry.hash}, ${entry.when})`;
    console.log(`  插入 ${entry.tag}`);
  }

  const after = await sql`select count(*)::int as c from drizzle.__drizzle_migrations`;
  console.log(`\n完成，账本现有 ${after[0].c} 行（journal ${entries.length} 条）`);
  if (after[0].c !== entries.length) {
    console.warn('⚠ 行数与 journal 条目数不一致，请人工复核。');
  }
}

// 供测试 import，不自动执行
const isDirectRun = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

export { collectDroppedAfter, extractDroppedObjects, extractObjects, parseCliArgs, stripSqlComments, verifyApplied };

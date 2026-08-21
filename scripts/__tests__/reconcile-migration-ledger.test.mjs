import { describe, expect, it } from 'vitest';

import {
  collectDroppedAfter,
  extractDroppedObjects,
  extractObjects,
  parseCliArgs,
  stripSqlComments,
  verifyApplied,
} from '../reconcile-migration-ledger.mjs';

const emptyDrops = { tables: new Set(), indexes: new Set(), columns: new Set() };

describe('parseCliArgs', () => {
  it('默认是 dry-run', () => {
    expect(parseCliArgs([]).apply).toBe(false);
  });

  it('--apply 才写库', () => {
    expect(parseCliArgs(['--apply']).apply).toBe(true);
  });

  it('拒绝未知参数与互斥组合', () => {
    expect(() => parseCliArgs(['--force'])).toThrow(/未知参数/);
    expect(() => parseCliArgs(['--apply', '--dry-run'])).toThrow(/不能同时/);
  });
});

describe('stripSqlComments', () => {
  /**
   * 这条是本脚本最容易出错的地方，也是实际踩过的坑：
   * 本仓库的迁移习惯在注释里写回滚提示，不剥注释就会把提示里的 DROP
   * 当成真的删除，导致校验被静默放宽。
   */
  it('注释里的回滚提示不能被当成真的 DROP', () => {
    const sql = `
      -- 回滚：DROP TABLE IF EXISTS "invite_codes";
      CREATE TABLE IF NOT EXISTS "invite_codes" ("id" text PRIMARY KEY);
    `;
    expect(extractDroppedObjects(sql).tables).toEqual([]);
    expect(extractObjects(sql).tables).toEqual(['invite_codes']);
  });

  it('块注释同样剥掉', () => {
    const sql = '/* DROP INDEX "x_idx"; */ CREATE INDEX "y_idx" ON "t" ("c");';
    expect(extractDroppedObjects(sql).indexes).toEqual([]);
    expect(extractObjects(sql).indexes).toEqual(['y_idx']);
  });

  it('真的 DROP 语句仍然认得出来', () => {
    const sql = 'DROP INDEX IF EXISTS "comments_status_idx";';
    expect(extractDroppedObjects(sql).indexes).toEqual(['comments_status_idx']);
  });

  it('保留注释之外的语句', () => {
    expect(stripSqlComments('SELECT 1; -- 说明\nSELECT 2;')).toContain('SELECT 2;');
  });
});

describe('extractObjects', () => {
  it('认得表、索引与新增列', () => {
    const sql = `
      CREATE TABLE IF NOT EXISTS "reports" ("id" text);
      CREATE UNIQUE INDEX "reports_uniq" ON "reports" ("id");
      ALTER TABLE "users" ADD COLUMN "bio" text;
    `;
    const objects = extractObjects(sql);
    expect(objects.tables).toEqual(['reports']);
    expect(objects.indexes).toEqual(['reports_uniq']);
    expect(objects.columns).toEqual(['users.bio']);
  });
});

describe('verifyApplied', () => {
  const shape = {
    tables: new Set(['comments']),
    indexes: new Set(['comments_target_idx']),
    columns: new Set(['users.bio']),
  };

  it('对象齐全时判为已执行', () => {
    const entry = { sql: 'CREATE TABLE "comments" ("id" text);' };
    expect(verifyApplied(entry, shape, emptyDrops).missing).toEqual([]);
  });

  it('对象缺失时报出来，不能放行', () => {
    const entry = { sql: 'CREATE TABLE "missing_table" ("id" text);' };
    const result = verifyApplied(entry, shape, emptyDrops);
    expect(result.missing).toEqual(['表 missing_table']);
  });

  it('已被后续迁移删除的对象不算缺失', () => {
    // 0008 建了 comments_status_idx，0027 又把它换成 comments_status_created_idx。
    // 不认这一层的话 0008 会被误判成「没执行过」。
    const entry = { sql: 'CREATE INDEX "comments_status_idx" ON "comments" ("status");' };
    const dropped = { ...emptyDrops, indexes: new Set(['comments_status_idx']) };
    const result = verifyApplied(entry, shape, dropped);
    expect(result.missing).toEqual([]);
    expect(result.superseded).toBe(1);
  });
});

describe('collectDroppedAfter', () => {
  const entries = [
    { when: 100, sql: 'CREATE INDEX "a_idx" ON "t" ("c");' },
    { when: 200, sql: 'DROP INDEX "a_idx";' },
  ];

  it('只收集 when 更大的迁移删掉的对象', () => {
    expect([...collectDroppedAfter(entries, 100).indexes]).toEqual(['a_idx']);
    // 站在 200 这条自己的时点上，它自己的 DROP 不该算进来
    expect([...collectDroppedAfter(entries, 200).indexes]).toEqual([]);
  });
});

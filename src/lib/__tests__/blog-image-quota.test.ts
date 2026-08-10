import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SQL } from 'drizzle-orm';
import { getTableConfig, PgDialect } from 'drizzle-orm/pg-core';
import { blogImages, users } from '../db/schema';

const dbState = vi.hoisted(() => ({
  rowsByCall: [] as Array<Array<Record<string, unknown>>>,
  queries: [] as unknown[],
}));

vi.mock('../db', () => ({
  db: {
    execute: vi.fn(async (query: unknown) => {
      dbState.queries.push(query);
      return { rows: dbState.rowsByCall.shift() ?? [] };
    }),
  },
}));

import {
  BLOG_IMAGE_ADMIN_LIMIT_BYTES,
  BLOG_IMAGE_MAX_BYTES,
  BLOG_IMAGE_USER_LIMIT_BYTES,
  confirmBlogImageReservation,
  discardBlogImageAllocation,
  getBlogImageLimitBytes,
  prepareBlogImageReservation,
  releaseBlogImageReservation,
} from '../blog-image-quota';

describe('博客图片配额数据模型', () => {
  it('在用户计数器与图片账本中保存配额所需字段', () => {
    expect(users.blogImageBytes.name).toBe('blog_image_bytes');
    expect(blogImages.id.name).toBe('id');
    expect(blogImages.userId.name).toBe('user_id');
    expect(blogImages.objectKey.name).toBe('object_key');
    expect(blogImages.sizeBytes.name).toBe('size_bytes');
    expect(blogImages.status.name).toBe('status');
    expect(blogImages.createdAt.name).toBe('created_at');
    expect(blogImages.updatedAt.name).toBe('updated_at');
    expect(blogImages.uploadedAt.name).toBe('uploaded_at');

    const imageConfig = getTableConfig(blogImages);
    expect(imageConfig.checks.map((constraint) => constraint.name)).toEqual([
      'blog_images_size_range',
      'blog_images_status_valid',
    ]);
    expect(imageConfig.indexes.map((index) => index.config.name)).toEqual([
      'blog_images_object_key_idx',
      'blog_images_user_idx',
      'blog_images_status_updated_idx',
    ]);
    expect(getTableConfig(users).checks.map((constraint) => constraint.name))
      .toContain('users_blog_image_bytes_non_negative');
  });
});

describe('博客图片额度', () => {
  beforeEach(() => {
    dbState.rowsByCall = [];
    dbState.queries = [];
  });

  it('普通用户为 200 MiB，管理员为 1 GiB，单图仍限制 5,000,000 字节', () => {
    expect(BLOG_IMAGE_USER_LIMIT_BYTES).toBe(200 * 1024 * 1024);
    expect(BLOG_IMAGE_ADMIN_LIMIT_BYTES).toBe(1024 * 1024 * 1024);
    expect(BLOG_IMAGE_MAX_BYTES).toBe(5_000_000);
    expect(getBlogImageLimitBytes(false)).toBe(BLOG_IMAGE_USER_LIMIT_BYTES);
    expect(getBlogImageLimitBytes(true)).toBe(BLOG_IMAGE_ADMIN_LIMIT_BYTES);
  });

  it('已有 legacy ready 对象时复用原 key 与当前用量', async () => {
    dbState.rowsByCall = [[{
      source: 'existing',
      id: 'BI1',
      object_key: 'blog/U1/0123456789abcdef.webp',
      size_bytes: 1024,
      status: 'ready',
      updated_at: '2026-08-10T00:00:00.000Z',
      used_bytes: '4096',
    }]];

    await expect(prepareBlogImageReservation({
      userId: 'U1',
      objectKey: `blog/U1/${'a'.repeat(64)}.webp`,
      legacyObjectKey: 'blog/U1/0123456789abcdef.webp',
      sizeBytes: 1024,
      limitBytes: BLOG_IMAGE_USER_LIMIT_BYTES,
      now: new Date('2026-08-10T01:00:00.000Z'),
    })).resolves.toEqual({
      kind: 'ready',
      key: 'blog/U1/0123456789abcdef.webp',
      quota: {
        usedBytes: 4096,
        limitBytes: BLOG_IMAGE_USER_LIMIT_BYTES,
        remainingBytes: BLOG_IMAGE_USER_LIMIT_BYTES - 4096,
      },
    });
    expect(dbState.queries).toHaveLength(1);
  });

  it('用参数化 DML CTE 把唯一 allocating 原子计费为 reserved', async () => {
    const fullKey = `blog/U1/${'a'.repeat(64)}.webp`;
    dbState.rowsByCall = [
      [{
        source: 'allocated',
        id: 'BI1',
        object_key: fullKey,
        size_bytes: 5_000_000,
        status: 'allocating',
        updated_at: '2026-08-10T01:00:00.000Z',
        used_bytes: '0',
      }],
      [{
        reservation_found: true,
        reserved: true,
        object_key: fullKey,
        size_bytes: 5_000_000,
        used_bytes: '5000000',
        updated_at: '2026-08-10T01:00:00.000Z',
      }],
    ];

    await expect(prepareBlogImageReservation({
      userId: 'U1',
      objectKey: fullKey,
      legacyObjectKey: 'blog/U1/aaaaaaaaaaaaaaaa.webp',
      sizeBytes: 5_000_000,
      limitBytes: BLOG_IMAGE_USER_LIMIT_BYTES,
      now: new Date('2026-08-10T01:00:00.000Z'),
    })).resolves.toEqual({
      kind: 'reserved',
      reservation: {
        id: 'BI1',
        key: fullKey,
        sizeBytes: 5_000_000,
        updatedAt: '2026-08-10T01:00:00.000Z',
      },
      quota: {
        usedBytes: 5_000_000,
        limitBytes: BLOG_IMAGE_USER_LIMIT_BYTES,
        remainingBytes: BLOG_IMAGE_USER_LIMIT_BYTES - 5_000_000,
      },
    });

    const compiled = new PgDialect().sqlToQuery(dbState.queries[1] as SQL);
    const sqlText = compiled.sql.replace(/\s+/g, ' ').trim().toLowerCase();
    expect(sqlText).toContain('with reservation as materialized');
    expect(sqlText).toContain('for update');
    expect(sqlText).toContain('update users');
    expect(sqlText).toContain('blog_image_bytes +');
    expect(sqlText).toContain('<=');
    expect(sqlText).toContain("update blog_images set status = 'reserved'");
    expect(compiled.sql).not.toContain(fullKey);
    expect(compiled.params).toContain('BI1');
    expect(compiled.params).toContain(BLOG_IMAGE_USER_LIMIT_BYTES);
    const claim = new PgDialect().sqlToQuery(dbState.queries[0] as SQL);
    expect(claim.sql).not.toContain(fullKey);
    expect(claim.params).toContain(fullKey);
  });

  it('额度不足时删除未计费 allocating，并返回当前用量与请求字节', async () => {
    const fullKey = `blog/U1/${'b'.repeat(64)}.png`;
    const usedBytes = BLOG_IMAGE_USER_LIMIT_BYTES - 1_000_000;
    dbState.rowsByCall = [
      [{
        source: 'allocated', id: 'BI2', object_key: fullKey,
        size_bytes: 5_000_000, status: 'allocating',
        updated_at: '2026-08-10T01:00:00.000Z', used_bytes: String(usedBytes),
      }],
      [{
        reservation_found: true, reserved: false, object_key: null,
        size_bytes: null, used_bytes: null, updated_at: null,
      }],
      [{ removed: true, used_bytes: String(usedBytes) }],
    ];

    await expect(prepareBlogImageReservation({
      userId: 'U1',
      objectKey: fullKey,
      legacyObjectKey: 'blog/U1/bbbbbbbbbbbbbbbb.png',
      sizeBytes: 5_000_000,
      limitBytes: BLOG_IMAGE_USER_LIMIT_BYTES,
      now: new Date('2026-08-10T01:00:00.000Z'),
    })).resolves.toEqual({
      kind: 'quota_exceeded',
      quota: {
        usedBytes,
        limitBytes: BLOG_IMAGE_USER_LIMIT_BYTES,
        remainingBytes: 1_000_000,
      },
      requestedBytes: 5_000_000,
    });

    const cleanup = new PgDialect().sqlToQuery(dbState.queries[2] as SQL);
    const cleanupSql = cleanup.sql.replace(/\s+/g, ' ').trim().toLowerCase();
    expect(cleanupSql).toContain('delete from blog_images');
    expect(cleanupSql).toContain("status = 'allocating'");
    expect(cleanup.params).toContain('BI2');
  });

  it('相同 key 并发只有一个请求获胜，其余请求看到上传中状态', async () => {
    const fullKey = `blog/U1/${'c'.repeat(64)}.jpg`;
    dbState.rowsByCall = [
      [],
      [{
        source: 'existing', id: 'BI3', object_key: fullKey,
        size_bytes: 2048, status: 'reserved',
        updated_at: '2026-08-10T01:00:00.000Z', used_bytes: '2048',
      }],
    ];

    await expect(prepareBlogImageReservation({
      userId: 'U1',
      objectKey: fullKey,
      legacyObjectKey: 'blog/U1/cccccccccccccccc.jpg',
      sizeBytes: 2048,
      limitBytes: BLOG_IMAGE_USER_LIMIT_BYTES,
      now: new Date('2026-08-10T01:00:01.000Z'),
    })).resolves.toEqual({
      kind: 'in_progress',
      retryAfter: 2,
      reservation: {
        id: 'BI3',
        key: fullKey,
        sizeBytes: 2048,
        status: 'reserved',
        updatedAt: '2026-08-10T01:00:00.000Z',
      },
    });
    expect(dbState.queries).toHaveLength(2);
  });

  it('R2 写入成功后幂等确认自己的 reserved/ready 记录', async () => {
    dbState.rowsByCall = [[{
      confirmed: true,
      used_bytes: '12345',
    }]];

    await expect(confirmBlogImageReservation({
      reservationId: 'BI1',
      userId: 'U1',
      limitBytes: BLOG_IMAGE_USER_LIMIT_BYTES,
      now: new Date('2026-08-10T01:05:00.000Z'),
    })).resolves.toEqual({
      usedBytes: 12345,
      limitBytes: BLOG_IMAGE_USER_LIMIT_BYTES,
      remainingBytes: BLOG_IMAGE_USER_LIMIT_BYTES - 12345,
    });

    const compiled = new PgDialect().sqlToQuery(dbState.queries[0] as SQL);
    const sqlText = compiled.sql.replace(/\s+/g, ' ').trim().toLowerCase();
    expect(sqlText).toContain('update blog_images');
    expect(sqlText).toContain("status = 'ready'");
    expect(sqlText).toContain("status in ('reserved', 'ready')");
    expect(sqlText).toContain('uploaded_at');
    expect(compiled.params).toContain('BI1');
    expect(compiled.params).toContain('U1');
  });

  it('R2 失败时仅在计数足够时用单条 CTE 原子扣减并释放 reservation', async () => {
    dbState.rowsByCall = [[{
      released: true,
      used_bytes: '0',
    }]];

    await expect(releaseBlogImageReservation({
      reservationId: 'BI1',
      userId: 'U1',
      limitBytes: BLOG_IMAGE_USER_LIMIT_BYTES,
    })).resolves.toEqual({
      usedBytes: 0,
      limitBytes: BLOG_IMAGE_USER_LIMIT_BYTES,
      remainingBytes: BLOG_IMAGE_USER_LIMIT_BYTES,
    });

    const compiled = new PgDialect().sqlToQuery(dbState.queries[0] as SQL);
    const sqlText = compiled.sql.replace(/\s+/g, ' ').trim().toLowerCase();
    expect(sqlText).toContain('with reservation as materialized');
    expect(sqlText).toContain('for update');
    expect(sqlText).toContain('delete from blog_images');
    expect(sqlText).toContain("status = 'reserved'");
    expect(sqlText).toContain('update users');
    expect(sqlText).toContain('blog_image_bytes >= reservation.size_bytes');
    expect(sqlText).toContain('exists (select 1 from adjusted)');
    expect(sqlText).not.toContain('greatest(');
    expect(compiled.params).toContain('BI1');
    expect(compiled.params).toContain('U1');
  });

  it('counter 小于 reservation 时返回 null，并由 SQL 保留账本供对账', async () => {
    dbState.rowsByCall = [[{
      released: false,
      used_bytes: '2',
    }]];

    await expect(releaseBlogImageReservation({
      reservationId: 'BI-drift',
      userId: 'U1',
      limitBytes: BLOG_IMAGE_USER_LIMIT_BYTES,
    })).resolves.toBeNull();

    const compiled = new PgDialect().sqlToQuery(dbState.queries[0] as SQL);
    const sqlText = compiled.sql.replace(/\s+/g, ' ').trim().toLowerCase();
    expect(sqlText).toContain('blog_image_bytes >= reservation.size_bytes');
    expect(sqlText).toContain('exists (select 1 from adjusted)');
  });

  it('只按旧版本删除超时 allocating，不触碰已计费状态', async () => {
    dbState.rowsByCall = [[{ discarded: true }]];

    await expect(discardBlogImageAllocation({
      reservationId: 'BI3',
      userId: 'U1',
      expectedUpdatedAt: '2026-08-10T00:00:00.000Z',
    })).resolves.toBe(true);

    const compiled = new PgDialect().sqlToQuery(dbState.queries[0] as SQL);
    const sqlText = compiled.sql.replace(/\s+/g, ' ').trim().toLowerCase();
    expect(sqlText).toContain('delete from blog_images');
    expect(sqlText).toContain("status = 'allocating'");
    expect(sqlText).toContain('updated_at =');
    expect(compiled.params).toEqual(expect.arrayContaining([
      'BI3', 'U1', '2026-08-10T00:00:00.000Z',
    ]));
  });
});

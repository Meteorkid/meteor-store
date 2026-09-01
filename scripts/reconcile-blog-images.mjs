#!/usr/bin/env node

import {
  HeadObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';
import { createSql } from './lib/pg-sql.mjs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import {
  buildReconciliationPlan,
  executeReconciliationPlan,
  parseCliArgs,
} from './reconcile-blog-images-lib.mjs';

const BLOG_PREFIX = 'blog/';
const STALE_AFTER_MS = 15 * 60_000;

function readConfig() {
  const config = {
    databaseUrl: process.env.DATABASE_URL,
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucket: process.env.R2_BUCKET,
  };
  const required = {
    DATABASE_URL: config.databaseUrl,
    R2_ACCOUNT_ID: config.accountId,
    R2_ACCESS_KEY_ID: config.accessKeyId,
    R2_SECRET_ACCESS_KEY: config.secretAccessKey,
    R2_BUCKET: config.bucket,
  };
  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([name]) => name);
  if (missing.length > 0) {
    throw new Error(`缺少必要环境变量：${missing.join(', ')}`);
  }
  return config;
}

function createR2Client(config) {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

async function listBlogObjects(client, bucket) {
  const objects = [];
  let continuationToken;
  do {
    const page = await client.send(new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: BLOG_PREFIX,
      ContinuationToken: continuationToken,
    }));
    objects.push(...(page.Contents ?? []));
    if (page.IsTruncated && !page.NextContinuationToken) {
      throw new Error('R2 LIST 返回截断页但缺少 continuation token');
    }
    continuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (continuationToken);
  return objects;
}

function isMissingObjectError(error) {
  return error?.$metadata?.httpStatusCode === 404
    || error?.name === 'NotFound'
    || error?.name === 'NoSuchKey';
}

function reconciliationId(objectKey) {
  return `recon_${createHash('sha256').update(objectKey).digest('hex').slice(0, 32)}`;
}

function sanitizeMessage(error, config) {
  let message = error instanceof Error ? error.message : String(error);
  for (const secret of [
    config.databaseUrl,
    config.accessKeyId,
    config.secretAccessKey,
  ]) {
    if (secret) message = message.replaceAll(secret, '[REDACTED]');
  }
  return message;
}

function printRows(label, rows, formatter) {
  console.log(`${label}: ${rows.length}`);
  for (const row of rows) console.log(`  - ${formatter(row)}`);
}

function printPlan(plan, apply) {
  console.log(apply ? '[apply] 将写入数据库；不会删除任何 R2 对象' : '[dry-run] 只读检查；不会写数据库或删除 R2 对象');
  console.log(`R2 对象: ${plan.summary.listedObjectCount}`);
  console.log(`R2 总字节: ${plan.summary.listedBytes}`);
  console.log(`合法对象: ${plan.summary.validObjectCount} / ${plan.summary.validBytes} 字节`);
  console.log('按用户用量:');
  for (const [userId, bytes] of Object.entries(plan.summary.byUser)) {
    console.log(`  - ${userId}: ${bytes}`);
  }
  printRows('未知用户对象', plan.unknownObjects, (row) => `${row.objectKey} (${row.sizeBytes})`);
  printRows('异常对象', plan.malformedObjects, (row) => `${row.objectKey ?? '<missing-key>'} (${row.sizeBytes ?? 'unknown-size'})`);
  printRows('R2 有、DB 无', plan.r2Only, (row) => row.objectKey);
  printRows('DB 有、R2 无', plan.dbOnly, (row) => row.objectKey);
  printRows('未知用户账本', plan.unknownDbUsers, (row) => `${row.objectKey} owner=${row.userId}`);
  printRows('异常 DB 账本（仅报告）', plan.malformedDbRows, (row) => (
    `${row.objectKey} owner=${row.userId} size=${row.sizeBytes}`
  ));
  printRows('大小不一致', plan.sizeMismatches, ({ object, row }) => (
    `${object.objectKey} R2=${object.sizeBytes} DB=${row.sizeBytes}`
  ));
  printRows('owner 不一致（仅报告）', plan.ownerMismatches, ({ object, row }) => (
    `${object.objectKey} keyOwner=${object.userId} dbOwner=${row.userId}`
  ));
  console.log(`计划回填/修正 ready: ${plan.upserts.length}`);
  console.log(`超时 allocating: ${plan.staleAllocating.length}`);
  console.log(`超时 reserved: ${plan.staleReserved.length}`);
}

async function main() {
  const { apply } = parseCliArgs(process.argv.slice(2));
  const config = readConfig();
  const sql = createSql(config.databaseUrl);
  const r2 = createR2Client(config);
  const now = new Date();

  const [listedObjects, userRows, dbImages] = await Promise.all([
    listBlogObjects(r2, config.bucket),
    sql`SELECT "id" FROM "users"`,
    sql`
      SELECT
        "id",
        "user_id" AS "userId",
        "object_key" AS "objectKey",
        "size_bytes"::integer AS "sizeBytes",
        "status",
        "created_at" AS "createdAt",
        "updated_at" AS "updatedAt",
        "uploaded_at" AS "uploadedAt"
      FROM "blog_images"
      ORDER BY "object_key"
    `,
  ]);
  const plan = buildReconciliationPlan({
    listedObjects,
    dbImages,
    userIds: new Set(userRows.map((row) => row.id)),
    now,
    staleAfterMs: STALE_AFTER_MS,
  });
  printPlan(plan, apply);

  const operations = {
    async upsertReady(object) {
      const timestamp = new Date().toISOString();
      const rows = await sql`
        INSERT INTO "blog_images" (
          "id", "user_id", "object_key", "size_bytes", "status",
          "created_at", "updated_at", "uploaded_at"
        ) VALUES (
          ${reconciliationId(object.objectKey)}, ${object.userId}, ${object.objectKey},
          ${object.sizeBytes}, 'ready', ${timestamp}, ${timestamp}, ${timestamp}
        )
        ON CONFLICT ("object_key") DO UPDATE SET
          "size_bytes" = EXCLUDED."size_bytes",
          "status" = 'ready',
          "updated_at" = EXCLUDED."updated_at",
          "uploaded_at" = COALESCE("blog_images"."uploaded_at", EXCLUDED."uploaded_at")
        WHERE "blog_images"."user_id" = EXCLUDED."user_id"
        RETURNING "id"
      `;
      return rows.length > 0;
    },
    async deleteAllocating(row) {
      const rows = await sql`
        DELETE FROM "blog_images"
        WHERE "id" = ${row.id}
          AND "user_id" = ${row.userId}
          AND "status" = 'allocating'
          AND "updated_at" = ${row.updatedAt}
        RETURNING "id"
      `;
      return rows.length > 0;
    },
    async headObject(objectKey) {
      try {
        const response = await r2.send(new HeadObjectCommand({
          Bucket: config.bucket,
          Key: objectKey,
        }));
        return { exists: true, contentLength: response.ContentLength };
      } catch (error) {
        if (isMissingObjectError(error)) return { exists: false };
        throw new Error(`R2 HEAD 失败：${error?.name ?? 'UnknownError'}`);
      }
    },
    async markReady(row) {
      const timestamp = new Date().toISOString();
      const rows = await sql`
        UPDATE "blog_images"
        SET
          "status" = 'ready',
          "updated_at" = ${timestamp},
          "uploaded_at" = COALESCE("uploaded_at", ${timestamp})
        WHERE "id" = ${row.id}
          AND "user_id" = ${row.userId}
          AND "status" = 'reserved'
        RETURNING "id"
      `;
      return rows.length > 0;
    },
    async releaseReserved(row) {
      const rows = await sql`
        WITH removed AS (
          DELETE FROM "blog_images"
          WHERE "id" = ${row.id}
            AND "user_id" = ${row.userId}
            AND "status" = 'reserved'
            AND "updated_at" = ${row.updatedAt}
          RETURNING "user_id", "size_bytes"
        )
        UPDATE "users"
        SET "blog_image_bytes" = GREATEST(
          0,
          "users"."blog_image_bytes" - removed."size_bytes"
        )
        FROM removed
        WHERE "users"."id" = removed."user_id"
        RETURNING "users"."id" AS "id"
      `;
      return rows.length > 0;
    },
    async recalibrate() {
      await sql`
        WITH totals AS (
          SELECT "user_id", SUM("size_bytes")::bigint AS "bytes"
          FROM "blog_images"
          WHERE "status" IN ('reserved', 'ready')
          GROUP BY "user_id"
        ), recalculated AS (
          SELECT "users"."id", COALESCE(totals."bytes", 0)::bigint AS "bytes"
          FROM "users"
          LEFT JOIN totals ON totals."user_id" = "users"."id"
        )
        UPDATE "users"
        SET "blog_image_bytes" = recalculated."bytes"
        FROM recalculated
        WHERE "users"."id" = recalculated."id"
          AND "users"."blog_image_bytes" IS DISTINCT FROM recalculated."bytes"
      `;
    },
  };

  const result = await executeReconciliationPlan({ apply, plan, operations });
  console.log('\n=== 执行结果 ===');
  console.log(`ready 回填/修正: ${result.appliedUpserts}`);
  console.log(`allocating 释放: ${result.releasedAllocating}`);
  console.log(`reserved HEAD 存在: ${result.reservedReady.length}`);
  console.log(`reserved HEAD 不存在: ${result.reservedMissing.length}`);
  console.log(`reserved 大小异常（保持原状态）: ${result.reservedSizeMismatches.length}`);
  console.log(`reserved -> ready: ${result.markedReady}`);
  console.log(`reserved 释放: ${result.releasedReserved}`);
  if (result.failures.length > 0) {
    console.error(`失败: ${result.failures.length}`);
    for (const failure of result.failures) {
      console.error(`  - ${failure.phase} ${failure.id ?? ''}: ${sanitizeMessage(failure.error, config)}`);
    }
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    const config = {
      databaseUrl: process.env.DATABASE_URL,
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    };
    console.error('博客图片对账失败:', sanitizeMessage(error, config));
    process.exitCode = 1;
  });
}

#!/usr/bin/env node
/**
 * 一次性迁移：把 users.avatar_url 中的 data URL 批量上传到 Cloudflare R2，
 * 把字段改写成 R2 公开 URL。
 *
 * 背景：在头像走对象存储之前，avatar_url 存的是 base64 data URL。
 * data URL 入库膨胀 users 表、每次请求都要原样回传，迁移到 R2 后只存 URL。
 *
 * 使用：
 *   set -a && . ./.env.local && set +a && node scripts/migrate-avatars-to-r2.mjs
 *   node scripts/migrate-avatars-to-r2.mjs --dry-run   # 只打印不写库不上传
 *   node scripts/migrate-avatars-to-r2.mjs --limit 10  # 只处理前 10 条
 *
 * 幂等：
 *   - avatar_url 已经是 https:// 开头（R2 URL 或外链）的会跳过
 *   - 重复跑只处理仍残留 data URL 的行
 *   - 上传失败的不写库，下次重跑会再试一次
 *
 * 安全：
 *   - 只识别 R2_PUBLIC_BASE 对应的 bucket 内 key，不会误删其他对象
 *   - 不删旧 data URL（数据库字段直接覆盖，没有对象要清理）
 */

import { createSql } from './lib/pg-sql.mjs';
import {
  S3Client,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { createHash } from 'node:crypto';

// ---------- 配置读取 ----------

function readR2Config() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  const publicBase = process.env.R2_PUBLIC_BASE;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBase) {
    throw new Error(
      'R2 配置不完整：需要 R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET / R2_PUBLIC_BASE',
    );
  }
  return { accountId, accessKeyId, secretAccessKey, bucket, publicBase };
}

function readDbUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL 未配置');
  return url;
}

// ---------- 解析参数 ----------

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const limitArg = process.argv.find((a) => a.startsWith('--limit='));
const LIMIT = limitArg ? Number.parseInt(limitArg.slice(8), 10) : null;

// ---------- R2 上传（与 src/lib/avatar-storage.ts 等价） ----------

let cachedClient = null;
function getClient(cfg) {
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: 'auto',
      endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: cfg.accessKeyId,
        secretAccessKey: cfg.secretAccessKey,
      },
    });
  }
  return cachedClient;
}

const MIME_EXT = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

async function uploadAvatar(cfg, userId, bytes, mime) {
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
  const ext = MIME_EXT[mime];
  if (!ext) throw new Error(`不支持的 MIME: ${mime}`);
  const key = `avatars/${encodeURIComponent(userId)}/${hash}.${ext}`;

  const client = getClient(cfg);
  await client.send(
    new PutObjectCommand({
      Bucket: cfg.bucket,
      Key: key,
      Body: bytes,
      ContentType: mime,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );

  const base = cfg.publicBase.endsWith('/') ? cfg.publicBase.slice(0, -1) : cfg.publicBase;
  return { url: `${base}/${key}`, key };
}

// ---------- data URL 解析 ----------

const DATA_URL_RE = /^data:(image\/(webp|jpeg|png));base64,([A-Za-z0-9+/=]+)$/;

function parseDataUrl(raw) {
  const m = DATA_URL_RE.exec(raw);
  if (!m) return null;
  return { mime: m[1], base64: m[3] };
}

// ---------- 主流程 ----------

async function main() {
  if (DRY_RUN) console.log('[dry-run] 仅打印，不写库不上传\n');

  const r2 = readR2Config();
  const sql = createSql(readDbUrl());

  // 拉所有 data URL 头像。Neon serverless 的 sqlTag 是参数化的
  const rows = await sql`
    SELECT id, email, avatar_url
    FROM users
    WHERE avatar_url LIKE 'data:image/%'
    ORDER BY created_at ASC
  `;

  console.log(`找到 ${rows.length} 条 data URL 头像`);

  const target = LIMIT ? rows.slice(0, LIMIT) : rows;
  if (LIMIT) console.log(`按 --limit=${LIMIT} 仅处理前 ${target.length} 条\n`);

  let ok = 0;
  let skipped = 0;
  let failed = 0;
  const failures = [];

  for (const row of target) {
    const parsed = parseDataUrl(row.avatar_url);
    if (!parsed) {
      console.log(`[skip] ${row.email} (${row.id}): data URL 格式不匹配`);
      skipped += 1;
      continue;
    }

    if (DRY_RUN) {
      console.log(
        `[dry-run]会上传: ${row.email} (${row.id}) mime=${parsed.mime} base64长度=${parsed.base64.length}`,
      );
      ok += 1;
      continue;
    }

    try {
      const bytes = Buffer.from(parsed.base64, 'base64');
      const { url } = await uploadAvatar(r2, row.id, bytes, parsed.mime);

      // 条件更新：仅当 avatar_url 仍是原始 data URL 时才覆盖，
      // 避免并发跑两次时把用户中途换成的新 URL 覆盖掉
      const result = await sql`
        UPDATE users
        SET avatar_url = ${url}
        WHERE id = ${row.id} AND avatar_url = ${row.avatar_url}
        RETURNING id
      `;

      if (result.length === 0) {
        console.log(`[race] ${row.email} (${row.id}): 头像已被其他进程改动，跳过`);
        skipped += 1;
      } else {
        console.log(`[ok]   ${row.email} (${row.id}) -> ${url}`);
        ok += 1;
      }
    } catch (err) {
      console.error(`[fail] ${row.email} (${row.id}):`, err.message);
      failed += 1;
      failures.push({ id: row.id, email: row.email, error: err.message });
    }
  }

  console.log('\n=== 汇总 ===');
  console.log(`成功: ${ok}`);
  console.log(`跳过: ${skipped}`);
  console.log(`失败: ${failed}`);
  if (failures.length > 0) {
    console.log('\n失败明细：');
    for (const f of failures) {
      console.log(`  - ${f.email} (${f.id}): ${f.error}`);
    }
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('迁移脚本异常退出:', err);
  process.exitCode = 1;
});

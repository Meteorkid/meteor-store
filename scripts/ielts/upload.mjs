#!/usr/bin/env node
/**
 * 把合成好的整篇听力录音上传到公开 R2 bucket。
 *
 * 用法：
 *   # 先预览（不发请求、不写 bucket）
 *   node scripts/ielts/upload.mjs --only test-01-part-1 --dry-run
 *   # 实际上传（读仓库根 .env.local 的 R2_* 凭证）
 *   node scripts/ielts/upload.mjs --only test-01-part-1
 *
 * 口径：
 *   - 只上传整篇 mp3；逐句分片留在工作目录做审计证据，不上传。
 *   - ContentType: audio/mpeg；CacheControl: public, max-age=31536000, immutable。
 *   - key 由 meta.json 决定：ielts-listening/{slug}/{transcriptHash}-{audioHash8}.mp3。
 *   - 清单合并是另一步（merge-manifest.mjs），本脚本不改 audio-manifest.json。
 */
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { AUDIO_KEY_RE, defaultWorkdir, loadEnvFile, parseOnly, repoRoot } from './common.mjs';

const { values } = parseArgs({
  options: {
    only: { type: 'string' },
    workdir: { type: 'string', default: defaultWorkdir },
    'dry-run': { type: 'boolean', default: false },
  },
});

const only = parseOnly(values.only);
if (!only) throw new Error('必须用 --only 指定要上传的 slug（逗号分隔）');

loadEnvFile(repoRoot);

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_BASE } = process.env;
const missing = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET', 'R2_PUBLIC_BASE']
  .filter(name => !process.env[name]);
if (missing.length && !values['dry-run']) throw new Error(`.env.local 缺少 R2 配置：${missing.join(', ')}`);
if (missing.length) console.warn(`[dry-run] 提示：缺少 R2 配置 ${missing.join(', ')}，仅打印计划，不构造客户端。`);

const publicBase = (R2_PUBLIC_BASE ?? '').replace(/\/+$/, '');
const client = missing.length ? null : new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  // 这台机器的 getaddrinfo 解析不了 `<bucket>.<account>.r2.cloudflarestorage.com`
  // 这类通配子域（c-ares 与 dig 可以，系统解析器不行），但账号主域可解析。
  // 走 path-style 后请求只落在 `<account>.r2.cloudflarestorage.com/<bucket>/<key>`，
  // 避免上传时 ENOTFOUND。R2 支持 path-style。
  forcePathStyle: true,
});

let failures = 0;
for (const slug of only) {
  const articleDir = path.resolve(values.workdir, slug);
  const metaPath = path.join(articleDir, 'meta.json');
  if (!existsSync(metaPath)) {
    console.error(`[skip] ${slug}: 缺少 meta.json（先跑 synthesize.py）`);
    failures += 1;
    continue;
  }

  const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
  if (!AUDIO_KEY_RE.test(meta.key)) {
    console.error(`[skip] ${slug}: meta.key 格式非法：${meta.key}`);
    failures += 1;
    continue;
  }
  const mp3Path = path.join(articleDir, path.basename(meta.key));
  if (!existsSync(mp3Path)) {
    console.error(`[skip] ${slug}: 整篇 mp3 不存在：${path.basename(meta.key)}`);
    failures += 1;
    continue;
  }

  const url = publicBase ? `${publicBase}/${meta.key}` : '(需配置 R2_PUBLIC_BASE 后拼接)';
  if (values['dry-run']) {
    console.log(`[dry-run] PUT s3://${R2_BUCKET}/${meta.key}`);
    console.log(`[dry-run] ${url}`);
    continue;
  }

  const body = readFileSync(mp3Path);
  await client.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: meta.key,
    Body: body,
    ContentType: 'audio/mpeg',
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  console.log(`[uploaded] ${meta.key}`);
  console.log(`[url] ${url}`);
}

if (failures) {
  console.error(`\n${failures} 篇未上传成功`);
  process.exit(1);
}
console.log(`\n完成：${only.length} 篇${values['dry-run'] ? '（dry-run，未实际上传）' : ''}`);

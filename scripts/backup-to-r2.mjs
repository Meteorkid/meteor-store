#!/usr/bin/env node
/**
 * 把数据库备份传一份到 Cloudflare R2，并清理 R2 上的过期备份。
 *
 * 用法：node --env-file=.env.production scripts/backup-to-r2.mjs <dump 文件> [保留天数]
 * 由 scripts/backup-db.sh 在本地备份**校验通过之后**调用。
 *
 * 为什么要有异地副本：备份和数据库在同一台机器上，防得了「删错了 / 数据写坏了」，
 * 防不了「这台机器整体没了」。R2 的出网流量免费，存储 10 GB 免费额度——
 * 一份 276KB，存十年也用不到 11%。
 *
 * **备份绝不能进 R2_BUCKET**：那个桶绑了公开自定义域名（R2_PUBLIC_BASE），
 * 用于头像和博客图片，对象本身是公开可读的。而数据库备份里有全部用户邮箱、
 * 密码哈希、订单与授权码。这里只认私有桶：优先 R2_BACKUP_BUCKET，
 * 否则回落到 R2_RELEASE_BUCKET（安装包用的私有桶，不绑公开域名）。
 * 想要独立的备份桶时加一个 R2_BACKUP_BUCKET 环境变量即可，代码不用动。
 */
import { readFileSync, statSync } from 'node:fs';
import { basename } from 'node:path';
import {
  S3Client, PutObjectCommand, HeadObjectCommand,
  ListObjectsV2Command, DeleteObjectsCommand,
} from '@aws-sdk/client-s3';

const PREFIX = 'db-backups/';

const [, , filePath, keepDaysArg] = process.argv;
const keepDays = Number(keepDaysArg ?? 14);

function fail(msg) {
  console.error(`❌ R2 上传：${msg}`);
  process.exit(1);
}

if (!filePath) fail('缺少参数：备份文件路径');

const bucket = process.env.R2_BACKUP_BUCKET || process.env.R2_RELEASE_BUCKET;
if (!bucket) fail('缺少 R2_BACKUP_BUCKET / R2_RELEASE_BUCKET（不接受公开桶 R2_BUCKET）');
if (bucket === process.env.R2_BUCKET) {
  fail(`拒绝上传到公开桶 ${bucket}：备份含用户邮箱、密码哈希与订单，必须放私有桶`);
}

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) fail('R2 凭据不完整');

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

const key = PREFIX + basename(filePath);
const localSize = statSync(filePath).size;

await client.send(new PutObjectCommand({
  Bucket: bucket,
  Key: key,
  Body: readFileSync(filePath),
  ContentType: 'application/octet-stream',
}));

// 传完立刻回读大小核对：PUT 返回 200 不代表对象落盘时是完整的
const head = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
if (head.ContentLength !== localSize) {
  fail(`大小不符：本地 ${localSize}，R2 ${head.ContentLength}`);
}
console.log(`   ↑ 已上传 R2 ${bucket}/${key}（${(localSize / 1024).toFixed(0)} KB，已回读校验）`);

// ---- 清理 R2 上的过期备份 ----
// 与本地同一套保留天数。放在上传成功之后：顺序反了会在一次上传失败时
// 把远端旧备份也清掉，两头同时变空
const cutoff = Date.now() - keepDays * 86_400_000;
const stale = [];
let token;
do {
  const page = await client.send(new ListObjectsV2Command({
    Bucket: bucket, Prefix: PREFIX, ContinuationToken: token, MaxKeys: 1000,
  }));
  for (const obj of page.Contents ?? []) {
    if (obj.Key !== key && obj.LastModified && obj.LastModified.getTime() < cutoff) {
      stale.push({ Key: obj.Key });
    }
  }
  token = page.IsTruncated ? page.NextContinuationToken : undefined;
} while (token);

if (stale.length > 0) {
  await client.send(new DeleteObjectsCommand({
    Bucket: bucket, Delete: { Objects: stale, Quiet: true },
  }));
}
console.log(`   R2 保留 ${keepDays} 天，本次删除 ${stale.length} 份过期备份`);

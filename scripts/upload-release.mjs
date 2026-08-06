#!/usr/bin/env node
/**
 * 把安装包（dmg / pkg / zip / tar.gz）上传到 Cloudflare R2，
 * 并打印可以直接粘进 src/data/products.ts 的 downloads 条目。
 *
 * 为什么是脚本而不是网页上传：安装包动辄几十 MB，走 API 要分片、要断点续传，
 * 而发版是站主本地的低频动作，一条命令就够了。
 *
 * 使用：
 *   set -a && . ./.env.local && set +a && \
 *   node scripts/upload-release.mjs --product xnook --version 1.2.0 --file ~/build/XNook.dmg
 *
 *   --gated        标记为需要授权才能下载（付费产品用，默认公开）
 *   --label-zh     下载卡片上的中文名，默认「下载 DMG」之类按扩展名推断
 *   --label-en     英文名
 *   --dry-run      只算校验和、打印计划，不上传
 *
 * 幂等：key 带版本号，重复上传同一版本会覆盖同一个对象；
 * 换版本号则是新对象，已发布的旧版本不会被悄悄替换。
 *
 * 注意（macOS）：上传前请确认 dmg 已经过 Developer ID 签名 + 公证 + 装订，
 * 否则用户下载后会被 Gatekeeper 拦下，比没有下载更糟。校验命令：
 *   spctl -a -t open --context context:primary-signature -v YourApp.dmg
 *   xcrun stapler validate YourApp.dmg
 */

import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { createHash } from 'node:crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// ---------- 参数 ----------

function parseArgs(argv) {
  const args = { gated: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (key === '--gated') args.gated = true;
    else if (key === '--dry-run') args.dryRun = true;
    else if (key === '--product') args.product = argv[++i];
    else if (key === '--version') args.version = argv[++i];
    else if (key === '--file') args.file = argv[++i];
    else if (key === '--label-zh') args.labelZh = argv[++i];
    else if (key === '--label-en') args.labelEn = argv[++i];
    else {
      throw new Error(`无法识别的参数：${key}`);
    }
  }
  for (const required of ['product', 'version', 'file']) {
    if (!args[required]) throw new Error(`缺少必填参数 --${required}`);
  }
  return args;
}

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

// 与 src/lib/release-storage.ts 保持一致
function contentTypeFor(fileName) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.dmg')) return 'application/x-apple-diskimage';
  if (lower.endsWith('.pkg')) return 'application/octet-stream';
  if (lower.endsWith('.zip')) return 'application/zip';
  if (lower.endsWith('.tar.gz') || lower.endsWith('.tgz')) return 'application/gzip';
  return 'application/octet-stream';
}

function defaultLabels(fileName) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.dmg')) return { zh: '下载 DMG', en: 'Download DMG' };
  if (lower.endsWith('.pkg')) return { zh: '下载安装包', en: 'Download installer' };
  if (lower.endsWith('.zip')) return { zh: '下载压缩包', en: 'Download ZIP' };
  return { zh: '下载', en: 'Download' };
}

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cfg = readR2Config();

  const fileName = basename(args.file);
  const body = await readFile(args.file);
  const sha256 = createHash('sha256').update(body).digest('hex');
  const key = `releases/${args.product}/${args.version}/${fileName}`;
  const contentType = contentTypeFor(fileName);
  const labels = defaultLabels(fileName);
  const labelZh = args.labelZh ?? labels.zh;
  const labelEn = args.labelEn ?? labels.en;
  // 同一产品可能有多个包（arm64 / Intel / zip），用文件名派生出稳定且唯一的 id
  const fileId = fileName.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/g, '-');

  console.log(`文件：${args.file}`);
  console.log(`大小：${formatSize(body.byteLength)}`);
  console.log(`类型：${contentType}`);
  console.log(`SHA-256：${sha256}`);
  console.log(`对象 key：${key}`);
  console.log(`门控：${args.gated ? '是（需要授权）' : '否（公开下载）'}`);

  if (args.dryRun) {
    console.log('\n--dry-run，未上传。');
  } else {
    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey },
    });
    await client.send(
      new PutObjectCommand({ Bucket: cfg.bucket, Key: key, Body: body, ContentType: contentType }),
    );
    console.log('\n上传完成。');
  }

  const entry = args.gated
    ? `      {
        id: '${fileId}',
        label: { zh: '${labelZh}', en: '${labelEn}' },
        icon: '${fileName.toLowerCase().endsWith('.dmg') ? 'dmg' : 'zip'}',
        r2Key: '${key}',
        gated: true,
        version: '${args.version}',
        sha256: '${sha256}',
      },`
    : `      {
        id: '${fileId}',
        label: { zh: '${labelZh}', en: '${labelEn}' },
        icon: '${fileName.toLowerCase().endsWith('.dmg') ? 'dmg' : 'zip'}',
        r2Key: '${key}',
        version: '${args.version}',
        sha256: '${sha256}',
      },`;

  console.log(`\n把下面这段加进 src/data/products.ts 里 ${args.product} 的 downloads：\n`);
  console.log(entry);
  if (!args.gated) {
    console.log(`\n公开下载地址：${cfg.publicBase}/${key}`);
  }
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});

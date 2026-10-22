import { createHash } from 'node:crypto';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { approvedAssetUrl } from './discovery.ts';
import type { ReleaseAsset } from './types';

const MAX_BYTES = 128 * 1024 * 1024;

export function assertArtifact(body: Uint8Array, asset: ReleaseAsset): void {
  if (body.byteLength !== asset.bytes || body.byteLength > MAX_BYTES) throw new Error('安装包大小不匹配');
  if (createHash('sha256').update(body).digest('hex') !== asset.sha256) throw new Error('安装包 SHA-256 校验失败');
  const buffer = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
  if (asset.name.endsWith('.dmg')) {
    // DMG 的 UDIF 尾部签名；真正内容身份由官方资产 SHA 固定，不执行安装包。
    if (buffer.length < 512 || buffer.toString('ascii', buffer.length - 512, buffer.length - 508) !== 'koly') {
      throw new Error('文件不是预期的 DMG 安装包');
    }
  } else {
    const cpu = asset.architecture === 'macos-arm64' ? 0x0100000c : 0x01000007;
    if (buffer.length < 8 || buffer.readUInt32LE(0) !== 0xfeedfacf || buffer.readUInt32LE(4) !== cpu) {
      throw new Error('独立程序的格式或处理器架构不匹配');
    }
  }
}

export async function downloadArtifact(asset: ReleaseAsset, signal?: AbortSignal): Promise<Buffer> {
  if (!Number.isSafeInteger(asset.bytes) || asset.bytes < 1 || asset.bytes > MAX_BYTES) throw new Error('安装包超出大小限制');
  const timeout = AbortSignal.timeout(300_000);
  const abortSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;
  let url = asset.url;
  for (let redirect = 0; redirect < 5; redirect++) {
    if (!approvedAssetUrl(url)) throw new Error('下载地址不在官方来源范围');
    const response = await fetch(url, { redirect: 'manual', signal: abortSignal, headers: { 'User-Agent': 'Meteor-Store-Release-Check' } });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      await response.body?.cancel();
      if (!location) throw new Error('官方下载跳转缺少地址');
      url = new URL(location, url).href;
      continue;
    }
    if (!response.ok || !response.body) throw new Error('官方安装包下载失败');
    const declared = response.headers.get('content-length');
    if (declared && Number(declared) !== asset.bytes) { await response.body.cancel(); throw new Error('下载大小与发布记录不符'); }
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > asset.bytes || bytes > MAX_BYTES) throw new Error('下载大小超出发布记录');
        chunks.push(value);
      }
    } finally { await reader.cancel(); }
    const body = Buffer.concat(chunks);
    assertArtifact(body, asset);
    return body;
  }
  throw new Error('官方下载跳转次数过多');
}

function privateStorage() {
  const { R2_ACCOUNT_ID: accountId, R2_ACCESS_KEY_ID: accessKeyId, R2_SECRET_ACCESS_KEY: secretAccessKey,
    R2_RELEASE_BUCKET: bucket, R2_BUCKET: publicBucket } = process.env;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBucket || bucket.trim() === publicBucket.trim()) {
    throw new Error('请配置独立的私有安装包存储');
  }
  return { bucket, client: new S3Client({ region: 'auto', endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey }, maxAttempts: 2 }) };
}

export async function uploadVerifiedArtifact(key: string, body: Buffer, asset: ReleaseAsset, signal?: AbortSignal): Promise<void> {
  const { client, bucket } = privateStorage();
  try {
    await putAndVerify(client, bucket, key, body, asset, signal);
  } finally { client.destroy(); }
}

export async function putAndVerify(client: Pick<S3Client, 'send'>, bucket: string, key: string, body: Buffer, asset: ReleaseAsset, signal?: AbortSignal): Promise<void> {
  assertArtifact(body, asset);
  const timeout = AbortSignal.timeout(300_000);
  const abortSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;
  try {
    await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, IfNoneMatch: '*',
      ContentType: asset.name.endsWith('.dmg') ? 'application/x-apple-diskimage' : 'application/octet-stream',
      Metadata: { sha256: asset.sha256 }, }), { abortSignal });
  } catch (error) {
    // 已有同名对象只允许内容完全相同的幂等复用，绝不覆盖。
    if ((error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode !== 412) throw new Error('私有安装包上传失败');
  }
  const result = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }), { abortSignal });
  if (!result.Body || result.ContentLength !== asset.bytes) throw new Error('存储回读大小不匹配');
  const hash = createHash('sha256');
  let bytes = 0;
  const stream = result.Body.transformToWebStream();
  const reader = stream.getReader();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > asset.bytes) throw new Error('存储回读大小超出限制');
      hash.update(value);
    }
  } finally { await reader.cancel(); }
  if (bytes !== asset.bytes || hash.digest('hex') !== asset.sha256) throw new Error('存储回读 SHA-256 校验失败');
}

#!/usr/bin/env node
/**
 * 把本次合成的 meta.json 合并进 audio-manifest.json。
 *
 * 用法：
 *   # 预览将新增/替换哪些 slug（不改文件）
 *   node scripts/ielts/merge-manifest.mjs --only test-01-part-1 --dry-run
 *   # 写入清单（只动 --only 点名的 slug，其它条目原样保留）
 *   node scripts/ielts/merge-manifest.mjs --only test-01-part-1
 *
 * 安全口径：
 *   - 只允许改/加本次 --only 指定的 slug；绝不触碰其它条目。
 *   - 写入前自检：key 正则、durationSec>0、transcriptHash 16 位、
 *     cues 为 [非负, 正] 二元组且条数 == sentenceCount。
 *   - 原子写入：同目录临时文件 + rename。
 */
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { AUDIO_KEY_RE, defaultWorkdir, parseOnly, repoRoot, SLUG_RE } from './common.mjs';

const { values } = parseArgs({
  options: {
    only: { type: 'string' },
    workdir: { type: 'string', default: defaultWorkdir },
    manifest: { type: 'string', default: path.join(repoRoot, 'src/data/ielts-listening/audio-manifest.json') },
    'dry-run': { type: 'boolean', default: false },
  },
});

const only = parseOnly(values.only);
if (!only) throw new Error('必须用 --only 指定要合并的 slug（逗号分隔）');

const manifestPath = path.resolve(values.manifest);
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
if (manifest === null || typeof manifest !== 'object' || Array.isArray(manifest)) {
  throw new Error('audio-manifest.json 顶层必须是对象');
}

const HASH_RE = /^[a-f0-9]{16}$/;

function validateMeta(slug, meta) {
  const issues = [];
  if (!SLUG_RE.test(slug)) issues.push('slug 非法');
  if (typeof meta.key !== 'string' || !AUDIO_KEY_RE.test(meta.key)) issues.push('key 不符合 ielts-listening/{slug}/{hash}-{hash8}.mp3');
  if (typeof meta.durationSec !== 'number' || !(meta.durationSec > 0)) issues.push('durationSec 必须 > 0');
  if (typeof meta.transcriptHash !== 'string' || !HASH_RE.test(meta.transcriptHash)) issues.push('transcriptHash 必须是 16 位十六进制');
  if (typeof meta.sentenceCount !== 'number' || !(meta.sentenceCount > 0)) issues.push('sentenceCount 必须 > 0');
  if (typeof meta.generatedAt !== 'string' || meta.generatedAt.length < 10) issues.push('generatedAt 缺失');

  const keyHash = meta.key?.match(/\/([a-f0-9]{16})-[a-f0-9]{8}\.mp3$/)?.[1];
  if (keyHash && meta.transcriptHash && keyHash !== meta.transcriptHash) {
    issues.push('key 中的 transcriptHash 与 meta.transcriptHash 不一致');
  }

  if (!Array.isArray(meta.cues)) {
    issues.push('cues 必须是数组');
  } else {
    if (typeof meta.sentenceCount === 'number' && meta.cues.length !== meta.sentenceCount) {
      issues.push(`cues 条数 ${meta.cues.length} ≠ sentenceCount ${meta.sentenceCount}`);
    }
    meta.cues.forEach((cue, index) => {
      if (!Array.isArray(cue) || cue.length !== 2) {
        issues.push(`第 ${index} 条 cue 不是二元组`);
        return;
      }
      const [start, end] = cue;
      if (typeof start !== 'number' || start < 0) issues.push(`第 ${index} 条 cue 起点非负非法：${start}`);
      if (typeof end !== 'number' || end <= 0) issues.push(`第 ${index} 条 cue 终点必须为正：${end}`);
      if (typeof start === 'number' && typeof end === 'number' && end <= start) issues.push(`第 ${index} 条 cue 终点不大于起点`);
    });
  }
  return issues;
}

const plan = [];
for (const slug of only) {
  const metaPath = path.resolve(values.workdir, slug, 'meta.json');
  if (!existsSync(metaPath)) {
    throw new Error(`${slug}: 缺少 meta.json（先跑 synthesize.py）`);
  }
  const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
  const issues = validateMeta(slug, meta);
  if (issues.length) {
    throw new Error(`${slug} 自检未通过：\n  - ${issues.join('\n  - ')}`);
  }

  const entry = {
    key: meta.key,
    durationSec: meta.durationSec,
    transcriptHash: meta.transcriptHash,
    cues: meta.cues,
    generatedAt: meta.generatedAt,
  };
  const action = Object.prototype.hasOwnProperty.call(manifest, slug) ? 'REPLACE' : 'ADD';
  plan.push({ slug, action, entry, previous: manifest[slug] ?? null });
}

for (const item of plan) {
  if (item.action === 'ADD') {
    console.log(`ADD     ${item.slug}  ${item.entry.key}  ${item.entry.durationSec}s`);
  } else {
    console.log(`REPLACE ${item.slug}`);
    console.log(`        旧：${item.previous.key}  ${item.previous.durationSec}s`);
    console.log(`        新：${item.entry.key}  ${item.entry.durationSec}s`);
  }
}

if (values['dry-run']) {
  console.log(`\n[dry-run] 未写入清单。计划：${plan.filter(p => p.action === 'ADD').length} 新增，${plan.filter(p => p.action === 'REPLACE').length} 替换。`);
  process.exit(0);
}

// 只覆盖 plan 里的 slug；其它条目原样保留。
const next = { ...manifest };
for (const item of plan) next[item.slug] = item.entry;

const tempPath = `${manifestPath}.tmp-${process.pid}`;
writeFileSync(tempPath, JSON.stringify(next, null, 2) + '\n');
renameSync(tempPath, manifestPath);
console.log(`\n已写入 ${path.relative(repoRoot, manifestPath)}：${plan.length} 篇（新增 ${plan.filter(p => p.action === 'ADD').length}，替换 ${plan.filter(p => p.action === 'REPLACE').length}）。`);

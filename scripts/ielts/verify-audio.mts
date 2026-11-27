#!/usr/bin/env node
/**
 * 校验某一批课时的录音是否真的可用：清单有条目、指纹与当前原文一致、
 * cues 与句子等长、末条 cue 不越界，并实测对象 URL 返回 200。
 *
 * 用法：node --experimental-strip-types --no-warnings scripts/ielts/verify-audio.mts --only test-07-part-1,test-07-part-2
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import { parseOnly, repoRoot } from './common.mjs';
import type { ListeningLesson } from '../../src/lib/ielts-listening/types.ts';

const { values } = parseArgs({ options: { only: { type: 'string' } } });
const only = new Set<string>(parseOnly(values.only) as string[]);

const { listeningTranscriptHash } = await import(
  pathToFileURL(path.join(repoRoot, 'src/lib/ielts-listening/transcript-hash.ts')).href
);

const manifest: Record<string, {
  key: string; durationSec: number; transcriptHash: string; cues: [number, number][];
}> = JSON.parse(readFileSync(path.join(repoRoot, 'src/data/ielts-listening/audio-manifest.json'), 'utf8'));

const publicBase = (process.env.R2_PUBLIC_BASE ?? '').replace(/\/$/, '');

async function loadLesson(slug: string): Promise<ListeningLesson> {
  const matched = /^test-(\d{2})-part-(\d)$/.exec(slug);
  if (!matched) throw new Error(`slug 不合法：${slug}`);
  const [, test, part] = matched;
  const file = path.join(repoRoot, `src/data/ielts-listening/test-${test}/part-${part}.ts`);
  const loaded = await import(pathToFileURL(file).href);
  const lesson = Object.values(loaded).find(
    (value) => (value as ListeningLesson)?.slug === slug,
  ) as ListeningLesson | undefined;
  if (!lesson) throw new Error(`找不到 ${slug}`);
  return lesson;
}

const problems: string[] = [];
const checked: string[] = [];

for (const slug of only) {
  const lesson = await loadLesson(slug);
  const entry = manifest[slug];
  if (!entry) { problems.push(`${slug}: 清单里没有条目`); continue; }

  const hash = listeningTranscriptHash(lesson.transcript.map((line) => line.text));
  if (hash !== entry.transcriptHash) {
    problems.push(`${slug}: 指纹不匹配（清单 ${entry.transcriptHash} / 当前 ${hash}），录音已过期`);
    continue;
  }
  if (entry.cues.length !== lesson.transcript.length) {
    problems.push(`${slug}: cues ${entry.cues.length} 条，句子 ${lesson.transcript.length} 句`);
    continue;
  }
  if (entry.cues.at(-1)![1] > entry.durationSec + 0.5) {
    problems.push(`${slug}: 末条 cue 越界`);
    continue;
  }

  if (publicBase) {
    const url = `${publicBase}/${entry.key}`;
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) { problems.push(`${slug}: 对象不可访问 ${response.status} ${url}`); continue; }
    const length = Number(response.headers.get('content-length') ?? 0);
    if (!length) { problems.push(`${slug}: 对象长度为空 ${url}`); continue; }
    checked.push(`${slug}: ok ${entry.durationSec}s ${entry.cues.length} 句 ${(length / 1e6).toFixed(1)}MB`);
  } else {
    checked.push(`${slug}: ok ${entry.durationSec}s ${entry.cues.length} 句（未设 R2_PUBLIC_BASE，跳过 URL 实测）`);
  }
}

for (const line of checked) console.log(line);
if (problems.length) {
  for (const line of problems) console.error(`FAIL ${line}`);
  process.exit(1);
}
console.log(`通过：${checked.length} 篇录音可用。`);

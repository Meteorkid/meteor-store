#!/usr/bin/env node
/**
 * 把指定 slug 的听力课时导出成合成用 JSON（供 synthesize.py 消费）。
 *
 * 用法：
 *   node --experimental-strip-types --no-warnings scripts/ielts/export-lessons.mts
 *   node --experimental-strip-types --no-warnings scripts/ielts/export-lessons.mts \
 *     --only test-01-part-1,test-01-part-2
 *
 * 产物：{workdir}/exports/{slug}.json
 *   slug, part, speechRate, cast(voice), 逐句 text/speaker/voice, transcriptHash。
 *
 * transcriptHash 直接复用 src/lib/ielts-listening/transcript-hash.ts 里的
 * listeningTranscriptHash（sha256(句子文本 join('\n')).hex 前 16 位），
 * 不另发明一套算法。displayText 只影响页面展示，不参与朗读、不进 hash。
 */
import { mkdirSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import { defaultWorkdir, parseOnly, repoRoot } from './common.mjs';
import type { ListeningLesson } from '../../src/lib/ielts-listening/types.ts';

const { values } = parseArgs({
  options: {
    only: { type: 'string' },
    workdir: { type: 'string', default: defaultWorkdir },
  },
});

const only = parseOnly(values.only);
const workdir = path.resolve(values.workdir);

const { listeningTranscriptHash } = await import(
  pathToFileURL(path.join(repoRoot, 'src/lib/ielts-listening/transcript-hash.ts')).href
);

/** 扫描 src/data/ielts-listening 下 test-NN 目录里的 part-N.ts，动态导入拿到课时对象。 */
async function loadLessons() {
  const dataDir = path.join(repoRoot, 'src/data/ielts-listening');
  const lessons = new Map<string, ListeningLesson>();
  // 只要指定的若干套题时，不去 import 其它 test-NN 目录：内容代理正在写的那几篇
  // 可能处于半成品状态，import 进来会让 --only 之外的语法错误把本批也带崩。
  const wantedTests = only ? new Set(only.map((slug: string) => slug.split('-')[1])) : null;
  for (const testDir of readdirSync(dataDir, { withFileTypes: true })) {
    if (!testDir.isDirectory() || !/^test-\d{2}$/.test(testDir.name)) continue;
    if (wantedTests && !wantedTests.has(testDir.name.slice('test-'.length))) continue;
    const testPath = path.join(dataDir, testDir.name);
    for (const partFile of readdirSync(testPath, { withFileTypes: true })) {
      if (!partFile.isFile() || !/^part-[1-4]\.ts$/.test(partFile.name)) continue;
      const absolute = path.join(testPath, partFile.name);
      const loaded = await import(pathToFileURL(absolute).href);
      const lesson = Object.values(loaded).find(
        value => value && typeof value === 'object' && 'slug' in value && 'transcript' in value,
      ) as ListeningLesson | undefined;
      if (!lesson) throw new Error(`${absolute}: 没有导出 ListeningLesson 对象`);
      lessons.set(lesson.slug, lesson);
    }
  }
  return lessons;
}

const lessons = await loadLessons();
const slugs = only ?? [...lessons.keys()].sort();

const missing = slugs.filter((slug: string) => !lessons.has(slug));
if (missing.length) throw new Error(`题库里找不到：${missing.join(', ')}`);

const exportsDir = path.join(workdir, 'exports');
mkdirSync(exportsDir, { recursive: true });

for (const slug of slugs) {
  const lesson = lessons.get(slug)!;
  const voiceById = new Map(lesson.cast.map(member => [member.id, member.voice]));

  const sentences = lesson.transcript.map((utterance, index) => {
    const voice = voiceById.get(utterance.speaker);
    if (!voice) throw new Error(`${slug}: 第 ${index} 句的说话人 ${utterance.speaker} 不在 cast 中`);
    return {
      index,
      speaker: utterance.speaker,
      voice,
      text: utterance.text, // 朗读脚本；displayText 不参与朗读
    };
  });

  const transcriptHash = listeningTranscriptHash(lesson.transcript.map(u => u.text));

  const payload = {
    slug: lesson.slug,
    part: lesson.part,
    speechRate: lesson.speechRate ?? null,
    cast: lesson.cast.map(member => ({ id: member.id, voice: member.voice })),
    sentences,
    transcriptHash,
    sentenceCount: sentences.length,
  };

  const outFile = path.join(exportsDir, `${slug}.json`);
  const tempFile = `${outFile}.tmp`;
  writeFileSync(tempFile, JSON.stringify(payload, null, 2) + '\n');
  renameSync(tempFile, outFile);
  console.log(`导出 ${slug}: ${sentences.length} 句, transcriptHash=${transcriptHash} -> ${path.relative(repoRoot, outFile)}`);
}

console.log(`完成：${slugs.length} 篇，导出目录 ${exportsDir}`);

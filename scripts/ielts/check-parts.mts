#!/usr/bin/env node
/**
 * 单篇听力题目自检（内容代理内部使用）。
 *
 * 用法：
 *   node --experimental-strip-types --no-warnings scripts/ielts/check-parts.mts \
 *     src/data/ielts-listening/test-03/part-1.ts src/data/ielts-listening/test-03/part-2.ts
 *
 * 直接调用 `auditListeningLesson()`——也就是 `src/data/__tests__/ielts-listening.test.ts`
 * 用的同一套质检，所以这里通过就等于 CI 那一关通过。之前在这里另写一套规则，
 * 结果是内容代理自检“通过”而仓库测试红，白跑一轮。
 */
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import type { ListeningLesson } from '../../src/lib/ielts-listening/types.ts';

const { auditListeningLesson } = await import('../../src/lib/ielts-listening/quality.ts');

const files = process.argv.slice(2);
if (!files.length) {
  console.error('用法：node --experimental-strip-types --no-warnings scripts/ielts/check-parts.mts <part.ts ...>');
  process.exit(2);
}

const issues: string[] = [];

for (const file of files) {
  const absolute = path.resolve(file);
  const loaded = await import(pathToFileURL(absolute).href);
  const lesson = Object.values(loaded).find(
    value => value && typeof value === 'object' && 'slug' in value && 'transcript' in value,
  ) as ListeningLesson | undefined;
  if (!lesson) {
    issues.push(`${file}: 没有导出 ListeningLesson 对象`);
    continue;
  }
  for (const violation of auditListeningLesson(lesson)) {
    issues.push(`${lesson.slug ?? file}: ${violation}`);
  }
}

if (issues.length) {
  console.error(`共 ${issues.length} 条问题：`);
  for (const issue of issues) console.error(' - ' + issue);
  process.exit(1);
}
console.log(`通过：${files.length} 篇。`);

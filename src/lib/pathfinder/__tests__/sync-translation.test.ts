import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * 翻译的接入位置有两条硬约束，写错任何一条的后果都不会立刻暴露，
 * 所以对着源码本身钉住。
 */
const syncSource = readFileSync(
  path.join(__dirname, '..', 'ingestion', 'sync.ts'),
  'utf-8',
);

describe('翻译的接入位置', () => {
  it('只翻新增与英文变更的条目，不在解析后立刻整批翻', () => {
    /*
     * 解析阶段永远把 titleZh 置为 null（来源不给中文）。若在 parse 之后直接翻，
     * 每轮同步都会把全部抓到的条目重译一遍——每小时上百次调用，结果与上一轮
     * 完全相同。必须等分类出 inserts / updates 之后再翻。
     */
    // 接入点现在多了一步「补正文首段」，两者共用同一批条目
    expect(syncSource).toContain('const needsEnrichment = [...pendingInserts');
    expect(syncSource).toContain('applyChineseText(needsEnrichment)');
    expect(syncSource).not.toMatch(/withChineseText\(parsePathfinderSource/);
  });

  it('翻译不参与 contentHash', () => {
    /*
     * contentHash 是「英文原文变没变」的判据。把译文掺进去，每次翻译结果的
     * 细微差异都会让条目被判为 changed，于是每轮都写一次库；反过来若沿用
     * 翻译前的哈希去比对，已存在的条目会被判为未变而永远补不上中文。
     */
    const helper = syncSource.slice(
      syncSource.indexOf('async function applyChineseText'),
      syncSource.indexOf('async function persistItems'),
    );
    expect(helper).not.toContain('contentHash');
  });
});

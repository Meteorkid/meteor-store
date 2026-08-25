import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildEditorialPrompt,
  EDITORIAL_MODEL,
  editorialNoteSchema,
  generateEditorialNote,
  isEditorialEnabled,
  normalizeEditorialNote,
} from '../editorial';
import { catalogItemFixture } from './fixtures';

const aiUpdate = (overrides = {}) => catalogItemFixture({
  itemType: 'ai-update',
  title: { zh: 'Gemini 3.7 Flash 发布', en: 'Introducing Gemini 3.7 Flash' },
  summary: { zh: '', en: 'A faster model for latency-sensitive apps.' },
  organization: { zh: 'Google DeepMind', en: 'Google DeepMind' },
  canonicalUrl: 'https://deepmind.google/blog/gemini-3-7-flash',
  publishedAt: '2026-08-13T00:00:00.000Z',
  ...overrides,
});

describe('解读只能由人工确认后公开', () => {
  const storeSource = readFileSync(
    path.join(__dirname, '..', 'editorial-store.ts'),
    'utf-8',
  );
  const pageSource = readFileSync(
    path.join(__dirname, '..', '..', '..', 'app', '[locale]', 'pathfinder', 'items', '[id]', 'page.tsx'),
    'utf-8',
  );

  it('写入的初稿一律是 draft', () => {
    // 生成路径上任何一处写 approved，都等于让模型产出直接上线
    expect(storeSource).toMatch(/status: 'draft' as const/);
    expect(storeSource).not.toMatch(/saveEditorialDraft[\s\S]{0,600}status: 'approved'/);
  });

  it('详情页只读已确认的解读', () => {
    expect(pageSource).toContain('getApprovedEditorialNote');
    // 列出草稿的函数不应出现在渲染路径里
    expect(pageSource).not.toContain('listEditorialNotes');
  });

  it('读取函数在 SQL 层就过滤 approved，不依赖调用方记得加条件', () => {
    const fn = storeSource.slice(storeSource.indexOf('export async function getApprovedEditorialNote'));
    expect(fn.slice(0, 500)).toMatch(/eq\(pathfinderItemNotes\.status, 'approved'\)/);
  });

  it('确认动作是条件更新，避免并发时署名落到后点的人身上', () => {
    const fn = storeSource.slice(storeSource.indexOf('export async function approveEditorialNote'));
    expect(fn.slice(0, 500)).toMatch(/eq\(pathfinderItemNotes\.status, 'draft'\)/);
  });

  it('重新生成不会覆盖已确认的解读', () => {
    const fn = storeSource.slice(storeSource.indexOf('export async function saveEditorialDraft'));
    expect(fn.slice(0, 900)).toMatch(/where: eq\(pathfinderItemNotes\.status, 'draft'\)/);
  });
});

describe('提示词', () => {
  it('把可核对的来源信息带进材料', () => {
    const prompt = buildEditorialPrompt(aiUpdate());
    // 标题同样中文优先，与摘要一致
    expect(prompt).toContain('Gemini 3.7 Flash 发布');
    expect(prompt).toContain('Google DeepMind');
    // 原文地址必须在，人工复核时要能一键回到来源
    expect(prompt).toContain('https://deepmind.google/blog/gemini-3-7-flash');
    expect(prompt).toContain('2026-08-13');
  });

  it('来源没有摘要时明确要求保守，而不是留空让模型自由发挥', () => {
    const prompt = buildEditorialPrompt(aiUpdate({ summary: { zh: '', en: '' } }));
    expect(prompt).toContain('来源未提供摘要');
    expect(prompt).toContain('保守');
  });

  it('中文摘要优先于英文', () => {
    const prompt = buildEditorialPrompt(aiUpdate({
      summary: { zh: '一个更快的模型', en: 'A faster model' },
    }));
    expect(prompt).toContain('一个更快的模型');
    expect(prompt).not.toContain('A faster model');
  });
});

describe('只为 AI 动态生成', () => {
  it.each(['competition', 'internship', 'open-source'] as const)('拒绝 %s', async (itemType) => {
    // 竞赛、实习、开源任务的卡片已有资格、费用、截止时间这些结构化事实，
    // 学生看得懂该做什么；需要解读的是「某公司发布了某模型」这类内容
    await expect(generateEditorialNote(catalogItemFixture({ itemType })))
      .rejects.toThrow(/只为 AI 动态/);
  });
});

describe('输出收紧', () => {
  it('过长段落被截断，技能标签去重并限制在 5 个内', () => {
    const note = normalizeEditorialNote({
      whatHappened: 'a'.repeat(400),
      whyItMatters: '  多余   空白   会被压缩  ',
      skills: ['PyTorch', 'pytorch ', 'PyTorch', 'A', 'B', 'C', 'D', 'E', 'F'],
      suggestedAction: 'b'.repeat(300),
    });

    expect(note.whatHappened).toHaveLength(300);
    expect(note.whatHappened.endsWith('…')).toBe(true);
    expect(note.whyItMatters).toBe('多余 空白 会被压缩');
    expect(note.skills.length).toBeLessThanOrEqual(5);
    expect(new Set(note.skills).size).toBe(note.skills.length);
    expect(note.suggestedAction).toHaveLength(200);
  });

  it('结构化输出的四个字段都是必填', () => {
    expect(editorialNoteSchema.safeParse({
      whatHappened: 'x', whyItMatters: 'y', skills: [], suggestedAction: 'z',
    }).success).toBe(true);
    expect(editorialNoteSchema.safeParse({ whatHappened: 'x' }).success).toBe(false);
  });
});

describe('未配置密钥时的行为', () => {
  it('isEditorialEnabled 反映 ANTHROPIC_API_KEY 是否存在', () => {
    const original = process.env.ANTHROPIC_API_KEY;
    try {
      delete process.env.ANTHROPIC_API_KEY;
      expect(isEditorialEnabled()).toBe(false);
      process.env.ANTHROPIC_API_KEY = 'sk-test';
      expect(isEditorialEnabled()).toBe(true);
    } finally {
      if (original === undefined) delete process.env.ANTHROPIC_API_KEY;
      else process.env.ANTHROPIC_API_KEY = original;
    }
  });

  it('模型 id 固定写进记录，便于日后判断哪批解读该重做', () => {
    expect(EDITORIAL_MODEL).toBe('claude-opus-5');
  });
});

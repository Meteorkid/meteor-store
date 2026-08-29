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
  parseEditorialResponse,
  canGenerateEditorialNote,
  looksUnfounded,
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

  it('来源没有摘要时根本不生成，而不是让模型保守发挥', () => {
    /*
     * 这条原本断言提示词里有「来源未提供摘要，请相应保守」的分支。模型确实
     * 照做了——但它保守的方式是在解读里写「材料未提供具体细节，因此暂无法
     * 评估具体影响」，那是一句公开的免责声明，不是解读。实测这样产出了 21 条。
     * 现在改为不生成：这类条目宁可没有解读，也不要有一条说自己没内容的解读。
     */
    expect(canGenerateEditorialNote(aiUpdate({ summary: { zh: '', en: '' } }))).toBe(false);
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

describe('DeepSeek 的 JSON 模式约束', () => {
  const valid = JSON.stringify({
    whatHappened: '某公司发布了新模型。',
    whyItMatters: '对做项目的学生有影响。',
    skills: ['PyTorch'],
    suggestedAction: '本周读一遍官方文档。',
  });

  it('提示词里必须出现 json 字样并给出格式示例', () => {
    // DeepSeek 的 json_object 模式硬性要求提示词含 "json" 且给出示例，
    // 缺了会退化成普通文本输出——这是官方文档明确写的前提条件
    const source = readFileSync(path.join(__dirname, '..', 'editorial.ts'), 'utf-8');
    const systemPrompt = source.slice(source.indexOf('const SYSTEM_PROMPT'), source.indexOf('组装用户消息'));
    expect(systemPrompt).toMatch(/JSON|json/);
    expect(systemPrompt).toContain('"whatHappened"');
    expect(systemPrompt).toContain('"suggestedAction"');
  });

  it('正常返回被解析并收紧', () => {
    expect(parseEditorialResponse(valid).skills).toEqual(['PyTorch']);
  });

  it('空内容当作可重试失败，而不是抛看不懂的语法错误', () => {
    // 官方明确提示 JSON 模式偶尔会返回空内容
    expect(() => parseEditorialResponse('')).toThrow(/空内容/);
    expect(() => parseEditorialResponse(null)).toThrow(/空内容/);
    expect(() => parseEditorialResponse('   ')).toThrow(/空内容/);
  });

  it('非法 JSON 有明确报错', () => {
    expect(() => parseEditorialResponse('这不是 JSON')).toThrow(/合法 JSON/);
  });

  it('字段缺失被 zod 挡下，不会以 undefined 写进数据库', () => {
    // json_object 只保证是合法 JSON，不保证符合我们的结构，所以必须再过一次 zod
    expect(() => parseEditorialResponse(JSON.stringify({ whatHappened: '只有一个字段' })))
      .toThrow(/结构不完整/);
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
  it('isEditorialEnabled 反映 DEEPSEEK_API_KEY 是否存在', () => {
    const original = process.env.DEEPSEEK_API_KEY;
    try {
      delete process.env.DEEPSEEK_API_KEY;
      expect(isEditorialEnabled()).toBe(false);
      process.env.DEEPSEEK_API_KEY = 'sk-test';
      expect(isEditorialEnabled()).toBe(true);
    } finally {
      if (original === undefined) delete process.env.DEEPSEEK_API_KEY;
      else process.env.DEEPSEEK_API_KEY = original;
    }
  });

  it('模型 id 固定写进记录，便于日后判断哪批解读该重做', () => {
    expect(EDITORIAL_MODEL).toBe('deepseek-v4-flash');
  });
});

describe('材料不足时不生成解读', () => {
  const item = (summaryZh: string, summaryEn: string) => ({
    ...catalogItemFixture({ id: 'x', itemType: 'ai-update' }),
    summary: { zh: summaryZh, en: summaryEn },
  });

  it('源摘要为空时拒绝生成', () => {
    /*
     * 提示词里原有一条「来源未提供摘要，请相应保守」的分支，模型也照做了——
     * 但它保守的方式是在解读里写「材料未提供具体细节，因此暂无法评估具体影响」。
     * 那不是解读，是一句公开的免责声明：读者想知道「这条对我意味着什么」，
     * 得到的是「不知道」。实测这样产出了 21 条，其中 16 条源摘要本来就是空的
     * （Hugging Face 的镜像 feed 只给标题）。
     */
    expect(canGenerateEditorialNote(item('', ''))).toBe(false);
    expect(canGenerateEditorialNote(item('', '   '))).toBe(false);
    expect(canGenerateEditorialNote(item('有摘要', ''))).toBe(true);
    expect(canGenerateEditorialNote(item('', 'has summary'))).toBe(true);
  });

  it('非 AI 动态一律不生成', () => {
    const other = { ...item('有摘要', 'ok'), itemType: 'open-source' as const };
    expect(canGenerateEditorialNote(other)).toBe(false);
  });

  it('生成函数自己也兜底，不依赖调用方过滤', async () => {
    await expect(generateEditorialNote(item('', ''))).rejects.toThrow(/材料不足/);
  });

  it('提示词不再有「未提供摘要」的分支', () => {
    // 有守卫之后那是死代码，留着会让人以为无摘要也能生成
    const prompt = buildEditorialPrompt(item('这是摘要', 'summary'));
    expect(prompt).toContain('来源摘要：这是摘要');
    expect(prompt).not.toContain('来源未提供摘要');
  });
});

describe('模型承认没材料时不留下这一版', () => {
  const note = (whatHappened: string) => ({
    whatHappened,
    whyItMatters: '值得关注',
    skills: ['技能'],
    suggestedAction: '本周去读一遍原文',
  });

  it.each([
    'Google 发布了一系列 AI 更新，具体内容未在材料中详细说明。',
    'Google 在 2026 年 6 月发布了更新，具体内容未在摘要中详述。',
    '该合作的具体技术细节和实施时间暂无法评估。',
    '据标题称，但未提供更多细节，材料不足。',
    '仅有官方标题信息，具体技术细节尚未披露。',
  ])('识别：%s', (text) => {
    expect(looksUnfounded(note(text))).toBe(true);
  });

  it.each([
    'OpenAI 宣布加入 PORTS-Pike 项目，旨在支持南俄亥俄州的社区发展和就业增长。',
    '英国政府与 Google DeepMind 合作构建 AI 驱动的原型，用于加速住房规划决策。',
    // 正常提到「某模型未公开权重」是有效信息，不该被当成缺陷
    'Meta 发布了新模型，但未公开训练数据的具体构成，仅说明了参数规模。',
  ])('不误伤：%s', (text) => {
    expect(looksUnfounded(note(text))).toBe(false);
  });

  it('按输入长度卡阈值行不通，所以判据放在产出侧', () => {
    /*
     * 实测 41 字的摘要信息完整（「我们宣布 Gemini API 中托管代理的新功能……」），
     * 而 25 字的「这里是 Google 在 2026 年 7 月的最新 AI 更新」才是纯指针。
     * 长度分不开这两者，模型自己的产出才能。
     */
    const short = { ...catalogItemFixture({ id: 'x', itemType: 'ai-update' }), summary: { zh: '这里是 Google 的最新 AI 更新。', en: '' } };
    expect(canGenerateEditorialNote(short)).toBe(true);
  });
});

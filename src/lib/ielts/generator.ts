import { z } from 'zod';
import { IeltsPairContentSchema, IeltsLearningSchema, countWords, type IeltsFocus, type IeltsPairContent, type IeltsTask } from './types';

/**
 * 用 DeepSeek 生成一组新的 5 分 / 8 分对照。
 *
 * 与每日英语同一条路子（同一个 endpoint、同一把 key、同样按字节数封顶），
 * 区别在于要求模型输出的是「同一篇作文的两个版本」，而且必须逐句对齐：
 * 这一步靠提示词约束，靠 zod 兜底——生成结果不合法时有限次重试，再失败就报错，
 * 绝不把半成品写进内容库让读者看到对不齐的左右两栏。
 *
 * 生成出来的内容是草稿：后台点「发布」之后才会出现在公开页。
 */

const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/chat/completions';
const MAX_RESPONSE_BYTES = 256 * 1024;
const ATTEMPTS = 3;

const completionSchema = z.object({
  choices: z.array(z.object({
    finish_reason: z.literal('stop'),
    message: z.object({ content: z.string().trim().min(1).max(MAX_RESPONSE_BYTES) }),
  })).length(1),
});

const generatedSchema = z.object({
  prompt: z.object({ en: z.string().trim().min(10).max(1200), zh: z.string().trim().min(2).max(1200) }).strict(),
  title: z.object({ zh: z.string().trim().min(1).max(400), en: z.string().trim().min(1).max(400) }).strict(),
  segments: z.array(z.object({
    paragraph: z.number().int().min(1).max(8),
    low: z.string().trim().min(1).max(600),
    high: z.string().trim().min(1).max(600),
    focus: z.array(z.enum(['task', 'cohesion', 'lexis', 'grammar', 'accuracy'])).min(1).max(3),
    translationZh: z.object({ low: z.string().trim().min(1).max(1200), high: z.string().trim().min(1).max(1200) }).strict(),
    note: z.object({ zh: z.string().trim().min(1).max(400), en: z.string().trim().min(1).max(400) }).strict(),
  }).strict()).min(6).max(30),
  criteria: z.array(z.object({
    key: z.enum(['TR', 'CC', 'LR', 'GRA']),
    note: z.object({ zh: z.string().trim().min(1).max(1200), en: z.string().trim().min(1).max(1200) }).strict(),
  }).strict()).length(4),
  takeaways: z.object({
    zh: z.array(z.string().trim().min(2).max(200)).min(2).max(5),
    en: z.array(z.string().trim().min(2).max(200)).min(2).max(5),
  }).strict(),
}).strict();

export interface IeltsGenerationRequest {
  task: IeltsTask;
  topic: string;
  category: string;
}

export interface IeltsGenerationResult {
  slug: string;
  content: IeltsPairContent;
  wordCounts: { low: number; high: number };
}

const TASK_GUIDE: Record<IeltsTask, string> = {
  task2: `Task 2 大作文：四到五段（引言 / 两个主体段 / 结论）。**5 分版正文 250–300 词，8 分版正文 260–310 词**（不含题干）。
段落句数配比（两版必须一致）：引言 2–3 句；每个主体段 5–7 句，其中至少一句是具体例子（For example / In many places ...）；结论 2–3 句。
写完后先数词数：不足 250 词时，把主体段的论证链和例子写细（说明原因、举出场景、给出结果），不要靠空话凑字数。`,
  'task1-academic': 'Task 1 学术类：**两版各 150–200 词**。题干里必须用纯文本给出完整数据（表格或分点列出年份与数值），读者不看图也能逐项核对；8 分版的数据必须与题干完全一致。',
  'task1-general': 'Task 1 书信（G 类）：**两版各 150–200 词**，题干列出三个要点（bullet points），两版都要覆盖全部要点。',
};

function systemPrompt(request: IeltsGenerationRequest): string {
  return `你是雅思写作教师，为中文母语的学习者编写「同一篇作文的 5 分版与 8 分版对照」。

${TASK_GUIDE[request.task]}

题目要求：task=${request.task}，topic=${request.topic}，category=${request.category}。
题干必须自己原创，不得照抄剑桥雅思真题或任何教材原文。

**核心：8 分版是 5 分版的升级，不是另写一篇。**
- 论点、论证顺序、例子、段落数完全一致；只提升词汇、句式、衔接与任务回应的完整度。
- 5 分版：词汇基本（good / bad / important / many people think），句式以简单句和 and / but / so 为主，
  衔接靠 Firstly / Secondly / In conclusion 这类机械连接；应当包含若干典型错误（冠词、主谓一致、介词、时态、搭配），
  只部分回应任务（立场不明确、论证单薄、Task 1 缺少 overview 或数据描述不准确）。
  要读起来像 5 分：比 4 分清楚，但明显不如 6 分。
- 8 分版：用词准确且有广度（自然搭配，不堆生僻词），句式多样（从句、分词、名词化），
  衔接自然（指代、替换、逻辑连接克制），立场贯穿全文、论证充分，几乎无语法错误。
- 8 分版不得新增论点、例子或数据，禁止编造真实来源（不要出现 according to a 2021 OECD report、a study by Harvard 之类）。
  可以用泛指例子（In many cities / Take a student who ...）。不要用与内容无关的模板套话。

**segments 必须逐句对齐**：把两版正文按句子切分，每个元素是「5 分版的一句 + 8 分版对应的那一句」。
同一段内句子数必须一致，paragraph 从 1 开始连续编号，两版段落数相同，两版句子按顺序一一对应。
note 用中英双语说明这一句具体改了什么、为什么更高分，要具体到词和结构（例如「think → maintain：把主观看法换成可论证的动词」），
不要写「更高级」这种空话。${request.task === 'task2' ? 'segments 12–20 个。' : 'segments 8–14 个。'}

每个 segment 还必须有 translationZh:{low,high}，分别忠实翻译两边原句。
中文自然通顺，但保留各自的立场、否定、程度、数字、例子及限定，不能把高分版的意思补进低分版。
低分版的语法问题不必在中文中模仿；事实或数字错误仍按原意翻译，纠错写入 note，不偷改译文。
criteria 恰好 4 条，key 分别为 TR、CC、LR、GRA，note 用中英双语说明 5 分版为什么只到 5 分、8 分版在这一维度做了什么。
takeaways 给 2–5 条可以直接抄走的写法，中英各一份，意思对应。

**输出前自检（必须做）**：把 segments 里所有 low 拼起来数一遍词数、所有 high 拼起来数一遍词数，
两者都必须落在上面要求的区间内，且 high 不能比 low 少 20 词以上（8 分版可以更紧凑，但不能丢内容）。
词数不达标就补足论证细节再输出——**宁可多写两句，也不要交一篇字数不足的作文**。

只输出一个 JSON 对象，不要代码块、不要解释：
{
  "prompt": { "en": "英文题干", "zh": "中文说明" },
  "title": { "zh": "中文标题", "en": "English title" },
  "segments": [{ "paragraph": 1, "low": "5 分版的一句", "high": "8 分版对应的那一句", "focus": ["lexis"], "translationZh": {"low":"对应低分原句的译文","high":"对应高分原句的译文"}, "note": { "zh": "中文说明", "en": "English note" } }],
  "criteria": [{ "key": "TR", "note": { "zh": "中文", "en": "English" } }],
  "takeaways": { "zh": ["写法一", "写法二"], "en": ["Phrase one", "Phrase two"] }
}`;
}

/** 不依赖服务端 Content-Length，防止超大或无穷响应占满进程。 */
async function readCompletion(response: Response): Promise<unknown> {
  if (Number(response.headers.get('content-length')) > MAX_RESPONSE_BYTES) {
    await response.body?.cancel().catch(() => undefined);
    throw new Error('雅思生成响应过大');
  }
  if (!response.body) throw new Error('雅思生成响应不完整或已截断');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let body = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_RESPONSE_BYTES) {
        await reader.cancel();
        throw new Error('雅思生成响应过大');
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(body);
}

function parseModelJson(content: string): unknown {
  // 模型偶尔会把 JSON 包在代码块里，先剥掉围栏再解析
  const trimmed = content.trim().replace(/^\`\`\`(?:json)?/i, '').replace(/\`\`\`$/, '').trim();
  return JSON.parse(trimmed);
}

/**
 * 升级维度的同义词表（键都写成「小写 + 空格」形态）。
 *
 * 模型经常把 lexis 写成 vocabulary、把 cohesion 写成 coherence。
 * 这类偏差不影响内容质量，却会让整份输出被 zod 拒掉、白花一次调用，
 * 所以在校验前先归一化；实在认不出来的取值直接丢弃，保底给一个词汇维度。
 */
const FOCUS_SYNONYMS: Record<string, IeltsFocus> = {
  task: 'task', 'task response': 'task', 'task achievement': 'task', 'task-response': 'task',
  cohesion: 'cohesion', coherence: 'cohesion', 'coherence and cohesion': 'cohesion', linking: 'cohesion', connectors: 'cohesion', 'cohesive devices': 'cohesion',
  lexis: 'lexis', vocabulary: 'lexis', lexical: 'lexis', 'lexical resource': 'lexis', 'word choice': 'lexis', collocation: 'lexis', 'word choice and collocation': 'lexis',
  grammar: 'grammar', 'grammatical range': 'grammar', syntax: 'grammar', 'sentence structure': 'grammar', structures: 'grammar', 'grammatical range and accuracy': 'grammar',
  accuracy: 'accuracy', errors: 'accuracy', correctness: 'accuracy', 'grammatical accuracy': 'accuracy', 'error correction': 'accuracy',
};

function normalizeFocus(values: unknown): IeltsFocus[] {
  const list = Array.isArray(values) ? values : [];
  const mapped = list
    .map(item => (typeof item === 'string' ? FOCUS_SYNONYMS[item.trim().toLowerCase().replace(/[_-]+/g, ' ')] : undefined))
    .filter((item): item is IeltsFocus => Boolean(item));
  const unique = [...new Set(mapped)].slice(0, 3);
  return unique.length > 0 ? unique : ['lexis'];
}

/** 把模型输出里「意思对但写法不同」的部分掰回协议要求的取值。 */
function normalizeModelJson(raw: unknown): unknown {
  if (!raw || typeof raw !== 'object') return raw;
  const value = raw as Record<string, unknown>;
  const segments = Array.isArray(value.segments) ? value.segments : [];
  const criteria = Array.isArray(value.criteria) ? value.criteria : [];
  return {
    ...value,
    segments: segments.map(segment => {
      if (!segment || typeof segment !== 'object') return segment;
      const item = segment as Record<string, unknown>;
      return { ...item, focus: normalizeFocus(item.focus) };
    }),
    criteria: criteria.map(item => {
      if (!item || typeof item !== 'object') return item;
      const entry = item as Record<string, unknown>;
      return typeof entry.key === 'string' ? { ...entry, key: entry.key.trim().toUpperCase() } : entry;
    }),
  };
}

/**
 * 词数与「升级没有缩水」的硬约束。
 * 模型偶尔会把 8 分版写成更短的一段话——那通常是丢内容，不是写得更好。
 */
function assertWordCounts(task: IeltsTask, content: IeltsPairContent): { low: number; high: number } {
  const low = countWords(content.segments.map(segment => segment.low).join(' '));
  const high = countWords(content.segments.map(segment => segment.high).join(' '));
  const range = task === 'task2' ? { low: [230, 320], high: [230, 340] } : { low: [120, 210], high: [120, 230] };
  if (low < range.low[0] || low > range.low[1]) throw new Error(`5 分版词数不合适（${low}）`);
  if (high < range.high[0] || high > range.high[1]) throw new Error(`8 分版词数不合适（${high}）`);
  if (high < low - 20) throw new Error(`8 分版比 5 分版少了 ${low - high} 词，可能丢了内容`);
  return { low, high };
}

function buildSlug(request: IeltsGenerationRequest): string {
  const suffix = Date.now().toString(36).slice(-6);
  const clean = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 20);
  return [request.task, clean(request.category), clean(request.topic), suffix].filter(Boolean).join('-').slice(0, 60);
}

/** 两阶段生成共用一个截止时间，包含正文、笔记及重试，早于反向代理的 60 秒超时。 */
async function requestModelJson(apiKey: string, system: string, input: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(DEEPSEEK_ENDPOINT, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'deepseek-chat', temperature: 0.8, max_tokens: 8000,
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: system }, { role: 'user', content: input }],
    }),
  });
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error(`DeepSeek 返回 ${response.status}`);
  }
  const completion = completionSchema.parse(await readCompletion(response));
  return parseModelJson(completion.choices[0].message.content);
}

const LEARNING_PROMPT = `为给出的原创雅思对照写学习笔记与词汇卡，不能改写正文。
两版是教学示例，不能宣称获得官方评分。评价准确性、论证、语气与搭配，不把生僻词等同高分。
Task 1 侧重任务完成度、数据准确/概述或书信要点与语气，Task 2 侧重立场与论证。
逐段说明作用及两版差异；三条技巧各引用一个真实句子索引，说明如何迁移使用。
选六个升级版中的词或短语：term 必须逐字连续出现在所引 high 句中，保留原词形；
segmentIndex 是 segments 数组的零起始索引，不是段落号。词性准确，解释本文语境、易错搭配，附自然原创例句和中文翻译。
所有说明中英双语。简洁但具体：审题中文150字内，段落讲解80字内，技巧100字内，用法60字内；英文意思对应。
不编音标、分数、新闻或来源。只输出如下 JSON，paragraphs 覆盖全部段落，techniques 恰好3条，mistakes 恰好2条，vocabulary 恰好6条：
{
  "taskAnalysis": {"zh":"审题与本篇思路", "en":"Question analysis"},
  "paragraphs": [{"paragraph":1, "role":{"zh":"段落作用","en":"Role"}, "analysis":{"zh":"具体拆解","en":"Analysis"}}],
  "techniques": [{"title":{"zh":"技巧","en":"Technique"}, "explanation":{"zh":"结合实际句子解释","en":"Explanation"}, "segmentIndex":0}],
  "mistakes": [{"zh":"本篇易错点","en":"Pitfall"}],
  "vocabulary": [{"term":"exact phrase", "partOfSpeech":"noun phrase", "meaning":{"zh":"本篇释义","en":"Meaning"}, "usage":{"zh":"搭配与误用","en":"Usage"}, "collocations":["a natural collocation"], "example":{"en":"An original example sentence.","zh":"忠实的中文翻译。"}, "segmentIndex":0}]
}`;

export async function generateIeltsPair(request: IeltsGenerationRequest): Promise<IeltsGenerationResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY 未配置');
  const signal = AbortSignal.timeout(50_000);
  let lastError = '';
  let essay: IeltsPairContent | undefined;
  for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
    try {
      const raw = await requestModelJson(apiKey, systemPrompt(request), attempt === 0
        ? '请生成这一组对照。'
        : `上次校验失败：${lastError.slice(0, 800)}。请核对逐句对齐、段落编号与词数。`, signal);
      const parsed = generatedSchema.parse(normalizeModelJson(raw));
      const content = IeltsPairContentSchema.parse({ ...parsed, bandLow: 5, bandHigh: 8 });
      assertWordCounts(request.task, content);
      essay = content;
      break;
    } catch (error) {
      if (signal.aborted) throw new Error('雅思对照生成超时，请稍后重试');
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  if (!essay) throw new Error(`雅思对照生成失败：${lastError}`);

  // 笔记失败只重试笔记；保留已经验证的正文，防止引用前一版句子。
  lastError = '';
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const input = JSON.stringify({ task: request.task, prompt: essay.prompt,
        segments: essay.segments.map(({ paragraph, low, high }) => ({ paragraph, low, high })),
        ...(lastError ? { validationError: lastError.slice(0, 800) } : {}),
      });
      const learning = IeltsLearningSchema.parse(await requestModelJson(apiKey, LEARNING_PROMPT, input, signal));
      const content = IeltsPairContentSchema.parse({ ...essay, learning });
      return { slug: buildSlug(request), content, wordCounts: assertWordCounts(request.task, content) };
    } catch (error) {
      if (signal.aborted) throw new Error('雅思学习笔记生成超时，请稍后重试');
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  throw new Error(`雅思学习笔记生成失败：${lastError}`);
}

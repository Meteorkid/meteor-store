import { z } from 'zod';
import type { PathfinderCatalogItem } from './catalog-types';

/**
 * AI 动态的编辑型解读。
 *
 * 回答四个问题：发生了什么、为什么值得大学生关注、影响哪些技能、建议做什么。
 * 目录里的 AI 动态原本只有标题和来源摘要，学生看完仍然不知道这跟自己有什么关系。
 *
 * **初稿由模型生成，必须人工确认后才公开**（见 `pathfinder_item_notes.status`）。
 * 这不是流程上的谨慎，而是产品定位的底线：Pathfinder 唯一的差异化资产是
 * 「每条都可追溯、不夸大」，自动发布模型产出等于把它交出去。
 */

/**
 * 提示词版本。
 *
 * **改了下面任何一段提示词就要改这个值**。否则库里会混着两代提示词产出的解读，
 * 而无法分辨哪些该重做——生成时间只能告诉你什么时候跑的，说明不了用的哪一版。
 */
export const EDITORIAL_PROMPT_VERSION = 'v2-deepseek-2026-08';

/**
 * 生成用的模型。写进每条记录，便于日后判断哪批解读需要重做。
 *
 * 选 DeepSeek 是因为生产服务器在阿里云（中国大陆），实测 api.anthropic.com
 * 对该出口 IP 返回 `forbidden: Request not allowed`——无效 key 都走不到鉴权，
 * 是按来源拒绝，不是密钥问题。国内接口直连、延迟更低、成本低一到两个数量级。
 *
 * flash 而非 pro：材料只有标题加一段摘要，要求也写死成四个字段，
 * 属于按给定材料改写，不是需要推理的任务。
 */
export const EDITORIAL_MODEL = 'deepseek-v4-flash';

/** OpenAI 兼容接口。 */
const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/chat/completions';

/** 单次生成的输出上限。官方提示要设得足够大，否则 JSON 会被从中间截断。 */
const MAX_OUTPUT_TOKENS = 2000;

export const editorialNoteSchema = z.object({
  whatHappened: z.string().describe('这条动态实际宣布或发生了什么，两到三句，只陈述来源里有的事实'),
  whyItMatters: z.string().describe('为什么值得中国大学生关注，两到三句，说清对学习或求职的具体影响'),
  skills: z.array(z.string()).describe('受影响的具体技能或工具名称，2 到 5 个，用中文或通用英文技术名词'),
  suggestedAction: z.string().describe('学生现在可以做的一件具体的事，一到两句，必须是本周就能开始的'),
});

export type EditorialNote = z.infer<typeof editorialNoteSchema>;

const SYSTEM_PROMPT = `你在为「Meteor Pathfinder」写面向中国大学生的技术动态解读。

这个产品的立身之本是可追溯、不夸大。因此有几条硬规则：

1. **只使用给定材料里的事实。** 不要补充材料里没有的数字、日期、价格、性能指标或合作方。
   材料信息不足以支撑某个字段时，就写出你能确定的那部分，不要用常识或印象填补。
2. **不预测、不评级、不喊口号。** 不要写「这将彻底改变」「必将成为标配」这类判断。
   写「它变化了什么」和「对你意味着什么」，把结论留给读者。
3. **建议必须是本周就能开始的一件具体的事**，比如读某份官方文档、跑通某个示例、
   在自己已有的项目里换掉某个调用。不要写「持续关注」「保持学习」这类无法执行的话。
4. **面向大学生**：假设读者是有一定编程基础、正在找实习或做项目的本科生，
   不是行业分析师，也不是完全的新手。
5. 全部用简体中文。技术名词、产品名保留英文原文。

输出的每个字段都会经过人工审核后才发布，所以宁可保守、宁可短，也不要编。

只输出一个 JSON 对象，不要包裹代码块，不要写任何额外说明。格式示例：

{
  "whatHappened": "两到三句，这条动态实际宣布或发生了什么",
  "whyItMatters": "两到三句，为什么值得中国大学生关注",
  "skills": ["受影响的技能或工具", "2 到 5 个"],
  "suggestedAction": "一到两句，本周就能开始做的一件具体的事"
}`;

/**
 * 组装用户消息。
 *
 * 单独抽出来是为了能在没有网络和 API key 的情况下测试——提示词里漏掉 canonicalUrl
 * 或把摘要截断到无意义，都是不发一次请求就该被发现的问题。
 */
/**
 * 有没有足够材料写解读。
 *
 * 来源摘要为空时不要生成。提示词里原本有一条「来源未提供摘要，请相应保守」的
 * 分支，模型也确实照做了——但它保守的方式是**在解读里写出「材料未提供具体细节，
 * 因此暂无法评估具体影响」**。那不是解读，是一句公开的免责声明；读者点进来
 * 想知道「这条对我意味着什么」，得到的是「不知道」。
 *
 * 实测全库有 14 条 AI 动态的英文摘要为空（部分 RSS 只给标题），
 * 这类条目宁可没有解读，也不要有一条说自己没内容的解读。
 */
/**
 * 模型在解读里承认自己没有材料。
 *
 * 「源摘要非空」不足以保证写得出解读：月度汇总类文章的摘要往往就是标题的复述
 * （「这里是 Google 在 2026 年 7 月的最新 AI 更新」），模型只能如实写
 * 「具体内容未在摘要中详述」。那是一句公开的免责声明，不是解读。
 *
 * **按输入长度卡阈值行不通**——实测 41 字的摘要信息完整
 * （「我们宣布 Gemini API 中托管代理的新功能，使开发者能够构建可靠的生产级代理」），
 * 而 25 字的那条才是纯指针。模型自己的产出才是可靠信号：它说不出内容时会明说。
 *
 * 代价是这类条目每轮同步都会重试一次（约 ¥0.003），比引入一个新状态、
 * 加一次数据库迁移来记住「试过且失败」要划算。
 */
const UNFOUNDED_PATTERNS: readonly RegExp[] = [
  // 「材料/摘要/原文 未提供|未详述|没有说明」
  /(材料|摘要|原文|来源)(中)?(未|没有)(提供|详细|详述|列出|说明|披露)/,
  /未在(材料|摘要|原文)中/,
  /暂(时)?无法(评估|判断|确定|得知)/,
  /(材料|信息|细节)不足/,
  /(具体)?(内容|细节)(尚)?未(在|被)?.{0,8}(列出|提供|说明|披露|详述)/,
  /无(法|从)得知/,
  /仅(有|凭|依据).{0,6}标题/,
];

export function looksUnfounded(note: EditorialNote): boolean {
  const text = `${note.whatHappened} ${note.whyItMatters} ${note.suggestedAction}`;
  return UNFOUNDED_PATTERNS.some((pattern) => pattern.test(text));
}

export function canGenerateEditorialNote(item: PathfinderCatalogItem): boolean {
  if (item.itemType !== 'ai-update') return false;
  return Boolean((item.summary.zh || item.summary.en || '').trim());
}

export function buildEditorialPrompt(item: PathfinderCatalogItem): string {
  const summary = item.summary.zh || item.summary.en;
  return [
    '请根据以下材料写解读。材料之外的信息一律不要使用。',
    '',
    `标题：${item.title.zh || item.title.en}`,
    `发布机构：${item.organization.zh || item.organization.en}`,
    `来源：${item.source.name.zh || item.source.name.en}（${item.source.trustLevel === 'official' ? '官方一手来源' : '已交叉核验'}）`,
    `原文地址：${item.canonicalUrl}`,
    item.publishedAt ? `发布时间：${item.publishedAt.slice(0, 10)}` : '',
    '',
    // 摘要必然非空：canGenerateEditorialNote 已经把无摘要的条目挡在外面
    `来源摘要：${summary}`,
  ].filter(Boolean).join('\n');
}

/** 未配置 API key 时，后台应显示「未启用」而不是报错按钮。 */
export function isEditorialEnabled(): boolean {
  return Boolean(process.env.DEEPSEEK_API_KEY);
}

/**
 * 从 `json_object` 模式的返回里取出解读。
 *
 * DeepSeek 只保证输出是合法 JSON，**不保证符合我们的字段结构**（它没有
 * json_schema 那样的强约束），所以解析完必须再过一次 zod。少了这一步，
 * 模型少写一个字段就会以 undefined 的形式一路写进数据库。
 *
 * 另外官方明确提示 JSON 模式偶尔会返回空内容，这里当作可重试的失败抛出，
 * 而不是让 JSON.parse 抛一个看不懂的语法错误。
 */
export function parseEditorialResponse(content: string | null | undefined): EditorialNote {
  const text = content?.trim();
  if (!text) {
    throw new Error('模型返回空内容（DeepSeek JSON 模式的已知问题），请重试');
  }

  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error('模型返回的不是合法 JSON');
  }

  const parsed = editorialNoteSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(`模型返回的结构不完整：${parsed.error.issues[0].path.join('.')}`);
  }
  return normalizeEditorialNote(parsed.data);
}

/**
 * 为一条 AI 动态生成解读初稿。
 *
 * 只处理 `ai-update`：竞赛、实习、开源任务的卡片上已经有资格、费用、截止时间这些
 * 结构化事实，学生看得懂该做什么；需要解读的是「某公司发布了某模型」这类内容。
 */
export async function generateEditorialNote(
  item: PathfinderCatalogItem,
): Promise<EditorialNote> {
  if (item.itemType !== 'ai-update') {
    throw new Error(`只为 AI 动态生成解读，收到 ${item.itemType}`);
  }
  // 兜底：调用方应先用 canGenerateEditorialNote 过滤，这里不依赖它做对
  if (!canGenerateEditorialNote(item)) {
    throw new Error('来源未提供摘要，材料不足以写出有价值的解读');
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY 未配置，无法生成解读');

  const response = await fetch(DEEPSEEK_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    // 单条生成通常几秒；超时兜底避免后台按钮一直转
    signal: AbortSignal.timeout(60_000),
    body: JSON.stringify({
      model: EDITORIAL_MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      response_format: { type: 'json_object' },
      // 思考模式默认开启，且思考 token 按输出计费。这个任务是按给定材料改写、
      // 字段也写死了，推理带不来质量，只带来成本，所以显式关掉。
      thinking: { type: 'disabled' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildEditorialPrompt(item) },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`DeepSeek 返回 ${response.status}：${detail.slice(0, 200)}`);
  }

  const payload = await response.json() as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const note = parseEditorialResponse(payload.choices?.[0]?.message?.content);
  /*
   * 模型自己说没材料时就不要这一版：把它存成草稿只会让审核队列里堆着
   * 一堆注定要删的东西，而放行则会把免责声明公开出去。
   */
  if (looksUnfounded(note)) {
    throw new Error('模型判断材料不足，未产出可用解读');
  }
  return note;
}

/**
 * 收紧模型输出。
 *
 * 结构化输出保证了字段存在与类型，但保证不了长度和条数。这里做的是入库前的
 * 最后一道防线：过长的段落会撑坏卡片布局，技能标签超过 5 个就不再是「重点」。
 */
export function normalizeEditorialNote(note: EditorialNote): EditorialNote {
  const trim = (value: string, max: number) => {
    const text = value.trim().replace(/\s+/g, ' ');
    return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
  };

  return {
    whatHappened: trim(note.whatHappened, 300),
    whyItMatters: trim(note.whyItMatters, 300),
    skills: [...new Set(note.skills.map((skill) => skill.trim()).filter(Boolean))].slice(0, 5),
    suggestedAction: trim(note.suggestedAction, 200),
  };
}

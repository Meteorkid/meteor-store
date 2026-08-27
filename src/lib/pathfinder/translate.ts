import { z } from 'zod';

/**
 * 条目标题与摘要的中文化。
 *
 * 中文站长期显示英文标题：实测生产库 178 条已发布条目里，`title_zh` 与
 * `title_en` **逐字相同的有 178 条（100%）**，摘要 172 条。原因是抓取管线在
 * 来源没给中文时用英文兜底（`titleZh: item.titleZh ?? title`），而 RSS 与
 * GitHub 都不会给中文——兜底成了常态，中文站实际上从没中文过。
 *
 * 这一层不改兜底逻辑（它仍然是正确的最后防线），而是在兜底之前补一次翻译。
 *
 * **为什么不是接一个通用翻译 API**：站里已经为 AI 解读接了 DeepSeek，
 * 复用同一个供应商与密钥，不必再引入一套凭证、配额和故障模式。翻译任务比
 * 解读简单得多，用同一个便宜档位的模型即可。
 *
 * **失败一律降级为英文原文，不抛错**：翻译不了是「不好看」，抓取整批失败是
 * 「机会库空了」，后者严重得多。所以这里的任何异常都不能冒泡到同步流程。
 */

const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/chat/completions';

/**
 * 翻译用的模型。
 *
 * 与解读共用 flash 档：翻译是有确定答案的改写任务，更贵的档位不会更准。
 */
export const TRANSLATION_MODEL = 'deepseek-v4-flash';

/** 一次请求最多翻几条。太大容易触发输出截断，太小则请求数上去了。 */
export const TRANSLATION_BATCH_SIZE = 10;

/** 输出上限：按每条标题 60 字 + 摘要 200 字 × 批量大小估算，留一倍余量。 */
const MAX_OUTPUT_TOKENS = 4_000;

const SYSTEM_PROMPT = [
  '你是技术内容的中英翻译。把给定的英文标题与摘要翻译成简体中文。',
  '要求：',
  '1. 保留技术术语的通用译法；广泛使用的英文缩写（LLM、RAG、API、GPU、PR、CI）保持英文不译。',
  '2. 产品名、公司名、仓库名、人名一律保持原文，不要音译。',
  '3. 标题按中文标题习惯写，不要句号结尾；摘要保持原意，不增删信息、不加评价。',
  '4. 译不出或原文本身就是中文时，原样返回原文。',
  '严格按 json 返回，形如：',
  '{"items":[{"id":"a1","title":"标题","summary":"摘要"}]}',
].join('\n');

const translationSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
  })),
});

export interface TranslatableItem {
  id: string;
  titleEn: string;
  summaryEn: string;
}

export interface TranslatedItem {
  id: string;
  titleZh: string;
  summaryZh: string;
}

export function isTranslationEnabled(): boolean {
  return Boolean(process.env.DEEPSEEK_API_KEY);
}

/**
 * 判断一段文本是否需要翻译。
 *
 * 含中日韩字符就当作已经是中文——来源偶尔本来就给中文，重复翻译既费钱又可能
 * 把已经通顺的原文改坏。
 */
export function needsTranslation(text: string | null | undefined): boolean {
  if (!text || !text.trim()) return false;
  return !/[一-鿿぀-ヿ]/.test(text);
}

/** 解析模型返回。结构不对时返回空数组，由调用方降级为英文原文。 */
export function parseTranslationResponse(content: string | null | undefined): TranslatedItem[] {
  if (!content || !content.trim()) return [];
  let payload: unknown;
  try {
    payload = JSON.parse(content);
  } catch {
    return [];
  }
  const parsed = translationSchema.safeParse(payload);
  if (!parsed.success) return [];

  return parsed.data.items.map((item) => ({
    id: item.id,
    // 长度上限与数据库列宽和卡片布局对齐，模型偶尔会写超
    titleZh: item.title.trim().slice(0, 180),
    summaryZh: item.summary.trim().slice(0, 320),
  }));
}

/**
 * 翻译一批条目。
 *
 * 返回 `Map<id, 译文>`；**没翻成的 id 不会出现在结果里**，调用方据此决定
 * 是否退回英文原文。不抛错是有意的——见文件头。
 */
export async function translateBatch(
  items: readonly TranslatableItem[],
): Promise<Map<string, TranslatedItem>> {
  const result = new Map<string, TranslatedItem>();
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey || items.length === 0) return result;

  try {
    const response = await fetch(DEEPSEEK_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(90_000),
      body: JSON.stringify({
        model: TRANSLATION_MODEL,
        max_tokens: MAX_OUTPUT_TOKENS,
        response_format: { type: 'json_object' },
        // 与解读同理：翻译不需要推理，而思考 token 按输出计费
        thinking: { type: 'disabled' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: JSON.stringify({
              items: items.map((item) => ({
                id: item.id,
                title: item.titleEn,
                summary: item.summaryEn,
              })),
            }),
          },
        ],
      }),
    });
    if (!response.ok) return result;

    const payload = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    for (const translated of parseTranslationResponse(payload.choices?.[0]?.message?.content)) {
      // 只接受我们确实请求过的 id，防止模型自己编一个 id 出来
      if (items.some((item) => item.id === translated.id)) result.set(translated.id, translated);
    }
  } catch {
    // 超时、网络异常、供应商故障都走这里：中文没补上，但同步不受影响
    return result;
  }
  return result;
}

/**
 * 分批翻译，批与批之间串行。
 *
 * 串行而不是并发：同步任务本身不赶时间，而并发打同一个供应商容易触发限流，
 * 一旦限流整批都拿不到译文，反而不如慢慢来。
 */
export async function translateAll(
  items: readonly TranslatableItem[],
  batchSize = TRANSLATION_BATCH_SIZE,
): Promise<Map<string, TranslatedItem>> {
  const merged = new Map<string, TranslatedItem>();
  for (let index = 0; index < items.length; index += batchSize) {
    const batch = items.slice(index, index + batchSize);
    for (const [id, value] of await translateBatch(batch)) merged.set(id, value);
  }
  return merged;
}
